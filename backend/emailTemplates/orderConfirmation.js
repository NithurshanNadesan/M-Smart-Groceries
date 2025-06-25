module.exports = (order, customer) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4CAF50;">Thank you for your order!</h1>
            <p>Dear ${customer.name},</p>
            <p>Your order <strong>#${order._id}</strong> has been received and is being processed.</p>
            
            <h2 style="color: #333;">Order Summary</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Order Number:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${order._id}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Order Date:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${new Date(order.orderDate).toLocaleString()}</td>
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
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">Payment Method:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${order.paymentMethod}</td>
                </tr>
            </table>
            
            <p style="margin-top: 20px;">We'll notify you when your order ships. If you have any questions, please contact our support team.</p>
            
            <p>Best regards,<br>M Smart Groceries Team</p>
        </div>
    `;
}