const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', serviceController.getServiceRequests);
router.post('/', serviceController.createServiceRequest);
router.get('/product/:productId', serviceController.getProductServiceRequests);
router.put('/:id', serviceController.updateServiceRequest);
router.delete('/:id', serviceController.deleteServiceRequest);

module.exports = router;
