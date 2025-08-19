const mongoose = require('mongoose');


const ConversationSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'New chat' }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Conversation', ConversationSchema);