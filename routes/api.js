const express = require('express');
const multer  = require('multer');
const sharp = require("sharp");
const { v4: uuid } = require('uuid');
const fs = require("fs");
require('dotenv').config();
const router = express.Router();
const Drinks = require('../models/drinks');
const Ingredients = require('../models/ingredients');
const Users = require('../models/users');
const packVars = require('../package.json');

const ADMIN_PASS = process.env.ADMIN_PASS || 'ADMIN';
const IMAGE_DIR = process.env.IMAGE_DIR || '';
const BACKUP_DIR = process.env.BACKUP_DIR || '/root/backups/';

const {RESERVED_ROUTES} = require("../constants");

const adminKey = uuid();

var ingredients = {};

function sanitize_drink_name(name) {
    return name
        .replace(/[`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        .replace(/ /g, '-')
        .toLowerCase();
}

async function is_url_name_available(url_name, uuid){
    return new Promise((resolve, reject) => {
        if(RESERVED_ROUTES.includes(url_name)) reject();
        Drinks.find({}, 'uuid url_name').then((all_drinks) => {
            all_drinks.forEach((drink)=> {
                if(drink.uuid !== uuid && drink.url_name === url_name) reject();
            });
            resolve();
        })
    });
}

async function attempt_name(url_name, uuid) {
    return new Promise((resolve)=> {
        is_url_name_available(url_name, uuid).then(()=>{
            resolve(url_name);
        }).catch(async () => {
            url_name = url_name + '_';
            resolve(await attempt_name(url_name, uuid));
        })
    });

}

async function generate_url_name(name, uuid){
    let url_name = sanitize_drink_name(name);
    return attempt_name(url_name, uuid);
}

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

async function updateDrinkEtOH(drink){
    let etoh = 0
    await Ingredients.find({}, '').then(all_ingr => {
        all_ingr.forEach(ingr => {
            let matched_ingrs = drink.ingredients.filter(i => (i.unit === 'oz' && i.ingredient === ingr.uuid))

            if(matched_ingrs.length > 0 && matched_ingrs[0].amount !== undefined && ingr.abv !== undefined){

                etoh += ingr.abv * matched_ingrs[0].amount;
            }
        })
        if(drink.etoh !== etoh){
            //EtOH is saved at 100ths of an oz to stay as int
            Drinks.updateOne({uuid: drink.uuid}, {etoh: etoh}).then(data =>{})
        }
    })
}

function updateABVforIngredient(ingr_uuid) {
    Drinks.find({}, 'uuid ingredients').then(drinks => {
        drinks.forEach(drink => {
            if(drink.ingredients.filter(ingr => ingr.ingredient === ingr_uuid).length > 0) {
                updateDrinkEtOH(drink)
            }
        })
    })
}

//TODO: Consider adding ingredient expense and using it sort. A drink missing club soda should be higher than a drink missing top shelf liquor.
async function find_on_hand_drinks(ingr_uuids, missing_ingr_tol) {
    return new Promise(resolve => {
        if(ingr_uuids.length === 0 || missing_ingr_tol < 0) resolve([[]]);
        Drinks.find({'ingredients.0': {"$exists":true}}, 'uuid ingredients').then(drinks => {
            let results = drinks.map(drink => {
                return {
                    uuid: drink.uuid,
                    num_missing_ingr: drink.ingredients.filter(ingr => !ingr_uuids.includes(ingr.ingredient)).length
                };
            });
            let sorted_results = Array.apply(null, Array(missing_ingr_tol+1)).map((val, index) =>{
                return results.filter((result => result.num_missing_ingr === index)).map(result => result.uuid);
            });
            resolve(sorted_results);
        })
    });
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

router.get('/drink/:identifier', (req, res, next) => {
    if(req.params.identifier){
        let filter
        if(req.params.identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)){
            filter = {uuid:req.params.identifier};
        } else {
            filter = {url_name:req.params.identifier};
        }
        Drinks.findOne(filter, '')
            .then((data) => {
                if(data && data.ingredients){
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
    Drinks.find({}, 'uuid name url_name tags glass').sort({name:1})
        .then((data) => res.json(data))
        .catch(next);
});

router.get('/list/:ingr_uuid', (req, res, next) => {
    if(req.params.ingr_uuid){
        Drinks.find({}, 'uuid name url_name tags glass ingredients').sort({name:1})
            .then((data) => {
                let filteredDrinks = data.filter((drink) => {
                    return drink.ingredients.filter((ingredient) => ingredient.ingredient === req.params.ingr_uuid).length > 0
                }).map(drink => {return {uuid: drink.uuid, name: drink.name, url_name: drink.url_name, tags: drink.tags, glass: drink.glass}})
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
    if(!process.env.BACKUP_DISABLED || process.env.BACKUP_DISABLED==='false' || process.env.BACKUP_DISABLED==='False'){
        let all_dbs = {}
        Drinks.find({})
            .then((drink_db_data) => {
                all_dbs.drinks = drink_db_data
                Ingredients.find({})
                    .then((ingr_db_data) => {
                        all_dbs.ingredients = ingr_db_data
                        fs.writeFile(BACKUP_DIR+'backup-'+Date.now()+'.json', JSON.stringify(all_dbs), (err) => {
                            if(err){
                                console.error('Error writing file:',err);
                            } else {
                                console.log('Database backed up!');
                            }
                        })
                    })
            })
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

router.post('/add_drink', verifyRequest, async (req, res, next) => {
    if (req.body.name) {

        //Clean up database data
        delete req.body._id
        delete req.body.__v

        let new_drink = req.body
        if (new_drink.uuid === undefined) {
            new_drink = {...req.body, uuid: uuid()}
        }

        new_drink.url_name = await generate_url_name(new_drink.name, new_drink.uuid);

        new_drink.volume = calculateDrinkVolume(new_drink)
        Drinks.create(new_drink)
            .then((data) => {
                updateDrinkEtOH(new_drink).then(() => {
                    res.json(data)
                })
            })
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
    if (req.body.name && req.body.abv !== undefined) {
        Ingredients.create({uuid: uuid(), name: req.body.name, abv: Math.abs(req.body.abv)})
            .then((data) => {
                res.json(data);
                updateIngredients();
            })
            .catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.post('/update_ingredient', verifyRequest, (req, res, next) => {

    if (req.body.uuid && (req.body.name || req.body.abv !== undefined)) {
        let update = req.body.name ? {name: req.body.name}:{abv: Math.abs(req.body.abv)}
        if (req.body.name && req.body.abv !== undefined) update = {name: req.body.name, abv: Math.abs(req.body.abv)}
        Ingredients.findOneAndUpdate({uuid: req.body.uuid}, update)
            .then((data) => {
                res.json(data);
                updateIngredients();
                if(req.body.abv !== undefined) updateABVforIngredient(req.body.uuid)
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
    Ingredients.find({}, 'uuid name abv').sort({name:1})
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

router.get('/user_ingredients/:user_id', (req, res, next) => {
    if(req.params.user_id){
        Users.findOne({user_id: req.params.user_id}, 'available_ingredients')
            .then((ingredientData) => {
                res.json({available_ingredients: ingredientData.available_ingredients});
            })
            .catch(next);
    }
});

router.get('/user_drinks/:user_id', (req, res, next) => {
    if(req.params.user_id){
        Users.findOne({user_id: req.params.user_id}, 'available_ingredients')
            .then(async (ingredientData) => {
                if (ingredientData) {
                    let drink_uuids = await find_on_hand_drinks(ingredientData.available_ingredients, 1);
                    Drinks.find({"uuid": {'$in':[...drink_uuids[0], ...drink_uuids[1]]}}, 'uuid name url_name tags glass').sort({name:1}).then(drinks => {
                        if(drinks && drinks.length >= 0){
                            res.json(drinks.map(drink => {
                                return {uuid:drink.uuid, name:drink.name, url_name:drink.url_name, tags:drink.tags, glass:drink.glass, onhand: drink_uuids[0].includes(drink.uuid)};
                            }));
                        } else {
                            res.sendStatus(500);
                        }

                    })
                } else {
                    res.sendStatus(400);
                }
            })
            .catch(next);
    }
});

router.get('/users', (req, res, next) => {
    Users.find({}, 'user_id')
        .then((users) => {
            res.json(users.map(user => user.user_id))
        })
        .catch(next);
});

router.post('/create_user', verifyRequest, (req, res, next) => {
    Users.find({}, 'user_id').then(users => {
        if(users.length >= 1000){
            res.sendStatus(503);
        } else {
            let used_ids = users.map(user => user.user_id);
            let new_id = 10000+Math.floor(Math.random() * 89999);
            while(used_ids.includes(new_id)) {
                new_id = 10000+Math.floor(Math.random() * 89999);
            }
            Users.create({user_id: new_id}).then(user => {
                res.json({user_id: user.user_id});
            }).catch(()=>{res.sendStatus(500)});
        }
    }).catch(next);
});

router.delete('/user/:user_id', verifyRequest, (req, res, next) => {
    if(req.params.user_id){
        Users.findOneAndDelete({ user_id: req.params.user_id })
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }
});

router.post('/user_ingredients', (req, res, next) => {
    if(req.body.user_id && req.body.ingr_uuid && req.body.ingr_uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)){
        Users.findOne({user_id: req.body.user_id}, 'available_ingredients')
            .then((ingredientData) => {
                if(ingredientData){
                    let new_ingrs = []
                    if(req.body.delete) {
                        new_ingrs = ingredientData.available_ingredients.filter(ingr => ingr !== req.body.ingr_uuid)
                    } else if(!ingredientData.available_ingredients.includes(req.body.ingr_uuid)) {
                        new_ingrs = [...ingredientData.available_ingredients, req.body.ingr_uuid]
                    } else {
                        res.json({user_id: req.body.user_id, available_ingredients: ingredientData.available_ingredients});
                        return;
                    }
                    Users.updateOne({user_id: req.body.user_id}, {available_ingredients: new_ingrs}).then((user)=>{
                        res.json({user_id: req.body.user_id, available_ingredients: new_ingrs});
                    })
                } else {
                    res.sendStatus(400);
                }
            })
            .catch(next);

    } else {
        res.sendStatus(400)
    }
});


module.exports = router;