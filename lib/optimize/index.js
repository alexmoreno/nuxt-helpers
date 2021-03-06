const cssnano = require('cssnano');

module.exports = {
    extend(nuxt) {
        // Better filenames
        if (!nuxt.build.filenames) {
            nuxt.build.filenames = {
                vendor: 'vendor.[hash].js',
                app: 'app.[chunkhash].js'
            };
        }

        // Better Public path
        if (!nuxt.build.publicPath) {
            nuxt.build.publicPath = '/assets/';
        }

        // Add cssnano
        nuxt.build.postcss.push(cssnano(nuxt.build.cssnano));
    },
    extendBuild() {
        // Modernize SSR bundle with less transforms
        // TODO
    }
};
