import Session from '../models/sessionModel.js';

// @desc    Get user's active sessions (Admin gets all active sessions)
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
    if (req.user.isAdmin) {
        const sessions = await Session.find({ isActive: true })
            .populate('userId', 'name email')
            .sort('-loginTime');
        res.status(200).json(sessions);
    } else {
        const sessions = await Session.find({ userId: req.user._id, isActive: true })
            .sort('-loginTime');
        res.status(200).json(sessions);
    }
};

// @desc    Log out of a specific session
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = async (req, res) => {
    const session = await Session.findById(req.params.id);

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    if (session.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(401);
        throw new Error('Not authorized to delete this session');
    }

    session.isActive = false;
    session.logoutTime = new Date();
    await session.save();

    res.status(200).json({ message: 'Session terminated' });
};

export { getSessions, deleteSession };
