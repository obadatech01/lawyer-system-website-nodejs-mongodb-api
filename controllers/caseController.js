const Case = require("../models/caseModel");
const factory = require("./handlersFactory");

// @desc Get list of cases
// @route GET /api/v1/cases
// @access Private/admin||cases-all
exports.getCases = factory.getAll(Case, "Case");

// @desc Get specific case by id
// @route GET /api/v1/cases/:id
// @access Private/admin||cases-id
exports.getCase = factory.getOne(Case);

// @desc Create case
// @route POST /api/v1/cases
// @access Private/admin||cases-create
exports.createCase = factory.createOne(Case);

// @desc Update specific case
// @route PUT /api/v1/cases/:id
// @access Private/admin||cases-update
exports.updateCase = factory.updateOne(Case);

// @desc Delete specific case
// @route DELETE /api/v1/cases/:id
// @access Private/admin||cases-delete
exports.deleteCase = factory.deleteOne(Case);
