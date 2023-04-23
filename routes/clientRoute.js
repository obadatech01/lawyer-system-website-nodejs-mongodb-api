const express = require('express');

const {
  getClient,
  getClients,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

const { auth, allowedPermissions } = require('../controllers/authController');
const { createClientValidator, getClientValidator, updateClientValidator, deleteClientValidator } = require('../utils/validators/clientValidator');

const router = express.Router();

router.use(auth, allowedPermissions('clients-permission'));

router.route('/').get(getClients).post(createClientValidator, createClient);
router.route('/:id').get(getClientValidator, getClient).put(updateClientValidator, updateClient).delete(deleteClientValidator, deleteClient);

module.exports = router;