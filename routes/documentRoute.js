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

router.route('/').get(authorizedBy("سكرتير", "محامي", "نائب المدير", "مدير"), getDocuments).post(authorizedBy("سكرتير", "نائب المدير", "مدير"), createDocumentValidator, upload.single('document'), createDocument);
router.route('/:id').get(authorizedBy("سكرتير", "محامي", "نائب المدير", "مدير"), getDocumentValidator, getDocument).put(authorizedBy("سكرتير", "نائب المدير", "مدير"), updateDocumentValidator, upload.single('document'), updateDocument).delete(authorizedBy("نائب المدير", "مدير"), deleteDocumentValidator, deleteDocument);

module.exports = router;