const express = require('express');
const authController = require('../controllers/auth.controller');
const menuController = require('../controllers/menu.controller');
const orderController = require('../controllers/order.controller');
const chatbotController = require('../controllers/chatbot.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SmartDine API',
  });
});

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', requireAuth, authController.me);

router.get('/menu/categories', menuController.listCategories);
router.get('/menu/items', menuController.listMenuItems);
router.get('/menu/items/:id', menuController.getMenuItem);
router.post('/menu/items', requireAuth, requireRole('admin'), menuController.createMenuItem);
router.put('/menu/items/:id', requireAuth, requireRole('admin'), menuController.updateMenuItem);
router.delete('/menu/items/:id', requireAuth, requireRole('admin'), menuController.deleteMenuItem);

router.get('/orders', requireAuth, orderController.listOrders);
router.post('/orders', requireAuth, orderController.createOrder);
router.get('/orders/:id', requireAuth, orderController.getOrder);
router.patch('/orders/:id/status', requireAuth, requireRole('admin'), orderController.updateOrderStatus);

router.post('/chatbot/message', chatbotController.sendMessage);

module.exports = router;

