import { GoogleGenAI } from "@google/genai";

export class ChatbotService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  /**
   * Generate a response using Gemini AI
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Optional conversation history
   * @returns {Promise<string>} - AI response
   */
  async generateResponse(message, conversationHistory = []) {
    try {
      // Build the conversation context
      let contextMessage = message;
      
      // Add system context about MGNREGA
      const systemContext = `You are a helpful assistant for the MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data portal. 
You help users understand MGNREGA data, including employment statistics, work completion rates, budget utilization, and district-level metrics across Indian states.
Be concise, helpful, and data-focused in your responses.`;

      // If there's conversation history, include it
      if (conversationHistory.length > 0) {
        const historyText = conversationHistory
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join('\n');
        contextMessage = `${systemContext}\n\nConversation history:\n${historyText}\n\nUser: ${message}`;
      } else {
        contextMessage = `${systemContext}\n\nUser: ${message}`;
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: contextMessage,
      });

      return response.text;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate response from AI');
    }
  }

  /**
   * Generate a response with MGNREGA data context
   * @param {string} message - User's message
   * @param {Object} dataContext - MGNREGA data to provide as context
   * @returns {Promise<string>} - AI response
   */
  async generateResponseWithData(message, dataContext = {}) {
    try {
      const systemContext = `You are a helpful assistant for the MGNREGA data portal. 
The user is viewing data for a specific district or state. Use the following data context to answer their questions accurately.

Data Context:
${JSON.stringify(dataContext, null, 2)}

Be concise and reference specific numbers from the data when relevant.`;

      const contextMessage = `${systemContext}\n\nUser: ${message}`;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: contextMessage,
      });

      return response.text;
    } catch (error) {
      console.error('Error generating AI response with data:', error);
      throw new Error('Failed to generate response from AI');
    }
  }
}
