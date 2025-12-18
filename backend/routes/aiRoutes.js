// backend/routes/aiRoutes.js
import rateLimit from 'express-rate-limit';

// ✅ Rate limiter: 5 requests per 60 seconds per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Rate limit exceeded. Please wait 1 minute before trying again."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to your AI chat route
router.post('/ai/chat', aiLimiter, async (req, res) => {
  try {
    const { message } = req.body;
    // ... your AI logic (Gemini/OpenAI call)
    const response = await generateAIResponse(message);
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});