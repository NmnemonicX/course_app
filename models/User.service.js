
const bcrypt = require('bcrypt');
const UserService = require('../models/Users')

module.exports = {
    // authenticate,
     getAll,
    // getById,
    create,
    findByEmail
    // update,
    // delete: _delete
};

async function findByEmail(email) {
    return await UserService.findOne({email:email});
}


async function getAll() {
    return await UserService.find();
}


async function create(data){

    const {email, password, name, contactPhone} = data;
    // validate
    if (await UserService.findOne({ name: name })) {
        throw 'Username "' + data.name + '" уже занят';
    }


    let newUser = await UserService.create({
        email,
        passwordHash: bcrypt.hashSync(password, 20), // hash the password early
        name,
        contactPhone
    })

    return newUser;


}


