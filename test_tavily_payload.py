import requests
from tavily import TavilyClient


def tavily_search(query, API_KEY):
    """Perform a search using the Tavily Search API and return results."""
    tavily_client = TavilyClient(api_key=API_KEY)
    return tavily_client.search(query)
tavily_api_key="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"
print(tavily_search("is cs61a a hard class",tavily_api_key))