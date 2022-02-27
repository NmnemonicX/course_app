const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const userService = require('../models/User.service');




router.post('/', getAll);
router.post('/create', create);
router.get('/findByEmail/:email', findByEmail);


async function create(req, res, next) {
    await userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function findByEmail(req, res, next) {
    userService.findByEmail(req.params.email)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

module.exports = router;

