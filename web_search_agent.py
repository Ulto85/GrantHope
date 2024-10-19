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
        reponse_text = [x['url'] for x in tavily_search(_query.message,tavily_api_key)['results']]
        print(reponse_text)
        await ctx.send(sender, Response(urls=reponse_text))
    except Exception:
        await ctx.send(sender, Response(urls=["fail"]))

#-----------------------------------------------------
class WebsiteScraperRequest(Model):
    url: str

class WebsiteScraperResponse(Model):
    text: str

class ContextPrompt(Model):
    context: str
    text: str

class WebSearchRequest(Model):
    query: str

class WebSearchResult(Model):
    title: str
    url: str
    content: str

class WebSearchResponse(Model):
    query: str
    results: list[WebSearchResult]

class Response2(Model):
    text: str

WEB_SCRAPER_AI_AGENT_ADDRESS = "agent1qwnjmzwwdq9rjs30y3qw988htrvte6lk2xaak9xg4kz0fsdz0t9ws4mwsgs"
OPEN_AI_AGENT_ADDRESS = "agent1q0h70caed8ax769shpemapzkyk65uscw4xwk6dc4t3emvp5jdcvqs9xs32y"


website_url = "https://www.alz.org/"

prompt = "Grants for nonprofits looking to work on diseases" # change to take user input from the frontend

# web scraper agent
#@agent.on_event("startup")
@agent.on_message(Response) # waits for the tavily response 
async def send_message(ctx: Context):
    await ctx.send(WEB_SCRAPER_AI_AGENT_ADDRESS, WebsiteScraperRequest(url=website_url))
    ctx.logger.info(f"Sent request for scraping the Website: {website_url}")

# OpenAI Agent
@agent.on_message(WebsiteScraperResponse) # runs after the website scraper responds
async def handle_response(ctx: Context, sender: str, msg: WebsiteScraperResponse):
    ctx.logger.info(f"Received response from {sender[-10:]}:")
    ctx.logger.info(msg.text)
    await ctx.send(OPEN_AI_AGENT_ADDRESS, 
        ContextPrompt(
            context = 'given this scraped website data of multiple URLs, return a table for each site whether it is relevant to this user prompt: ' + prompt,
            text = msg.text # from WebsiteScraperResponse
        ))

# OpenAI Agent, prints that it received a response
@agent.on_message(Response2)
async def handle_response(ctx: Context, sender: str, msg: Response2):
    ctx.logger.info(f"Received response from {sender}: {msg.text}")
#-----------------------------------------------------

agent.run()