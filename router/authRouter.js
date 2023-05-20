const Router = require('express')
const router = new Router()

const authController = require('../controller/authController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')


router.post('/registration',
    authMiddleware.isNewUserValid,
    authController.registration
)

router.post('/login',
    authMiddleware.isLoginValid,
    authController.login)

router.post('/refresh',
    authController.refreshToken)


router.get('/users', roleMiddleware(["ADMIN", "MANAGER"]), authController.getUsers)


module.exports = router

