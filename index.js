const express = require('express');
const router = express();
const dotenv = require('dotenv');
dotenv.config();

const api_controller = require('./controllers/ApiController');

router.use(express.json());

router.post('/api/register', api_controller.register);
router.get('/api/commonstudents', api_controller.common_student);
router.post('/api/suspend', api_controller.suspend);
router.post('/api/retrievefornotifications', api_controller.retrieve_for_notification);

const port = process.env.PORT;
router.listen(port, () => console.log(`Listen on port ${port}...`));