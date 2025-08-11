// File: netlify/functions/create-transaction.js (Versi Perbaikan)
const axios = require('axios');

exports.handler = async function (event, context) {
    // Hanya izinkan metode POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { productName, productPrice, customerName, customerEmail } = JSON.parse(event.body);

        const serverKey = process.env.MIDTRANS_SERVER_KEY;

        // --- PERBAIKAN DI BARIS BERIKUT ---
        // Tambahkan karakter ':' setelah serverKey sebelum di-encode
        const encodedKey = Buffer.from(serverKey + ':').toString('base64');
        // --- AKHIR PERBAIKAN ---

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
        // Tampilkan error yang lebih detail di log untuk debugging
        console.error('Error creating Midtrans transaction:', error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to create transaction.' }),
        };
    }
};
