const axios = require("axios");

const defaultLogData = {
  service: "auth-service",    
  environment: process.env.NODE_ENV || "dev"
};

const sendLog = async (level, message, data = {}) => {
  if (!process.env.BETTERSTACK_TOKEN) {
    return;
  }
  try {
    const log = [
      {
        dt: new Date().toISOString(),
        message,
        level,
        ...defaultLogData,
        ...data
      }
    ];

    await axios.post("https://in.logs.betterstack.com", log, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BETTERSTACK_TOKEN}`
      }
    });

  } catch (error) {
    console.error("Erro ao enviar log para Better Stack:", error.response?.data || error.message);
  }
};

const logger = {
  info: (msg, data) => sendLog("info", msg, data),
  error: (msg, data) => sendLog("error", msg, data)
};

module.exports = logger;
