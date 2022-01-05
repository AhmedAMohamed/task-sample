const InvoceService = require('../service/invoice.service');
const RequestService = require('../service/request.service');
module.exports = class TaskRunner {
    static async run(date) {
        const directOrderPartsGroups = await RequestService.getRequestsByDate(date).catch(e => {
            throw e;
        })
        return await InvoceService.createInvoice(directOrderPartsGroups).catch(e => {
            throw e;
        })
    }
}