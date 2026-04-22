const Plant = require('../models/Plant');

// Get plants by specific pollinator
exports.getPlantsByPollinator = async (req, res) => {
  try {
    const { pollinator } = req.params;
    
    const plants = await Plant.find({ 'pollinators.common_name': pollinator });
    res.json({
      pollinator,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all available pollinators with scientific information
exports.getAllPollinators = async (req, res) => {
  try {
    const pollinators = await Plant.aggregate([
      { $unwind: '$pollinators' },
      { $group: {
          _id: '$pollinators.common_name',
          scientific_order: { $first: '$pollinators.scientific_order' },
          family: { $first: '$pollinators.family' },
          description: { $first: '$pollinators.description' },
          plant_count: { $sum: 1 }
        }
      },
      { $sort: { plant_count: -1 } }
    ]);
    
    res.json(pollinators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants that attract multiple pollinators
exports.getPlantsByMultiplePollinators = async (req, res) => {
  try {
    const { pollinators } = req.query;
    
    if (!pollinators) {
      return res.status(400).json({ message: 'Pollinators query parameter required' });
    }
    
    const pollinatorList = Array.isArray(pollinators) ? pollinators : [pollinators];
    
    const plants = await Plant.find({
      'pollinators.common_name': { $in: pollinatorList }
    });
    
    res.json({
      requestedPollinators: pollinatorList,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get keystone wildlife plants
exports.getKeystoneWildlifePlants = async (req, res) => {
  try {
    const plants = await Plant.find({ 'garden_uses.wildlife_keystone': true });
    res.json({
      type: 'keystone wildlife plants',
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get butterfly garden plants
exports.getButterflyGardenPlants = async (req, res) => {
  try {
    const plants = await Plant.find({ 'garden_uses.butterfly_garden': true });
    res.json({
      type: 'butterfly garden plants',
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
