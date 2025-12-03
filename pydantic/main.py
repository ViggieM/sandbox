from datetime import date
from typing import List, Literal, Optional

import openai
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr, Field, ValidationError

load_dotenv()
client = openai.OpenAI()


class UserInput(BaseModel):
    name: str
    email: EmailStr
    query: str
    order_id: Optional[int] = Field(
        None,
        description="5-digit order number (cannot start with 0)",
        ge=10000,
        le=99999,
    )
    purchase_date: Optional[date] = None


class CustomerQuery(UserInput):
    priority: str = Field(..., description="Priority level: low, medium, high")
    category: Literal["refund_request", "information_request", "other"] = Field(
        ..., description="Query category"
    )
    is_complaint: bool = Field(..., description="Whether this is a complaint")
    tags: List[str] = Field(..., description="Relevant keyword tags")


user_input_json = """
{
    "name": "Joe User",
    "email": "joe.user@example.com",
    "query": "I forgot my password.",
    "order_number": null,
    "purchase_date": null
}
"""

example_response_structure = """{
    name="Example User",
    email="user@example.com",
    query="I ordered a new computer monitor and it arrived with the screen cracked. I need to exchange it for a new one.",
    order_id=12345,
    purchase_date="2025-12-31",
    priority="medium",
    category="refund_request",
    is_complaint=True,
    tags=["monitor", "support", "exchange"]
}"""


def call_llm(prompt, model="gpt-4o"):
    response = client.chat.completions.create(
        model=model, messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content


def main():
    user_input = UserInput.model_validate_json(user_input_json)

    prompt = f"""
    Please analyze this user query\n {user_input.model_dump_json(indent=2)}:

    Return your analysis as a JSON object matching this exact structure
    and data types:
    {example_response_structure}

    Respond ONLY with valid JSON. Do not include any explanations or
    other text or formatting before or after the JSON object.
    """

    response_content = call_llm(prompt)
    if not response_content:
        return
    valid_data = CustomerQuery.model_validate_json(response_content)


if __name__ == "__main__":
    main()
