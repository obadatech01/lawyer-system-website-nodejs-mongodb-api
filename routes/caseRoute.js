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

router.use(auth);

router.route('/').get(allowedPermissions('cases-all'), getCases).post(allowedPermissions('cases-create'), createCaseValidator, createCase);
router.route('/:id').get(allowedPermissions('cases-id'), getCaseValidator, getCase).put(allowedPermissions('cases-update'), updateCaseValidator, updateCase).delete(allowedPermissions('cases-delete'), deleteCaseValidator, deleteCase);

module.exports = router;