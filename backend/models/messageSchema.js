import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: { // Ensure correct field name
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: { // Correct field name
        type: String,
        required: true
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;


