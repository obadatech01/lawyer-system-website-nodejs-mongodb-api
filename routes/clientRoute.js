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

router.use(auth);

router.route('/').get(allowedPermissions('clients-all'), getClients).post(allowedPermissions('clients-create'), createClientValidator, createClient);
router.route('/:id').get(allowedPermissions('clients-id'), getClientValidator, getClient).put(allowedPermissions('clients-update'), updateClientValidator, updateClient).delete(allowedPermissions('clients-delete'), deleteClientValidator, deleteClient);

module.exports = router;