const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock'); 

router.get('/top-stocks', stockController.getTopStocks);
router.get('/favourites', stockController.getFavourites);
router.post('/favourites', stockController.addToFavourites);
router.delete('/favourites', stockController.removeFromFavourites);
router.get('/history', stockController.getStockPriceHistory);
router.get('/:name', stockController.getStockByName);

module.exports = router;
