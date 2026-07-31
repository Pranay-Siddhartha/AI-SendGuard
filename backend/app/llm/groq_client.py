import json
from groq import Groq
from pydantic import BaseModel
from app.core.config import settings

def get_groq_client():
    api_key = settings.GROQ_API_KEY
    if not api_key or api_key == "test-key":
        return None
    try:
        return Groq(api_key=api_key)
    except Exception as e:
        print(f"Error initializing Groq client: {e}")
        return None

def generate_json_completion(system_prompt: str, user_prompt: str, response_format: BaseModel = None) -> dict:
    client = get_groq_client()
    if not client:
        return None
        
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.1
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Groq API error: {e}")
        return None
