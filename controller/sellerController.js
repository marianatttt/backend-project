const SellerSchema = require("../model/Seller");
const Advertisement = require("../model/Advertisement");
const Car = require("../model/Car");
const badWordsList = require("badwords-list");
const axios = require("axios");

let editCount = 0;
const maxEditCount = 3;

class sellerController {
    async sellerBase(req, res) {
        try {
            const { name } = req.body;
            const seller = new SellerSchema ({ name });
            const savedSeller = await seller.save();
            res.json(savedSeller);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async sellerPremium (req, res) {
        try {
            const { name } = req.body;
            const seller = new SellerSchema ({ name, accountType: 'premium' }); // Встановити тип акаунту як "premium"
            const savedSeller = await seller.save();
            res.json(savedSeller);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async sellerCreateAdvertisements (req, res) {
        try {
            const seller = await SellerSchema.findById(req.params.id);

            const {model, originalPrice, currency, price, region, title} = req.body;
            if (!model || !originalPrice || !currency || !title) {
                return res.status(400).json({error: 'Not all required fields are filled in'});
            }
            const availableCurrencies = ['USD', 'EUR', 'UAH'];
            if (!availableCurrencies.includes(currency.toUpperCase())) {
                return res.status(400).json({error: 'The selected currency is not supported'});
            }
            if (currency.toUpperCase() === 'UAH') {
                const advertisement = new Advertisement({
                    model,
                    originalPrice,
                    currency,
                    price: originalPrice,
                    seller: seller._id,
                    region
                });
                const savedAdvertisement = await advertisement.save();
                return res.json({message: 'Car sale advertisement successfully placed'});
            } else {

                const exchangeRates = req.exchangeRates;

                const selectedCurrencyRate = exchangeRates.find(rate => rate.ccy === currency.toUpperCase());
                if (!selectedCurrencyRate) {
                    return res.status(400).json({error: 'The selected currency is not supported'});
                }

                const calculatedPrice = originalPrice * selectedCurrencyRate.sale;
                const convertedPrice = calculatedPrice.toFixed(0);
                const advertisement = new Advertisement({
                    model,
                    originalPrice,
                    currency,
                    price: convertedPrice,
                    exchangeRate: selectedCurrencyRate.sale,
                    seller: seller._id,
                    region
                });
                const savedAdvertisement = await advertisement.save();

                res.json({message:'Car sale advertisement successfully placed'});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }

    async sellerAllAdvertisements (req, res) {
        try {
            const seller = await SellerSchema.findById(req.params.id);
            if (!seller) {
                return res.status(404).json({ message: 'Seller not found' });
            }

            const advertisements = await Advertisement.find({ seller: seller._id });
            res.json(advertisements);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

module.exports = new sellerController()