module.exports = {
    PORT: process.env.PORT || 5000,
    DB_URL: process.env.DB_URL || "mongodb://localhost:27017/test",
    SECRET_ACCESS: process.env.SECRET_ACCESS || "SECRET_KEY_RANDOM",
    SECRET_REFRESH: process.env.SECRET_REFRESH || "SECRET_KEY_RANDOM"

};
