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

router.route('/').get(authorizedBy("سكرتير", "محامي", "نائب المدير", "مدير"), getSessions).post(authorizedBy("سكرتير", "نائب المدير", "مدير"), createSessionValidator, createSession);
router.route('/:id').get(authorizedBy("سكرتير", "محامي", "نائب المدير", "مدير"), getSessionValidator, getSession).put(authorizedBy("سكرتير", "نائب المدير", "مدير"), updateSessionValidator, updateSession).delete(authorizedBy("نائب المدير", "مدير"), deleteSessionValidator, deleteSession);

module.exports = router;