const expressLoader = require("./express");
const serverLoader = require("./server");

exports.init = () => {
  const app = expressLoader();
  serverLoader(app);
};
