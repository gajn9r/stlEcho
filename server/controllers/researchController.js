const Plant = require('../models/Plant');

// Get plant research data
exports.getPlantResearch = async (req, res) => {
  try {
    const { plantId } = req.params;
    
    const plant = await Plant.findById(plantId);
    
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    
    res.json({
      botanical_name: plant.botanical_name,
      common_name: plant.common_name,
      ethnobotanical_uses: plant.ethnobotanical_uses || [],
      medicinal_properties: plant.medicinal_properties || [],
      source_research: plant.source_research || []
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants with medicinal properties
exports.getPlantsByMedicinalProperties = async (req, res) => {
  try {
    const { property } = req.params;
    
    const plants = await Plant.find({
      medicinal_properties: property
    });
    
    res.json({
      medicinal_property: property,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all distinct medicinal properties
exports.getAllMedicinalProperties = async (req, res) => {
  try {
    const properties = await Plant.distinct('medicinal_properties');
    
    const propertyData = await Promise.all(
      properties.filter(Boolean).map(async (prop) => {
        const count = await Plant.countDocuments({
          medicinal_properties: prop
        });
        return { property: prop, count };
      })
    );
    
    res.json(propertyData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plants with ethnobotanical uses
exports.getPlantsByEthnobotanicalUse = async (req, res) => {
  try {
    const { use } = req.params;
    
    const plants = await Plant.find({
      ethnobotanical_uses: use
    });
    
    res.json({
      ethnobotanical_use: use,
      count: plants.length,
      plants
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all distinct ethnobotanical uses
exports.getAllEthnobotanicalUses = async (req, res) => {
  try {
    const uses = await Plant.distinct('ethnobotanical_uses');
    
    const useData = await Promise.all(
      uses.filter(Boolean).map(async (use) => {
        const count = await Plant.countDocuments({
          ethnobotanical_uses: use
        });
        return { use, count };
      })
    );
    
    res.json(useData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get plant with full research details
exports.getPlantFullProfile = async (req, res) => {
  try {
    const { plantId } = req.params;
    
    const plant = await Plant.findById(plantId);
    
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    
    // Compile comprehensive profile
    const profile = {
      ...plant.toObject(),
      profile_sections: {
        basic_info: {
          botanical_name: plant.botanical_name,
          common_name: plant.common_name,
          plant_type: plant.plant_type,
          family: plant.family,
          description: plant.description
        },
        growing_conditions: {
          soil_type: plant.soil_type,
          height: plant.height,
          bloom_time: plant.bloom_time,
          light_requirements: plant.light_requirements
        },
        ecology: {
          pollinators: plant.pollinators,
          garden_uses: plant.garden_uses,
          environmental_impact: plant.environmental_impact
        },
        research: {
          ethnobotanical_uses: plant.ethnobotanical_uses || [],
          medicinal_properties: plant.medicinal_properties || [],
          source_research: plant.source_research || []
        }
      }
    };
    
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search research data
exports.searchResearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ message: 'Keyword query parameter required' });
    }
    
    const plants = await Plant.find({
      $or: [
        { medicinal_properties: new RegExp(keyword, 'i') },
        { ethnobotanical_uses: new RegExp(keyword, 'i') },
        { 'source_research.title': new RegExp(keyword, 'i') }
      ]
    });
    
    res.json({
      keyword,
      count: plants.length,
      plants: plants.map(p => ({
        botanical_name: p.botanical_name,
        common_name: p.common_name,
        ethnobotanical_uses: p.ethnobotanical_uses || [],
        medicinal_properties: p.medicinal_properties || [],
        source_research: p.source_research || []
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get research sources
exports.getResearchSources = async (req, res) => {
  try {
    const { plantId } = req.params;
    
    const plant = await Plant.findById(plantId);
    
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    
    res.json({
      botanical_name: plant.botanical_name,
      sources: plant.source_research || []
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Advanced filter: Get plants by research + plant type + pollinator
exports.filterByResearchAndAttributes = async (req, res) => {
  try {
    const { plantType, pollinator, soilType, light, query, family } = req.query;
    
    let filterCriteria = {};
    
    // Search query filter
    if (query && query.trim()) {
      filterCriteria.$or = [
        { botanical_name: { $regex: query, $options: 'i' } },
        { common_name: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Plant type filter
    if (plantType) {
      filterCriteria.plant_type = plantType;
    }
    
    // Pollinator filter - search in array of objects by common_name
    if (pollinator) {
      filterCriteria['pollinators.common_name'] = pollinator;
    }
    
    // Soil type filter
    if (soilType) {
      filterCriteria.soil_type = soilType;
    }
    
    // Light requirement filter (optional)
    if (light) {
      if (light === 'full_sun') {
        filterCriteria['light_requirements.full_sun'] = true;
      } else if (light === 'part_shade') {
        filterCriteria['light_requirements.part_shade'] = true;
      } else if (light === 'full_shade') {
        filterCriteria['light_requirements.full_shade'] = true;
      }
    }
    
    // Family filter
    if (family) {
      filterCriteria.family = family;
    }
    
    const plants = await Plant.find(filterCriteria);
    
    res.json({
      filters: {
        query: query || '',
        plantType: plantType || 'all',
        pollinator: pollinator || 'all',
        soilType: soilType || 'all',
        light: light || 'all',
        family: family || 'all'
      },
      count: plants.length,
      plants: plants.map(p => ({
        _id: p._id,
        botanical_name: p.botanical_name,
        common_name: p.common_name,
        plant_type: p.plant_type,
        family: p.family,
        description: p.description,
        soil_type: p.soil_type,
        height: p.height,
        bloom_time: p.bloom_time,
        pollinators: p.pollinators,
        light_requirements: p.light_requirements,
        ethnobotanical_uses: p.ethnobotanical_uses || [],
        medicinal_properties: p.medicinal_properties || []
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
