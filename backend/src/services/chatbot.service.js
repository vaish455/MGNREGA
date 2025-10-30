import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ChatbotService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  /**
   * Check if the message is a navigation request
   * @param {string} message - User's message
   * @returns {Object|null} - Navigation info or null
   */
  async detectNavigationIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Keywords that suggest navigation intent
    const navigationKeywords = [
      'navigate', 'go to', 'show', 'display', 'view', 'open',
      'take me to', 'switch to', 'see data', 'check', 'look at'
    ];
    
    const hasNavigationIntent = navigationKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (!hasNavigationIntent) {
      return null;
    }

    // Try to extract district name from the message
    try {
      // Get all districts
      const districts = await prisma.district.findMany({
        include: {
          state: true
        }
      });

      console.log(`Searching for district in message: "${message}"`);
      console.log(`Total districts in database: ${districts.length}`);
      
      // Log first few districts for debugging
      if (districts.length > 0) {
        console.log('Sample districts:', districts.slice(0, 5).map(d => d.districtName).join(', '));
      }

      // Search for matching district - prioritize exact district name match
      for (const district of districts) {
        const districtLower = district.districtName.toLowerCase();
        
        // Normalize for comparison (remove spaces, handle common variations)
        const normalizedDistrict = districtLower.replace(/\s+/g, '').replace(/[^\w]/g, '');
        const normalizedMessage = lowerMessage.replace(/\s+/g, '').replace(/[^\w]/g, '');
        
        // Check if district name is in the message (exact or normalized)
        if (lowerMessage.includes(districtLower) || normalizedMessage.includes(normalizedDistrict)) {
          console.log('Navigation match found (district):', {
            districtName: district.districtName,
            districtCode: district.districtCode,
            state: district.state.stateName,
            matchedOn: lowerMessage.includes(districtLower) ? 'exact' : 'normalized'
          });
          return {
            type: 'navigate',
            district: {
              districtCode: district.districtCode,
              districtName: district.districtName,
              stateCode: district.stateCode,
              stateName: district.state.stateName,
              state: district.state
            }
          };
        }
      }

      // If no district found, try state-level match (find first district in state)
      for (const district of districts) {
        const stateLower = district.state.stateName.toLowerCase();
        
        if (lowerMessage.includes(stateLower)) {
          console.log('Navigation match found (state):', {
            districtName: district.districtName,
            districtCode: district.districtCode,
            state: district.state.stateName
          });
          return {
            type: 'navigate',
            district: {
              districtCode: district.districtCode,
              districtName: district.districtName,
              stateCode: district.stateCode,
              stateName: district.state.stateName,
              state: district.state
            }
          };
        }
      }
      
      console.log('No district match found in message:', message);
    } catch (error) {
      console.error('Error detecting navigation:', error);
    }

    return null;
  }

  /**
   * Generate a response using Gemini AI
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Optional conversation history
   * @returns {Promise<Object>} - AI response with optional navigation data
   */
  async generateResponse(message, conversationHistory = []) {
    try {
      // Check for navigation intent first
      const navigationIntent = await this.detectNavigationIntent(message);
      
      // Build the conversation context
      let contextMessage = message;
      
      // Add system context about MGNREGA
      let systemContext = `You are a helpful assistant for the MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data portal. 
You help users understand MGNREGA data, including employment statistics, work completion rates, budget utilization, and district-level metrics across Indian states.
Be concise, helpful, and data-focused in your responses.`;

      // If navigation intent detected, add context
      if (navigationIntent) {
        systemContext += `\n\nThe user wants to navigate to ${navigationIntent.district.districtName}, ${navigationIntent.district.stateName}. 
Confirm that you're navigating them to that district's data. Be brief and friendly.`;
      }

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

      console.log('Returning response with navigation:', {
        hasText: !!response.text,
        hasNavigation: !!navigationIntent,
        navigation: navigationIntent
      });

      return {
        text: response.text,
        navigation: navigationIntent
      };
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
