// server.js
// This Node.js backend uses Express to create a REST API for text summarization and email sharing.

// Import necessary modules
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from a .env file

const app = express();
const port = 3000;

// Middleware setup
// Enable CORS for all routes, allowing the frontend to make requests.
app.use(cors());
// Parse incoming JSON requests.
app.use(express.json());

// Set up Nodemailer transporter using environment variables for security.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // Use 'true' or 'false' in .env
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// A function to handle fetch calls with exponential backoff for retries.
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429) { // Too Many Requests
        console.warn(`API rate limit exceeded. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      return response;
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Fetch failed. Retrying in ${delay}ms...`, error);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}

// Endpoint for AI-powered summarization.
app.post('/api/summarize', async (req, res) => {
  try {
    const { transcript, prompt } = req.body;

    // Check if both transcript and prompt are provided.
    if (!transcript || !prompt) {
      return res.status(400).json({ error: 'Transcript and prompt are required.' });
    }

    // Construct the prompt for the Gemini API.
    const apiPrompt = `Instruction: ${prompt}\n\nTranscript:\n${transcript}`;

    // Define the payload for the Gemini API call.
    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: apiPrompt }],
            }
        ]
    };

    // Correctly get the API key from the environment variables.
    const apiKey = process.env.GEMINI_API_KEY; 
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not set in the environment variables.' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    // Make the API call to Gemini using the retry function.
    const response = await fetchWithRetry(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    // Check for a valid response structure before trying to access it.
    if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content || !result.candidates[0].content.parts || result.candidates[0].content.parts.length === 0) {
        // If the AI service returns an invalid response, check for a "block" reason
        if (result.promptFeedback && result.promptFeedback.blockReason) {
             throw new Error(`AI service blocked the request. Reason: ${result.promptFeedback.blockReason}`);
        }
        throw new Error('Invalid or empty response from the AI service.');
    }

    const summary = result.candidates[0].content.parts[0].text;

    // Send the generated summary back to the frontend.
    res.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

// Endpoint for sharing the summary via email.
app.post('/api/share-summary', async (req, res) => {
  try {
    const { recipient_email, summary_content } = req.body;

    // Check for required fields.
    if (!recipient_email || !summary_content) {
      return res.status(400).json({ error: 'Recipient email and summary content are required.' });
    }

    // Define the email content.
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient_email,
      subject: 'AI-Generated Meeting Summary',
      text: summary_content,
      // You can also add an HTML body for better formatting.
      // html: `<b>AI-Generated Meeting Summary</b><br><br><pre>${summary_content}</pre>`,
    };

    // Send the email.
    await transporter.sendMail(mailOptions);
    
    // Respond with a success message.
    res.json({ message: 'Summary shared successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

// Start the server and listen for requests.
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
