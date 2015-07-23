ProjectPage = require './project.coffee'
WithMasonry = require '../mixins/with-masonry-item.coffee'
Maps = require '../elements/maps.coffee'

FieldsPage = ProjectPage.mix(WithMasonry).extend {}


module.exports = FieldsPage
