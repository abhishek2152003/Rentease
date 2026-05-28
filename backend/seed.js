import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/userModel.js';

dotenv.config();
await connectDB();

const promoteUser = async () => {
    try {
        const result = await User.updateOne(
            { email: 'agent.smith@example.com' },
            { $set: { isAdmin: true } }
        );
        console.log('User promoted to admin. Result:', result);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

promoteUser();
