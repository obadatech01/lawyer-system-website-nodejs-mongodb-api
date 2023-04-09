const express = require('express');

const {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} = require('../controllers/documentController');

const { auth, allowedPermissions } = require('../controllers/authController');

const upload = require('./S3');
const { createDocumentValidator, getDocumentValidator, updateDocumentValidator, deleteDocumentValidator } = require('../utils/validators/documentValidator');

const router = express.Router();

router.use(auth);

router.route('/').get(allowedPermissions('documents-all'), getDocuments).post(allowedPermissions('documents-create'), createDocumentValidator, upload.single('document'), createDocument);
router.route('/:id').get(allowedPermissions('documents-id'), getDocumentValidator, getDocument).put(allowedPermissions('documents-update'), updateDocumentValidator, upload.single('document'), updateDocument).delete(allowedPermissions('documents-delete'), deleteDocumentValidator, deleteDocument);

module.exports = router;