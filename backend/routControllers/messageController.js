import Message from '../models/messageSchema.js';
import Conversation from '../models/conversationModels.js'; 

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;  // This is extracted from the URL
        const senderId = req.user._id;  // This is the logged-in user's ID from the middleware

        // Add logging to check the values
        console.log("Sender ID:", senderId);
        console.log("Receiver ID:", receiverId);

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let chats = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!chats) {
            chats = new Conversation({
                participants: [senderId, receiverId],
                messages: []
            });
            await chats.save();
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            conversationId: chats._id
        });

        await newMessage.save();

        chats.messages.push(newMessage._id);
        await chats.save();

        res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export const getMessage = async (req, res) => {
    try {
        const { receiverId } = req.params;
        console.log('Received receiverId:', receiverId);  // Debugging line

        if (!receiverId) {
            return res.status(400).json({ success: false, message: "Receiver ID is required" });
        }

        // Fetch messages where receiverId matches
        const messages = await Message.find({ receiverId });

        console.log('Messages found:', messages);  // Debugging line

        if (messages.length === 0) {
            return res.status(404).json({ success: false, message: "Messages not found" });
        }

        res.status(200).json({ success: true, message: "Messages fetched successfully", data: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};





