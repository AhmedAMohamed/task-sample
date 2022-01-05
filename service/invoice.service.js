const DirectOrderRepo = require('../repository/order.repo');
const DirectOrderPartRepo = require('../repository/order-part.repo');
const InvoiceRepo = require('../repository/invoice.repo');
const PartRepo = require('../repository/part.repo');
module.exports = class InvoceService {
    static async createInvoice(groupedParts) {
        return await Promise.all(groupedParts.map(async allDirectOrderParts => {
            const directOrder = await DirectOrderRepo.findById(allDirectOrderParts[0].directOrderId,
                ['partsIds', 'requestPartsIds', 'discountAmount', 'deliveryFees', 'walletPaymentAmount']).catch(e => {
                    throw e;
                });
            const invoices = await InvoiceRepo.findByDirectOrderId(allDirectOrderParts[0].directOrderId,
                ['walletPaymentAmount', 'discountAmount', 'deliveryFees']).catch(e => {
                    throw e;
                });
            const directOrderParts = allDirectOrderParts.filter(directOrderPart => ['StockPart', 'QuotaPart'].some(partClass => partClass === directOrderPart.partClass))
            const directPartPrice = directOrderParts.reduce((sum, part) => sum + part.priceBeforeDiscount, 0);
            const directPartIds = directOrderParts.map(part => part._id);

            const requestParts = allDirectOrderParts.filter(part => part.partClass === 'requestPart');
            const requestPartPrice = requestParts.reduce((sum, part) => sum + part.premiumPriceBeforeDiscount, 0);
            const requestPartIds = requestParts.map(part => part._id);

            const totalPrice = Helpers.Numbers.toFixedNumber(requestPartPrice + directPartPrice);

            const { deliveryFees, walletPaymentAmount: walletPaymentAmountOriginal, discountAmount: discountAmountOriginal } = directOrder;

            const { totalAmount, discountAmount, walletPaymentAmount } = InvoceService._calculateWalletPaymentAndDiscount(invoices, walletPaymentAmountOriginal, discountAmountOriginal, totalPrice);
            if (totalAmount < 0) {
                throw Error(`Could not create invoice for directOrder: ${directOrder._id} with totalAmount: ${totalAmount}. `);
            }
            const invoice = await InvoiceRepo.createInvoice(directOrder._id, directPartIds, requestPartIds, totalPrice, totalAmount, deliveryFees, walletPaymentAmount, discountAmount).catch(e => {
                throw e;
            });
            await Promise.all([
                DirectOrderRepo.invoiceOrder(directOrder._id, invoice._id),
                DirectOrderPartRepo.invoicePart(directPartIds, invoice._id),
                PartRepo.invoicePart(requestPartIds, invoice._id)
            ]).catch(e => {
                throw e;
            });
            return invoice._id;
        }))
    }

    static _calculateWalletPaymentAndDiscount(invoices, walletPaymentAmount, discountAmount, totalPrice) {
        let totalAmount = totalPrice;
        if (directOrder.deliveryFees && invoices.length === 0) {
            totalAmount += directOrder.deliveryFees;
        }
        if (walletPaymentAmount) {
            invoices.forEach(invo => {
                walletPaymentAmount = Math.min(0, walletPaymentAmount - invo.walletPaymentAmount);
            });
            walletPaymentAmount = Math.min(walletPaymentAmount, totalAmount);
            totalAmount -= walletPaymentAmount;
        }

        if (discountAmount) {
            invoices.forEach(nvc => {
                discountAmount = Math.min(0, discountAmount - nvc.discountAmount);
            });
            discountAmount = Math.min(discountAmount, totalAmount);
            totalAmount -= discountAmount;
        }

        return { totalAmount, discountAmount, walletPaymentAmount };
    }
}