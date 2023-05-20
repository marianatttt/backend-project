const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


const { DB_URL, PORT} = require('./config/config')
const authRouter = require('./router/authRouter')
const sellerRouter = require('./router/sellerRouter')
const advertisementRouter = require('./router/advertisementRouter')


const app = express()

app.use(express.json())

app.use("/auth", authRouter);

app.use("/seller", sellerRouter);

app.use("/advertisement", advertisementRouter);





app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Unknown error',
        status: err.status || 500
    });
});

const start = async () => {
    try {
        await mongoose.connect(DB_URL,
            { useUnifiedTopology: true ,
                useNewUrlParser: true } ,

        )
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()



