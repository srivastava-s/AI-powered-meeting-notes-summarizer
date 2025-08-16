const express = require('express');
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure nodemailer
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Generate AI summary
app.post('/api/summarize', async (req, res) => {
  try {
    const { transcript, customPrompt } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const prompt = customPrompt 
      ? `Please summarize the following transcript based on this instruction: "${customPrompt}"\n\nTranscript:\n${transcript}`
      : `Please provide a comprehensive summary of the following transcript:\n\n${transcript}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional meeting summarizer. Provide clear, structured summaries that are easy to read and actionable."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content;
    
    res.json({ 
      success: true, 
      summary,
      originalPrompt: customPrompt || 'Default summary'
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
});

// Share summary via email
app.post('/api/share', async (req, res) => {
  try {
    const { recipients, subject, summary, senderName } = req.body;

    if (!recipients || !summary) {
      return res.status(400).json({ error: 'Recipients and summary are required' });
    }

    const emailContent = `
      <h2>Meeting Summary</h2>
      <p><strong>From:</strong> ${senderName || 'Meeting Summarizer'}</p>
      <hr>
      <div style="white-space: pre-wrap;">${summary}</div>
      <hr>
      <p><em>This summary was generated using AI Meeting Summarizer</em></p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(', '),
      subject: subject || 'Meeting Summary',
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: 'Summary shared successfully',
      recipients: recipients.length
    });

  } catch (error) {
    console.error('Error sharing summary:', error);
    res.status(500).json({ 
      error: 'Failed to share summary',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
