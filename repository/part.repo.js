const Part = require('nugttah-backend/modules/parts');
module.exports = class PartRepository {
    static async getAllParts(creationDate, selectionList) {
        return await Part.Model
            .find({
                directOrderId: { $exists: true },
                createdAt: { $gt: creationDate },
                partClass: 'requestPart',
                pricedAt: { $exists: true },
                invoiceId: { $exists: false }
            }).select(selectionList.join(' '))
            .catch(e => { throw e; })
    }

    static async invoicePart(ids, invoiceId) {
        return await Part.Model.updateMany({ '_id': { $in: ids } }, { $set: { invoiceId: invoiceId } }).catch(e => {
            throw e;
        })
    }
}