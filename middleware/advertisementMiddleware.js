const axios = require("axios");
const badWordsList = require("badwords-list");
const mongoose = require('mongoose');

const SellerSchema = require("../model/Seller");
const Advertisement = require("../model/Advertisement");
const Car = require("../model/Car")


let editCount = 0;
const maxEditCount = 3;


module.exports = {
    checkSeller: async (req, res, next) => {
        const seller = await SellerSchema.findById(req.params.id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (seller.accountType === 'basic') {
            const advertisementsCount = await Advertisement.countDocuments({ seller: seller._id });
            if (advertisementsCount >= 1) {
                return res.status(403).json({ message: 'A basic account can only have one ad' });
            }
        }
        next();
    },
    checkCarModel: async (req, res, next) => {
        const { model } = req.body
        const carModels = await Car.find({});
        const availableCarModels = carModels.map((Car) => Car.model);

        if (!availableCarModels.includes(model)) {
            return res.status(400).json({ error: 'This model of car is not enough, inform the administrator.' });
        }
        next();
    },

    checkBadWords : async (req, res, next) => {
        const seller = await SellerSchema.findById(req.params.id);

        const { model, title, originalPrice, region } = req.body;

        const hasProfanityModel = badWordsList.array.some(word => model.toLowerCase().includes(word));
        const hasProfanityTitle = badWordsList.array.some(word => title.toLowerCase().includes(word));
        if (hasProfanityModel || hasProfanityTitle) {
            editCount++;
            if (editCount > maxEditCount) {
                const advertisement = new Advertisement({
                    model,
                    originalPrice,
                    title,
                    region,
                    status: 'inactive',
                    seller: seller._id,
                });

                advertisement.status = 'inactive';

                return res.status(400).json({ error: 'The ad contains profanity and cannot be activated' });
            } else {
                return res.status(200).json({ message: `The ad contains profanity. You have ${maxEditCount - editCount} more attempts to edit` });
            }
        }

        next();
    },

    getExchangeRate : async (req, res, next) => {
        try {
            const exchangeRateURL = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
            const response = await axios.get(exchangeRateURL);
            const exchangeRates = response.data;

            req.exchangeRates = exchangeRates;

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },

}
