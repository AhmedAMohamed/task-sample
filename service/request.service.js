const DirectOrderPartRepo = require('../repository/order-part.repo');
const PartRepo = require('../repository/part.repo');
const Helpers = require('nugttah-backend/helpers');

module.exports = class RequestService {

    static async getRequestsByDate(creationDate) {
        const directPartsColumnList = ['_id', 'directOrderId', 'partClass', 'priceBeforeDiscount'];
        const partsColumnList = ['_id', 'directOrderId', 'partClass', 'premiumPriceBeforeDiscount'];
        let [directParts, allParts] = await Promise.all([
            DirectOrderPartRepo.getDirectOrderPartByCreationDateAndHasInvoiceIdAndCompletionDate(creationDate, directPartsColumnList),
            PartRepo.getAllParts(creationDate, partsColumnList)
        ]).catch(e => {
            throw e;
        });

        const allParts = allParts.concat(directParts);
        return Helpers.groupBy(allParts, 'directOrderId');
    }
}