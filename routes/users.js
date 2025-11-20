var express = require('express');
var router = express.Router();
const stockController = require('../controllers/stockController');
/* GET users listing. */
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/',authMiddleware, stockController.getAllStocks);
router.get('/:id',authMiddleware, stockController.getStockById);
 router.post('/postdata',authMiddleware, stockController.createStock);
 router.delete('/deletestock/:id',authMiddleware, stockController.deleteStock);
 router.put('/updatestock/:id',authMiddleware, stockController.updateStock);

module.exports = router;
