"use strict";

var nodemailer = require('nodemailer');
var settings   = require('../config/settings');
var OrderModel = require('../models/order');

module.exports = {

    /**
     * Create new order item
     *
     * /orders POST call
     */
    create: function (req, res, next) {
        console.log('/orders POST handled');

        OrderModel.create(req.body, function (err, order) {
            if (err) {
                console.log(err);
                res.status(500).json({error: err});
                return;
            }

            req.session.order = order._id;

            res.json(order);

            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth:    {
                    user: 'amateurs.io.info@gmail.com',
                    pass: 'amateurs0908'
                }
            });

            var mailOptions = {
                from:    'Amateur Footabll League <amateurs.io.info@gmail.com>',
                to:      settings.ordersEmail,
                bcc:     settings.ordersBcc,
                subject: 'Новая заявка на участие в лиге',
                html:    '<div>' +
                         '<span>Имя: ' + order.name + '</span><br />' +
                         '<span>Email: ' + order.email + '</span><br />' +
                         '<span>Телефон: ' + order.phone + '</span><br />' +
                         '<span>Желаемая лига: ' + order.league + '</span><br />' +
                         '<span>Желаемая команда: ' + order.team + '</span><br />' +
                         '<span>Источник: ' + order.source + '</span><br />' +
                         '<span>Комментарий: ' + order.message + '</span><br />' +
                         '</div>'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        });
    }
};
