from fastapi import FastAPI
from pydantic import BaseModel
from predict import predict_risk

app = FastAPI()

class InputData(BaseModel):
    features: list

@app.get("/")
def home():
    return {"message": "Wellbeing AI ML Service Running"}

@app.post("/predict")
def predict(data: InputData):

    result = predict_risk({"features": data.features})

    return {
        "prediction": result   # ✅ matches backend expectation
    }
