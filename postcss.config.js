/**
 * Created by Aus on 2017/12/27.
 */
const px2rem = require('postcss-px2rem');
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        px2rem({remUnit: 75}),
        autoprefixer({browsers: ['last 2 versions']})
    ]
};