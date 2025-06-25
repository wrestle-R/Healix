from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware 


# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
app = FastAPI(title="Medical Advisor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define request/response models
class SymptomQuery(BaseModel):
    symptoms: str
    patient_history: str = ""
    current_medications: str = ""
    num_recommendations: int = 3

class RecommendationResponse(BaseModel):
    recommendations: List[str]
    advice: str
    precautions: List[str]

# Initialize LLM
try:
    llm_model = ChatGroq(
        model='llama3-70b-8192',
        api_key=GROQ_API_KEY,
        temperature=0.7
    )
except Exception as e:
    raise RuntimeError(f"Failed to initialize LLM: {str(e)}")

# Create the prompt template
prompt = ChatPromptTemplate([
    ('system', '''You are an experienced medical doctor. A patient has described their symptoms to you.
     Provide general medical advice and recommendations based on the symptoms provided.
     Always recommend consulting with a healthcare professional in person for proper diagnosis.
     Your response should include:
     1. Possible conditions that might match these symptoms
     2. General recommendations (3-5)
     3. Precautions to take
     4. When to seek immediate medical attention'''),
    ('human', '''Patient Symptoms: {symptoms}
     Patient History: {patient_history}
     Current Medications: {current_medications}
     Please provide {num_recommendations} recommendations.''')
])

@app.get("/")
async def root():
    return {"message": "Medical Advisor API is running"}

@app.post("/get_medical_advice", response_model=RecommendationResponse)
async def get_medical_advice(query: SymptomQuery):
    try:
        # Create and run the chain
        chain = prompt | llm_model | StrOutputParser()
        response = chain.invoke({
            "symptoms": query.symptoms,
            "patient_history": query.patient_history,
            "current_medications": query.current_medications,
            "num_recommendations": query.num_recommendations
        })
        
        # Parse the response into structured format
        # Note: In a production app, you'd want more sophisticated parsing
        recommendations = response.split('\n\n')[1].split('\n')[1:]  # Gets recommendations list
        precautions = response.split('\n\n')[2].split('\n')[1:]     # Gets precautions list
        
        return RecommendationResponse(
            recommendations=recommendations,
            advice=response.split('\n\n')[0],  # The first part is general advice
            precautions=precautions
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)