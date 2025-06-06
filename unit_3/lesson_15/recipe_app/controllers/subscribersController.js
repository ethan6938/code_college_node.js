const Subscriber = require('../models/subscriber');

exports.getAllSubscribers = (req, res) => {
    Subscriber.find({})
    .exec()
        .then((subscribers) => {
            res.render("subscribers", {
                subscribers: subscribers
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("Promise Complete")
        });
};

exports.getSubscriptionPage = (req, res) => {
    res.render("contact");
};

exports.getSubscriber = (req, res) => { 
    res.render("subscriber", );
};

exports.saveSubscriber = (req, res) => {
    let newSubscriber = new Subscriber({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    });
    newSubscriber.save()
    .then((result) => {
        res.render("thanks");
    })
    .catch((error) => {
        res.send(error);
    });
};