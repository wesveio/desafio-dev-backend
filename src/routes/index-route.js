'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).send({
    title: "Goomer Desafio Dev Back-end"
  });
});

module.exports = router;