import pickle
import numpy as np

model = pickle.load(open("model/xgboost_model.pkl", "rb"))

def predict_risk(data):

    features = data["features"]

    stress = features[0]
    mood = features[1]
    sleep = features[2]
    activity = features[3]
    diet = features[4]
    lateEating = features[5]
    medication = features[6]

    # Example prediction logic
    risk_score = stress + mood + (10 - sleep)

    if risk_score > 10:
        prediction = "High Risk"
    else:
        prediction = "Low Risk"

    return {"prediction": prediction}