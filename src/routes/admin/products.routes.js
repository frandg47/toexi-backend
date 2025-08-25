const router = require("express").Router();
const { list, create, update, remove } = require("../../controllers/admin/products.controller");
const upload = require("../../middleware/upload");

router.get("/", list);
router.post("/", upload.single("image"), create);
router.put("/:id", upload.single("image"), update);
router.delete("/:id", remove);

module.exports = router;
