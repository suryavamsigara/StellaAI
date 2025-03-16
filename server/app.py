from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
from openai import OpenAI
from pydantic import BaseModel
from typing import Dict, Generator

app = Flask(__name__)
CORS(app)

class UserInput(BaseModel):
    question: str
    level: str

class Tutor:
    def __init__(self):
        """Initializing with default settings"""
        self.max_tokens = 100
        self.temperature = 0.6
        self.levels = {
            "beginner": "Explain concepts in simple terms",
            "intermediate": "Provide a clear and concise explanation with some detail",
            "advanced": "Give a detailed, technical explanatin"
        }
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    def get_user_input(self, question: str, level: str) -> Dict:
        user_input = UserInput(question=question, level=level)
        return user_input.model_dump()

    def generate_content(self, question: str, level: str) -> Generator[str, None, None]:
        """Generate educational content based on user's question and level"""
        prompt = self.generate_prompt(question, level)
        return self.ask_openai(prompt)

    def generate_prompt(self, question: str, level="intermediate") -> str:
        """Generate a comprehensive prompt"""
        prompt = f"""
        Important instructions
        Your goal is to provide clear, accurate, and detailed responses tailored to the user's level: {self.levels[level]}
        - For conceptual questions, explain step-by-step, and build up to complex ideas
        - For problems, solve them step by step with explanations for each step.
        - For advanceed topics, include technical details, formulas, and context.
        - For hypothetical questions, analyze the problem from multiple angles.
        - Use examples where helpful and keep the tone friendly and educational.
        - If the user talks in an informal tone, respond in a similar tone.
        - When possible, relate abstract concepts to real-world applications or phenomena.
        - Ask clarifying questions if the problem statement is ambiguous, and explore alternative solutions or interpretations.
        - If the user asks about something that is not related to the topics, you can give answers based on your knowledge in the similar tone.
        **Token Limit Handling**
        - If you are close to reaching the token limit ({self.max_tokens} tokens), conclude gracefully.
        - Do not cut off mid-sentence or leave the response incomplete.
        - If the topic requires more explanation, suggest continuing in a follow-up response.
        Question: {question}
        """
        return prompt
    
    def ask_openai(self, prompt: str) -> Generator[str, None, None]:
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages = [
                {"role": "system", "content": "You are an expert educator in Astronomy, Astrophysics, Mathematics, and Physics"},
                {"role": "user", "content": prompt},
            ],
            temperature=self.temperature,
            max_tokens=self.max_tokens,
            stream=True
        )
        
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content

# Initialize the tutor
tutor = Tutor()

@app.route('/')
def home():
    return jsonify({"message": "Server is running"})

@app.route('/api/execute', methods=['POST'])
def execute_code():
    data = request.json
    code = data.get('code')
    
    if not code:
        return jsonify({"error": "No code provided"}), 400
    
    try:
        # Create a string buffer to capture output
        import io
        import sys
        output_buffer = io.StringIO()
        sys.stdout = output_buffer
        
        # Execute the code
        exec(code)
        
        # Get the output and restore stdout
        output = output_buffer.getvalue()
        sys.stdout = sys.__stdout__
        
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tutor', methods=['POST'])
def handle_tutor():
    data = request.json
    question = data.get('question')
    level = data.get('level')
    
    if not question or not level:
        return jsonify({"error": "Missing question or level"}), 400
    
    try:
        # Validate input using the tutor's method
        user_input = tutor.get_user_input(question, level)
        
        def generate():
            for chunk in tutor.generate_content(user_input["question"], user_input["level"]):
                yield f"data: {chunk}\n\n"
        
        return Response(
            generate(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            }
        )
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True) 