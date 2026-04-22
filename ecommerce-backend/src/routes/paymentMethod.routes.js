const express = require("express");
const paymentMethodController = require("../controllers/paymentMethod.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  createPaymentMethodSchema,
  paymentMethodIdParamSchema,
} = require("../validations/paymentMethod.validation");

const router = express.Router();

router.use(authMiddleware);

router.get("/", paymentMethodController.getMyPaymentMethods);
router.post("/", validateBody(createPaymentMethodSchema), paymentMethodController.createPaymentMethod);
router.delete(
  "/:id",
  validateParams(paymentMethodIdParamSchema),
  paymentMethodController.deletePaymentMethod
);
router.patch(
  "/:id/default",
  validateParams(paymentMethodIdParamSchema),
  paymentMethodController.setDefaultPaymentMethod
);

module.exports = router;
