// backend/routes/conversations.js
const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// -----------------------------
// GET /api/conversations - Get all conversations for user
// -----------------------------
router.get('/', async (req, res) => {
    try {
        const userId = req.user.uid;

        const conversations = await Conversation.find({ firebaseUid: userId })
            .sort({ lastMessageAt: -1 }) // Most recent first
            .select('_id title lastMessageAt createdAt messages')
            .lean();

        // Add message count to each conversation
        const conversationsWithCount = conversations.map(conv => ({
            ...conv,
            messageCount: conv.messages?.length || 0,
            lastMessage: conv.messages?.[conv.messages.length - 1]?.content?.substring(0, 100) || ''
        }));

        return res.json({
            conversations: conversationsWithCount
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({
            error: 'Failed to fetch conversations'
        });
    }
});

// -----------------------------
// GET /api/conversations/:id - Get specific conversation
// -----------------------------
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.uid;
        const conversationId = req.params.id;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            firebaseUid: userId
        });

        if (!conversation) {
            return res.status(404).json({
                error: 'Conversation not found'
            });
        }

        return res.json({
            conversation
        });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return res.status(500).json({
            error: 'Failed to fetch conversation'
        });
    }
});

// -----------------------------
// POST /api/conversations - Create new conversation
// -----------------------------
router.post('/', async (req, res) => {
    try {
        const userId = req.user.uid;
        const { title, messages } = req.body;

        const conversation = new Conversation({
            firebaseUid: userId,
            title: title || 'New Conversation',
            messages: messages || [],
            lastMessageAt: new Date()
        });

        await conversation.save();

        return res.json({
            conversation
        });
    } catch (error) {
        console.error('Error creating conversation:', error);
        return res.status(500).json({
            error: 'Failed to create conversation'
        });
    }
});

// -----------------------------
// PUT /api/conversations/:id - Update conversation (add messages)
// -----------------------------
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.uid;
        const conversationId = req.params.id;
        const { messages, title } = req.body;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            firebaseUid: userId
        });

        if (!conversation) {
            return res.status(404).json({
                error: 'Conversation not found'
            });
        }

        // Update messages if provided
        if (messages) {
            conversation.messages = messages;
            conversation.lastMessageAt = new Date();
        }

        // Update title if provided
        if (title) {
            conversation.title = title;
        }

        await conversation.save();

        return res.json({
            conversation
        });
    } catch (error) {
        console.error('Error updating conversation:', error);
        return res.status(500).json({
            error: 'Failed to update conversation'
        });
    }
});

// -----------------------------
// DELETE /api/conversations/:id - Delete conversation
// -----------------------------
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.uid;
        const conversationId = req.params.id;

        const result = await Conversation.deleteOne({
            _id: conversationId,
            firebaseUid: userId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: 'Conversation not found'
            });
        }

        return res.json({
            message: 'Conversation deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return res.status(500).json({
            error: 'Failed to delete conversation'
        });
    }
});

module.exports = router;
