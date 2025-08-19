const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { askLLM } = require('../services/openai');

// Simple manual validation instead of zod
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, message } = req.body;

    if (!message || typeof message !== 'string' || message.length > 4000) {
      return res.status(400).json({ error: 'Message is required and must be a string under 4000 chars.' });
    }

    let convoId = conversationId;
    if (!convoId) {
      const title = (message.length > 40 ? message.slice(0, 40) + '…' : message) || 'New chat';
      const convo = await Conversation.create({ title });
      convoId = convo._id.toString();
    }

    await Message.create({ conversationId: convoId, role: 'user', content: message });

    const historyDocs = await Message.find({ conversationId: convoId })
      .sort({ createdAt: 1 })
      .limit(40);

    const systemPrompt = process.env.SYSTEM_PROMPT || 'You are a helpful, concise assistant.';
    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...historyDocs.map(m => ({ role: m.role, content: m.content }))
    ];

    const reply = await askLLM(chatMessages);

    await Message.create({ conversationId: convoId, role: 'assistant', content: reply });

    res.status(200).json({ conversationId: convoId, reply });
  } catch (err) {
    next(err);
  }
};

const getConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const convo = await Conversation.findById(id);
    if (!convo) return res.status(404).json({ message: 'Conversation not found' });

    const messages = await Message.find({ conversationId: id }).sort({ createdAt: 1 });
    res.json({ conversation: convo, messages });
  } catch (err) {
    next(err);
  }
};

const listConversations = async (req, res, next) => {
  try {
    const items = await Conversation.find().sort({ updatedAt: -1 }).limit(50);
    res.json({ conversations: items });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendMessage, getConversation, listConversations };

