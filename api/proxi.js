const axios = require('axios');

const TARGET_SERVER = 'https://api.openai.com/v1';

module.exports = async (req, res) => {
    const targetUrl = TARGET_SERVER + req.url;

    try {
        // Clone the headers from the original request
        const headers = { ...req.headers };

        // Remove the host header from the original request
        delete headers.host;

        // Add your custom header
        headers['OpenAI-Beta'] = 'assistants=v1';

        const response = await axios({
            method: req.method,
            url: targetUrl,
            headers: headers,
            data: req.body,
            params: req.query,
            responseType: 'stream'
        });

        // Forward the response headers and status code
        res.writeHead(response.status, response.headers);

        // Pipe the response stream to the client
        response.data.pipe(res);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            console.error(error);
            res.status(500).send('An error occurred');
        }
    }
};
