
var mongodb = require('mongodb');

var documents = [
    {dc: new Date(), country: 'en', name: 'Николай Гордеев', title:'Глава Английской Федерации', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/id205213953', name: 'Капитан Вэстхэмов'}, photo: 'https://pp.vk.me/c409718/v409718953/4cff/IQsN7usEI1I.jpg'},
    {dc: new Date(), country: 'en', name: 'Эрвин Умеров', title:'Зам. главы Федерации', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/umerov_ervin', name: 'Ervin Umerov'}, photo: 'https://pp.vk.me/c411317/v411317943/60ed/Lt8L_xHbNcE.jpg'},
    {dc: new Date(), country: 'en', name: 'Олег Цыпляев', title:'Глава отдела мультимедиа', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/id3719280', name: 'Олег Цыпляев'}, photo: 'https://pp.vk.me/c622526/v622526280/5a1/3vNp6c-HAy4.jpg'},
    {dc: new Date(), country: 'en', name: 'Владислав Берестенёв', title:'Глава судейского корпуса', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/id32612983', name: 'Владислав Берестенёв'}, photo: 'https://pp.vk.me/c421430/v421430983/583c/zmQJUCGxaRw.jpg'},
    {dc: new Date(), country: 'en', name: 'Артур Григорян', title:'Главный редактор', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/ateka', name: 'Атёка Григорян'}, photo: 'https://pp.vk.me/c10290/u337595/a_112b575a.jpg'}
];


exports.up = function(db, next){
    var contacts = mongodb.Collection(db, 'contacts');
    contacts.insert(documents, next);

    next();
};

exports.down = function(db, next){
    var contacts = mongodb.Collection(db, 'contacts');
    contacts.remove({}, next);

    next();
};
