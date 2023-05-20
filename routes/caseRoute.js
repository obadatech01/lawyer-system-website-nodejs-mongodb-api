const express = require('express');

const {
  getCase,
  getCases,
  createCase,
  updateCase,
  deleteCase,
} = require('../controllers/caseController');

const { auth, authorizedBy } = require('../controllers/authController');
const { createCaseValidator, getCaseValidator, updateCaseValidator, deleteCaseValidator } = require('../utils/validators/caseValidator');

const router = express.Router();

router.use(auth);

router.route('/').get(authorizedBy("محاسب", "سكرتير", "محامي", "نائب المدير", "مدير"), getCases).post(authorizedBy("نائب المدير", "مدير"), createCaseValidator, createCase);
router.route('/:id').get(authorizedBy("سكرتير", "محامي", "نائب المدير", "مدير"), getCaseValidator, getCase).put(authorizedBy("نائب المدير", "مدير"), updateCaseValidator, updateCase).delete(authorizedBy("نائب المدير", "مدير"), deleteCaseValidator, deleteCase);

module.exports = router;