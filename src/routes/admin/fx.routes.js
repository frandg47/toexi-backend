const router = require("express").Router();
const { setActiveFx } = require("../../controllers/admin/fx.controller");

router.put("/", setActiveFx);

module.exports = router;
