from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import ngrok
import pickle

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

class EmissionsFactors(BaseModel):
    gcv: float
    burntamount: float
    plf: float
    production: float
    is_lignite: bool
    is_bituminous: bool

@app.post("/predict")
def predict_emissions(emission_factors: EmissionsFactors):
    # Load the model
    with open('./app_python/AI_model/lasso_model.pkl', 'rb') as file:
        loaded_model = pickle.load(file)

        # Use the loaded model to make predictions on new data
        emissions = loaded_model.predict({emission_factors.gcv, emission_factors.burntamount, emission_factors.plf, emission_factors.production, emission_factors.is_lignite, emission_factors.is_bituminous})

    return {"emissions": emissions}

class EmissionDetails(BaseModel):
    gcv: float
    burntamount: float
    plf: float
    production: float
    is_lignite: bool
    is_bituminous: bool

@app.post("/suggest")
def suggest(emission_details: EmissionDetails):
    suggestion = ""  # TODO: Implement the suggestion logic
    return {
        "suggestion": suggestion
    }

if __name__ == "__main__":
    listener = ngrok.forward(addr=8080, domain="mole-model-drake.ngrok-free.app", authtoken_from_env = True)
    print(listener.url())
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
    ngrok.disconnect()