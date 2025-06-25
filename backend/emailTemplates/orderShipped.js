module.exports = (order, customer) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4CAF50;">Your Order is on the Way!</h1>
            <p>Dear ${customer.name},</p>
            
            <p>Your order <strong>#${order._id}</strong> has been shipped and is on its way to you.</p>
            
            <h2 style="color: #333;">Delivery Information</h2>
            <p>Expected delivery date: <strong>${new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString()}</strong></p>
            
            <h2 style="color: #333;">Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Order Number:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${order._id}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Total Amount:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs.${order.total.toFixed(2)}</td>
                </tr>
                ${order.discountFk ? `
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">Discount:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; color: #4CAF50;">
                            - Rs.${(order.total - order.netAmount).toFixed(2)}
                        </td>
                    </tr>
                ` : ''}
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Net Amount:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs.${order.netAmount.toFixed(2)}</td>
                </tr>
            </table>
            <div style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px;">
                <h3 style="margin-top: 0;">Need Help?</h3>
                <p>Contact our support team at <a href="mailto:support@msmartgroceries.com">support@msmartgroceries.com</a></p>
            </div>
            
            <p>Thank you for shopping with us!</p>
            <p><strong>The M Smart Groceries Team</strong></p>
        </div>
    `;
}