const express = require("express");
const returnController = require("../controllers/return.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireRoles } = require("../middlewares/role.middleware");
const { validateBody, validateParams } = require("../middlewares/validate.middleware");
const {
  createReturnSchema,
  updateReturnStatusSchema,
  returnIdParamSchema,
} = require("../validations/return.validation");

const router = express.Router();

router.use(authMiddleware);

router.get("/my", returnController.getMyReturns);
router.post("/", validateBody(createReturnSchema), returnController.createReturnRequest);
router.get("/", requireRoles("admin"), returnController.getAllReturns);
router.patch(
  "/:id/status",
  requireRoles("admin"),
  validateParams(returnIdParamSchema),
  validateBody(updateReturnStatusSchema),
  returnController.updateReturnStatus
);

module.exports = router;
