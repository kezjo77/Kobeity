# KOBEITY

### A private self-reflection and self-advocacy platform for women

Kobeity is a web application designed to help users record personal experiences, identify recurring patterns, prepare for professional conversations, and access reliable educational resources.

The application focuses on self-reflection and self-advocacy rather than diagnosis.
TO RUN:- in one terminal :npm run dev 
second terminal inside server folder : node server.js
---

## Features

### Journal

Users can record personal experiences in a structured journal.

Each journal entry can include:

- Date
- Category
- Personal experience
- Detailed notes

Users can also review and delete their previous entries.

---

### AI Pattern Analysis

Kobeity uses the Gemini API to analyze journal entries and identify recurring experiences.

The analysis can identify themes such as:

- Task initiation
- Time management
- Memory and organization
- Sensory experiences
- Social experiences
- Emotional overwhelm
- Routine and transitions
- Attention
- Communication
- Energy and recovery

The AI provides:

- Recurring themes
- Frequency of themes
- Neutral summaries
- Evidence from journal entries
- An overall summary

The system is specifically designed **not to diagnose medical conditions**.

---

### Personal Report

Kobeity provides a personal report based on the user's recorded experiences.

The purpose of the report is to help users organize their experiences and communicate them more clearly.

---

### Resources

The Resources section provides educational information related to:

- Understanding personal experiences
- Self-advocacy
- College and work
- Support and wellbeing

Kobeity also provides a search feature for finding additional resources on topics entered by the user.

The resource system prioritizes reliable and established sources and is intended for education and self-reflection.

---

### Community

Kobeity includes a community section where users can explore and interact with supportive content.

---

### Settings

The Settings section allows users to manage their application preferences and account-related information.

---

## AI Safety

Kobeity uses AI as an assistance and pattern-recognition tool.

The AI is **not a doctor** and is not intended to:

- Diagnose ADHD
- Diagnose autism
- Diagnose depression
- Diagnose anxiety
- Determine whether someone has a medical condition
- Replace professional medical advice

The pattern analysis is based only on information provided by the user.

Kobeity is designed to help users notice recurring experiences and prepare for conversations with qualified professionals.

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Lucide React icons

### Backend

- Node.js
- Express
- CORS
- dotenv

### AI

- Google Gemini API

---

## Project Structure


Kobeity/
│
├── src/
│   ├── components/
│   ├── views/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── public/
│
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

