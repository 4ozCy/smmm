const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const BASE_URL = 'https://leangzz2.net/api/v2';
const API_KEY = 'a83ad74f1f0d3cf9a87e3d288aeb4500';

let orders = [];

app.use(cors());
app.use(bodyParser.json());

// Serve the HTML file
app.use(express.static(path.join(__dirname, 'Public')));

app.get('/services', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/services`, { params: { key: API_KEY } });
        // Log the response data for debugging purposes
        console.log(response.data);

        // Filter services by name containing 'view' or 'like' and related to TikTok
        const tiktokServices = response.data.filter(service =>
            (service.name.toLowerCase().includes('view') || service.name.toLowerCase().includes('like'))
        );

        res.json(tiktokServices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch services.' });
    }
});

app.post('/order', async (req, res) => {
    const { service, link, quantity } = req.body;

    try {
        const apiResponse = await axios.post(`${BASE_URL}/order`, {
            key: API_KEY,
            service,
            link,
            quantity,
        });

        const order = {
            id: apiResponse.data.order,
            service,
            link,
            quantity,
            status: 'Completed',
            timestamp: new Date(),
        };

        orders.push(order);

        res.json({ message: 'Order placed successfully!', order });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order.' });
    }
});

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
