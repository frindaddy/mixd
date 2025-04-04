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
const Menus = require('../models/menus');
const packVars = require('../package.json');

const IMAGE_DIR = process.env.IMAGE_DIR || '';
const BACKUP_DIR = process.env.BACKUP_DIR || '/root/backups/';

const {RESERVED_ROUTES} = require("../constants");
require("../security");
const {issueUserToken, validateUserToken, validateAdminToken} = require("../security");

const adminKey = uuid();

let ingredients = {};
let na_ingredients = [];

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
    na_ingredients = []
    Ingredients.find({}, 'uuid name abv').sort({name:1})
        .then((data) => {
            data.forEach((ingredient)=>{
                if(ingredient.abv === 0) na_ingredients.push(ingredient.uuid);
                ingredients[ingredient.uuid] = {name: ingredient.name, abv: ingredient.abv};
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

function remove_drink_from_menus(drinkUUID) {
    Menus.aggregate([{$match: {$expr: {$in: [drinkUUID, '$drinks']}}},
        {$project: {_id: 0, menu_id: '$menu_id', drinks: {$filter : {input: "$drinks", cond: {$ne: ["$$this", drinkUUID]}}}}}
    ]).then(menus => {
        menus.forEach(menu =>{
            Menus.updateOne({menu_id: menu.menu_id}, {drinks: menu.drinks}).then((res)=>{
                if(!res.acknowledged) console.error(res);
            })
        })
    });
}
function validate_username(username) {
    if(username.length === 0 || username.length > 15) return false;
    if(!username.match(/^[a-zA-Z0-9._]*$/)) return false;
    if(!username.match(/[a-zA-Z]/)) return false;
    if(username.match(/^[._]|[.]$|[_.]_$/)) return false;
    return true;
}

updateIngredients()

router.get('/app-info', (req, res, next) => {
    res.json({
        name: packVars.name,
        version: packVars.version,
        description: packVars.description
    });
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
                            data.ingredients[index].ingredient = ingredients[data.ingredients[index].ingredient].name;
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

/*router.get('/list/:ingr_uuid', (req, res, next) => {
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
});*/

router.get('/search', async (req, res, next) => {
    let pipeline = [];
    let myBarAggregate;
    if(req.query.user_id){
        let tol = parseInt(req.query.tol) || 0;
        let user_data = await Users.findOne({user_id: req.query.user_id}, 'available_ingredients')
        let available_ingredients = user_data.available_ingredients;
        if(req.query.no_na === 'true'){
            available_ingredients = available_ingredients.concat(na_ingredients);
        }
        if(user_data.available_ingredients){
            myBarAggregate = await Drinks.aggregate([
                {$project: {
                    uuid: '$uuid',
                    ingredients: '$ingredients',
                    totalIngredients: {$size: '$ingredients'}
                }},
                {$unwind: '$ingredients'},
                {$match: {'ingredients.ingredient': {$in: available_ingredients}}},
                {$group: {
                    _id: {
                        uuid: '$uuid',
                        totalIngredients: '$totalIngredients'
                    },
                    count: {$sum: 1}
                }},
                {$project: {
                    uuid: '$_id.uuid',
                    missing: {$subtract: ['$_id.totalIngredients', '$count']},
                    _id: 0
                }},
                {$match: {missing: req.query.strict === 'true' ? tol:{$lte: tol}}},
                {$sort: {missing: 1}}
            ])
        }
    }

    if(myBarAggregate) {
        pipeline = [{$match: {uuid: {$in: myBarAggregate.map(result => result.uuid)}}}];
    }

    if(req.query.searchText && req.query.searchText !=='') {
        pipeline.push({$match: {'name': {$regex: req.query.searchText.trim(), $options: 'i'}}})
    }

    if(req.query.ingredient && req.query.ingredient !==''){
        pipeline = pipeline.concat([
            {$unwind: '$ingredients'},
            {$match: {'ingredients.ingredient': req.query.ingredient}},
            {$group: {
                _id: {
                    uuid: '$uuid',
                    name: '$name',
                    tags: '$tags'
                }
            }},
            {$project: {
                uuid: '$_id.uuid',
                name: '$_id.name',
                tags: '$_id.tags',
                _id: 0
            }}
        ]);
    }

    if(req.query.tags){
        pipeline = pipeline.concat([
            {$unwind: "$tags"},
            {$project: {
                uuid: '$uuid',
                name: '$name',
                tag: {
                    category: '$tags.category',
                    value: '$tags.value'
                }
            }},
            {$match: {'tag': {$in:req.query.tags}}},
            {$group: {
                _id: {
                    uuid: '$uuid',
                    name: '$name',
                },
                count: {$sum: 1}
            }},
            {$project: {
                uuid: '$_id.uuid',
                name: '$_id.name',
                ingredients: '$_id.ingredients',
                tagCount: '$count',
                _id: 0
            }},
            {$sort: {tagCount: -1, name: 1}}
        ]);
    } else {
        pipeline.push({$sort: {name: 1}});
    }

    if(pipeline.length > 0){
        Drinks.aggregate(pipeline).then(pipeline_res => {
            let pipeline_uuids = pipeline_res.map(drink=>drink.uuid);
            Drinks.find({uuid: {$in: pipeline_uuids}}, 'uuid name url_name tags glass').then((data) => {
                if(myBarAggregate){
                    let missing_ingr = {}
                    myBarAggregate.forEach(drink => missing_ingr[drink.uuid] = drink.missing);
                    data.sort((a, b) => {
                        let ingr_rank = missing_ingr[a.uuid] - missing_ingr[b.uuid];
                        if(ingr_rank === 0) {
                            return pipeline_uuids.indexOf(a.uuid) - pipeline_uuids.indexOf(b.uuid);
                        } else {
                            return ingr_rank;
                        }
                    });
                } else {
                    data.sort((a, b) => pipeline_uuids.indexOf(a.uuid) - pipeline_uuids.indexOf(b.uuid));
                }
                res.json(data);
            }).catch(next);
        })
    } else {
        res.json([]);
    }
});

router.get('/tags', (req, res, next) => {
    Drinks.aggregate([
        {$unwind: '$tags'},
        {$group: {
            _id: {
                category: '$tags.category',
                value: '$tags.value'
            }
        }},
        {$project: {
            category: '$_id.category',
            value: '$_id.value',
            _id: 0
        }},
        {$sort: {value: 1}}
    ]).then(data => {
        if(data){
            res.json(data);
        }
    })
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

/*router.post('*', (req, res, next) => {
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
});*/

router.post('/image', validateAdminToken, async (req, res, next) => {
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

router.post('/add_drink', validateAdminToken, async (req, res, next) => {
    if (req.body.name) {

        //Clean up database data
        delete req.body._id
        delete req.body.__v

        let new_drink = req.body
        if (new_drink.uuid === undefined) {
            new_drink = {...req.body, uuid: uuid()}
        }
        if (new_drink.menu_desc && new_drink.menu_desc.length > 150) {
            new_drink = {...new_drink, menu_desc: new_drink.menu_desc.substring(0, 150)}
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

router.post('/modify_tag/', validateAdminToken, (req, res, next) => {
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

/*router.delete('*', (req, res, next) => {
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
});*/

router.delete('/drink/:uuid', validateAdminToken, (req, res, next) => {
    if(req.params.uuid){
        Drinks.findOneAndDelete({ uuid: req.params.uuid })
            .then((data) => {
                let drinkImage = IMAGE_DIR+'user_drinks/'+data.image+'.jpg'
                if (!req.query.saveImg && fs.existsSync(drinkImage)){
                    fs.unlink(drinkImage, (e)=>{e && console.error(e)});
                }
                remove_drink_from_menus(req.params.uuid);
                return res.json(data);
            })
            .catch(next);
    }
});

router.post('/add_ingredient', validateAdminToken, (req, res, next) => {
    if (req.body.name && req.body.abv !== undefined && req.body.category !== '') {
        Ingredients.create({uuid: uuid(), name: req.body.name, abv: Math.abs(req.body.abv), category: req.body.category})
            .then((data) => {
                res.json(data);
                updateIngredients();
            })
            .catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.post('/update_ingredient', validateAdminToken, (req, res, next) => {
    if (req.body.uuid && (req.body.name || req.body.abv !== undefined || req.body.category) && req.body.category !== '') {
        Ingredients.findOneAndUpdate({uuid: req.body.uuid}, {name: req.body.name, category: req.body.category, abv: req.body.abv !== undefined ? Math.abs(req.body.abv) : undefined})
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

router.delete('/ingredient/:uuid', validateAdminToken, (req, res, next) => {
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
    Ingredients.find({}, 'uuid name abv category').sort({name:1})
        .then((data) => res.json(data))
        .catch(next);
});

router.get('/count_ingredients/', (req, res, next) => {
    let ingredients = []
    Ingredients.find({}, 'uuid name category').sort({name:1})
        .then((ingredientData) => {
            Drinks.find({}, 'ingredients').then((drinkData) => {
                ingredientData.forEach((ingredientResult) => {
                    let drinks = drinkData.filter((drink) => {
                        return drink.ingredients.filter(ingr => ingr.ingredient === ingredientResult.uuid).length > 0
                    })
                    ingredients.push({
                        uuid: ingredientResult.uuid,
                        name: ingredientResult.name,
                        category: ingredientResult.category,
                        count: drinks.length
                    })
                })
                ingredients.sort((a, b) => {
                    if(a.count > b.count) return -1;
                    if(a.count < b.count) return 1;
                    return 0;
                });
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
                if(ingredientData && ingredientData.available_ingredients){
                    res.json({available_ingredients: ingredientData.available_ingredients});
                } else {
                    res.sendStatus(400);
                }
            })
            .catch(next);
    }
});

router.post('/login', (req, res, next) => {
    if(req.body.accountIdentifier){
        let query = {username: req.body.accountIdentifier}
        if(req.body.accountIdentifier.length === 5){
            let checkInt = parseInt(req.body.accountIdentifier);
            if(checkInt && checkInt >= 10000 && checkInt < 100000){
                query = {user_id: checkInt}
            }
        }
        Users.findOne(query, 'username user_id admin pin')
            .then((user_data) => {
                if(user_data){
                    let response = {user_id: user_data.user_id, username: user_data.username, token: issueUserToken(user_data.user_id, uuid(), user_data.admin || false), isAdmin: user_data.admin || false}
                    if(user_data.pin){
                        if(req.body.pin === user_data.pin){
                            res.json(response);
                        } else {
                            res.sendStatus(403)
                        }
                    } else {
                        res.json(response)
                    }
                } else {
                    res.sendStatus(403);
                }
            })
            .catch(next);
    }
});

router.get('/users', (req, res, next) => {
    Users.find({}, 'user_id username admin')
        .then((users) => {
            res.json(users);
        })
        .catch(next);
});

router.get('/check_username/:username', (req, res, next)=>{
    if(req.params.username){
        if(validate_username(req.params.username)){
            Users.findOne({username: req.params.username}).then(user => {
                res.json({taken: user !== null, valid: true});
            }).catch(err => console.log(err));
        } else {
            res.json({taken: false, valid: false});
        }
    }
});

router.post('/change_username', validateUserToken, (req, res, next) => {
    if(req.body.user_id && req.body.username) {
        Users.updateOne({user_id: req.body.user_id}, {username: req.body.username}).then(user => {
            if(user && user.acknowledged){
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        }).catch(next);
    }
});

router.post('/change_pin', validateUserToken, (req, res, next) => {
    if(req.body.user_id && req.body.pin && req.body.pin >= 1000 && req.body.pin < 100000) {
        Users.updateOne({user_id: req.body.user_id}, {pin: req.body.pin}).then(user => {
            if(user && user.acknowledged){
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        }).catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.post('/make_admin', validateAdminToken, (req, res, next) => {
    if(req.body.user_id) {
        Users.updateOne({user_id: req.body.user_id}, {admin: req.body.admin}).then(user => {
            if(user && user.acknowledged){
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        }).catch(next);
    }
});

router.post('/create_user', validateAdminToken, (req, res, next) => {
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

router.delete('/user/:user_id', validateAdminToken, (req, res, next) => {
    if(req.params.user_id){
        Users.findOneAndDelete({ user_id: req.params.user_id })
            .then((data) => {
                res.sendStatus(200);
            })
            .catch(next);
    }
});

router.delete('/pin/:user_id', validateAdminToken, (req, res, next) => {
    if(req.params.user_id){
        Users.updateOne({ user_id: req.params.user_id }, {$unset: {pin: ""}})
            .then((data) => {
                res.sendStatus(200);
            })
            .catch(next);
    }
});

router.post('/user_ingredients', validateUserToken, (req, res, next) => {
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

router.get('/menus', (req, res, next) => {
    Menus.find({}, 'menu_id name users featured').sort({name: 1})
        .then((menus) => {
            res.json(menus)
        })
        .catch(next);
});

router.get('/menus/:user_id', (req, res, next) => {
    if(req.params.user_id){
        Menus.find({}, 'menu_id name users drinks')
            .then((menus) => {
                let users_menus = menus.filter(menu => menu.users && menu.users.includes(req.params.user_id));
                res.json(users_menus.map(menu => {return {menu_id: menu.menu_id, name: menu.name, drinks: menu.drinks}}));
            })
            .catch(next);
    } else {
        res.send(400);
    }
});

router.get('/menu/:menu_id', (req, res, next) => {
    if(req.params.menu_id){
        let menuFilter = {menu_id: req.params.menu_id}
        if(req.params.menu_id === 'featured') menuFilter = {featured: true}
        Menus.findOne(menuFilter, '')
            .then((menu) => {
                if (menu) {
                    if(menu.drinks){
                        Drinks.find({"uuid": {'$in':menu.drinks}}, 'uuid name url_name tags menu_desc glass')
                            .then((drinks) => {
                                if(drinks && drinks.length >= 0){
                                    let sorted_drinks = menu.drinks.map(drink_uuid => {
                                        return drinks.filter(drink => drink.uuid === drink_uuid)[0];
                                    })
                                    res.json({menu_id: req.params.menu_id, name: menu.name, users: menu.users, drinks: menu.drinks, drinkList: sorted_drinks});
                                } else {
                                    res.sendStatus(500);
                                }
                            })
                            .catch(next);
                    } else {
                        res.json(menu)
                    }
                } else {
                    if(req.params.menu_id === 'featured'){
                        res.json({});
                    } else {
                        res.sendStatus(400);
                    }
                }
            })
            .catch(next);
    }
});

router.post('/create_menu', validateUserToken, (req, res, next) => {
    if(!req.body.menu_id && req.body.user_id){
        Menus.find({}, 'menu_id').then(all_menus => {
            let used_ids = all_menus.map(menu => menu.menu_id);
            let new_menu_id = uuid().substring(0,8);
            let attempts = 1;
            while(used_ids.includes(new_menu_id)) {
                new_menu_id = uuid().substring(0,8);
                if(attempts > 10){
                    res.sendStatus(500);
                    return;
                }
                attempts = attempts + 1;
            }
            let drinks = [];
            if(req.body.drinks && Object.prototype.toString.call(req.body.drinks) === '[object Array]' && req.body.drinks.length > 0){
                drinks = req.body.drinks.filter(drink=>typeof drink === 'string');
            }
            Menus.create({menu_id: new_menu_id, drinks: drinks, users: [req.body.user_id], name: req.body.name}).then(menu => {
                res.json({menu_id: menu.menu_id, drinks: menu.drinks, name: menu.name});
            }).catch(()=>{res.sendStatus(500)});
        }).catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.post('/modify_menu', validateUserToken, (req, res, next) => {
    if(req.body.menu_id && (req.body.drinks || req.body.name)){
        Menus.findOne({menu_id: req.body.menu_id, $expr: {$in: [req.validated_user, '$users']}}, 'menu_id').then(menu => {
            if(menu){
                let drinks;
                if(req.body.drinks && Object.prototype.toString.call(req.body.drinks) === '[object Array]' && req.body.drinks.length > 0){
                    drinks = req.body.drinks.filter(drink=>typeof drink === 'string');
                } else if(req.body.drinks && req.body.drinks.length === 0){
                    drinks = [];
                }
                Menus.updateOne({menu_id: menu.menu_id}, {drinks: drinks, name: req.body.name}).then(response => {
                    if(response.acknowledged){
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(500);
                    }
                }).catch(()=>{res.sendStatus(500)});
            } else {
                res.sendStatus(400);
            }
        }).catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.post('/feature_menu', validateAdminToken, (req, res, next) => {
    if(req.body.menu_id){
        Menus.updateMany({featured: true}, {featured: false}).then(response => {
            if(response.acknowledged){
                if(req.body.remove !== true){
                    Menus.updateOne({menu_id: req.body.menu_id}, {featured: true}).then(response => {
                        if(response.acknowledged){
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(500);
                        }
                    }).catch(()=>{res.sendStatus(500)});
                } else {
                    res.sendStatus(200);
                }
            } else {
                res.sendStatus(500);
            }
        }).catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.post('/add_menu_drink', validateUserToken, (req, res, next) => {
    if(req.body.menu_id && req.body.drink){
        Menus.findOne({menu_id: req.body.menu_id, $expr: {$in: [req.validated_user, '$users']}}, 'menu_id drinks').then(menu => {
            if(menu && menu.drinks){
                if(menu.drinks.includes(req.body.drink)){
                    res.sendStatus(200);
                } else {
                    Menus.updateOne({menu_id: menu.menu_id}, {drinks: [...menu.drinks, req.body.drink]}).then(response => {
                        if(response.acknowledged){
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(500);
                        }
                    }).catch(()=>{res.sendStatus(500)});
                }
            } else {
                res.sendStatus(400);
            }
        }).catch(next);
    } else {
        res.sendStatus(400);
    }
});

router.delete('/menu/:menu_id', validateUserToken, (req, res, next) => {
    if(req.params.menu_id){
        Menus.findOneAndDelete({menu_id: req.params.menu_id, $expr: {$in: [req.validated_user, '$users']}})
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }
});

router.delete('/menu_forced/:menu_id', validateAdminToken, (req, res, next) => {
    if(req.params.menu_id){
        Menus.findOneAndDelete({ menu_id: req.params.menu_id })
            .then((data) => {
                res.json(data);
            }).catch(next);
    }
});

module.exports = router;