const express = require('express');
const multer  = require('multer');
const sharp = require("sharp");
const { v4: uuid } = require('uuid');
const fs = require("fs");
require('dotenv').config();
const router = express.Router();
const Drinks = require('../models/drinks');
const Ingredients = require('../models/ingredients');
const packVars = require('../package.json');

const ADMIN_PASS = process.env.ADMIN_PASS || 'ADMIN';
const IMAGE_DIR = process.env.IMAGE_DIR || '';
const BACKUP_DIR = process.env.BACKUP_DIR || '/root/backups/';

const adminKey = uuid();

var ingredients = {};

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
        res.sendStatus(401);
    }
}

const imageStorage = multer.diskStorage(
    {
        destination: function ( req, file, cb ) {
            cb(null, IMAGE_DIR+'upload');
        },
        filename: function ( req, file, cb ) {
            cb(null, file.originalname+ '-' + Date.now()+'.jpg');
        }
    }
);

const uploadImage = multer( { storage: imageStorage,
    fileFilter: function ( req, file, cb ) {
        cb(null, file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/webp');
    },
    limits: { fileSize: 4000000, files: 1 }
}).single('drinkImage');

const compressDrinkImg = async(req, imageUUID) =>{
    let uploadFile = req.file.destination+'/'+req.file.filename;
    let compressedFile = IMAGE_DIR+'user_drinks/'+imageUUID+'.jpg';
    await sharp(uploadFile)
        .rotate()
        .resize({ width: 600, height:840, fit:"cover" })
        .jpeg({ quality: 80, mozjpeg: true, force: true })
        .toFile(compressedFile)
    await fs.unlink(uploadFile, ()=>{});
};

const updateIngredients = async() => {
    ingredients = {}
    Ingredients.find({}, 'uuid name').sort({name:1})
        .then((data) => {
            data.forEach((ingredient)=>{
                ingredients[ingredient.uuid] = ingredient.name;
            })
        })
        .catch();
}

function calculateDrinkVolume(drink) {
    let volume = 0
    if(drink.ingredients){
        drink.ingredients.forEach(ingredient => {
           if(ingredient.unit === 'oz') volume += ingredient.amount
        });
    }
    return volume
}

updateIngredients()

router.get('/app-info', (req, res, next) => {
    res.json({
        name: packVars.name,
        version: packVars.version,
        description: packVars.description
    });
});

router.post('/admin_login', (req, res, next) => {
    if (req.body.password === ADMIN_PASS) {
        updateIngredients(); //Update ingredients on Admin Login
        res.json({adminKey: adminKey});
    } else {
        res.json({error: 'Incorrect Password'});
    }
});

router.get('/drink/:uuid', (req, res, next) => {
    if(req.params.uuid){
        Drinks.findOne({uuid:req.params.uuid}, '')
            .then((data) => {
                if(data.ingredients != null){
                    data.ingredients.forEach((ingredient, index)=>{
                        if(ingredients[data.ingredients[index].ingredient] != null){
                            data.ingredients[index].ingredient = ingredients[data.ingredients[index].ingredient];
                        } else {
                            data.ingredients[index].ingredient = "Missing ingredient ("+data.ingredients[index].ingredient+")"
                        }
                    })
                }
                res.json(data)
            })
            .catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.get('/list', (req, res, next) => {
    Drinks.find({}, 'uuid name tags glass').sort({name:1})
        .then((data) => res.json(data))
        .catch(next);
});

router.get('/list/:ingr_uuid', (req, res, next) => {
    if(req.params.ingr_uuid){
        Drinks.find({}, 'uuid name tags glass ingredients').sort({name:1})
            .then((data) => {
                let filteredDrinks = data.filter((drink) => {
                    return drink.ingredients.filter((ingredient) => ingredient.ingredient === req.params.ingr_uuid).length > 0
                }).map(drink => {return {uuid: drink.uuid, name: drink.name, tags: drink.tags, glass: drink.glass}})
                res.json(filteredDrinks)
            })
            .catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.get('/tags', (req, res, next) => {
    Drinks.find({}, 'tags glass')
        .then((data) => {
            let tags = {};
            let tagList = [];
            let categories = [];
            let glasses = [];
            data.forEach((drink) => {
                if (drink.glass) {
                    glasses.push(drink.glass);
                }
                if (drink.tags){
                    drink.tags.forEach((drinkTag)=>{
                        tagList.push(drinkTag);
                        categories.push(drinkTag.category)
                    });
                }
            });
            categories = Array.from(new Set(categories)).sort();
            categories.forEach((cat) => {
                let catTags = [];
                tagList.forEach((drinkTag) => {
                   if(drinkTag.category === cat) {
                       catTags.push(drinkTag.value);
                   }
                });
                tags = {...tags, [cat]:Array.from(new Set(catTags)).sort()};
            });
            res.json({tags: tags, glasses: Array.from(new Set(glasses)).sort()});
        })
        .catch(next);
});

router.get('/image', (req, res, next) => {
    if (req.query.file && fs.existsSync(IMAGE_DIR+req.query.file)){
        res.sendFile(IMAGE_DIR+req.query.file);
    } else if (req.query.backup && fs.existsSync(IMAGE_DIR+req.query.backup)) {
        res.sendFile(IMAGE_DIR+req.query.backup);
    } else {
        res.sendStatus(404);
    }
});

router.post('*', (req, res, next) => {
    if(!process.env.BACKUP_DISABLED){
        Drinks.find({})
            .then((data) => fs.writeFile(BACKUP_DIR+'drinkbackup'+Date.now()+'.json', JSON.stringify(data), (err) => {
                if(err) console.log('Error writing file:',err);
            }))
        Ingredients.find({})
            .then((data) => fs.writeFile(BACKUP_DIR+'ingredientbackup'+Date.now()+'.json', JSON.stringify(data), (err) => {
                if(err) console.log('Error writing file:',err);
            }))
    }
        next()
});

router.post('/image', verifyRequest, async (req, res, next) => {
    uploadImage(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }
        if (!req.file) {
            return res.sendStatus(400);
        } else {
            let imageUUID = uuid();
            compressDrinkImg(req, imageUUID);
            return res.send({ imageUUID: imageUUID });
        }
    });
});

router.post('/add_drink', verifyRequest, (req, res, next) => {
    if (req.body.name) {

        //Clean up database data
        delete req.body._id
        delete req.body.__v

        let new_drink = {...req.body, uuid: uuid()}
        new_drink.volume = calculateDrinkVolume(new_drink)
        Drinks.create(new_drink)
            .then((data) => res.json(data))
            .catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.post('/modify_tag/', verifyRequest, (req, res, next) => {
    if (req.body) {
        switch (req.body.change) {
            case 'add':
                Drinks.updateOne({uuid: req.body.drinkUUID}, {$push: {"tags":req.body.tag}})
                    .then((data) => res.json(data))
                    .catch(next);
                console.log('Added tag!');
                return;
            case 'remove':
                Drinks.updateOne({uuid: req.body.drinkUUID}, {$pull: {"tags":req.body.tag}})
                    .then((data) => res.json(data))
                    .catch(next);
                console.log('Removed tag!');
                return;
            default:
                res.sendStatus(400);
                return;
        }
    } else {
        res.sendStatus(400);
    }
});
/** Unused and deprecated
router.post('/update_drink/:id', verifyRequest, (req, res, next) => {
    if (req.params.id && req.body) {
        console.log(req.body);
        Drinks.updateOne({_id: req.params.id}, req.body)
            .then((data) => res.json(data))
            .catch(next);
    } else {
        res.sendStatus(400);
    }
});**/

router.delete('*', (req, res, next) => {
    if(!process.env.BACKUP_DISABLED) {
        Drinks.find({})
            .then((data) => fs.writeFile(BACKUP_DIR + 'drinkbackup' + Date.now() + '.json', JSON.stringify(data), (err) => {
                if (err) console.log('Error writing file:', err);
            }))
        Ingredients.find({})
            .then((data) => fs.writeFile(BACKUP_DIR + 'ingredientbackup' + Date.now() + '.json', JSON.stringify(data), (err) => {
                if (err) console.log('Error writing file:', err);
            }))
    }
    next()
});

router.delete('/drink/:uuid', verifyRequest, (req, res, next) => {
    if(req.params.uuid){
        Drinks.findOneAndDelete({ uuid: req.params.uuid })
            .then((data) => {
                let drinkImage = IMAGE_DIR+'user_drinks/'+data.image+'.jpg'
                if (!req.query.saveImg && fs.existsSync(drinkImage)){
                    fs.unlink(drinkImage, (e)=>{e && console.error(e)});
                }
                return res.json(data);
            })
            .catch(next);
    }
});

router.post('/add_ingredient', verifyRequest, (req, res, next) => {
    if (req.body.name) {
        Ingredients.create({uuid: uuid(), name: req.body.name})
            .then((data) => {
                res.json(data);
                updateIngredients();
            })
            .catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.post('/rename_ingredient', verifyRequest, (req, res, next) => {
    if (req.body.uuid && req.body.name) {
        Ingredients.findOneAndUpdate({uuid: req.body.uuid}, {name: req.body.name})
            .then((data) => {
                res.json(data);
                updateIngredients();
            })
            .catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.delete('/ingredient/:uuid', verifyRequest, (req, res, next) => {
    if(req.params.uuid){
        Ingredients.findOneAndDelete({ uuid: req.params.uuid })
            .then((data) => {
                res.json(data);
                updateIngredients();
            })
            .catch(next);
    }

});

router.get('/get_ingredients', (req, res, next) => {
    Ingredients.find({}, 'uuid name').sort({name:1})
        .then((data) => res.json(data))
        .catch(next);
});

router.get('/count_ingredients/', (req, res, next) => {
    let ingredients = []
    Ingredients.find({}, 'uuid name').sort({name:1})
        .then((ingredientData) => {
            Drinks.find({}, 'ingredients').then((drinkData) => {
                ingredientData.forEach((ingredientResult) => {
                    let drinks = drinkData.filter((drink) => {
                        return drink.ingredients.filter(ingr => ingr.ingredient === ingredientResult.uuid).length > 0
                    })
                    ingredients.push({
                        uuid: ingredientResult.uuid,
                        name: ingredientResult.name,
                        count: drinks.length
                    })
                })
                res.json(ingredients)
            })
        })
        .catch(next);
});

router.get('/unused_ingredients', (req, res, next) => {
    let empty_UUIDs = []
    Ingredients.find({}, 'uuid')
        .then((ingredientData) => {
            Drinks.find({}, 'ingredients').then((drinkData) => {
                ingredientData.forEach((ingredientResult) => {
                    let drinks = drinkData.filter((drink) => {
                        return drink.ingredients.filter(ingr => ingr.ingredient === ingredientResult.uuid).length > 0
                    })
                    if(drinks.length === 0) empty_UUIDs.push(ingredientResult.uuid)
                })
                res.json(empty_UUIDs)
            })
        })
        .catch(next);
});


module.exports = router;