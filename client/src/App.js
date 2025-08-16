import React, { useState } from 'react';
import { Upload, FileText, Send, Edit3, Download, Share2 } from 'lucide-react';
import axios from 'axios';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareForm, setShowShareForm] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState('');
  const [subject, setSubject] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTranscript(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  // Generate summary
  const generateSummary = async () => {
    if (!transcript.trim()) {
      setMessage({ type: 'error', text: 'Please enter or upload a transcript first.' });
      return;
    }

    setIsGenerating(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/summarize', {
        transcript: transcript.trim(),
        customPrompt: customPrompt.trim()
      });

      if (response.data.success) {
        setSummary(response.data.summary);
        setMessage({ type: 'success', text: 'Summary generated successfully!' });
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to generate summary. Please try again.' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle recipient input
  const handleRecipientInput = (e) => {
    if (e.key === 'Enter' && recipientInput.trim()) {
      const email = recipientInput.trim();
      if (isValidEmail(email) && !recipients.includes(email)) {
        setRecipients([...recipients, email]);
        setRecipientInput('');
      }
    }
  };

  const removeRecipient = (email) => {
    setRecipients(recipients.filter(r => r !== email));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Share summary
  const shareSummary = async () => {
    if (recipients.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one recipient.' });
      return;
    }

    if (!summary.trim()) {
      setMessage({ type: 'error', text: 'No summary to share.' });
      return;
    }

    setIsSharing(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/share', {
        recipients,
        subject: subject || 'Meeting Summary',
        summary: summary.trim(),
        senderName: senderName || 'Meeting Summarizer'
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: `Summary shared successfully with ${response.data.recipients} recipient(s)!` });
        setShowShareForm(false);
        setRecipients([]);
        setSubject('');
        setSenderName('');
      }
    } catch (error) {
      console.error('Error sharing summary:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to share summary. Please try again.' 
      });
    } finally {
      setIsSharing(false);
    }
  };

  // Download summary
  const downloadSummary = () => {
    if (!summary) return;
    
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'meeting-summary.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>AI Meeting Summarizer</h1>
          <p>Transform your meeting transcripts into actionable summaries with AI-powered insights</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`${message.type}-message`}>
            {message.text}
          </div>
        )}

        {/* Input Section */}
        <div className="card">
          <h2>
            <FileText size={24} />
            Meeting Transcript
          </h2>
          
          <div className="form-group">
            <label>Upload Transcript File</label>
            <div 
              className="upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <Upload className="upload-icon" />
              <div className="upload-text">Click to upload or drag & drop</div>
              <div className="upload-hint">Supports .txt files up to 10MB</div>
            </div>
            <input
              id="file-input"
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group">
            <label>Or Paste Transcript Here</label>
            <textarea
              className="form-control"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here..."
            />
          </div>

          <div className="form-group">
            <label>Custom Instructions (Optional)</label>
            <input
              type="text"
              className="form-control"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
            />
          </div>

          <button
            className="btn"
            onClick={generateSummary}
            disabled={isGenerating || !transcript.trim()}
          >
            {isGenerating ? (
              <>
                <div className="loading"></div>
                Generating Summary...
              </>
            ) : (
              <>
                <FileText size={20} />
                Generate Summary
              </>
            )}
          </button>
        </div>

        {/* Summary Section */}
        {summary && (
          <div className="card">
            <h2>
              <Edit3 size={24} />
              Generated Summary
            </h2>
            
            <div className="form-group">
              <label>Edit Summary (if needed)</label>
              <textarea
                className="form-control summary-content"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Your AI-generated summary will appear here..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowShareForm(!showShareForm)}
              >
                <Share2 size={20} />
                Share via Email
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={downloadSummary}
              >
                <Download size={20} />
                Download
              </button>
            </div>
          </div>
        )}

        {/* Share Form */}
        {showShareForm && (
          <div className="card">
            <h2>
              <Send size={24} />
              Share Summary
            </h2>
            
            <div className="form-group">
              <label>Recipients (Press Enter to add each email)</label>
              <div className="recipients-input">
                {recipients.map((email, index) => (
                  <div key={index} className="recipient-tag">
                    {email}
                    <span className="remove" onClick={() => removeRecipient(email)}>×</span>
                  </div>
                ))}
                <input
                  type="email"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyPress={handleRecipientInput}
                  placeholder="Enter email address..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                className="form-control"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Meeting Summary"
              />
            </div>

            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                className="form-control"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Name"
              />
            </div>

            <button
              className="btn btn-success"
              onClick={shareSummary}
              disabled={isSharing || recipients.length === 0}
            >
              {isSharing ? (
                <>
                  <div className="loading"></div>
                  Sharing...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Summary
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
