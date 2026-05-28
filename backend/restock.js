import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';

dotenv.config();

const restockProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const result = await Product.updateMany({}, {
            $set: {
                stock: 100,
                isAvailable: true
            }
        });

        console.log(`Successfully updated ${result.modifiedCount} products. All products are now in stock.`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

restockProducts();
