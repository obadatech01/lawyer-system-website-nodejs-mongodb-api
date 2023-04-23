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

router.use(auth, allowedPermissions('documents-permission'));

router.route('/').get(getDocuments).post(createDocumentValidator, upload.single('document'), createDocument);
router.route('/:id').get(getDocumentValidator, getDocument).put(updateDocumentValidator, upload.single('document'), updateDocument).delete(deleteDocumentValidator, deleteDocument);

module.exports = router;