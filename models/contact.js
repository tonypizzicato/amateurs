var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ContactSchema = new Schema({
    id:      ObjectId,
    dc:      {type: Date, default: Date.now},
    du:      {type: Date},
    title:   {type: String},
    name:    {type: String},
    phone:   {type: String},
    email:   {type: String},
    vk:      {
        name: {type: String},
        url:  {type: String}
    },
    photo:   {type: String},
    country: {type: String},
    league:  {type: String}
});

module.exports = mongoose.model('Contact', ContactSchema, 'contacts');

/**
 * db.contacts.remove({})
 * db.contacts.insert(migrations)
 */
var migrations = [
    {dc: new Date(), country: 'en', name: 'Николай Гордеев', title:'Глава Английской Федерации', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/id205213953', name: 'Капитан Вэстхэмов'}, photo: 'https://pp.vk.me/c409718/v409718953/4cff/IQsN7usEI1I.jpg'},
    {dc: new Date(), country: 'en', name: 'Эрвин Умеров', title:'Зам. главы Федерации', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/umerov_ervin', name: 'Ervin Umerov'}, photo: 'https://pp.vk.me/c411317/v411317943/60ed/Lt8L_xHbNcE.jpg'},
    {dc: new Date(), country: 'en', name: 'Олег Цыпляев', title:'Глава отдела мультимедиа', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/id3719280', name: 'Олег Цыпляев'}, photo: 'https://pp.vk.me/c622526/v622526280/5a1/3vNp6c-HAy4.jpg'},
    {dc: new Date(), country: 'en', name: 'Владислав Берестенёв', title:'Глава судейского корпуса', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/id32612983', name: 'Владислав Берестенёв'}, photo: 'https://pp.vk.me/c421430/v421430983/583c/zmQJUCGxaRw.jpg'},
    {dc: new Date(), country: 'en', name: 'Артур Григорян', title:'Главный редактор', phone: '+8 (999) 999-99-99', vk: {url:'https://vk.com/ateka', name: 'Атёка Григорян'}, photo: 'https://pp.vk.me/c10290/u337595/a_112b575a.jpg'}
]
