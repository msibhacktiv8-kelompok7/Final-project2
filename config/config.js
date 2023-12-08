require('dotenv').config();

module.exports = {
    development: {
        "username": process.env.DEV_PGUSER,
        "password": process.env.DEV_PGPASSWORD,
        "database": process.env.DEV_PGDATABASE,
        "host": process.env.DEV_PGHOST,
        "port": process.env.DEV_PGPORT,
        "dialect": "postgres"
    },
    test: {
        "username": process.env.TEST_PGUSER,
        "password": process.env.TEST_PGPASSWORD,
        "database": process.env.TEST_PGDATABASE,
        "host": process.env.TEST_PGHOST,
        "port": process.env.TEST_PGPORT,
        "dialect": "postgres"
    },
    production: {
        "username": process.env.PROD_PGUSER,
        "password": process.env.PROD_PGPASSWORD,
        "database": process.env.PROD_PGDATABASE,
        "host": process.env.PROD_PGHOST,
        "port": process.env.PROD_PGPORT,
        "dialect": "postgres"
    }
};