
const bcrypt = require('bcrypt');
const MessageService = require('../models/Message')
const ChatService = require('../models/Chat')

module.exports = {

    find,
    getHistory,
    create,
    sendMessage
    // deleteA
};

async function find(body) {
    const {users} = body;  // это если в body = users:[ObjectId, ObjectId]
 console.log('users')
 console.log(users)
    const Chat = await ChatService.findOne({
         users:users
        });
    return Chat
}

async function getHistory(id) {
    return await ChatService.findById(id).select('messages',);

}


async function create(data)  {
    const {authorId, receiverId} = data;
    try {
    const newChat = await ChatService.create({
        users: [authorId, receiverId],
        createAt: Date.now(),
    });

      return newChat;
    } catch (e) {

      console.error('Ошибка добавления')
    }


}


async function sendMessage(body) {
    const{author, receiver, text} = body;

    const chat = await find({users:[author,receiver]} )
    if(chat)
    {
        const newMessage =  await MessageService.create(
            {
                author,
                sentAt: Date.now(),
                text,
                readAt: false,
            }
        )
        console.log('newMessage')
        console.log(newMessage)

        console.log('chat')
        console.log(chat)

        await ChatService.findByIdAndUpdate(chat._id,{$push: {messages: newMessage._id}} )

        return newMessage // await getHistory(chat._id)

    }
    else {
    const chatCreated = await create({authorId:author,receiverId:receiver})

    const newMessage =  await MessageService.create(
            {
                author,
                sentAt: Date.now(),
                text,
                readAt: false,
            }
        )

        console.log('newMessage2')
        console.log(newMessage)

        console.log('chatCreated')
        console.log(chatCreated)

        await ChatService.findByIdAndUpdate(chatCreated._id,{$push: {messages: newMessage._id}} )

    return   newMessage //await getHistory(chatCreated._id)
    }



    async function getMessage(id) {
        return await MessageService.findById(id).select('-__v',);

    }


}




