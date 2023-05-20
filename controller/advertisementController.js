const Advertisement = require("../model/Advertisement");
const Seller = require('../model/Seller')

let editCount = 0;
const maxEditCount = 3;
class advertisementController {

    async advertisementById(req, res) {
        try {
            const adId = req.params.id;
            const advertisement = await Advertisement.findById(adId);

            if (!advertisement) {
                return res.status(404).json({ message: 'Advertisement not found' });
            }

            const seller = await Seller.findById(advertisement.seller);

            if (seller && seller.accountType === 'premium') {
                advertisement.viewCount += 1;
                const today = new Date();
                const todayISO = today.toISOString().split('T')[0];

                if (advertisement.viewCounts.length === 0) {
                    advertisement.viewCounts.push(
                        { count: 1, type: 'daily', date: today },
                        { count: 1, type: 'weekly', date: todayISO },
                        { count: 1, type: 'monthly', date: todayISO }
                    );
                } else {
                    advertisement.viewCounts.forEach(count => {
                        if (count.type === 'daily' && count.date instanceof Date && count.date.toISOString().split('T')[0] === todayISO) {
                            count.count += 1;
                        }
                        if (count.type === 'weekly' && typeof count.date === 'string' && count.date.split('T')[0] === todayISO) {
                            count.count += 1;
                        }
                        if (count.type === 'monthly' && typeof count.date === 'string' && count.date.split('T')[0] === todayISO) {
                            count.count += 1;
                        }
                    });
                }

                if (!advertisement.statistics) {
                    advertisement.statistics = {};
                }

                const averagePriceByModelAndRegion = await Advertisement.aggregate([
                    { $match: { model: advertisement.model, region: advertisement.region } },
                    { $group: { _id: null, averagePrice: { $avg: { $toDouble: "$price" } } } }
                ]);

                const averagePriceByModelInUkraine = await Advertisement.aggregate([
                    { $match: { model: advertisement.model } },
                    { $group: { _id: null, averagePrice: { $avg: { $toDouble: "$price" } } } }
                ]);

                advertisement.statistics.averagePriceByModelAndRegion = averagePriceByModelAndRegion[0] ? averagePriceByModelAndRegion[0].averagePrice : 0;
                advertisement.statistics.averagePriceByModelInUkraine = averagePriceByModelInUkraine[0] ? averagePriceByModelInUkraine[0].averagePrice : 0;
            }

            advertisement.statistics.averagePriceByModelInUkraine = parseFloat(advertisement.statistics.averagePriceByModelInUkraine);
            await advertisement.save();
            return res.json(advertisement);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async advertisementAll(req, res) {
        try {
            const advertisements = await Advertisement.find();
            res.json(advertisements);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async  update(req, res, next) {
        try {
            const { id } = req.params;

            const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
                id,
                { ...req.body },
                { new: true }
            );

            if (!updatedAdvertisement) {
                return res.status(404).json({ message: 'Advertisement not found' });
            }

            return res.status(200).json(updatedAdvertisement);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async  delete(req, res) {
        try {
            const { id } = req.params;

            const result = await Advertisement.deleteOne({ _id: id });

            if (result.deletedCount === 1) {
                return res.status(200).json({ message: 'User deleted successfully' });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

module.exports = new advertisementController()
