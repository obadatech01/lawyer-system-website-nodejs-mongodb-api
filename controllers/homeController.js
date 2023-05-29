const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const Case = require("../models/caseModel");
const Client = require("../models/clientModel");
const Session = require("../models/sessionModel");
const Payment = require("../models/paymentModel");
const Expense = require("../models/expenseModel");

// @desc Get list data in home dashboard
// @route GET /api/v1/home
// @access Private
exports.getHome = asyncHandler(async (req, res) => {
  const [clientsCounter, casesPCounter, casesNCounter, sessionsCounter, payments, expenses, lastCases, lastSessions] = await Promise.all([
    Client.countDocuments(),
    Case.countDocuments({ status: "مكتملة" }),
    Case.countDocuments({ status: "غير مكتملة" }),
    Session.countDocuments(),
    Payment.find(),
    Expense.find(),
    Case.find().sort({ _id: -1 }).limit(5), // Retrieve last 5 cases
    Session.find().sort({ _id: -1 }).limit(5), // Retrieve last 5 sessions
  ]);

  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const allPayments = lastCases.reduce((sum, caseObj) => sum + caseObj.cost, 0);
  const allExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  res.status(200).json({
    data: {
      clients: {
        name: "العملاء",
        count: clientsCounter,
      },
      casesCompleted: {
        name: "القضايا مكتملة",
        count: casesPCounter,
      },
      casesNotCompleted: {
        name: "القضايا الغير مكتملة",
        count: casesNCounter,
      },
      sessions: {
        name: "الجلسات",
        count: sessionsCounter,
      },
      payments: {
        name: "إجمالي المدفوع",
        count: totalPayments,
      },
      paymentsRemaining: {
        name: "إجمالي المتبقي",
        count: allPayments - totalPayments,
      },
      expenses: {
        name: "إجمالي المصروفات",
        count: allExpenses,
      },
      expensesRemaining: {
        name: "المصروفات المتبقية",
        count: allPayments - allExpenses,
      },
      lastCases,
      lastSessions,
    },
  });
});


