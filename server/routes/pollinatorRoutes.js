const express = require('express');
const router = express.Router();
const pollinatorController = require('../controllers/pollinatorController');

// Pollinator routes
router.get('/', pollinatorController.getAllPollinators);
router.get('/type/:pollinator', pollinatorController.getPlantsByPollinator);
router.get('/multiple', pollinatorController.getPlantsByMultiplePollinators);
router.get('/keystone-wildlife', pollinatorController.getKeystoneWildlifePlants);
router.get('/butterfly-garden', pollinatorController.getButterflyGardenPlants);

module.exports = router;
