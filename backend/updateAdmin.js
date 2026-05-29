import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';

dotenv.config();

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        let adminUser = await User.findOne({ isAdmin: true });

        if (adminUser) {
            // Update existing admin
            adminUser.name = 'anuj patil';
            adminUser.email = 'anuj.admin@example.com';
            adminUser.password = '  ';
            adminUser.isVerified = true;
            await adminUser.save();
            console.log('Admin user updated successfully');
        } else {
            // Create new admin if none exists
            adminUser = new User({
                name: 'anuj patil',
                email: 'anuj.admin@example.com',
                password: 'anujadmin123',
                isAdmin: true,
                isVerified: true,
            });
            await adminUser.save();
            console.log('New admin user created successfully');
        }

        console.log(`Email: ${adminUser.email}`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

updateAdmin();
