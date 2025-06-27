const express = require("express");
const router = express.Router();
const TherapyController = require("../controllers/therapyController");

// All routes are public - no authentication needed
router.get("/", TherapyController.getAllTherapies);
router.get("/categories", TherapyController.getCategories);
router.get("/conditions", TherapyController.getTargetConditions);
router.get("/:therapyId", TherapyController.getTherapyById);

module.exports = router;