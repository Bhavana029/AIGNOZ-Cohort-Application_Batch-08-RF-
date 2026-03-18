const axios = require("axios");

const predictHealth = async (data) => {

  const response = await axios.post(
    "http://127.0.0.1:8000/predict",
    {
      features: [
        data.stress,
        data.mood,
        data.sleep,
        data.activity,
        data.diet,
        data.lateEating ? 1 : 0,
        data.medication ? 1 : 0
      ]
    }
  );

  return response.data;
};

module.exports = { predictHealth };