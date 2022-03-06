const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const bcrypt = require('bcrypt');
const passport = require('passport');

router.get('/', (req, res) => {
    res.json('Пусто');
})

router.post('/signup',
    async (req, res, next) => {
       console.log("вошел в метод")
        const {email, password, name, contactPhone} = req.body;
        let user = await User.findOne({email: email})
        if (user) {
            console.log(" он уже есть user")
            console.log(user)
            return res.json({
                error: "email занят",
                status: "error"
            }
            )
        }
        let newUser = await User.create({
            email,
            passwordHash: bcrypt.hashSync(password, 20),
            name: name,
            contactPhone: contactPhone,
        })
        res.status(200)
        return res.json({
            data: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                contactPhone: newUser.contactPhone
            },
            status: "ok"
        });
    });

router.post('/signin', (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        console.log('user controller', user)
        console.log('error controller', err)
        if (err) {
            return res.status(400).json({
                error: "Неверный логин или пароль",
                status: "error"
            });
        }
        req.logIn(user,  function (err) {
            if (err) {
                return res.status(400).json({
                    error: "Неверный логин или пароль",
                    status: "error"
                });
            }
            return res.status(200).json({
                data: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    contactPhone: user.contactPhone
                },
                status: "ok"
            });
        });
    }) (req, res, next);
});













module.exports = router;

