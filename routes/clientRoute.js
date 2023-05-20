const express = require('express');

const {
  getClient,
  getClients,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

const { auth, authorizedBy } = require('../controllers/authController');
const { createClientValidator, getClientValidator, updateClientValidator, deleteClientValidator } = require('../utils/validators/clientValidator');

const router = express.Router();

router.use(auth);

router.route('/').get(authorizedBy("محاسب", "سكرتير", "محامي", "نائب المدير", "مدير"), getClients).post(authorizedBy("نائب المدير", "مدير"), createClientValidator, createClient);
router.route('/:id').get(authorizedBy("سكرتير", "محامي", "نائب المدير", "مدير"), getClientValidator, getClient).put(authorizedBy("نائب المدير", "مدير"), updateClientValidator, updateClient).delete(authorizedBy("نائب المدير", "مدير"), deleteClientValidator, deleteClient);

module.exports = router;