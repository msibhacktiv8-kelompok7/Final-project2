require('dotenv').config()

module.exports = {
    development: {
        "username": "postgres",
        "password": "-c*F46-12ccaAaf1c24c31B313DdAdDC",
        "database": "railway",
        "host": "viaduct.proxy.rlwy.net:23743",
        "port": "23743",
        "dialect": "postgres"
    },
    test: {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    production: {
        "username": "postgres",
        "password": "-c*F46-12ccaAaf1c24c31B313DdAdDC",
        "database": "railway",
        "host": "viaduct.proxy.rlwy.net:23743",
        "port": "23743",
        "dialect": "postgres"
    }
};