const express = require('express');

const {
  getCase,
  getCases,
  createCase,
  updateCase,
  deleteCase,
} = require('../controllers/caseController');

const { auth, allowedPermissions } = require('../controllers/authController');
const { createCaseValidator, getCaseValidator, updateCaseValidator, deleteCaseValidator } = require('../utils/validators/caseValidator');

const router = express.Router();

router.use(auth, allowedPermissions('cases-permission'));

router.route('/').get(getCases).post(createCaseValidator, createCase);
router.route('/:id').get(getCaseValidator, getCase).put(deleteCaseValidator, deleteCase);

module.exports = router;