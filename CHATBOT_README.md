# Chatbot Integration Guide

## Overview
This application now includes an AI-powered chatbot using Google's Gemini API to help users understand MGNREGA data and answer questions about the portal.

## Features
- 🤖 AI-powered responses using Gemini 2.0 Flash
- 💬 Conversational interface with message history
- 📊 Context-aware responses about MGNREGA data
- 🎨 Beautiful floating chat widget in the corner
- 📱 Responsive design

## Setup Instructions

### 1. Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Backend
1. Open `/backend/.env` file
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```env
   GEMINI_API_KEY="your_actual_api_key_here"
   ```

### 3. Start the Services
```bash
# Start backend (in backend directory)
cd backend
npm run dev

# Start frontend (in frontend directory)
cd frontend
npm run dev
```

## How It Works

### Backend API
- **Endpoint**: `POST /api/chatbot`
- **Service**: `/backend/src/services/chatbot.service.js`
- **Model**: Gemini 2.0 Flash Experimental

**Request Body**:
```json
{
  "message": "What is MGNREGA?",
  "conversationHistory": [],
  "dataContext": {}
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "message": "AI response here...",
    "timestamp": "2025-10-30T12:00:00.000Z"
  }
}
```

### Frontend Component
- **Component**: `/frontend/src/components/ChatBot.jsx`
- **Location**: Floating button in the bottom-right corner
- **Features**:
  - Auto-scroll to latest messages
  - Typing indicators
  - Message timestamps
  - Error handling
  - Keyboard shortcuts (Enter to send)

## Usage

1. **Open the chat**: Click the blue floating button in the bottom-right corner
2. **Ask questions**: Type your question about MGNREGA data
3. **Get answers**: The AI will provide helpful, context-aware responses
4. **Close the chat**: Click the X button or the floating button again

## Example Questions to Ask

- "What is MGNREGA?"
- "Explain the work completion rate"
- "What does active job cards mean?"
- "How is the wage calculated?"
- "What are the key metrics I should look at?"
- "Tell me about women's participation in MGNREGA"

## Customization

### Modify the System Prompt
Edit `/backend/src/services/chatbot.service.js` to change how the AI responds:
```javascript
const systemContext = `You are a helpful assistant for the MGNREGA data portal...`;
```

### Change the Model
Update the model in `chatbot.service.js`:
```javascript
model: "gemini-2.0-flash-exp" // or "gemini-2.5-flash"
```

### Style the Chat Widget
Edit `/frontend/src/components/ChatBot.jsx` to customize:
- Colors (Tailwind classes)
- Size and position
- Animation effects
- Message styling

## Troubleshooting

### "Failed to generate response from AI"
- Check that your `GEMINI_API_KEY` is set correctly in `/backend/.env`
- Verify the API key is valid at [Google AI Studio](https://aistudio.google.com/)
- Check your internet connection
- Look at backend console logs for detailed errors

### Chat button not appearing
- Ensure the frontend is running
- Check browser console for errors
- Verify `ChatBot` component is imported in `Dashboard.jsx`

### Backend not starting
- Make sure `.env` file exists in `/backend/`
- Check that `dotenv` is imported: `import 'dotenv/config';`
- Verify all dependencies are installed: `npm install`

## API Rate Limits

The Gemini API has rate limits depending on your plan:
- **Free tier**: 15 requests per minute
- **Paid tier**: Higher limits available

If you hit rate limits, users will see an error message. Consider implementing:
- Request queuing
- Response caching
- Rate limit warnings

## Security Notes

⚠️ **Important**:
- Never commit your actual API key to version control
- Keep the `.env` file in `.gitignore`
- Use environment variables for production deployments
- Consider implementing user authentication for the chatbot
- Add rate limiting on the backend endpoint

## Future Enhancements

Potential improvements:
- [ ] Add streaming responses for real-time typing effect
- [ ] Implement conversation memory/persistence
- [ ] Add data context awareness (pass current district data)
- [ ] Support for multiple languages (Hindi/English)
- [ ] Voice input/output
- [ ] Suggested questions/quick replies
- [ ] Export chat history
- [ ] Admin analytics dashboard

## Dependencies

**Backend**:
- `@google/genai`: ^1.28.0
- `dotenv`: ^16.3.1
- `express`: ^4.18.2

**Frontend**:
- `axios`: Latest
- `react`: ^19.1.1
- `tailwindcss`: ^4.1.16

## Support

For issues with:
- **Gemini API**: [Google AI Documentation](https://ai.google.dev/docs)
- **Integration**: Check backend logs and browser console
- **UI/UX**: Inspect component props and styling

---

Built with ❤️ using Google Gemini AI
