const config = require("../app/config/app");

module.exports = (app) => {
  app.listen(config.port, () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${config.port}`
    );
  });
};
