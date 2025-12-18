// backend/models/Conversation.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'ai'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false }); // Prevents auto _id in subdocuments

const conversationSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        default: 'New Conversation'
    },
    messages: [messageSchema],
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // We manage dates manually
});

// Auto-generate title from first user message
conversationSchema.pre('save', function (next) {
    if (this.isNew && this.messages.length > 0 && this.title === 'New Conversation') {
        const firstUserMessage = this.messages.find(m => m.role === 'user');
        if (firstUserMessage) {
            this.title = firstUserMessage.content.substring(0, 50).trim() +
                (firstUserMessage.content.length > 50 ? '...' : '');
        }
    }
    next();
});

// Update lastMessageAt before saving if messages changed
conversationSchema.pre('save', function (next) {
    if (this.isModified('messages') && this.messages.length > 0) {
        const lastMsg = this.messages[this.messages.length - 1];
        this.lastMessageAt = lastMsg.timestamp || new Date();
    }
    next();
});

// Ensure index on firebaseUid for performance
conversationSchema.index({ firebaseUid: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);