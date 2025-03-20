const fs = require('fs');
const Drinks = require("../models/drinks");
const Ingredients = require('../models/ingredients');
const {RESERVED_ROUTES} = require("../constants");

async function importObjectToModel(model, object) {
    return new Promise((resolve) =>{
        model.findOne({uuid:object.uuid}, '').then(data => {
            //Check that object is not in db
            if(data === null){
                //Clean up old db data
                delete object._id
                delete object.__v

                model.create(object).then(()=>{
                    resolve(true);
                }).catch(()=>{
                    resolve(false);
                })
            } else {
                resolve(false);
            }
        }).catch(()=>{
            resolve(false);
        });
    });
}

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

module.exports = {
    validateDatabase: async function (verbose) {
        return new Promise((resolve) =>{
            console.log(`Database connected successfully.`)
            Drinks.find({}, 'name uuid').then(drinks =>{
                drinks.forEach((drink) => {
                    generate_url_name(drink.name, drink.uuid).then(url_name=>{
                        console.log(url_name, drink.name, drink.uuid)
                        Drinks.updateOne({uuid: drink.uuid}, {url_name: url_name}).then(data =>{});
                    })
                })
            })
            resolve();
        })
    },
    //Import data from a JSON if one is provided
    importJSON: async function (JSON_FILE, resolveDatabase) {
        return new Promise((resolve) => {
            if(JSON_FILE !== undefined){
                console.log('Attempting to import data from:', JSON_FILE);
                fs.readFile(JSON_FILE, async function (err, data) {
                    if (!err) {
                        const json_data = JSON.parse(data);
                        let drinks = []
                        let ingredients = []
                        if (json_data.drinks !== undefined && json_data.drinks.length > 0) drinks = json_data.drinks;
                        if (json_data.ingredients !== undefined && json_data.ingredients.length > 0) ingredients = json_data.ingredients
                        let imported_drinks = 0;
                        let imported_ingr = 0;
                        for await (const ingredient of ingredients) {
                            await importObjectToModel(Ingredients, ingredient).then(added => {
                                if (added){
                                    console.log('Imported Ingredient:', ingredient.name, '(' + ingredient.uuid + ')');
                                    imported_ingr++;
                                }
                            });
                        }
                        for await (const drink of drinks) {
                            await importObjectToModel(Drinks, drink).then(added => {
                                if (added){
                                    console.log('Imported Drink:', drink.name, '(' + drink.uuid + ')');
                                    imported_drinks++;
                                }
                            });
                        }
                        if(imported_drinks + imported_ingr > 0){
                            console.log('Import complete! Imported', imported_drinks, 'drinks and', imported_ingr, 'ingredients.');
                        } else {
                            console.log('Nothing to import. Consider removing import file.');
                        }
                        resolveDatabase();
                        resolve();
                    } else {
                        resolveDatabase();
                        resolve();
                        console.error(err);
                    }
                });
            } else {
                resolveDatabase();
                resolve();
            }
        });
    }
}
