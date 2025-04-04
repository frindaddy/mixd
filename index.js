const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/api');
const path = require("path");
const { validateDatabase, importJSON } = require('./routes/validate');
const {readFile} = require("fs");
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

const DB_USER = process.env.DB_USER || 'test-user';
const DB_PASS = process.env.DB_PASS || 'test-pass';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '27017';

const VERBOSE_DB_VALIDATION = false;
const IMPORT_JSON = process.env.IMPORT_JSON;

const Drinks = require('./models/drinks');
const {RESERVED_ROUTES} = require("./constants");

function is_reserved_route(route) {
    if(route === '/') return true;
    if(route.includes('.')) return true;
    return RESERVED_ROUTES.includes(route.split('/')[1]);
}

async function start_database() {
    return new Promise((resolve) =>{
        mongoose.connect('mongodb://'+DB_USER+':'+DB_PASS+'@'+DB_HOST+':'+DB_PORT, { useNewUrlParser: true, dbName:"mixd"})
            .then(validateDatabase(VERBOSE_DB_VALIDATION))
            .then(importJSON(IMPORT_JSON, resolve)).catch((err) => console.log(err));

    })
}

function start_server() {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.use(express.json());

    app.use('/api', routes);

    app.get('/*', (req, res, next) => {
        if(!is_reserved_route(req.path)){
            let filter
            if(req.path.match(/^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)){
                filter = {uuid: req.path.substring(1)}
            } else {
                filter = {url_name: req.path.substring(1)}
            }
            Drinks.findOne(filter).then((drink)=>{
                readFile(path.join(__dirname, './client/build/index.html'), 'utf8', (err, indexHTML) => {
                    if (err) {
                        next();
                        return;
                    }
                    if(drink && drink.name && drink.name !==''){
                        indexHTML = indexHTML.replace('title>mixd.</title', 'title>'+drink.name+' | mixd.</title');
                        if(drink.image && drink.image !== ''){
                            indexHTML = indexHTML
                                .replace('/logo512.png', '/api/image?file=user_drinks/'+drink.image+'.jpg&backup=glassware/'+(drink.glass || 'unknown')+'.svg')
                        }
                    }
                    return res.send(indexHTML);
                });
            });
        } else if(req.path !== '/menu' && req.path.split('/')[1]==='menu'){
            if(req.path.split('/')[2].match(/^[0-9a-f]{8}$/i)){
                readFile(path.join(__dirname, './client/build/index.html'), 'utf8', (err, indexHTML) => {
                    if (err) {
                        next();
                        return;
                    }
                    return res.send(indexHTML);
                });
            } else if(is_reserved_route(req.path.substring(5))) {
                res.redirect(req.path.substring(5));
            } else {
                next();
            }
        } else {
            next();
        }
    });

    app.use(express.static(path.join(__dirname, './client/build')));

    app.use((err, req, res, next) => {
        console.log(err);
        next();
    });

    app.get('*', function(req, res) {
        res.redirect('/');
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

start_database().then(start_server);
