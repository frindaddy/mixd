const express = require('express');
const fs = require("fs");
require('dotenv').config();
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
    Drinks.find({}, 'name tags glass').sort({name:1})
        .then((data) => res.json(data))
        .catch(next);
});

router.get('/image', (req, res, next) => {
    let directoryPath = process.env.IMAGE_DIR;
    if (req.query.file && fs.existsSync(directoryPath+req.query.file)){
        res.sendFile(directoryPath+req.query.file);
    } else if (req.query.backup && fs.existsSync(directoryPath+req.query.backup)) {
        res.sendFile(directoryPath+req.query.backup);
    } else {
        res.json({error: 'Unable to find file'})
    }
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