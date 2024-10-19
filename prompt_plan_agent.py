

from uagents import Agent, Context, Model

import requests


# Importing necessary libraries
from uagents import Agent, Context
from uagents.setup import fund_agent_if_low
from uagents import Model
import google.generativeai as genai
from dotenv import load_dotenv
import os
import re
import ast
load_dotenv()

gemini_api_key=os.getenv("GEMINI_API_KEY")



class Request(Model):
    message: str


class Response(Model):
    prompts:list



def find_and_eval_lists(text):
    pattern = r'\[([^\[\]]*)\]'
    matches = re.findall(pattern, text)
    return [ast.literal_eval(f'[{match}]') for match in matches]
agent = Agent(
    name="PromptPlannerAgent",
    seed="gemini-planner",
    port=8001,
    endpoint="http://localhost:8001/plan",
)
genai.configure(api_key=gemini_api_key) 
model = genai.GenerativeModel('gemini-1.5-flash')
@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"Starting up {agent.name}")
    ctx.logger.info(f"With address: {agent.address}")
    ctx.logger.info(f"And wallet address: {agent.wallet.address()}")


# @agent.on_query(model=TestRequest, replies={Response})
# async def query_handler(ctx: Context, sender: str, _query: TestRequest):
#     ctx.logger.info("Query received")
#     try:
#         response_text = model.generate_content(f"Create a list (RETURN ONLY A PYTHON LIST) of possible prompts to search for this grants for an NGO with this description {_query.message}: ")
        
#         await ctx.send(sender, Response(prompts=find_and_eval_lists(response_text)[0]))
#     except Exception:
#         await ctx.send(sender, Response(prompts=["fail"]))
# agent.run()
@agent.on_rest_post("/plan",Request, Response)
async def query_handler(ctx: Context, req: Request):
    ctx.logger.info("Query received")
    try:
        
        response_text = model.generate_content(f"Create a list (RETURN ONLY A PYTHON LIST) of possible prompts to search for this grants for an NGO with this description, make some relate closely, make some a bit broad {req.message}: ").text
        return Response(prompts=find_and_eval_lists(response_text)[0])
    except Exception as e:
        return Response(prompts=["fail"])
agent.run()