"use strict";

var nodemailer  = require('nodemailer');
var settings    = require('../config/settings');
var OrderModel  = require('../models/order');
var LeagueModel = require('../models/league');

module.exports = {

    /**
     * Create new order item
     *
     * /orders POST call
     */
    create: function (req, res, next) {
        OrderModel.create(req.body, function (err, order) {
                if (err) {
                    console.log(err);
                    res.status(500).json({error: err});
                    return;
                }

                req.session.order = order._id;

                res.json(order);

                LeagueModel.findOne({_id: order.leagueId}).exec(function (err, league) {

                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth:    {
                            user: 'amateurs.io.info@gmail.com',
                            pass: 'amateurs0908'
                        }
                    });

                    var mailOptions = {
                        from:    'Amateur Football League <amateurs.io.info@gmail.com>',
                        to:      settings.ordersEmail,
                        bcc:     settings.ordersBcc,
                        subject: 'Новая заявка на участие в лиге',
                        html:    '<div>' +
                                 '<span>Имя: ' + order.name + '</span><br />' +
                                 '<span>Email: ' + order.email + '</span><br />' +
                                 '<span>Телефон: ' + order.phone + '</span><br />' +
                                 '<span>Город: ' + (league.slug.charAt(0).toUpperCase() + league.slug.substr(1)) + '</span><br />' +
                                 '<span>Кто: ' + (order.teamOrPlayer == 'player' ? 'Игрок' : 'Команда') + '</span><br />' +
                                 '<span>Формат: ' + order.format + 'x' + order.format + '</span><br />' +
                                 '<span>Желаемая лига: ' + order.league + '</span><br />' +
                                 '<span>Желаемая команда: ' + order.team + '</span><br />'

                    };
                    if (order.teamOrPlayer == 'player') {
                        mailOptions.html +=
                            '<span>Позиция: ' + order.position + '</span><br />' +
                            '<span>Возраст: ' + order.age + '</span><br />'
                    }

                    mailOptions.html +=
                        '<span>Источник: ' + order.source + '</span><br />' +
                        '<span>Опыт в других лигах: ' + order.experience + '</span><br />' +
                        '<span>Комментарий: ' + order.message + '</span><br />' +
                        '</div>'

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Message sent: ' + info.response);
                        }
                    });
                })
            }
        )
        ;
    }
}
;
