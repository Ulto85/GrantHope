
from uagents import Agent, Context, Model

import requests
from tavily import TavilyClient
from dotenv import load_dotenv
import os
load_dotenv()

tavily_api_key=os.getenv("TAVILY_API_KEY")

def tavily_search(query, API_KEY):
    """Perform a search using the Tavily Search API and return results."""
    tavily_client = TavilyClient(api_key=API_KEY)
    return tavily_client.search(query)

class TestRequest(Model):
    message: str


class Response(Model):
    urls:list


agent = Agent(
    name="SearcherAgent",
    seed="tavily-searcher",
    port=8001,
    endpoint="http://localhost:8001/search",
)


@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"Starting up {agent.name}")
    ctx.logger.info(f"With address: {agent.address}")
    ctx.logger.info(f"And wallet address: {agent.wallet.address()}")


@agent.on_query(model=TestRequest, replies={Response})
async def query_handler(ctx: Context, sender: str, _query: TestRequest):
    ctx.logger.info("Query received")
    try:
      
        reponse_text = [x['title'] for x in tavily_search(_query.message,tavily_api_key)['results']]
      
        await ctx.send(sender, Response(urls=reponse_text))
    except Exception as e:
  
        await ctx.send(sender, Response(urls=["fail"]))
agent.run()
# @agent.on_rest_get("/rest/search",model=TestRequest, replies={Response})
# async def query_handler(ctx: Context, sender: str, _query: TestRequest):
#     ctx.logger.info("Query received")
#     try:
#         reponse_text = [x['title'] for x in tavily_search(_query.message,tavily_api_key)['results']]
#         return Response(urls=reponse_text)
#     except Exception:
#         return Response(urls=["fail"])
# agent.run()