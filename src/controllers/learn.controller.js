const LearningTrack = require('../models/LearningTrack');

// Public: list learning tracks (content managed via the seed script / admin).
exports.getTracks = async (req, res) => {
    try {
        const tracks = await LearningTrack.find().sort({ order: 1, createdAt: 1 }).lean();
        const result = tracks.map((track) => ({
            id: track._id,
            slug: track.slug,
            title: track.title,
            description: track.description,
            tags: track.tags || [],
            lessons: track.lessons || [],
            lessonCount: (track.lessons || []).length,
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
