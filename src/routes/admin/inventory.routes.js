const router = require("express").Router();
const { updateStock } = require("../../controllers/admin/inventory.controller");

router.put("/:productId", updateStock);

module.exports = router;
