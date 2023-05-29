const express = require('express');
const router = express.Router();
const Drinks = require('../models/drinks');

router.get('/drink/:id', (req, res, next) => {
    if(req.params.id){
        Drinks.find({_id:req.params.id}, '')
            .then((data) => res.json(data))
            .catch(next);
    } else {
        res.json({
            error: 'No drink id provided',
        });
    }
});

router.get('/list', (req, res, next) => {
    Drinks.find({}, 'name tags').sort({name:1})
        .then((data) => res.json(data))
        .catch(next);
});

router.post('/add_drink', (req, res, next) => {
    if (req.body.name) {
        Drinks.create(req.body)
            .then((data) => res.json(data))
            .catch(next);
    } else {
        res.json({
            error: 'The input field is empty',
        });
    }
});

router.post('/update_drink/:id', (req, res, next) => {
    if (req.params.id && req.body) {
        console.log(req.body);
        Drinks.updateOne({_id: req.params.id}, req.body)
            .then((data) => res.json(data))
            .catch(next);
    } else {
        res.json({
            error: 'Invalid Request',
        });
    }
});

router.delete('/drink/:id', (req, res, next) => {
    Drinks.findOneAndDelete({ _id: req.params.id })
        .then((data) => res.json(data))
        .catch(next);
});

module.exports = router;