const express = require('express');
const multer  = require('multer');
const sharp = require("sharp");
const { v4: uuid } = require('uuid');
const fs = require("fs");
require('dotenv').config();
const router = express.Router();
const Drinks = require('../models/drinks');
const packVars = require('../package.json');

const ADMIN_PASS = process.env.ADMIN_PASS || 'ADMIN';

const adminKey = uuid();

const verifyRequest = (req, res, next) => {
    if (req.headers.authorization) {
        let bearerToken = req.headers.authorization.split(' ')[1];
        if(bearerToken === adminKey){
            req.token = bearerToken;
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}

const imageStorage = multer.diskStorage(
    {
        destination: function ( req, file, cb ) {
            cb(null, process.env.IMAGE_DIR+'upload');
        },
        filename: function ( req, file, cb ) {
            cb(null, file.originalname+ '-' + Date.now()+'.jpg');
        }
    }
);

const uploadImage = multer( { storage: imageStorage,
    fileFilter: function ( req, file, cb ) {
        cb(null, file.mimetype==='image/jpeg' );
    },
    limits: { fileSize: 4000000, files: 1 }
}).single('drinkImage');

router.get('/app-info', (req, res, next) => {
    res.json({
        name: packVars.name,
        version: packVars.version,
        description: packVars.description
    });
});

router.post('/admin_login', (req, res, next) => {
    if (req.body.password === ADMIN_PASS) {
        res.json({adminKey: adminKey});
    } else {
        res.json({error: 'Incorrect Password'});
    }
});

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

const compressDrinkImg = async(req, imageUUID) =>{
    let uploadFile = req.file.destination+'/'+req.file.filename;
    let compressedFile = process.env.IMAGE_DIR+'user_drinks/'+imageUUID+'.jpg';
    await sharp(uploadFile)
        .resize({ width: 600, height:840, fit:"cover" })
        .jpeg({ quality: 80, mozjpeg: true, force: true })
        .toFile(compressedFile)
    await fs.unlink(uploadFile, ()=>{});
}

router.post('/image', verifyRequest, async (req, res, next) => {
    uploadImage(req, res, (err) => {
        if (err) {
            return res.send({ error: err });
        }
        if (!req.file) {
            return res.send({ error: 'No file was received.' });
        } else {
            let imageUUID = uuid();
            compressDrinkImg(req, imageUUID);
            return res.send({ imageUUID: imageUUID });
        }
    });
});

router.post('/add_drink', verifyRequest, (req, res, next) => {
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

router.post('/update_drink/:id', verifyRequest, (req, res, next) => {
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

router.delete('/drink/:id', verifyRequest, (req, res, next) => {
    Drinks.findOneAndDelete({ _id: req.params.id })
        .then((data) => {
            let drinkImage = process.env.IMAGE_DIR+'user_drinks/'+data.image+'.jpg'
            if (!req.query.saveImg && fs.existsSync(drinkImage)){
               fs.unlink(drinkImage, (e)=>{e && console.error(e)});
            }
            return res.json(data);
        })
        .catch(next);
});

module.exports = router;