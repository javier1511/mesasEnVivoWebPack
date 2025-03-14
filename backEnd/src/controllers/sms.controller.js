import SmsModel from "../models/SmsModel";
import https from 'https';

const username = '741CFBA57D4341319825620FC961B953-02-E';
const password = 'qeMgo8A9v6miLcf*wyNks340qCIAt';

const sendSMS = async (req, res) => {
    try {
        const { numbers, message } = req.body;

        // Validar los datos
        if (!numbers || numbers.length === 0 || !message) {
            return res.status(400).json({ status: 'error', message: 'Números y mensaje son obligatorios' });
        }

        // Guardar en la base de datos
        const newSMS = new SmsModel({ numbers, message });
        await newSMS.save();

        let postData = JSON.stringify({
            'to': numbers,
            'body': message
        });

        let options = {
            hostname: 'api.bulksms.com',
            port: 443,
            path: '/v1/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
            }
        };

        let apiReq = https.request(options, (apiRes) => {
            let data = '';
            apiRes.on('data', (chunk) => {
                data += chunk;
            });
            apiRes.on('end', () => {
                res.json({ status: 'success', response: JSON.parse(data) });
            });
        });

        apiReq.on('error', (e) => {
            res.status(500).json({ status: 'error', message: e.message });
        });

        apiReq.write(postData);
        apiReq.end();

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export { sendSMS };
