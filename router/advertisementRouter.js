const Router = require('express')
const router = new Router()

const advertisementController = require('../controller/advertisementController')
const roleMiddleware = require('../middleware/roleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')


router.get('/:id' ,
    authMiddleware.isAuthorization,
    roleMiddleware(["ADMIN", "MANAGER", "SELLER"]),
    advertisementController.advertisementById
);


router.put('/:id',
    authMiddleware.isAuthorization,
    roleMiddleware(["ADMIN", "MANAGER"]),
    advertisementController.update
)



router.delete('/:id',
    authMiddleware.isAuthorization,
    roleMiddleware(["ADMIN", "MANAGER"]),
    advertisementController.delete)


router.get('/',
    authMiddleware.isAuthorization,
    advertisementController.advertisementAll
)



module.exports = router
