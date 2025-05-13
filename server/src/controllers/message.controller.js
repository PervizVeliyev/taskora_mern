const { Message, Conversation } = require('../models');

const createMessage = async (request, response) => {
    const { conversationID, description } = request.body;

    try {
        const message = new Message({
            conversationID,
            userID: request.userID,
            description
        });

        await message.save();

        await Conversation.findOneAndUpdate(
            { conversationID },
            {
                $set: {
                    readBySeller: request.isSeller,
                    readByBuyer: !request.isSeller,
                    lastMessage: description
                }
            },
            { new: true }
        );

        return response.status(201).send(message);
    } catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        });
    }
};

const getMessages = async (request, response) => {
    const { conversationID } = request.params;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log('getMessages pagination:', { page, limit, skip });
    try {
        const messages = await Message.find({ conversationID })
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(limit)
            .populate('userID', 'username image email');

        console.log('getMessages returned messages:', messages.length);
        const total = await Message.countDocuments({ conversationID });

        return response.send({
            data: messages,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        });
    } catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        });
    }
};

module.exports = {
    createMessage,
    getMessages
};