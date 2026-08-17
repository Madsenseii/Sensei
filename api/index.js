// Vercel Serverless Function entry point
const app = require("../backend/app");

module.exports = (req, res) => {
  return app(req, res);
};
