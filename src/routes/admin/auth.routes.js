const router = require("express").Router();
const { login, logout } = require("../../controllers/admin/auth.controller");

router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
