module.exports = {
    apps: [{
        name: 'api',
        script: 'dist/index.js',
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};
