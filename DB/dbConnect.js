import mongoose from 'mongoose';

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB Connected Successfully');
    } catch (error) {
        console.error('Error connecting to DB:', error);
        throw error; // Re-throw the error to handle it in the main file
    }
};

export default dbConnect;
