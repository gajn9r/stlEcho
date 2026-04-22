const express = require('express');
const router = express.Router();
const environmentalController = require('../controllers/environmentalController');

// Environmental routes
router.get('/conservation-priority', environmentalController.getConservationPriority);
router.get('/water-conservation', environmentalController.getWaterConservationPlants);
router.get('/pollinator-value/:rating', environmentalController.getPlantsByPollinatorValue);
router.get('/ecological-importance', environmentalController.getAllEcologicalImportances);
router.get('/ecological-importance/:importance', environmentalController.getPlantsByEcologicalImportance);
router.get('/conservation-status/:status', environmentalController.getPlantsByConservationStatus);
router.get('/native-range/:range', environmentalController.getPlantsByNativeRange);
router.get('/habitat-use/:use', environmentalController.getPlantsByHabitatUse);
router.get('/impact-summary/:plantId', environmentalController.getEnvironmentalImpactSummary);

module.exports = router;
