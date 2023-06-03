const asyncHandler = require("express-async-handler");
const Document = require("../models/documentModel");
const factory = require("./handlersFactory");

// @desc Get list of documents
// @route GET /api/v1/documents
// @access Protect/auth
exports.getDocuments = factory.getAll(Document, "Document");

// @desc Get specific document by id
// @route GET /api/v1/documents/:id
// @access Protect/auth
exports.getDocument = factory.getOne(Document);

// @desc Create document
// @route POST /api/v1/documents
// @access Protect/auth
exports.createDocument = asyncHandler(async (req, res) => {
  const body = req.body;
  console.log(req.file.location);
  body.document = req.file.location;
  body.createdBy = req.user._id;
  const document = await Document.create(body);
  res.status(201).json({ data: document });
});

// @desc Update specific document
// @route PUT /api/v1/documents/:id
// @access Protect/auth
exports.updateDocument = asyncHandler(async (req, res, next) => {
  const body = req.body;
  req.file.location ? (body.document = req.file.location) : null;
  body.updatedBy = res.user._id;
  if (body.document) {
    body.document = req.file.location;
  }

  const document = await Document.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  if (!document)
    return next(
      new ApiError(`No document for this id ${req.params.id}`, 404)
    );

  // Trigger "save" event when update document
  document.save();
  res.status(200).json({ data: document });
});

// @desc Delete specific document
// @route DELETE /api/v1/documents/:id
// @access Private/admin
exports.deleteDocument = factory.deleteOne(Document);
