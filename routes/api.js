const express = require('express');
const multer  = require('multer');
const fs = require("fs");
require('dotenv').config();
const router = express.Router();
const Drinks = require('../models/drinks');

const storage = multer.diskStorage(
    {
        destination: function ( req, file, cb ) {
            switch (req.body.loc) {
                case 'user_drinks':
                    cb(null, process.env.IMAGE_DIR+'user_drinks');
                    break;
                default:
                    cb(null, process.env.IMAGE_DIR);
                    break;
            }
        },
        filename: function ( req, file, cb ) {
            switch (req.body.loc) {
                case 'user_drinks':
                    cb(null, req.body.drinkID+'.jpg');
                    break;
                default:
                    cb(null, file.originalname);
                    break;
            }

        }
    }
);

const upload = multer( { storage: storage,
    fileFilter: function ( req, file, cb ) {
        if (req.body.loc) {
            cb(null, file.mimetype==='image/jpeg');
        } else {
            cb(null, false);
        }

    } } );

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

router.post('/image', upload.single('drinkImage'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received');
        return res.send({
            success: true
        })
    }
})

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