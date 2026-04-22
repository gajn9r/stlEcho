const Plant = require('../models/Plant');

// Get all plants
exports.getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single plant by ID
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plant by botanical name
exports.getPlantByBotanicalName = async (req, res) => {
  try {
    const plant = await Plant.findOne({ botanical_name: req.params.name });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search plants
exports.searchPlants = async (req, res) => {
  try {
    const { query, plant_type, soil_type, light, pollinator, family } = req.query;
    
    let searchCriteria = {};
    
    if (query) {
      searchCriteria.$or = [
        { botanical_name: new RegExp(query, 'i') },
        { common_name: new RegExp(query, 'i') }
      ];
    }
    
    if (plant_type) searchCriteria.plant_type = plant_type;
    
    if (soil_type) searchCriteria.soil_type = soil_type;
    
    if (light) {
      const lightKey = `light_requirements.${light}`;
      searchCriteria[lightKey] = true;
    }
    
    if (pollinator) {
      searchCriteria['pollinators.common_name'] = pollinator;
    }
    
    if (family) {
      searchCriteria.family = family;
    }
    
    const plants = await Plant.find(searchCriteria);
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants by soil type
exports.getPlantsBySoilType = async (req, res) => {
  try {
    const plants = await Plant.find({ soil_type: req.params.soilType });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create plant
exports.createPlant = async (req, res) => {
  const plant = new Plant(req.body);
  
  try {
    const newPlant = await plant.save();
    res.status(201).json(newPlant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update plant
exports.updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    
    Object.assign(plant, req.body);
    const updatedPlant = await plant.save();
    res.json(updatedPlant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete plant
exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json({ message: 'Plant deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants with pagination
exports.getPlantsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const plants = await Plant.find().skip(skip).limit(limit);
    const total = await Plant.countDocuments();
    
    res.json({
      plants,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
