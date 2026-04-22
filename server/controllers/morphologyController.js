const Plant = require('../models/Plant');

// Get plants by flower color
exports.getPlantsByFlowerColor = async (req, res) => {
  try {
    const { color } = req.params;
    
    const plants = await Plant.find({
      'morphological_traits.flower_color': color
    });
    
    res.json({
      flower_color: color,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all available flower colors
exports.getAllFlowerColors = async (req, res) => {
  try {
    const colors = await Plant.distinct('morphological_traits.flower_color');
    
    // Get counts for each color
    const colorData = await Promise.all(
      colors.map(async (color) => {
        const count = await Plant.countDocuments({
          'morphological_traits.flower_color': color
        });
        return { color, count };
      })
    );
    
    res.json(colorData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants by leaf type
exports.getPlantsByLeafType = async (req, res) => {
  try {
    const { leafType } = req.params;
    
    const plants = await Plant.find({
      'morphological_traits.leaf_type': leafType
    });
    
    res.json({
      leaf_type: leafType,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants by growth habit
exports.getPlantsByGrowthHabit = async (req, res) => {
  try {
    const { habit } = req.params;
    
    const plants = await Plant.find({
      'morphological_traits.growth_habit': habit
    });
    
    res.json({
      growth_habit: habit,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants with specific root system
exports.getPlantsByRootSystem = async (req, res) => {
  try {
    const { rootType } = req.params;
    
    const plants = await Plant.find({
      'morphological_traits.root_system': rootType
    });
    
    res.json({
      root_system: rootType,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get similar plants based on morphology
exports.getSimilarPlants = async (req, res) => {
  try {
    const { plantId } = req.params;
    const { similarity_threshold } = req.query;
    
    const targetPlant = await Plant.findById(plantId);
    
    if (!targetPlant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    
    // Find plants with similar characteristics
    const similarPlants = await Plant.find({
      _id: { $ne: plantId },
      $or: [
        { 'morphological_traits.flower_color': { $in: targetPlant.morphological_traits.flower_color || [] } },
        { 'morphological_traits.leaf_type': targetPlant.morphological_traits.leaf_type },
        { 'morphological_traits.growth_habit': targetPlant.morphological_traits.growth_habit },
        { plant_type: targetPlant.plant_type }
      ]
    });
    
    res.json({
      target_plant: targetPlant.botanical_name,
      similar_count: similarPlants.length,
      similar_plants: similarPlants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants with same bloom time
exports.getPlantsByBloomTime = async (req, res) => {
  try {
    const { bloomTime } = req.params;
    
    const plants = await Plant.find({
      bloom_time: new RegExp(bloomTime, 'i')
    });
    
    res.json({
      bloom_time: bloomTime,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
