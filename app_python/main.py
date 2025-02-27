from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json
import ngrok

# initializing the fastapi instance
app = FastAPI()

# Allowing all requests from any source
allowed_origins = [
    "*",
]

# Adding the middleware to the fastapi instance
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Carbon Emissions Dashboard"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    listener = ngrok.forward(addr=8080, domain="mole-model-drake.ngrok-free.app", authtoken_from_env = True)
    print(listener.url())
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
    ngrok.disconnect()