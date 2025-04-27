# Serene-AI

## Overview
This project is a simple chatbot built using **TypeScript** and the **Gemini API**, incorporating **sentiment analysis** with an **event-stream architecture** for real-time responses.

## Features
- **Real-time streaming responses** (similar to ChatGPT)
- **Sentiment analysis** for analyzing user input
- **TypeScript** for type safety and maintainability
- **Gemini API** integration for natural language understanding
- **Event-stream architecture** for efficient message handling

## Technologies Used
- **TypeScript**
- **Nextjs** (for frontend)
- **Gemini API** (for chatbot responses)
- **Sentiment Analysis Library** (e.g., `sentiment` or `compromise`)
- **Event Streams** (Server-Sent Events or WebSockets)

## Installation
### Prerequisites
- **Node.js** (v16 or later)
- **Gemini API Key**

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/rishabh3562/sentiment-analysis-chatbot-js.git
   cd sentiment-analysis-chatbot-js
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

## Usage
- Run the server and send a POST request to `/chat` with user input.
- The chatbot will return a streaming response with sentiment analysis insights.

## API Endpoints
| Method | Endpoint | Description |
|--------|------------|-------------|
| POST   | `/chat`   | Sends a message and receives a streaming chatbot response |

## Example Request
```sh
curl -X POST http://localhost:3000/chat -H "Content-Type: application/json" -d '{"message": "Hello! How are you?"}'
```

## Future Enhancements
- WebSocket support for two-way communication.
- UI integration with React.
- Multi-language support.