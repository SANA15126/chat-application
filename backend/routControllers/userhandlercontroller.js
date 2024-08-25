import Conversation from '../models/conversationModels.js';
import User from '../models/userModels.js';

export const getUserBySearch = async (req, res) => {
    try {
        // Extract search query from request, default to an empty string if not provided
        const search = req.query.search || '';

        if (!req.user || !req.user._id) {

            console.error('User object is missing or _id is undefined:', req.user);  // Debug log
            return res.status(401).json({ success: false, message: 'User not authenticated' });

        }

        const currentUserID = req.user._id;

        // Query the database to find users matching the search criteria
        const users = await User.find({
            $and: [
                {
                    $or: [
                        { username: { $regex: search, $options: 'i' } },
                        { fullname: { $regex: search, $options: 'i' } }
                    ]
                },
                {
                    _id: { $ne: currentUserID }

                }
            ]
        }).select("-password");  
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        
        console.error('Error in getUserBySearch:', error);  
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
export const getCorrentChatters = async (req, res) => {
    try {
        console.log('getCorrentChatters route hit'); // Add this log to check

        const currentUserID = req.user._id;
        const currentchatters = await Conversation.find({
            participants: currentUserID
        }).sort({ updatedAt: -1 });

        if (!currentchatters || currentchatters.length === 0) {
            return res.status(200).send([]);
        }

        const participantsIDs = currentchatters.reduce((ids, conversation) => {
            const otherparticipants = conversation.participants.filter(id => id !== currentUserID);
            return [...ids, ...otherparticipants];
        }, []);

        const otherparticipantsIDs = participantsIDs.filter(id => id.toString() !== currentUserID.toString());

        const users = await User.find({ _id: { $in: otherparticipantsIDs } }).select("-password -email");

        res.status(200).send(users);

    } catch (error) {
        console.error('Error in getCorrentChatters:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

