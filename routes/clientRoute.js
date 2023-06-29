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

router.route('/').get(getClients).post(authorizedBy("محامي", "مدير"), createClientValidator, createClient);
router.route('/:id').get(getClientValidator, getClient).put(authorizedBy("مدير"), updateClientValidator, updateClient).delete(authorizedBy("مدير"), deleteClientValidator, deleteClient);

module.exports = router;