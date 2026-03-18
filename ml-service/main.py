from fastapi import FastAPI
from predict import predict_risk

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Wellbeing AI ML Service Running"}

@app.post("/predict")

def predict(data: dict):

    result = predict_risk(data)

    if result == 1:
        risk = "High Risk"
    else:
        risk = "Low Risk"

    return {
        "risk_level": risk
    }