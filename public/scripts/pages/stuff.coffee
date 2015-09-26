ProjectPage = require './project.coffee'
WithMasonry = require '../mixins/with-masonry-item.coffee'
WithTabs = require '../mixins/with-tabs.coffee'

StuffPage = ProjectPage.mix(WithTabs, WithMasonry).extend {}

module.exports = StuffPage
