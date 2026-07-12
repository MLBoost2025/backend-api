const express = require('express');
const router = express.Router();
const learnController = require('../controllers/learn.controller');

router.get('/tracks', learnController.getTracks);

module.exports = router;
