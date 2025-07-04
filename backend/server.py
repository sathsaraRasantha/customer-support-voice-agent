from fastapi import FastAPI
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()

@app.get("/config")
async def get_config():
    # Example config payload
    return JSONResponse({
        "featureToggle": {"type": "boolean", "value": True},
        "apiUrl": {"type": "string", "value": "https://api.example.com"},
        "someSetting": {"type": "string", "value": "exampleValue"}
    })

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

