const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const bcrypt = require('bcrypt');

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















module.exports = router;

