AI Meeting Notes Summarizer
📄 Project Description
The AI Meeting Notes Summarizer is a full-stack web application designed to streamline the process of summarizing and sharing meeting transcripts. Users can upload a text transcript and provide a custom instruction (e.g., "Summarize in bullet points," "Extract action items"). The application then uses an AI service to generate a structured, editable summary that can be shared via email.

✨ Features
AI-Powered Summarization: Generates concise summaries from raw meeting transcripts based on user-defined prompts.

Action Item Extraction: A dedicated feature to automatically identify and list action items from the transcript.

Email Drafting: Creates a professional, editable follow-up email based on the meeting content.

Editable Output: The AI-generated summary can be freely edited by the user before sharing.

Email Sharing: Send the final, edited summary to a specified recipient via email.

⚙️ Tech Stack
Frontend
HTML: For the application structure.

CSS: For basic styling and layout.

JavaScript: For all client-side logic and API communication.

Backend
Node.js & Express.js: A robust and lightweight server-side runtime and framework for handling API requests.

Gemini API: The AI service used for natural language processing, summarization, and content generation.

Nodemailer: A module for sending emails from the Node.js server using an SMTP service.

dotenv: A module to securely manage environment variables.

📂 Project Structure
/ai-meeting-notes-app
├── .env                  # Environment variables (API keys, etc.)
├── .gitignore            # Git ignore file for secrets and dependencies
├── README.md             # This file
├── /client/              # Frontend files
│   ├── index.html        # Main application page
│   └── style.css         # Basic styling (optional, can be embedded)
│   └── script.js         # Frontend logic (optional, can be embedded)
└── /server/              # Backend files
    ├── node_modules/     # Node.js dependencies (ignored by Git)
    ├── package.json      # Backend manifest and dependencies
    ├── package-lock.json # Dependency lock file
    └── server.js         # Backend server logic

🚀 Installation & Setup
Prerequisites
Node.js (v14 or higher) and npm installed on your machine.

A Gemini API Key. You can get this for free from Google AI Studio.

A Gmail account with a generated App Password for sending emails. (App Passwords are required if you have 2-Step Verification enabled on your account).

Backend Setup
Clone the repository:

git clone https://github.com/your-username/ai-meeting-notes-app.git
cd ai-meeting-notes-app/server

Install dependencies:

npm install

Create a .env file: In the root directory (/ai-meeting-notes-app), create a file named .env and add your credentials.

GEMINI_API_KEY=your_copied_gemini_api_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

Start the backend server:

npm start

The server will start on http://localhost:3000.

Frontend Setup
The frontend is a static site. Simply open the index.html file in your web browser.

Navigate to the client directory:

cd ../client

Open the file:

open index.html  # on macOS
start index.html # on Windows

Make sure your backend server is running for the app to function correctly.

✍️ Usage
Open the index.html file in your browser.

Paste a meeting transcript into the "Meeting Transcript" text area.

Enter a custom prompt into the "Custom Prompt" text area, or use the pre-built buttons to generate a summary, extract action items, or draft a follow-up email.

Click the "Generate Summary" button. The AI-generated output will appear in the editable text area below.

Edit the output as needed, then enter a recipient email address and click "Share" to send the summary.

☁️ Deployment
This application can be easily deployed on platforms like Render or Vercel. For deployment, you would typically:

Host the backend as a Web Service.

Host the frontend as a Static Site.

Update the BACKEND_URL variable in your frontend's index.html to point to the live URL of your deployed backend service.
