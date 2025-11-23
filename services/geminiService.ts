
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AnalyzedFood {
  foodName: string;
  calories: number;
  protein: number; // g
  fiber: number; // g
  carbs: number; // g
  fat: number; // g
  confidence: number; // 0-100
}

export const analyzeFoodImage = async (base64Image: string): Promise<AnalyzedFood> => {
  try {
    // Strip the data url prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyze this image of food. Estimate the nutritional content for the entire visible portion. Be precise with fiber and protein."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "Short descriptive name of the dish" },
            calories: { type: Type.NUMBER, description: "Total estimated calories (kcal)" },
            protein: { type: Type.NUMBER, description: "Total protein in grams" },
            fiber: { type: Type.NUMBER, description: "Total fiber in grams" },
            carbs: { type: Type.NUMBER, description: "Total carbohydrates in grams" },
            fat: { type: Type.NUMBER, description: "Total fat in grams" },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100" }
          },
          required: ["foodName", "calories", "protein", "fiber", "carbs", "fat", "confidence"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalyzedFood;
    }
    throw new Error("No text returned from Gemini");

  } catch (error) {
    console.error("Error analyzing food:", error);
    throw error;
  }
};

export const getHealthAdvice = async (
  userContext: string,
  userQuestion: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert health coach for a GLP-1 medication user. 
      
      User Context:
      ${userContext}
      
      User Question: "${userQuestion}"
      
      Provide a helpful, encouraging, and concise answer (max 3 sentences). Focus on protein, fiber, hydration, and medication adherence.`,
    });
    return response.text || "I couldn't generate a response right now.";
  } catch (error) {
    console.error("Error getting advice:", error);
    return "I'm having trouble connecting to the server. Please try again.";
  }
};
