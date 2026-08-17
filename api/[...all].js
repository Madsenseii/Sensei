// Vercel Serverless Function catch-all entry point (/api/*)
const app = require("../backend/app");

module.exports = (req, res) => {
  return app(req, res);
};
