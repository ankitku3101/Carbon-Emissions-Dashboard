from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import os
import pandas as pd
# from langserve import add_routes
# import uvicorn

load_dotenv()

os.environ['OPENAI_API_KEY'] = os.getenv("OPENAI_API_KEY")
os.environ['LANGCHAIN_API_KEY'] = os.getenv("LANGCHAIN_API_KEY")
os.environ['LANGCHAIN_TRACING_V2'] = "true"

emission_details = pd.read_csv("dataset\Emission_data_monthly.csv")

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are an AI expert in carbon emission analysis for coal-based power plants."),
        ("user", """Below is a summarized dataset showing current trends of coal-based electricity generation:{emission_details}
            Based on this, provide:
            1. Possible future challenges in maintaining emission control.
            2. Three effective strategies to reduce emissions while maintaining energy efficiency.

            Keep your response concise and data-driven.""")
    ]
)

llm = ChatOpenAI(model = "gpt-4o-mini")
output_parser = StrOutputParser()
chain = prompt|llm|output_parser

if __name__ == "__main__":
    response = chain.invoke({'emission_details':emission_details})
