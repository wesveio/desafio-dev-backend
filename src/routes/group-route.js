'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/group-controller');

router.get('/', controller.get);
router.get('/:slug', controller.getBySlug);
router.get('/id/:id', controller.getById);
router.post('/', controller.post);
router.put('/:id', controller.put);
router.put('/remove/user', controller.removeUserFromGroup);
router.delete('/', controller.delete);

module.exports = router;