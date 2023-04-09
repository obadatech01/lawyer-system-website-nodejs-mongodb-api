const Client = require("../models/clientModel");
const factory = require("./handlersFactory");

// @desc Get list of client
// @route GET /api/v1/clients
// @access Private/admin||clients-all
exports.getClients = factory.getAll(Client, "Client");

// @desc Get specific client by id
// @route GET /api/v1/clients/:id
// @access Private/admin||clients-id
exports.getClient = factory.getOne(Client);

// @desc Create client
// @route POST /api/v1/clients
// @access Private/admin||clients-create
exports.createClient = factory.createOne(Client);

// @desc Update specific client
// @route PUT /api/v1/clients/:id
// @access Private/admin||clients-update
exports.updateClient = factory.updateOne(Client);

// @desc Delete specific Client
// @route DELETE /api/v1/clients/:id
// @access Private/admin||clients-delete
exports.deleteClient = factory.deleteOne(Client);
