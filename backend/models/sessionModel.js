import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        token: {
            type: String,
            required: true,
        },
        deviceInfo: {
            type: String,
            required: true,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        loginTime: {
            type: Date,
            default: Date.now,
        },
        logoutTime: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Session = mongoose.model('Session', sessionSchema);

export default Session;
