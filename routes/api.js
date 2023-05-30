const express = require('express');
const multer  = require('multer');
const sharp = require("sharp");
const fs = require("fs");
require('dotenv').config();
const router = express.Router();
const Drinks = require('../models/drinks');

const imageStorage = multer.diskStorage(
    {
        destination: function ( req, file, cb ) {
            cb(null, process.env.IMAGE_DIR+'user_drinks');
        },
        filename: function ( req, file, cb ) {
            cb(null, req.body.image_UUID+'.jpg');
        }
    }
);

const uploadImage = multer( { storage: imageStorage,
    fileFilter: function ( req, file, cb ) {
        cb(null, file.mimetype==='image/jpeg' );
    },
    limits: { fileSize: 4000000, files: 1 }
}).single('drinkImage');

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

const compressResponse = async(req) =>{
    let uploadFile = req.file.destination+'/'+req.file.filename;
    let compressedFile = req.file.destination+'/'+req.body.image_UUID+'-compressed.jpg';
    await sharp(uploadFile)
        .resize({ width: 600, height:840, fit:"cover" })
        .jpeg({ quality: 80, mozjpeg: true, force: true })
        .toFile(compressedFile)
    await fs.unlink(uploadFile, ()=>{});
    await fs.rename(compressedFile, uploadFile, ()=>{});
}

router.post('/image', uploadImage, async (req, res, next) => {
    /*uploadImage(req, res, (err) => {
        if (err) { //Error receiving the image
            return res.send({
                success: false,
                error: err
            });
        }
    });*/
    if (!req.file) { // No file was uploaded
        return res.send({
            success: false
        });
    } else { // File received successfully
        await compressResponse(req);
        return res.send({
            success: true
        })
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