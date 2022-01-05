const DirectOrder = require('nugttah-backend/modules/direct.orders');
module.exports = class OrderPartRepository {
    static async findById(id, selectionList) {
        await DirectOrder.Model.findOne({ _id: allDirectOrderParts[0].directOrderId }).select('partsIds requestPartsIds discountAmount deliveryFees walletPaymentAmount');
        return await DirectOrder.Model.findOne({ _id: id }).select(selectionList.join(' ')).catch(e => {
            throw e
        })
    }

    static async invoiceOrder(id, invoiceId) {
        await DirectOrder.Model.updateOne({ _id: id }, { $addToSet: { invoicesIds: invoiceId } });

    }
}