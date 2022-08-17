const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST, 
    database: process.env.DB_DATABASE,
    options: {
        trustedConnection: true,
        enableArithPort: true,
        encrypt: false,
        instancename: '' 
    },
    port: parseInt(process.env.DB_PORT)
};

module.exports = config;


