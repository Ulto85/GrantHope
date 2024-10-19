import json

from fastapi import FastAPI, Request

from uagents import Model
from uagents.envelope import Envelope
from uagents.query import query

AGENT_ADDRESS = "agent1q0hqakx8mdhsv7sydtzh38gzsx8td035dcdkp44yt4t4tsya8y6y2wl79rj"


class TestRequest(Model):
    message: str


async def agent_query(req):
    response = await query(destination=AGENT_ADDRESS, message=req, timeout=15)
    print(response)
    if isinstance(response, Envelope):
        data = json.loads(response.decode_payload())
        return data["urls"]
    return response


app = FastAPI()


@app.get("/")
def read_root():
    return "Hello from the Agent controller"


@app.post("/endpoint")
async def make_agent_call(req: Request):
    print("YESSIR")
    model = TestRequest.parse_obj(await req.json())
    try:
        res = await agent_query(model)
        return f"successful call - agent response: {res}"
    except Exception as e:
        print(e)
        return "unsuccessful agent call"