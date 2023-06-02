// Routes
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const clientRoute = require('./clientRoute');
const expenseRoute = require('./expenseRoute');
const caseRoute = require('./caseRoute');
const paymentRoute = require('./paymentRoute');
const documentRoute = require('./documentRoute');
const sessionRoute = require('./sessionRoute');
const homeRoute = require('./homeRoute');

const mountRoutes = (app) => {
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/clients', clientRoute);
  app.use('/api/v1/expenses', expenseRoute);
  app.use('/api/v1/cases', caseRoute);
  app.use('/api/v1/payments', paymentRoute);
  app.use('/api/v1/documents', documentRoute);
  app.use('/api/v1/sessions', sessionRoute);
  app.use('/api/v1/home', homeRoute);
};

module.exports = mountRoutes;