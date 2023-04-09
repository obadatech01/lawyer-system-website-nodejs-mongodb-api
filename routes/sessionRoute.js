const express = require('express');

const {
  getSession,
  getSessions,
  createSession,
  updateSession,
  deleteSession,
} = require('../controllers/sessionController');

const { auth, allowedPermissions } = require('../controllers/authController');
const { createSessionValidator, getSessionValidator, updateSessionValidator, deleteSessionValidator } = require('../utils/validators/sessionValidator');

const router = express.Router();

router.use(auth);

router.route('/').get(allowedPermissions('sessions-all'), getSessions).post(allowedPermissions('sessions-create'), createSessionValidator, createSession);
router.route('/:id').get(allowedPermissions('sessions-id'), getSessionValidator, getSession).put(allowedPermissions('sessions-update'), updateSessionValidator, updateSession).delete(allowedPermissions('sessions-delete'), deleteSessionValidator, deleteSession);

module.exports = router;