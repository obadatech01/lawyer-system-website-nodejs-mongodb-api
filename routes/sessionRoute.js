const express = require('express');

const {
  getSession,
  getSessions,
  createSession,
  updateSession,
  deleteSession,
} = require('../controllers/sessionController');

const { auth, authorizedBy } = require('../controllers/authController');
const { createSessionValidator, getSessionValidator, updateSessionValidator, deleteSessionValidator } = require('../utils/validators/sessionValidator');

const router = express.Router();


router.use(auth);

router.route('/').get(getSessions).post(authorizedBy("سكرتير", "محامي", "مدير"), createSessionValidator, createSession);
router.route('/:id').get(getSessionValidator, getSession).put(authorizedBy("سكرتير", "محامي", "مدير"), updateSessionValidator, updateSession).delete(authorizedBy("محامي", "مدير"), deleteSessionValidator, deleteSession);

module.exports = router;