const Session = require("../models/sessionModel");
const factory = require("./handlersFactory");

// @desc Get list of sessions
// @route GET /api/v1/sessions
// @access Protect/auth
exports.getSessions = factory.getAll(Session, "Session");

// @desc Get specific session by id
// @route GET /api/v1/sessions/:id
// @access Protect/auth
exports.getSession = factory.getOne(Session);

// @desc Create session
// @route POST /api/v1/sessions
// @access Protect/auth
exports.createSession = factory.createOne(Session);

// @desc Update specific session
// @route PUT /api/v1/sessions/:id
// @access Protect/auth
exports.updateSession = factory.updateOne(Session);

// @desc Delete specific session
// @route DELETE /api/v1/sessions/:id
// @access Private/admin
exports.deleteSession = factory.deleteOne(Session);
