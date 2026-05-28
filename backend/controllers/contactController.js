import Contact from '../models/contactModel.js';

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error('Please comprehensively provide all required fields');
    }

    const contact = new Contact({
        name,
        email,
        phone,
        subject,
        message,
    });

    const createdMessage = await contact.save();
    res.status(201).json(createdMessage);
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
    // Sort descending natively
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
};

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactStatus = async (req, res) => {
    const { status } = req.body;
    const message = await Contact.findById(req.params.id);

    if (message) {
        message.status = status || message.status;
        const updatedMessage = await message.save();
        res.status(200).json(updatedMessage);
    } else {
        res.status(404);
        throw new Error('Message pipeline not successfully mapped inside Mongo');
    }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res) => {
    const message = await Contact.findById(req.params.id);

    if (message) {
        await Contact.deleteOne({ _id: message._id });
        res.status(200).json({ message: 'Contact element cleanly purged.' });
    } else {
        res.status(404);
        throw new Error('Message anchor missing natively.');
    }
};

export { createContactMessage, getContactMessages, updateContactStatus, deleteContactMessage };
