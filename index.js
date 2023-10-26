const cron = require("node-cron");
const express = require("express");
const https = require('https');
const { log } = require("console");

const app = express();
import { cron } from './corn.js';

app.use('/cron', cron);

app.get("/home", () => {
    return "Home page"
});

app.listen(3000, () => {
    console.log("application listening.....");
});