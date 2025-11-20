import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (topic: string, description: string): Promise<any> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Create a short multiple-choice quiz (3 questions) about this topic: "${topic}". 
    Context: ${description}.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  answer: { type: Type.STRING }
                },
                required: ["id", "question", "options", "answer"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return null;
  }
};

export const askTutor = async (question: string, courseContext: string) => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `The student asks: "${question}"`,
      config: {
        systemInstruction: `You are a helpful coding tutor for the course: ${courseContext}. Answer clearly and concisely.`
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Tutor Error:", error);
    return "I'm having trouble connecting to the knowledge base right now.";
  }
};