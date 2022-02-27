const express = require('express');
const router = express.Router();
const Chatservice = require('../models/Chat.service');
const Advertisementervice = require("../models/Advertisement.service");



router.post('/find', find); //Получить чат между пользователями
router.get('/getHistory/:id', getHistory);
router.post('/send', sendmessage);  // {author, receiver, text}



function find(req, res, next) {
    Chatservice.find(req.body)
        .then(chat => res.json(chat))
        .catch(err => next(err));
}

function getHistory(req, res, next) {
    Chatservice.getHistory(req.params.id)
        .then(messages => messages ? res.json(messages) : res.sendStatus(404))
        .catch(err => next(err));
}

function sendmessage(req, res, next) {
    Chatservice.sendMessage(req.body)   // { }
        .then(messages => messages ? res.json(messages) : res.sendStatus(404))
        .catch(err => next(err));
}








module.exports = router;

