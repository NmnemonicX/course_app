

const bcrypt = require('bcrypt');
const AdvertisementService = require('../models/Advertisement')

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
    return await Advertisement.findById(id).select('-__v');

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

async function create(data,files) {
    console.log("files")
    console.log(files)
    const images = files
    const {shortText, description,tags,userId} = data;

    let newAdvertisement = await AdvertisementService.create({
        shortText,
        description,
        images,
        tags,
        userId
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
                    //name: newAdvertisement.user.name
                },
                createdAt: newAdvertisement.createdAt
            }
        ],
        status: "ok"
    }


    return newresp;
    //return newAdvertisement;
}
async function deleteA(id) {

    return  await AdvertisementService.findByIdAndUpdate(id, {isDeleted: true});

}
