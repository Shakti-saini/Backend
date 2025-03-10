

module.exports = function (app,validator) {

    require('./userRoutes')(app,validator)
    require('./productUser')(app,validator)
}