import express from "express";
// const express = require("express");
import { cronJob } from './corn.js';

const app = express();

app.use('/cron', cronJob);

app.get("/home", () => {
    return "Home page"
});

app.listen(3000, () => {
    console.log("application listening.....");
});