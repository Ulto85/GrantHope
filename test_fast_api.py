import json

from fastapi import FastAPI, Request

from uagents import Model
from uagents.envelope import Envelope
from uagents.query import query

AGENT_ADDRESS = "agent1qw9agk69kw9t57lpgasq9uewx3ns9qtlfju3pzphl4x2u39yfelp7v057ev"


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


@app.post("/plan")
async def make_agent_call(req: Request):
    print("YESSIR")
    model = TestRequest.parse_obj(await req.json())
    try:
        res = await agent_query(model)
        return f"successful call - agent response: {res}"
    except Exception as e:
        print(e)
        return "unsuccessful agent call"