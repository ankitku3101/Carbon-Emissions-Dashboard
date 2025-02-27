from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import ngrok
import pickle
import numpy as np

from suggestion import Suggestions

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
    emissions = 0.0 
    # Load the model
    with open('./app_python/AI_model/lasso_model.pkl', 'rb') as file:
        loaded_model = pickle.load(file)

        emission_dict = emission_factors.model_dump()  # For Pydantic v2
        # emission_dict = emission_factors.dict()  # Use this if using Pydantic v1
        
        # Convert boolean values to integers
        is_lignite = int(emission_dict["is_lignite"])  
        is_bituminous = int(emission_dict["is_bituminous"])

        # Extract values in correct order
        input_data = np.array([[
            emission_dict["gcv"],
            emission_dict["burntamount"],
            emission_dict["plf"],
            emission_dict["production"],
            is_lignite,
            is_bituminous
        ]])
        
        emissions = loaded_model.predict(input_data)


    return {"totalemissions": emissions.tolist()[0]}

class EmissionDetails(BaseModel):
    gcv: float
    burntamount: float
    plf: float
    production: float
    is_lignite: bool
    is_bituminous: bool
    totalemissions: float

@app.post("/suggest")
def suggest(emission_details: EmissionDetails):
    
    suggestion = Suggestions().suggest(emission_details.model_dump())
    return {
        "suggestion": suggestion
    }

if __name__ == "__main__":
    listener = ngrok.forward(addr=8080, domain="mole-model-drake.ngrok-free.app", authtoken_from_env = True)
    print(listener.url())
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)
    ngrok.disconnect()