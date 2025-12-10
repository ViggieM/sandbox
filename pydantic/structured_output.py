from datetime import date
from typing import List, Literal, Optional

import anthropic
import instructor
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, EmailStr, Field
from pydantic_ai import Agent

load_dotenv()
openai_client = OpenAI()
anthropic_client = instructor.from_anthropic(anthropic.Anthropic())


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


# Define the CustomerQuery model that inherits from UserInput
class CustomerQuery(UserInput):
    priority: str = Field(..., description="Priority level: low, medium, high")
    category: Literal["refund_request", "information_request", "other"] = Field(
        ..., description="Query category"
    )
    is_complaint: bool = Field(..., description="Whether this is a complaint")
    tags: List[str] = Field(..., description="Relevant keyword tags")


user_input_json = """{
    "name": "Joe User",
    "email": "joe.user@example.com",
    "query": "I ordered a new computer monitor and it arrived with the screen cracked. This is the second time this has happened. I need a replacement ASAP.",
    "order_number": 12345,
    "purchase_date": "2025-12-31"
}"""


def main():
    user_input = UserInput.model_validate_json(user_input_json)

    prompt = (
        f"Analyze the following customer query {user_input} "
        f"and provide a structured response."
    )

    response = anthropic_client.messages.create(
        model="claude-3-7-sonnet-latest",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
        response_model=CustomerQuery,
    )

    print(type(response))
    print(response.model_dump_json(indent=2))

    # Initialize OpenAI client and call passing CustomerQuery in your API call
    openai_client = OpenAI()
    response = openai_client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format=CustomerQuery,
    )
    response_content = response.choices[0].message.content
    print(type(response_content))
    print(response_content)

    # Try the responses API from OpenAI
    response = openai_client.responses.parse(
        model="gpt-4o",
        input=[{"role": "user", "content": prompt}],
        text_format=CustomerQuery,
    )

    # Investigate class inheritance structure of the OpenAI response
    def print_class_inheritence(llm_response):
        for cls in type(llm_response).mro():
            print(f"{cls.__module__}.{cls.__name__}")

    print_class_inheritence(response)

    # Print the response type and content
    print(type(response.output_parsed))
    if response.output_parsed:
        print(response.output_parsed.model_dump_json(indent=2))

    # Try out the Pydantic AI package for defining an agent and getting a structured response
    agent = Agent(
        model="google-gla:gemini-2.0-flash",
        output_type=CustomerQuery,
    )
    response = agent.run_sync(prompt)
    print(type(response.output))
    print(response.output.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
