module.exports = {
    apps: [{
        name: 'api',
        script: 'dist/index.js',
        env: {
            NODE_ENV: 'production',
            PORT: 3000,
            UPDATE_TOKEN: process.env.UPDATE_TOKEN
        }
    }]
};
