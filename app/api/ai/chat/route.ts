import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message } = body;

        // In a real app, we would call Google Gemini API here
        // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        // const result = await model.generateContent(message);
        // const response = result.response.text();

        // For prototype, we'll just echo back a simulated response
        return NextResponse.json({
            response: `I received your message: "${message}". As a prototype AI, I can tell you that space is vast and full of wonders!`
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        );
    }
}
