const fs = require('fs');
const Drinks = require("../models/drinks");
const Ingredients = require('../models/ingredients');

/*
const { v4: uuid, validate: uuidValidate } = require('uuid');

async function checkUUIDs(verbose) {
    return Drinks.find({}, 'uuid')
        .then(async (data) => {
            let uuidsToDefine = [];
            let allUUIDs = [];
            data.forEach((drink) => {
                if (!drink.uuid) {
                    uuidsToDefine.push(drink._id.toString());
                } else {
                    allUUIDs.push(drink.uuid);
                }
            });

            if (allUUIDs.length !== new Set(allUUIDs).size) {
                console.error('DUPLICATE UUIDs');
            }

            if (uuidsToDefine.length > 0) {
                console.log(`Defining ${uuidsToDefine.length} UUIDs...`);
                for (const drinkID of uuidsToDefine) {
                    await Drinks.updateOne({_id: drinkID}, {uuid: uuid()})
                        .then((res) => {
                            if(res.acknowledged) {
                                console.log('UUID added for database item: '+drinkID);
                            } else {
                                console.error('Failed to add UUID for database item: '+drinkID);
                            }
                        });
                }
            } else if (verbose) {
                console.log('No missing UUIDs')
            }
        });
}

async function updateLegacyIngredients() {
    //Find legacy ingredients and create the ingredient
    Ingredients.find({}, 'uuid name').then(ingredients => {
        let ingredientUUIDs = ingredients.map((ingredient) => ingredient.uuid)
        let ingredientNames = ingredients.map((ingredient) => ingredient.name)
        Drinks.find({}, 'ingredients').then((drinkData) => {
            drinkData.forEach((drink) => {
                drink.ingredients.forEach(drinkIngredient => {
                    if(!ingredientUUIDs.includes(drinkIngredient.ingredient) && !ingredientNames.includes(drinkIngredient.ingredient)){
                        if(!uuidValidate(drinkIngredient.ingredient)){
                            ingredientNames.push(drinkIngredient.ingredient)
                            Ingredients.create({uuid: uuid(), name: drinkIngredient.ingredient})
                            console.log("Creating '" + drinkIngredient.ingredient + "' ingredient")
                        } else {
                            console.log("UUID used but not an ingredient")
                        }
                    }
                })
            })
        })
    }).then(()=>{
        //Assign ingredients based on legacy name
        Ingredients.find({}, 'uuid name').then(ingredientData => {
            let ingredientUUIDs = ingredientData.map((ingredient) => ingredient.uuid)
            Drinks.find({}, 'name uuid ingredients').then((drinkData) => {
                drinkData.forEach((drink) => {
                    let new_ingredients = drink.ingredients
                    let updated = false
                    drink.ingredients.forEach(drinkIngredient => {
                        if(!ingredientUUIDs.includes(drinkIngredient.ingredient) && !uuidValidate(drinkIngredient.ingredient)){
                            let ingIndex = ingredientData.findIndex(ingredient => ingredient.name === drinkIngredient.ingredient)
                            if(ingIndex !== -1) {
                                let index = drink.ingredients.findIndex(ingredient => ingredient.ingredient === drinkIngredient.ingredient)
                                new_ingredients[index].ingredient = ingredientData[ingIndex].uuid
                                updated = true
                            }
                        }
                    })
                    if(updated) {
                        Drinks.updateOne({uuid: drink.uuid}, {ingredients: new_ingredients}).then((data) => {
                            console.log("Converted legacy ingredients for drink "+drink.name+" ("+drink.uuid+")")
                        })
                    }
                })
            })
        })
    })
}*/

/*function calculateDrinkVolume(drink) {
    let volume = 0
    if(drink.ingredients){
        drink.ingredients.forEach(ingredient => {
            if(ingredient.unit === 'oz') volume += ingredient.amount
        });
    }
    return volume
}*/

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
            resolve();
        })
        /*Drinks.find({}, 'uuid name volume ingredients').then((drinkData) => {
            drinkData.forEach(drink => {
                if(drink.volume === undefined || typeof(drink.volume) !== "number") {
                    Drinks.updateOne({uuid: drink.uuid}, {volume: calculateDrinkVolume(drink)}).then((data) => {
                        console.log("Auto calculated volume for "+drink.name+" ("+drink.uuid+")")
                    })
                }
            })
        })*/

        //Depreciated methods below
        /*
        console.log('Converting Database...');
        await checkUUIDs(verbose);
        await updateLegacyIngredients();
        console.log('Database conversion complete.')
        */
    },
    //Import data from a JSON if one is provided
    importJSON: async function (JSON_FILE) {
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
                        for await (const drink of drinks) {
                            await importObjectToModel(Drinks, drink).then(added => {
                                if (added) console.log('Imported Drink:', drink.name, '(' + drink.uuid + ')');
                            });
                        }
                        for await (const ingredient of ingredients) {
                            await importObjectToModel(Ingredients, ingredient).then(added => {
                                if (added) console.log('Imported Ingredient:', ingredient.name, '(' + ingredient.uuid + ')');
                            });
                        }
                        resolve();
                    } else {
                        resolve();
                        console.error(err);
                    }
                });
            } else {
                resolve();
            }
        });

    }
}
