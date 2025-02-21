const fs = require('fs');
const Drinks = require("../models/drinks");
const Ingredients = require('../models/ingredients');

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

module.exports = {
    validateDatabase: async function (verbose) {
        return new Promise((resolve) =>{
            console.log(`Database connected successfully.`)
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
                        for await (const drink of drinks) {
                            await importObjectToModel(Drinks, drink).then(added => {
                                if (added){
                                    console.log('Imported Drink:', drink.name, '(' + drink.uuid + ')');
                                    imported_drinks++;
                                }
                            });
                        }
                        for await (const ingredient of ingredients) {
                            await importObjectToModel(Ingredients, ingredient).then(added => {
                                if (added){
                                    console.log('Imported Ingredient:', ingredient.name, '(' + ingredient.uuid + ')');
                                    imported_ingr++;
                                }
                            });
                        }
                        if(imported_drinks + imported_ingr > 0){
                            console.log('Import complete! Imported', imported_drinks + imported_ingr, 'objects');
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
