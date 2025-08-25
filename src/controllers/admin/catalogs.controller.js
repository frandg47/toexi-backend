// src/controllers/admin/catalogs.controller.js
const pool = require("../../config/db");

const getBrands = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM brands ORDER BY name");
    res.json(rows);
  } catch (e) {
    console.error("Error fetching brands:", e);
    res.status(500).json({ error: "Error al obtener las marcas." });
  }
};

const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json(rows);
  } catch (e) {
    console.error("Error fetching categories:", e);
    res.status(500).json({ error: "Error al obtener las categorías." });
  }
};

module.exports = {
  getBrands,
  getCategories
};