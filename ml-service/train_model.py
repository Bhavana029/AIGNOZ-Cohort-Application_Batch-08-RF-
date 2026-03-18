import pandas as pd
import numpy as np
import xgboost as xgb
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

# ----------------------------
# Load dataset
# ----------------------------
data = pd.read_csv("dataset/dataset.csv", encoding="latin1")

print("Dataset Loaded:", data.shape)

# ----------------------------
# Remove Timestamp
# ----------------------------
if "Timestamp" in data.columns:
    data.drop(columns=["Timestamp"], inplace=True)

# ----------------------------
# Encode every column safely
# ----------------------------
label_encoders = {}

for col in data.columns:
    encoder = LabelEncoder()

    # Convert everything to string first
    data[col] = data[col].astype(str)

    # Encode values
    data[col] = encoder.fit_transform(data[col])

    label_encoders[col] = encoder

# Now dataframe is fully numeric
data = data.astype(float)

# ----------------------------
# Create UI Features
# ----------------------------
stress_cols = data.columns[0:5]

data["stressLevel"] = data[stress_cols].mean(axis=1)

data["sleepHours"] = data.iloc[:,5]

data["activityMinutes"] = data.iloc[:,8] * 10

data["dietAdherence"] = data.iloc[:,7]

data["lateNightEating"] = data.iloc[:,14]

data["medicationTaken"] = data.iloc[:,22]

data["mood"] = data.iloc[:,1]

# ----------------------------
# Create Risk Label
# ----------------------------
risk_score = (
    data["stressLevel"] +
    data["dietAdherence"] +
    data["lateNightEating"]
) / 3

median_val = risk_score.median()

data["risk_level"] = np.where(risk_score > median_val, 1, 0)

# ----------------------------
# Features for model
# ----------------------------
features = [
    "stressLevel",
    "sleepHours",
    "activityMinutes",
    "dietAdherence",
    "lateNightEating",
    "medicationTaken",
    "mood"
]

X = data[features]
y = data["risk_level"]

# ----------------------------
# Train/Test split
# ----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ----------------------------
# Train XGBoost
# ----------------------------
model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    random_state=42
)

model.fit(X_train, y_train)

# ----------------------------
# Evaluate
# ----------------------------
pred = model.predict(X_test)

accuracy = accuracy_score(y_test, pred)

print("Model Accuracy:", accuracy)

# ----------------------------
# Save model
# ----------------------------
pickle.dump(model, open("model/xgboost_model.pkl", "wb"))

print("Model saved successfully")