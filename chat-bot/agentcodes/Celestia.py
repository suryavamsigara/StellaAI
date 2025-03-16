from openai import OpenAI
from pydantic import BaseModel
from sympy import symbols, solve, Eq
import re
from typing import Dict, List
import os

client = OpenAI(
    api_key = os.getenv('OPENAI_API_KEY')
)

class UserInput(BaseModel):
    question: str
    level: str

class Tutor:
    def __init__(self):
        """Initializing with default settings"""
        self.max_tokens = 600
        self.temperature = 0.6
        self.levels = {
            "beginner": "Explain concepts in simple terms",
            "intermediate": "Provide a clear and concise explanation with some detail",
            "advanced": "Give a detailed, technical explanatin"
        }

    def get_user_input(self) -> Dict:
        """Get the propmt"""
        print("Welcome")

        question = input("What do you want to learn?: ")
        level = input("What is your current level?: ").lower()

        while level not in self.levels:
            level = input("Please choose: beginner, intermediate, or advanced: ").lower()


        # Validating with pydantic
        user_input = UserInput(question=question, level=level)
        return user_input.model_dump()

    
    def generate_content(self, question: str, level: str) -> str:
        """Generate educational content based on user's question and level"""
        prompt = self.generate_prompt(question, level)
        response = self.ask_openai(prompt)
        return response


    def generate_prompt(self, question: str, level="intermediate"):
        """Generate a comprehensive prompt"""
        prompt = f"""
        Important instructions
        Your goal is to provide clear, accurate, and detailed responses tailored to the user's level: {self.levels[level]}
        - For conceptual questions, explain step-by-step, and build up to complex ideas
        - For problems, solve them step by step with explanations for each step.
        - For advanceed topics, include technical details, formulas, and context.
        - For hypothetical questions, analyze the problem from multiple angles.
        - Use examples where helpful and keep the tone friendly and educational.
        - When possible, relate abstract concepts to real-world applications or phenomena.
        - When faced with hypothetical scenarios, analyze the problem from multiple angles.
        - Ask clarifying questions if the problem statement is ambiguous, and explore alternative solutions or interpretations.
        - Promote interdisciplinary connections.
        Question: {question}
        """
        return prompt
    
    def ask_openai(self, prompt: str) -> str:
        """Call OpenAI's API to generate a response"""
        response = client.chat.completions.create(
            model="gpt-4o",
            messages = [
                {"role": "system", "content": "You are an expert educator in Astronomy, Astrophysics, Mathematics, and Physics"},
                {"role": "user", "content": prompt},
            ],
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )
        return response.choices[0].message.content
    
    def run(self):
        """Run the tutor"""
        while True:
            user_input = self.get_user_input()
            question = user_input["question"]
            level = user_input["level"]
            answer = self.generate_content(question, level)
            print(f"\nAnswer:\n{answer}\n")