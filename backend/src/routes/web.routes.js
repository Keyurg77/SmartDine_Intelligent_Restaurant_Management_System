const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/home', {
    pageTitle: 'Fresh restaurant ordering made simple',
  });
});

router.get('/health', (req, res) => {
  res.status(200).send('SmartDine is running');
});

module.exports = router;
