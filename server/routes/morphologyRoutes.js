const express = require('express');
const router = express.Router();
const morphologyController = require('../controllers/morphologyController');

// Morphology routes
router.get('/flower-colors', morphologyController.getAllFlowerColors);
router.get('/flower-color/:color', morphologyController.getPlantsByFlowerColor);
router.get('/leaf-type/:leafType', morphologyController.getPlantsByLeafType);
router.get('/growth-habit/:habit', morphologyController.getPlantsByGrowthHabit);
router.get('/root-system/:rootType', morphologyController.getPlantsByRootSystem);
router.get('/bloom-time/:bloomTime', morphologyController.getPlantsByBloomTime);
router.get('/similar/:plantId', morphologyController.getSimilarPlants);

module.exports = router;
