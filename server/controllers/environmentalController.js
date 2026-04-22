const Plant = require('../models/Plant');

// Get plants needing conservation
exports.getConservationPriority = async (req, res) => {
  try {
    const plants = await Plant.find({
      'environmental_impact.conservation_need': true
    });
    
    res.json({
      type: 'conservation priority plants',
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get water conservation plants
exports.getWaterConservationPlants = async (req, res) => {
  try {
    const plants = await Plant.find({
      'environmental_impact.water_conservation': true
    });
    
    res.json({
      type: 'water conservation plants',
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pollinator value rating
exports.getPlantsByPollinatorValue = async (req, res) => {
  try {
    const { rating } = req.params;
    
    const plants = await Plant.find({
      'environmental_impact.pollinator_value': rating
    });
    
    res.json({
      pollinator_value: rating,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants by ecological importance
exports.getPlantsByEcologicalImportance = async (req, res) => {
  try {
    const { importance } = req.params;
    
    const plants = await Plant.find({
      'environmental_impact.ecological_importance': importance
    });
    
    res.json({
      ecological_importance: importance,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants by conservation status
exports.getPlantsByConservationStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const plants = await Plant.find({
      'environmental_impact.conservation_status': status
    });
    
    res.json({
      conservation_status: status,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all distinct ecological importances
exports.getAllEcologicalImportances = async (req, res) => {
  try {
    const importances = await Plant.distinct('environmental_impact.ecological_importance');
    
    const importanceData = await Promise.all(
      importances.filter(Boolean).map(async (imp) => {
        const count = await Plant.countDocuments({
          'environmental_impact.ecological_importance': imp
        });
        return { importance: imp, count };
      })
    );
    
    res.json(importanceData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get environmental impact summary for a plant
exports.getEnvironmentalImpactSummary = async (req, res) => {
  try {
    const { plantId } = req.params;
    
    const plant = await Plant.findById(plantId);
    
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    
    res.json({
      botanical_name: plant.botanical_name,
      common_name: plant.common_name,
      environmental_impact: plant.environmental_impact
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants by native range
exports.getPlantsByNativeRange = async (req, res) => {
  try {
    const { range } = req.params;
    
    const plants = await Plant.find({
      'environmental_impact.native_range': new RegExp(range, 'i')
    });
    
    res.json({
      native_range: range,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get habitat suitability filter (rain garden, bioswale, etc.)
exports.getPlantsByHabitatUse = async (req, res) => {
  try {
    const { use } = req.params;
    
    const validUses = ['rain_garden_wet', 'rain_garden_dry', 'bioswale', 'butterfly_garden', 'wildlife_keystone', 'ground_cover'];
    
    if (!validUses.includes(use)) {
      return res.status(400).json({
        message: `Invalid habitat use. Valid options: ${validUses.join(', ')}`
      });
    }
    
    const searchCriteria = {};
    searchCriteria[`garden_uses.${use}`] = true;
    
    const plants = await Plant.find(searchCriteria);
    
    res.json({
      habitat_use: use,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
