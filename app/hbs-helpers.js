var hbs     = require('hbs'),
    _       = require('underscore'),
    moment  = require('moment-timezone'),
    slugify = require('transliteration').slugify;


var helpers = {
    eq: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("hbs Helper eq needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    },
    ne: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("hbs Helper ne needs 2 parameters");
        if (lvalue != rvalue) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    lt: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("hbs Helper lt needs 2 parameters");
        if (lvalue >= rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    },
    gt: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("hbs Helper gt needs 2 parameters");
        if (lvalue <= rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    },

    lowercase: function (str) {
        return str.toLowerCase();
    },

    uppercase: function (str) {
        return str.toUpperCase();
    },

    debug: function (optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);

        if (optionalValue) {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
        }
    },

    '$': function (partial) {
        var values, opts, done, value, context;
        if (!partial) {
            console.error('No partial name given.');
        }
        values = Array.prototype.slice.call(arguments, 1);
        opts = values.pop();
        while (!done) {
            value = values.pop();
            if (value) {
                partial = partial.replace(/:[^\.]+/, value);
            }
            else {
                done = true;
            }
        }
        partial = hbs.handlebars.partials[partial];
        if (!partial) {
            return '';
        }
        if (typeof partial === 'string') {
            partial = hbs.handlebars.compile(partial);
        }

        context = _.extend({}, opts.hash || this, _.omit(opts, 'data', 'context', 'fn', 'inverse'));
        return new hbs.handlebars.SafeString(partial(context));
    },

    rand: function (min, max) {
        min = min || 0;
        max = max || 100;
        return Math.ceil(min + (max - min) * Math.random());
    },

    menuStartCol: function (current, breakOn, total, options) {
        if (current % breakOn === 0) {
            return options.fn(this);
        }

        return options.inverse(this);
    },

    menuBreakCol: function (current, breakOn, total, options) {
        if ((current + 1) % breakOn === 0) {
            return options.fn(this);
        }

        return options.inverse(this);
    },

    trunc: function (text, symbolsCount) {
        return text.slice(0, symbolsCount) + '...';
    },

    date: function (date) {
        return dateFn(date, 'L');
    },

    datefull: function (date) {
        return dateFn(date, 'LL');
    },

    dateTimeShort: function (date) {
        return dateFn(date, 'DD.MM HH:mm');
    },

    dateTimeFull: function (date) {
        return dateFn(date, 'LLLL');
    },

    contains: function (string, needle) {
        if (string.toLowerCase().indexOf(needle.toLowerCase()) === -1) {
            return options.fn(this);
        }

        return options.inverse(this);
    },

    notContains: function (string, needle, options) {
        if (string.toLowerCase().indexOf(needle.toLowerCase()) === -1) {
            return options.fn(this);
        }

        return options.inverse(this);
    },

    inc: function (value, options) {
        return parseInt(value) + 1;
    },

    sub: function (value, sub) {
        return value - sub;
    },

    slugify: function (value) {
        return slugify(value);
    },

    add: function (value, add) {
        return value + add;
    }
};

var dateFn = function (date, format) {
    var tz = 'Europe/Moscow';

    return moment(date).locale('ru').tz(tz).format(format);
};

module.exports.initialize = function (hbs) {
    console.log('starting registering helpers');
    for (var helper in helpers) {
        hbs.registerHelper(helper, helpers[helper]);
        console.log('helper "' + helper + '" registered');
    }
};
