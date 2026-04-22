const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

// Plant routes
router.get('/', plantController.getAllPlants);
router.get('/paginated', plantController.getPlantsWithPagination);
router.get('/search', plantController.searchPlants);
router.get('/soil-type/:soilType', plantController.getPlantsBySoilType);
router.get('/botanical-name/:name', plantController.getPlantByBotanicalName);
router.get('/:id', plantController.getPlantById);

router.post('/', plantController.createPlant);
router.put('/:id', plantController.updatePlant);
router.delete('/:id', plantController.deletePlant);

module.exports = router;
