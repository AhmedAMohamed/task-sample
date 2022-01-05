const DirectOrderPart = require('nugttah-backend/modules/direct.order.parts');
module.exports = class OrderPartRepository {
    static async getDirectOrderPartByCreationDateAndHasInvoiceIdAndCompletionDate(creationDate, selectionList) {
        return await DirectOrderPart.Model.find({
            createdAt: { $gt: creationDate },
            fulfillmentCompletedAt: { $exists: true },
            invoiceId: { $exists: false }
        }).select(selectionList.join(' ')).catch(e => {
            throw e;
        })
    }

    static async findById(id, selectionList) {
        await DirectOrder.Model.findOne({ _id: allDirectOrderParts[0].directOrderId }).select('partsIds requestPartsIds discountAmount deliveryFees walletPaymentAmount');
        return await DirectOrder.Model.findOne({ _id: id }).select(selectionList.join(' ')).catch(e => {
            throw e
        })
    }

    static async invoicePart(ids, invoiceId) {
        return await DirectOrderPart.Model.updateMany({ '_id': { $in: ids } }, { $set: { invoiceId: invoiceId } }).catch(e => {
            throw e;
        })
    }
}