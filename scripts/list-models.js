const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

async function listModels() {
    try {
        // Read .env file manually since dotenv might not be installed
        const envPath = path.join(process.cwd(), '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);

        if (!apiKeyMatch) {
            console.error('GEMINI_API_KEY not found in .env');
            return;
        }

        const apiKey = apiKeyMatch[1].trim();
        const genAI = new GoogleGenerativeAI(apiKey);

        // Access the model through the API directly if SDK doesn't have listModels helper exposed easily
        // Or just try to use a known working model like 'gemini-pro' but verify it.
        // Actually, the SDK doesn't have a direct listModels method on the instance usually, 
        // it's often on the class or via a manager, but let's try a direct fetch to the API endpoint for listing.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error('Error listing models:', data.error);
            return;
        }

        console.log('Available Models:');
        const models = data.models || [];
        models.forEach(m => {
            if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                console.log(`- ${m.name} (${m.displayName})`);
            }
        });

    } catch (error) {
        console.error('Failed to list models:', error);
    }
}

listModels();
