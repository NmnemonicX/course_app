

const bcrypt = require('bcrypt');
const AdvertisementService = require('../models/Advertisement')
const userService = require('../models/User.service');




module.exports = {

    find,
    findId,
    create,
    deleteA
};



async function getAll() {
    return await AdvertisementService.find();
}

async function findId(id) {
    return await AdvertisementService.findById(id).select('-__v');

}

async function find(body) {
    const {shortText, description,tags,userId} = body;
console.log(userId);
    if(userId)
    {
        const advertisements = await AdvertisementService.find({
            userId,
            shortText: {$regex:shortText??"", $options:"$i" },
          description: {$regex:description??"", $options:"$i" },
          //  tags:"/"+tags.toString()+"/i",
            isDeleted: false
        });
        return advertisements
    }
    else {
        const advertisements = await AdvertisementService.find({
            shortText: {$regex:shortText??"", $options:"$i" },
            description: {$regex:description??"", $options:"$i" },
            //  tags:"/"+tags.toString()+"/i",
            isDeleted: false
        });
        return advertisements
      }
}

async function create(data,files,user) {
    console.log("files")
    console.log(files)
    console.log("user")
    console.log(user)
    const images = files
    const {shortText, description,tags,userId} = data;

    let newAdvertisement = await AdvertisementService.create({
        shortText,
        description,
        images,
        tags,
        userId:user.id
    })


    const newresp = {
        data: [
            {
                id: newAdvertisement._id,
                shortText: newAdvertisement.shortText,
                description: newAdvertisement.description,
                images: newAdvertisement.images,
                user: {
                    id: newAdvertisement.userId,
                    name: user.name
                },
                createdAt: newAdvertisement.createdAt
            }
        ],
        status: "ok"
    }


    return newresp;
    //return newAdvertisement;
}
async function deleteA(id,userD,res) {
console.log("userD")
console.log(userD)
    console.log("id")
    console.log(id)
    //const adv = await AdvertisementService.find({id:id,userId:userD.id }).select('-__v');
    const adv = await AdvertisementService.findById(id).select('-__v');
    console.log("adv")
    console.log(adv.userId===userD.id)
    if (adv.userId===userD.id) {
        const resultDelete = await AdvertisementService.findByIdAndUpdate(id, {isDeleted: true});

        return resultDelete ? res.json(resultDelete) : res.sendStatus(404).json('Ошибка удаления')
    }
    else{
        return  res.sendStatus(403).json('Ошибка удаления- это не ваше объявление')
    }
}
