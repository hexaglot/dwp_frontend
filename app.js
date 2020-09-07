const express = require("express");
const path = require("path");
const nunjucks = require("nunjucks");
const { indexRouter } = require("./routes/index");

const createApp = () => {
  const app = express();

  // Disable these response headers, we don't need them
  app.set("etag", false);
  app.set("x-powered-by", false);

  nunjucks.configure(path.join(__dirname, "views"), {
    autoescape: true,
    express: app,
  });

  app.use("/static", express.static("./public"));

  // Attach our only route
  app.use("/", indexRouter);

  // eslint-disable-next-line no-unused-vars
  app.use(function (req, res, next) {
    const err = new Error(`Page not found: ${req.path}`);
    err.status = 404;
    next(err);
  });

  // eslint-disable-next-line no-unused-vars
  app.use(function (err, req, res, next) {
    console.error(err.message);
    const status = err.status || 500;
    res.status(status);
    return res.render("error.html", { status });
  });

  return app;
};
module.exports = { createApp };
