/**
 * Created by SWSD on 2018-11-15.
 */
require('babel-register') ({
    presets: [ 'env' ]
})

module.exports = require('./webpackConfigDev.js')