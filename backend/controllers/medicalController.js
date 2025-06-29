const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');

class MedicalAdvisorController {
    constructor() {
        this.initializeLLM();
    }

    initializeLLM() {
        try {
            this.llm = new ChatGroq({
                model: 'llama3-70b-8192',
                apiKey: process.env.GROQ_API_KEY,
                temperature: 0.7
            });

            this.promptTemplate = ChatPromptTemplate.fromMessages([
                ['system', `You are an experienced medical doctor. A patient has described their symptoms to you.
Provide general medical advice and recommendations based on the symptoms provided.
Always recommend consulting with a healthcare professional in person for proper diagnosis.
Your response should include:
1. Possible conditions that might match these symptoms
2. General recommendations (3-5)
3. Precautions to take
4. When to seek immediate medical attention`],
                ['human', `Patient Symptoms: {symptoms}
Patient History: {patient_history}
Current Medications: {current_medications}
Please provide {num_recommendations} recommendations.`]
            ]);

            this.outputParser = new StringOutputParser();

        } catch (error) {
            throw new Error(`Failed to initialize LLM: ${error.message}`);
        }
    }

    // Controller method for getting medical advice
    async getMedicalAdvice(req, res) {
        try {
            const {
                symptoms,
                patient_history = "",
                current_medications = "",
                num_recommendations = 3
            } = req.body;

            // Validation
            if (!symptoms || symptoms.trim() === "") {
                return res.status(400).json({
                    error: "Symptoms are required"
                });
            }

            // Generate response using LangChain
            const chain = this.promptTemplate.pipe(this.llm).pipe(this.outputParser);
            
            const response = await chain.invoke({
                symptoms,
                patient_history,
                current_medications,
                num_recommendations
            });

            // Parse the response into structured format
            const responseText = response;
            const sections = responseText.split('\n\n');
            
            // Simple parsing logic (you might want to make this more sophisticated)
            let recommendations = [];
            let precautions = [];
            let advice = "";

            // Extract advice (first section)
            advice = sections[0] || responseText;

            // Try to extract recommendations and precautions
            const lines = responseText.split('\n').filter(line => line.trim() !== '');
            let currentSection = '';
            
            for (const line of lines) {
                const lowerLine = line.toLowerCase();
                if (lowerLine.includes('recommendation') || lowerLine.includes('suggest')) {
                    currentSection = 'recommendations';
                    continue;
                } else if (lowerLine.includes('precaution') || lowerLine.includes('warning')) {
                    currentSection = 'precautions';
                    continue;
                }

                if (currentSection === 'recommendations' && line.trim().match(/^\d+\.|\-|\•/)) {
                    recommendations.push(line.replace(/^\d+\.\s*|\-\s*|\•\s*/, '').trim());
                } else if (currentSection === 'precautions' && line.trim().match(/^\d+\.|\-|\•/)) {
                    precautions.push(line.replace(/^\d+\.\s*|\-\s*|\•\s*/, '').trim());
                }
            }

            // If parsing didn't work well, provide fallback
            if (recommendations.length === 0) {
                recommendations = ["Consult with a healthcare professional for proper diagnosis"];
            }
            if (precautions.length === 0) {
                precautions = ["Seek immediate medical attention if symptoms worsen"];
            }

            const result = {
                recommendations,
                advice: advice || responseText,
                precautions,
                disclaimer: "This is general medical information and should not replace professional medical advice."
            };

            res.status(200).json(result);

        } catch (error) {
            console.error('Medical advice error:', error);
            res.status(500).json({
                error: "Error processing medical advice request",
                details: error.message
            });
        }
    }

    // Health check endpoint
    async healthCheck(req, res) {
        res.status(200).json({
            message: "Medical Advisor API is running",
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = new MedicalAdvisorController();