const axios = require("axios");

const predictHealth = async (data) => {

  const response = await axios.post(
    "https://aignoz-cohort-application-batch-08-rf-1.onrender.com/predict",
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
