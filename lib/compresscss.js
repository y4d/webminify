const cleancss = require('clean-css');
    

module.exports = function (text, options) {

    return new clearcss(options).minify(text).styles;
}
