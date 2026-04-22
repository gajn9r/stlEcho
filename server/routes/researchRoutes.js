const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController');

// Advanced filtering route
router.get('/filter', researchController.filterByResearchAndAttributes);

// Research routes
router.get('/search', researchController.searchResearch);
router.get('/medicinal-properties', researchController.getAllMedicinalProperties);
router.get('/medicinal-properties/:property', researchController.getPlantsByMedicinalProperties);
router.get('/ethnobotanical-uses', researchController.getAllEthnobotanicalUses);
router.get('/ethnobotanical-uses/:use', researchController.getPlantsByEthnobotanicalUse);
router.get('/sources/:plantId', researchController.getResearchSources);
router.get('/profile/:plantId', researchController.getPlantFullProfile);
router.get('/:plantId', researchController.getPlantResearch);

module.exports = router;
