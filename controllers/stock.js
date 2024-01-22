const Stock = require('../models/DailyStock');
const FavouriteStock = require('../models/FavouriteStock');
const redis = require('redis');

const redisClient = redis.createClient();
(async () => {
    await redisClient.connect();
})();
redisClient.on("ready", () => {
    console.log("Connected!");
});
redisClient.on("error", (err) => {
    console.log("Error in the Connection");
});


// async function getTopStocks(req, res) {
//     try {
//         const cachedTopStocks = await redisClient.get('topStocks');
//         if (cachedTopStocks) {
//             console.log('Serving top stocks from cache');
//             return res.json(JSON.parse(cachedTopStocks));
//         }
//         const topStocks = await Stock.find().sort({ close: -1 }).limit(10);

//         await redisClient.set('topStocks', JSON.stringify(topStocks));
//         await redisClient.expire('topStocks', 5);        
//         res.json(topStocks);
//     } catch (err) {
//         console.error('Error retrieving top stocks:', err);
//         res.status(500).send('Error retrieving top stocks');
//     }
// }

async function getTopStocks(req, res) {
    try {
        const topStocks = await Stock.find().sort({ close: -1 }).limit(10);
        res.json(topStocks);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving top stocks');
    }
}

async function getStockByName(req, res) {
    try {
        const stockName = req.params.name;
        const stock = await Stock.findOne({ SC_NAME: stockName });

        console.log({ name: stockName })
        if (!stock) {
            res.status(404).send('Stocks not found');
        } else {
            res.json(stock);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving stock');
    }
}

async function getStockPriceHistory(req, res) {
    try {
        const { SC_NAME: stockName } = req.body;

        if (!stockName) {
            res.status(400).send('Missing stock name in the request body');
            return;
        }
        const priceHistory = await Stock.find({ SC_NAME: stockName })
            .sort({ date: -1 })
            .limit(5)  
            .select({ SC_NAME: 1, OPEN: 1, date: 1 });

        res.json(priceHistory);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving price history');
    }
}


async function addToFavourites(req, res) {
    try {
        const stockData = req.body;

        if (!stockData || !stockData.SC_CODE) {
            res.status(400).send('Missing stock data or stock code');
            return;
        }
        const existingFavourite = await FavouriteStock.findOne({ code: stockData.SC_CODE });
        if (existingFavourite) {
            res.status(400).send('Stock already in favourites');
            return;
        }
        const favouriteStock = new FavouriteStock({
            code: stockData.SC_CODE,
            name: stockData.SC_NAME.trim(),
            open: stockData.OPEN,
            high: stockData.HIGH,
            low: stockData.LOW,
            close: stockData.CLOSE,
            date: new Date(), 
        });

        await favouriteStock.save();
        res.json(favouriteStock);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding favourite');
    }
}

async function getFavourites(req, res) {
    try {
        const favouriteStocks = await FavouriteStock.find();
        res.json(favouriteStocks);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving favourites');
    }
}   

async function removeFromFavourites(req, res) {
    try {
        const stockData = req.body;

        if (!stockData || !stockData.SC_CODE) {
            res.status(400).send('Missing stock data or stock code');
            return;
        }
        const removedFavourite = await FavouriteStock.findOneAndDelete({ code: stockData.SC_CODE });
        if (!removedFavourite) {
            res.status(404).send('Stock not found in favourites');
            return;
        }

        res.json(removedFavourite);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing favourite');
    }
}

module.exports = {
    getTopStocks,
    getStockByName,
    getStockPriceHistory,
    addToFavourites,
    getFavourites,
    removeFromFavourites,
};
