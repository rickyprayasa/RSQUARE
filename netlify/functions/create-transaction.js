// File: netlify/functions/create-transaction.js
const axios = require('axios');

exports.handler = async function (event, context) {
    // Hanya izinkan metode POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { productName, productPrice, customerName, customerEmail } = JSON.parse(event.body);

        // Ambil Server Key rahasia dari Netlify Environment Variables
        const serverKey = process.env.MIDTRANS_SERVER_KEY;
        const encodedKey = Buffer.from(serverKey).toString('base64');

        // Buat ID pesanan yang unik, contohnya dengan timestamp
        const orderId = `RSQ-${Date.now()}`;

        const response = await axios.post(
            'https://app.sandbox.midtrans.com/snap/v1/transactions',
            {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: parseInt(productPrice),
                },
                item_details: [{
                    id: orderId,
                    price: parseInt(productPrice),
                    quantity: 1,
                    name: productName,
                }],
                customer_details: {
                    first_name: customerName,
                    email: customerEmail,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Basic ${encodedKey}`,
                },
            }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ token: response.data.token }),
        };

    } catch (error) {
        console.error('Error creating Midtrans transaction:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create transaction.' }),
        };
    }
};