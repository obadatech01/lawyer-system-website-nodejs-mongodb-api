const express = require('express');

const {
  getDocument,
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} = require('../controllers/documentController');

const { auth, authorizedBy } = require('../controllers/authController');

const upload = require('./S3');
const { createDocumentValidator, getDocumentValidator, updateDocumentValidator, deleteDocumentValidator } = require('../utils/validators/documentValidator');

const router = express.Router();


router.use(auth);

router.route('/').get(getDocuments).post(authorizedBy("محامي", "مدير"), upload.single('document'), createDocumentValidator, createDocument);
router.route('/:id').get(getDocumentValidator, getDocument).put(authorizedBy("محامي", "مدير"), upload.single('document'), updateDocumentValidator, updateDocument).delete(authorizedBy("محامي", "مدير"), deleteDocumentValidator, deleteDocument);

module.exports = router;