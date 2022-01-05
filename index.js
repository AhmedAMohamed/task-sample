// The code snippet below is functional, but is made ugly on purpose
// Please refactor it to a state you'd be satisfied with and send back the refactored code
const startCronJob = require('nugttah-backend/helpers/start.cron.job');
const TaskRunner = require('./controller')
const Helpers = require('nugttah-backend/helpers');

const createInvoceTask = async () => {
  try {
    const creationDate = new Date('2021-04-01');
    const invoices = await TaskRunner.run(creationDate).catch(e => {
      throw e;
    });
    return { case: 1, message: 'invoices created successfully.', invoicesIds: invoices };
  } catch (err) {
    Helpers.reportError(err);
  }
}

startCronJob('*/1 * * * *', createInvoceTask, true); // at 00:00 every day

module.exports = createInvoceTask;