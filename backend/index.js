const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

app.use(cors());
app.use(express.json());

// Proxy stream to Python ML Service
app.post('/api/stream', async (req, res) => {
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const response = await axios({
            method: 'post',
            url: `${ML_SERVICE_URL}/api/analyze`,
            data: req.body,
            responseType: 'stream'
        });

        response.data.on('data', (chunk) => {
            // Forward chunks to the client
            res.write(chunk);
        });

        response.data.on('end', () => {
            res.end();
        });

    } catch (error) {
        console.error("Error communicating with ML service:", error.message);
        res.write(`data: ${JSON.stringify({ type: 'error', data: 'Failed to connect to ML Service' })}\n\n`);
        res.end();
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Vineetra Orchestrator' });
});

app.listen(PORT, () => {
    console.log(`Orchestrator running on port ${PORT}`);
});
