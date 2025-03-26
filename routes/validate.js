const fs = require('fs');
const Drinks = require("../models/drinks");
const Ingredients = require('../models/ingredients');
const Users = require("../models/users");

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

async function check_for_admin(){
    return new Promise(resolve => {
        Users.find({}, 'user_id admin').then(users=> {
            let admin_count = users.filter(user=> user.admin).length;
            if(admin_count >= 1) {
                console.log(admin_count, admin_count === 1 ? 'admin':'admins', 'found.');
                resolve();
            } else {
                console.log('No existing admins found. Creating a new admin account...');
                let used_ids = users.map(user => user.user_id);
                let new_id = 10000+Math.floor(Math.random() * 89999);
                while(used_ids.includes(new_id)) {
                    new_id = 10000+Math.floor(Math.random() * 89999);
                }
                Users.create({user_id: new_id, admin: true}).then(user => {
                    console.log('Generated new admin account with user id', user.user_id);
                    resolve();
                }).catch(()=>{res.sendStatus(500)});
            }
        }).catch(()=>{
            console.error('Failed to get user database!');
        });
    });
}

module.exports = {
    validateDatabase: async function (verbose) {
        return new Promise(async (resolve) => {
            console.log(`Database connected successfully.`);
            await check_for_admin();
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
