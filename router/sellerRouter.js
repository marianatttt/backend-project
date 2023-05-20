const Router = require('express')
const router = new Router()

const sellerController = require('../controller/sellerController')
const createAdvertisementMiddleware = require('../middleware/AdvertisementMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')


router.post('/',
    authMiddleware.isAuthorization,
    roleMiddleware(["ADMIN", "MANAGER", "SELLER"]),
    sellerController.sellerBase)


router.post('/premium',
    authMiddleware.isAuthorization,
    roleMiddleware(["ADMIN", "MANAGER", "SELLER"]),
    sellerController.sellerPremium)

router.post('/:id/advertisement',
    authMiddleware.isAuthorization,
    roleMiddleware(["ADMIN", "MANAGER", "SELLER"]),
    createAdvertisementMiddleware.checkSeller,
    createAdvertisementMiddleware.checkCarModel,
    createAdvertisementMiddleware.getExchangeRate,
    createAdvertisementMiddleware.checkBadWords,
    sellerController.sellerCreateAdvertisements)


router.get('/:id/advertisements',
    authMiddleware.isAuthorization,
    roleMiddleware(["ADMIN", "MANAGER", "SELLER"]),
    sellerController.sellerAllAdvertisements)


module.exports = router
