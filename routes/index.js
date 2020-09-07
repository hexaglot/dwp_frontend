const Router = require("express-promise-router");
const { check, validationResult } = require("express-validator");
const { londonerService } = require("../services/londonerService");

const indexRouter = Router();

indexRouter.get(
  "/",
  [
    check("radius")
      .optional()
      .isNumeric()
      .withMessage("Please enter a whole number")
      .toInt(),
  ],
  async (req, res, next) => {
    const { errors } = validationResult(req);

    if (errors.length) {
      return res.render("index.html", { errors });
    }

    if (typeof req.query.radius === "number") {
      const radius = req.query.radius;

      try {
        const londoners = await londonerService(radius);
        return res.render("index.html", { radius, londoners });
      } catch (err) {
        next(err);
      }
    } else {
      return res.render("index.html", {});
    }
  }
);

module.exports = { indexRouter };
