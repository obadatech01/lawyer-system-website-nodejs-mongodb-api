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

router.use(auth, allowedPermissions('sessions-permission'));

router.route('/').get(getSessions).post(createSessionValidator, createSession);
router.route('/:id').get(getSessionValidator, getSession).put(updateSessionValidator, updateSession).delete(deleteSessionValidator, deleteSession);

module.exports = router;