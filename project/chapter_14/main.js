const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const ejs = require('ejs');

const BlogPost = require('./models/BlogPost');
const newPostController = require('./controllers/newPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const storePostController = require('./controllers/storePost');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

const app = express();
const PORT = 3000;

// App setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Session and Flash middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Global loggedIn variable
global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

// MongoDB connection
mongoose.connect('mongodb://localhost/my_database', { useUnifiedTopology: true, useNewUrlParser: true });

// Routes

// Home page
app.get('/', async (req, res) => {
    const blogposts = await BlogPost.find({});
    res.render('index', { blogposts });
});

// Static pages
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/samplepost', (req, res) => res.render('samplepost'));

// Post detail
app.get('/post/:id', async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id).populate('userid');
    res.render('post', { blogpost, userId: req.session.userId });
});

// Create post
app.get('/posts/new', authMiddleware, newPostController);
app.get('/create', (req, res) => res.render('create'));

// Store new post
app.post('/posts/store', async (req, res) => {
    try {
        let imagePath = null;
        if (req.files && req.files.image) {
            let image = req.files.image;
            let imageSavePath = path.resolve(__dirname, 'public/img', image.name);
            await image.mv(imageSavePath);
            imagePath = '/img/' + image.name;
        }

        await BlogPost.create({ ...req.body, image: imagePath });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Edit post form
app.get('/posts/edit/:id', authMiddleware, async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    if (post.userid.toString() !== req.session.userId.toString()) return res.status(403).send('Unauthorized');
    res.render('edit', { post });
});

// Handle post update
app.post('/posts/update/:id', authMiddleware, async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');
        if (post.userid.toString() !== req.session.userId.toString()) return res.status(403).send('Unauthorized');

        let imagePath = post.image;

        if (req.files && req.files.image) {
            let image = req.files.image;
            let imageSavePath = path.resolve(__dirname, 'public/img', image.name);
            await image.mv(imageSavePath);
            imagePath = '/img/' + image.name;
        }

        await BlogPost.findByIdAndUpdate(req.params.id, {
            ...req.body,
            image: imagePath
        });

        res.redirect('/post/' + req.params.id);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating post');
    }
});

// Delete post
app.post('/posts/delete/:id', async (req, res) => {
    try {
        if (!req.session.userId) return res.redirect('/auth/login');

        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');
        if (post.userid.toString() !== req.session.userId.toString()) return res.status(403).send('Unauthorized');

        await BlogPost.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error deleting post');
    }
});

// Authentication routes
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);
app.get('/auth/logout', logoutController);

// Catch-all for 404s
app.use((req, res) => res.render('notfound'));

// Start the server
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
