const fs = require('fs');
const Drinks = require("../models/drinks");
const Ingredients = require('../models/ingredients');
const Users = require("../models/users");
const Menus = require("../models/menus");

async function importObjectToModel(model, object) {
    return new Promise((resolve) =>{
        let filter = {uuid:object.uuid};
        if(!object.uuid){
            if(object.menu_id) filter = {menu_id:object.menu_id};
            if(object.user_id) filter = {user_id:object.user_id};
        }
        model.findOne(filter, '').then(data => {
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
            let admins = users.filter(user=> user.admin)
            if(admins.length >= 1) {
                console.log(admins.length, admins.length === 1 ? 'admin':'admins', 'found.', admins.map(admin=>admin.user_id));
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
                        let users = []
                        let menus = []
                        if (json_data.drinks !== undefined && json_data.drinks.length > 0) drinks = json_data.drinks;
                        if (json_data.ingredients !== undefined && json_data.ingredients.length > 0) ingredients = json_data.ingredients
                        if (json_data.users !== undefined && json_data.users.length > 0) users = json_data.users;
                        if (json_data.menus !== undefined && json_data.menus.length > 0) menus = json_data.menus;
                        let imported_drinks = 0;
                        let imported_ingr = 0;
                        let imported_users = 0;
                        let imported_menus = 0;
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
                        for await (const user of users) {
                            await importObjectToModel(Users, user).then(added => {
                                if (added){
                                    console.log('Imported User:', user.username, '(' + user.user_id + ')');
                                    imported_users++;
                                }
                            });
                        }
                        for await (const menu of menus) {
                            await importObjectToModel(Menus, menu).then(added => {
                                if (added){
                                    console.log('Imported Menu:', menu.name, '(' + menu.menu_id + ')');
                                    imported_menus++;
                                }
                            });
                        }
                        if(imported_drinks + imported_ingr + imported_users + imported_menus > 0){
                            console.log('Import complete! Imported', imported_drinks, 'drinks,', imported_ingr, 'ingredients', imported_users, 'users, and', imported_menus, 'menus.');
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
