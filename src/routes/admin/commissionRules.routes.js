const router = require("express").Router();
const { list, create, update, remove } = require("../../controllers/admin/commissionRules.controller");

router.get("/", list);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
