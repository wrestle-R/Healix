const Therapy = require("../models/therapy");

class TherapyController {
  // Get all therapy routines
  static async getAllTherapies(req, res) {
    try {
      const { category, difficulty, targetCondition } = req.query;
      
      let filter = { isActive: true };
      
      if (category) filter.category = category;
      if (difficulty) filter.difficulty = difficulty;
      if (targetCondition) filter.targetConditions = { $in: [targetCondition] };

      const therapies = await Therapy.find(filter).sort({ createdAt: -1 });

      res.json({ 
        success: true, 
        therapies,
        count: therapies.length 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get therapy by ID
  static async getTherapyById(req, res) {
    try {
      const { therapyId } = req.params;

      const therapy = await Therapy.findById(therapyId);

      if (!therapy) {
        return res.status(404).json({ 
          success: false, 
          message: "Therapy routine not found" 
        });
      }

      res.json({ 
        success: true, 
        therapy 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get therapy categories
  static async getCategories(req, res) {
    try {
      const categories = await Therapy.distinct("category", { isActive: true });
      
      res.json({ 
        success: true, 
        categories: categories.sort() 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // Get target conditions
  static async getTargetConditions(req, res) {
    try {
      const conditions = await Therapy.distinct("targetConditions", { isActive: true });
      
      res.json({ 
        success: true, 
        conditions: conditions.sort() 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = TherapyController;