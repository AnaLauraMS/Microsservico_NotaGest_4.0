const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;

    await logger.info("HTTP Request", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      headers: req.headers,
      query: req.query,
      params: req.params,
      body: req.body,
      ip: req.ip
    });
  });

  next();
};

module.exports = requestLogger;
