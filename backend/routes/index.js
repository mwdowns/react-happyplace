const express = require('express'),
pgp = require('pg-promise')(),
router = express.Router(),
dotenv = require('dotenv').config();
db = pgp();    


module.exports = router;