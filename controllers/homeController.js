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
  const [clientsCounter, casesCounter, sessionsCounter, cases, payments, expenses, lastCases, lastSessions] = await Promise.all([
    Client.countDocuments(),
    Case.countDocuments(),
    Session.countDocuments(),
    Case.find(),
    Payment.find(),
    Expense.find(),
    Case.find().sort({ _id: -1 }).limit(5), // Retrieve last 5 cases
    Session.find().sort({ _id: -1 }).limit(5), // Retrieve last 5 sessions
  ]);

  const totalContracts = cases.reduce((sum, currentCase) => sum + currentCase.cost, 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const allExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  res.status(200).json({
    data: {
      clients: {
        name: "العملاء",
        count: clientsCounter,
      },
      cases: {
        name: "القضايا",
        count: casesCounter,
      },
      sessions: {
        name: "الجلسات",
        count: sessionsCounter,
      },
      totalContracts: {
        name: "إجمالي العقود",
        count: totalContracts,
      },
      payments: {
        name: "إجمالي المدفوع",
        count: totalPayments,
      },
      paymentsRemaining: {
        name: "إجمالي المتبقي",
        count: totalContracts - totalPayments,
      },
      expenses: {
        name: "إجمالي المصروفات",
        count: allExpenses,
      },
      expensesRemaining: {
        name: "المصروفات المتبقية",
        count: totalContracts - allExpenses,
      },
      lastCases,
      lastSessions,
    },
  });
});

// @desc Get list data in home dashboard
// @route GET /api/v1/home/report
// @access Private
exports.getReport = asyncHandler(async (req, res) => {
  const [cases, payments, expenses] = await Promise.all([
    Case.find(),
    Payment.find(),
    Expense.find(),
  ]);

  const totalContracts = cases.reduce((sum, currentCase) => sum + currentCase.cost, 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const allExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  res.status(200).json({
    data: {
      // cases: cases,
      totalContracts: {
        name: "إجمالي العقود",
        count: totalContracts,
      },
      payments: {
        name: "إجمالي المدفوع",
        count: totalPayments,
      },
      paymentsRemaining: {
        name: "إجمالي المتبقي",
        count: totalContracts - totalPayments,
      },
      expenses: {
        name: "إجمالي المصروفات",
        count: allExpenses,
      },
      expensesRemaining: {
        name: "المصروفات المتبقية",
        count: totalContracts - allExpenses,
      }
    },
  });
});


