"use strict";

var _ = require('underscore');

var fields = [
    {
        id:      1,
        name:    'Прага',
        address: 'улица Красного Маяка дом 13',
        route:   'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. ' +
                 'Вдали от всех живут они в буквенных домах на берегу Семантика большого языкового океана. ' +
                 'Маленький ручеек Даль журчит по всей стране и обеспечивает ее всеми необходимыми правилами. ' +
                 'Эта парадигматическая страна, в которой жаренные члены предложения залетают прямо в рот. ' +
        'Даже всемогущая пунктуация не имеет власти над рыбными текстами, ведущими безорфографичный образ жизни.',
        coords:  '//api-maps.yandex.ru/services/constructor/1.0/static/?sid=96rhcLSs30-lXlbm5lYXR8960oZMWW6Z&width=600&height=308'
    },
    {
        id:      2,
        name:    'Анохина',
        address: 'улица Академика Анохина, дом 4, корпус 2',
        coords:  '//api-maps.yandex.ru/services/constructor/1.0/static/?sid=96rhcLSs30-lXlbm5lYXR8960oZMWW6Z&width=600&height=308',
        route:   'Она предупредила его: «В моей стране все переписывается по несколько раз. ' +
                 'Единственное, что от меня осталось, это приставка «и». Возвращайся ты лучше в свою безопасную страну». ' +
        'Не послушавшись рукописи, наш текст продолжил свой путь. Вскоре ему повстречался коварный составитель'
    },
    {
        id:      3,
        name:    'Ереванка',
        address: 'улица Ереванская дом 53 школа 883',
        coords:  '//api-maps.yandex.ru/services/constructor/1.0/static/?sid=96rhcLSs30-lXlbm5lYXR8960oZMWW6Z&width=600&height=308',
        route:   'Даже всемогущая пунктуация не имеет власти над рыбными текстами, ведущими безорфографичный образ жизни. ' +
        'Однажды одна маленькая строчка рыбного текста по имени Lorem ipsum решила выйти в большой мир грамматики.'
    }
];

module.exports = {
    get: function (id) {
        var result;

        if (id) {
            id = id.toLowerCase();
            result = _.findWhere(_.map(fields, function (item) {
                item.name = item.name.toLowerCase();

                return item;
            }), {name: id});
        } else {
            result = fields;
        }

        return result;
    }
};
