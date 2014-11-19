var helpers = {
    equals: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    }
};

module.exports.initialize = function (hbs) {
    console.log('starting registering helpers');
    for (var helper in helpers) {
        hbs.registerHelper(helper, helpers[helper]);
        console.log('helper registered');
    }
};
