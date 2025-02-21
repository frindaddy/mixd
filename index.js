const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/api');
const path = require("path");
const { validateDatabase, importJSON } = require('./routes/validate');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

const DB_USER = process.env.DB_USER || 'test-user';
const DB_PASS = process.env.DB_PASS || 'test-pass';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '27017';

const VERBOSE_DB_VALIDATION = false;
const IMPORT_JSON = process.env.IMPORT_JSON;

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

    app.use(express.static(path.join(__dirname, './client/build')));

    app.use('/api', routes);

    app.use((err, req, res, next) => {
        console.log(err);
        next();
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

start_database().then(start_server);
