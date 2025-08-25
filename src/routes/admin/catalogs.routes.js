// src/routes/admin/catalogs.routes.js
const router = require("express").Router();
const { getBrands, getCategories } = require("../../controllers/admin/catalogs.controller");

// Ambas rutas deben estar protegidas por el middleware de autenticación
router.get("/brands", getBrands);
router.get("/categories", getCategories);

module.exports = router;