import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: 'Gemini API key not configured' },
            { status: 500 }
        );
    }

    try {
        const { message, history, context, timelineEvent } = await req.json();

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `
You are ARIA (Astronomical Research & Information Assistant), a highly advanced AI co-pilot for the SpaceScope exploration system.
Your goal is to assist users in exploring the solar system and learning about space history.

CONTEXT:
${context}

${timelineEvent ? `
CURRENT TIMELINE EVENT:
Title: ${timelineEvent.title}
Year: ${timelineEvent.year}
Description: ${timelineEvent.description}
Facts: ${timelineEvent.facts.join(', ')}
` : ''}

INSTRUCTIONS:
1. Be helpful, concise, and engaging.
2. Use a sci-fi, professional tone (like a ship's computer but friendly).
3. If the user asks about the current timeline event, use the provided details.
4. If the user asks about other space topics, use your general knowledge.
5. Keep responses under 3-4 sentences unless asked for a detailed explanation.
`;

        // Combine system prompt with user history
        const chatHistory = [
            {
                role: 'user',
                parts: [{ text: systemPrompt }],
            },
            {
                role: 'model',
                parts: [{ text: "Systems online. I am ARIA. How can I assist you with your mission today, Commander?" }],
            },
            ...(history || []) // Append previous conversation history
        ];

        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ message: text });
    } catch (error) {
        console.error('AI Chat Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
