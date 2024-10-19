

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
from bs4 import BeautifulSoup
load_dotenv()
import re
import ast

def find_and_eval_dicts(text):
   pattern = r'\{([^\{\}]*)\}'
   matches = re.findall(pattern, text)
   return [ast.literal_eval(f'{{{match}}}') for match in matches]
gemini_api_key=os.getenv("GEMINI_API_KEY")
def get_webpage_content(link):
    resp=requests.get(link) 
      
    answer= ''
    if resp.status_code==200: 
        print("Successfully opened the web page") 
    
        soup=BeautifulSoup(resp.text,'html.parser')    
        l=soup.findAll("div")
       
        for i in l: 
            answer+=i.text
        return answer
    else: 
        return 'error'


class TestRequest(Model):
    link: str
    context:str


class Response(Model):
    text:str
    isValid:bool




agent = Agent(
    name="WebPageEvalAgent",
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
@agent.on_rest_post("/validate",TestRequest, Response)
async def query_handler(ctx: Context, req: TestRequest):
    ctx.logger.info("Query received")
    try:
        webcontext = get_webpage_content(req.link)
 
        response_text = model.generate_content(f"RETURN YOUR ANSWER AS A DICTIONARY {{'is_applicable':(boolean: (TRUE/FALSE)), 'reasoning':why you think that way}}. Does this grant: {webcontext} \n sound applicable for my specific NGO usecase: {req.context}").text
        print(response_text)
        response_dict= find_and_eval_dicts(response_text)[0]
        return Response(text=response_dict["reasoning"],isValid=response_dict["is_applicable"])
    except Exception as e:
        print(e)
        return Response(text="fail",isValid=False)
agent.run()