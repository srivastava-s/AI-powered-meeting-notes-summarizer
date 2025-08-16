# AI Meeting Summarizer

A full-stack web application that uses AI to generate structured summaries from meeting transcripts and allows users to share them via email.

## Features

- **AI-Powered Summarization**: Upload or paste meeting transcripts and get intelligent summaries
- **Custom Instructions**: Provide specific prompts like "Summarize in bullet points for executives" or "Highlight only action items"
- **Editable Summaries**: Review and edit AI-generated summaries before sharing
- **Email Sharing**: Send summaries to multiple recipients with custom subjects
- **File Upload**: Support for .txt file uploads with drag & drop functionality
- **Responsive Design**: Modern, mobile-friendly interface with smooth animations
- **Download Option**: Save summaries as text files for offline use

## Tech Stack

### Backend
- **Node.js** with **Express.js** framework
- **OpenAI API** for AI-powered summarization
- **Nodemailer** for email functionality
- **Multer** for file upload handling
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with modern hooks
- **Axios** for API communication
- **Lucide React** for beautiful icons
- **CSS3** with modern animations and responsive design

## Prerequisites

Before running this application, you'll need:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn** package manager
3. **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/)
4. **Gmail Account** with App Password for email functionality

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root directory
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your credentials:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Server Configuration
PORT=5000
```

**Important Notes:**
- For Gmail, you'll need to use an **App Password** instead of your regular password
- To generate an App Password:
  1. Enable 2-Factor Authentication on your Google Account
  2. Go to Google Account Settings → Security → App Passwords
  3. Generate a new app password for "Mail"

### 3. Start the Application

#### Option 1: Run Both Frontend and Backend (Recommended)
```bash
npm run dev
```

#### Option 2: Run Separately
```bash
# Terminal 1 - Start Backend
npm run server

# Terminal 2 - Start Frontend
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Usage Guide

### 1. Upload or Paste Transcript
- **File Upload**: Click the upload area or drag & drop a .txt file
- **Manual Input**: Paste your meeting transcript directly into the text area

### 2. Add Custom Instructions (Optional)
- Enter specific instructions like:
  - "Summarize in bullet points for executives"
  - "Highlight only action items and deadlines"
  - "Focus on key decisions and next steps"

### 3. Generate Summary
- Click "Generate Summary" to process your transcript with AI
- Wait for the AI to analyze and create a structured summary

### 4. Edit and Review
- Review the generated summary
- Make any necessary edits or adjustments
- The summary is fully editable

### 5. Share or Download
- **Share via Email**: Add recipient emails, customize subject and sender name
- **Download**: Save the summary as a text file for offline use

## API Endpoints

### POST `/api/summarize`
Generates AI summary from transcript and custom prompt.

**Request Body:**
```json
{
  "transcript": "Your meeting transcript text...",
  "customPrompt": "Optional custom instructions"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "AI-generated summary...",
  "originalPrompt": "Custom prompt used"
}
```

### POST `/api/share`
Shares summary via email to specified recipients.

**Request Body:**
```json
{
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Meeting Summary",
  "summary": "Summary content...",
  "senderName": "Your Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Summary shared successfully",
  "recipients": 2
}
```

## File Structure

```
ai-meeting-summarizer/
├── server/                 # Backend server
│   ├── index.js           # Main server file
│   ├── package.json       # Server dependencies
│   └── env.example        # Environment variables template
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # Component styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Client dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## Customization

### AI Model
- Change the OpenAI model in `server/index.js`:
  ```javascript
  model: "gpt-4" // or "gpt-3.5-turbo"
  ```

### Email Service
- Modify email configuration in `server/index.js`:
  ```javascript
  // For other email services
  const transporter = nodemailer.createTransporter({
    host: 'your-smtp-host',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  ```

### Styling
- Modify `client/src/index.css` and `client/src/App.css` for custom themes
- Update color schemes, fonts, and animations

## Troubleshooting

### Common Issues

1. **OpenAI API Error**
   - Verify your API key is correct
   - Check your OpenAI account has sufficient credits
   - Ensure the API key has proper permissions

2. **Email Not Sending**
   - Verify Gmail credentials in `.env`
   - Use App Password instead of regular password
   - Check if 2FA is enabled on your Google account

3. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill processes using the default ports

4. **CORS Issues**
   - Ensure the backend is running on the correct port
   - Check if the proxy is set correctly in `client/package.json`

### Debug Mode
Enable debug logging by adding to `server/index.js`:
```javascript
console.log('Request body:', req.body);
console.log('OpenAI response:', completion);
```

## Security Considerations

- **API Keys**: Never commit `.env` files to version control
- **Email**: Use App Passwords for Gmail integration
- **File Uploads**: Implement file type validation and size limits
- **Rate Limiting**: Consider adding rate limiting for production use

## Deployment

### Backend Deployment
- Deploy to services like Heroku, Railway, or AWS
- Set environment variables in your hosting platform
- Ensure CORS is configured for your frontend domain

### Frontend Deployment
- Build the React app: `npm run build`
- Deploy the `build` folder to services like Netlify, Vercel, or AWS S3
- Update the API base URL for production

## Output

### Welcome & Features Page
<p align="center">
  <img src="home page.png" width="800">
</p>

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Open an issue on GitHub

---

**Built with ❤️ using React, Node.js, and OpenAI**
