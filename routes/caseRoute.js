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

router.route('/').get(getCases).post(authorizedBy("محامي", "مدير"), createCaseValidator, createCase);
router.route('/:id').get(getCaseValidator, getCase).put(authorizedBy("مدير"), updateCaseValidator, updateCase).delete(authorizedBy("مدير"), deleteCaseValidator, deleteCase);

module.exports = router;