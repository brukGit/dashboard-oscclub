const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

router.get('/test', dataController.testData);
router.get('/fetch', dataController.fetchWorldBankData);


module.exports = router;