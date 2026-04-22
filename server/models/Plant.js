const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  botanical_name: {
    type: String,
    required: true,
    unique: true
  },
  common_name: {
    type: String,
    required: true
  },
  plant_type: {
    type: String,
    enum: ['Forb', 'Shrub', 'Grass', 'Vine', 'Tree', 'Fern'],
    required: true
  },
  family: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  url: String,
  
  // Growing Conditions
  soil_type: {
    type: String,
    enum: ['dry', 'moist', 'wet']
  },
  height: String,
  bloom_time: String,
  
  // Light Requirements (optional)
  light_requirements: {
    full_sun: Boolean,
    part_shade: Boolean,
    full_shade: Boolean
  },
  
  // Garden Uses (optional)
  garden_uses: {
    rain_garden_wet: Boolean,
    rain_garden_dry: Boolean,
    bioswale: Boolean,
    butterfly_garden: Boolean,
    wildlife_keystone: Boolean,
    ground_cover: Boolean
  },
  
  // Ecological Properties - Pollinators with Scientific Information
  pollinators: [{
    common_name: String,
    scientific_order: String,
    family: String,
    description: String
  }],
  
  // Research Data (flattened from nested structure)
  ethnobotanical_uses: [String],
  medicinal_properties: [String],
  source_research: [{
    title: String,
    url: String
  }],
  
  morphological_traits: {
    flower_color: [String],
    leaf_type: String,
    growth_habit: String,
    root_system: String
  },
  
  environmental_impact: {
    native_range: String,
    conservation_status: String,
    conservation_need: Boolean,
    ecological_importance: String,
    water_conservation: Boolean,
    pollinator_value: String
  }
}, {
  timestamps: true
});

// Update timestamp on save
plantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Plant', plantSchema);
