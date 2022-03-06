const express = require('express');
const router = express.Router();
const Advertisementervice = require('../models/Advertisement.service');
const fileMiddleware = require('../middleware/file');


router.post('/',fileMiddleware.array('images',12), create);
router.post('/find', find);
router.get('/:id', findId);
router.delete('/:id', deleteA);

async function create(req, res, next) {
    console.log("req.files")
    console.log(req.files)
    await Advertisementervice.create(req.body,req.files.map((item)=>{return item.filename } ))
        .then(advertisement => res.json(advertisement))
        .catch(err => next(err));
}

function find(req, res, next) {
    Advertisementervice.find(req.body)
        .then(advertisement => res.json(advertisement))
        .catch(err => next(err));
}

function findId(req, res, next) {
    Advertisementervice.findId(req.params.id)
        .then(advertisement => advertisement ? res.json(advertisement) : res.sendStatus(404))
        .catch(err => next(err));
}

function deleteA(req, res, next) {
    console.log('req.params.id')
    console.log(req.params.id)
    Advertisementervice.deleteA(req.params.id)
        .then(advertisement => advertisement ? res.json(advertisement) : res.sendStatus(404).json('Ошибка удаления'))
        .catch(err => next(err));
}

module.exports = router;

