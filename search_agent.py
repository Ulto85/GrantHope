tavily_api_key="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"

from uagents import Agent, Context, Model

import requests
from tavily import TavilyClient


def tavily_search(query, API_KEY):
    """Perform a search using the Tavily Search API and return results."""
    tavily_client = TavilyClient(api_key=API_KEY)
    return tavily_client.search(query)
tavily_api_key="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"
print(tavily_search("is cs61a a hard class",tavily_api_key))
class TestRequest(Model):
    message: str


class Response(Model):
    urls:list


agent = Agent(
    name="SearcherAgent",
    seed="tavily-searcher",
    port=8001,
    endpoint="http://localhost:8001/submit",
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
        print(reponse_text)
        await ctx.send(sender, Response(urls=reponse_text))
    except Exception:
        await ctx.send(sender, Response(urls=["fail"]))
agent.run()