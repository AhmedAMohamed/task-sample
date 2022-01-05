const Invoice = require('nugttah-backend/modules/invoices');
module.exports = class PartRepository {
    static async findByDirectOrderId(id, selectionList) {
        return await Invoice.Model.find({ directOrderId: id })
            .select(selectionList.join(' '))
            .catch(e => { throw e; })
    }

    static async createInvoice(directOrderId, directOrderPartsIds, requestPartsIds, totalPartsAmount, totalAmount, deliveryFees, walletPaymentAmount, discountAmount) {
        return await Invoice.Model.create({
            directOrderId,
            directOrderPartsIds,
            requestPartsIds,
            totalPartsAmount,
            totalAmount,
            deliveryFees,
            walletPaymentAmount,
            discountAmount
        }).catch(e => {
            throw e;
        })

    }
}