const chalk = require('chalk');

function printURL(title, url, prefix) {
    console.log(chalk.bgMagenta.black(` ${title} `) + chalk.magenta(` ${url}${prefix}`) + '\r\n');
}

module.exports = (nuxt) => {
    // API URL
    const API_URL = process.env.API_URL || process.env.npm_package_config_nuxt_api_url || 'http://localhost:3000';
    process.env.API_URL = API_URL;

    // API URL for Browser
    const API_URL_BROWSER = process.env.API_URL_BROWSER || process.env.npm_package_config_nuxt_api_url_browser || API_URL;
    process.env.API_URL_BROWSER = API_URL_BROWSER;

    // Common API Prefix
    const API_PREFIX = process.env.API_PREFIX || process.env.npm_package_config_nuxt_api_prefix || '/api';
    process.env.API_PREFIX = API_PREFIX;
    nuxt.env.API_PREFIX = API_PREFIX;

    // Don't add env to production bundles
    if (process.env.NODE_ENV !== 'production') {
        nuxt.env.API_URL = API_URL;
        nuxt.env.API_URL_BROWSER = API_URL_BROWSER;
    }

    printURL('API URL', API_URL, API_PREFIX);

    if (API_URL_BROWSER && API_URL_BROWSER.length > 0) {
        printURL('API URL (Browser)', API_URL_BROWSER, API_PREFIX);
    }
};

module.exports.meta = {
    plugin: true,
    vendor: ['axios']
};
