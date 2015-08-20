var hbs     = require('hbs'),
    _       = require('underscore'),
    moment  = require('moment-timezone'),
    slugify = require('transliteration').slugify;

var linkRoutes = {
    table: {}
};

//moment.tz.setDefault("America/New_York");

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

    ucfirst: function (str) {
        str += '';
        var f = str.charAt(0)
            .toUpperCase();
        return f + str.substr(1);
    },

    json: function(data) {
        return JSON.stringify(data);
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
        opts   = values.pop();
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

    date: function (date, tz) {
        return dateFn(date, 'L', tz);
    },

    dateShort: function (date, tz) {
        return dateFn(date, 'DD.MM', tz);
    },

    datetime: function (date, tz) {
        return dateFn(date, 'L LT', tz);
    },

    dateFull: function (date, tz) {
        return dateFn(date, 'dddd, Do MMMM YYYY', tz);
    },

    dateHuman: function (date, tz) {
        return dateFn(date, 'Do MMMM YYYY', tz);
    },

    dateDay: function (date, tz) {
        return dateFn(date, 'dddd', tz);
    },

    dateTimeShort: function (date, tz) {
        return dateFn(date, 'DD.MM HH:mm', tz);
    },

    dateTimeFull: function (date, tz) {
        return dateFn(date, 'dddd, Do MMMM YYYY HH:mm', tz);
    },

    time: function (date, tz) {
        return dateFn(date, 'HH:mm', tz);
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

    inc: function (value) {
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
    },

    get: function (obj) {
        var args = Array.prototype.slice.call(arguments, 1);
        var key  = typeof args[args.length - 1] === 'object' ? args.slice(0, args.length - 1) : args;
        if (key.length > 1) {
            if (obj) {
                return helpers.get.apply(null, [obj[key[0]]].concat(key.slice(1)));
            } else {
                return undefined;
            }
        }
        if (obj.hasOwnProperty(key)) {
            return obj[key];
        } else {
            console.log('no value', obj, key);
            return undefined;
        }
    },

    last: function(arr) {
        if(!_.isArray(arr)) {
            return null;
        }

        return _.last(arr);
    },

    endsWith: function (str, suffix, options) {
        if (str.toLowerCase().indexOf(suffix.toLowerCase(), str.length - suffix.length) !== -1) {
            return options.fn(this);
        }

        return options.inverse(this);
    },

    gameResTeam: function (team, game) {
        if (!game.score) {
            return false;
        }
        var teamId = team._id ? team._id : team.teamId;
        var score = game.score.ft;
        if (game.teams[0]._id == teamId) {
            return score[0] > score[1] ? 'w' : (score[0] == score[1] ? 'd' : 'l');
        } else {
            return score[1] > score[0] ? 'w' : (score[0] == score[1] ? 'd' : 'l');
        }

    },

    isNumber: function (value, options) {
        if (_.isNumber(value)) {
            return options.fn(this);
        }

        return options.inverse(this);
    },

    notEmptyObject: function (obj, options) {
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return options.fn(this);
            }
        }

        return options.inverse(this);
    },

    ifCond: function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    },

    noYear: function (name) {
        if (name.indexOf(' - ') > 0) {
            return name.slice(0, name.indexOf(' - '));
        }

        return name;
    },

    previewHeight: function (photos, index, width, def) {
        var padding = (photos.length - 1) * 5 * 2;

        var sum = photos.reduce(function (sum, item) {
            var image = item.thumb ? item.thumb : item.main,
                ratio;
            if (image.w && image.h) {
                ratio = image.w / image.h;
            } else {
                ratio = def;
            }

            return sum + ratio;
        }, 0);

        return Math.floor((width - padding) / sum);
    }
};

var dateFn = function (date, format, tz) {

    if (!tz) {
        return moment(date).locale('ru').format(format);
    } else {
        var zone = 'Europe/Moscow';
        return moment(date).locale('ru').format(format);
    }
};

module.exports.initialize = function (hbs) {
    for (var helper in helpers) {
        hbs.registerHelper(helper, helpers[helper]);
    }
};
