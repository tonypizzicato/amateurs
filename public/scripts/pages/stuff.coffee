ProjectPage = require './project.coffee'

WithTabs = require '../mixins/with-masonry-tabs.coffee'
WithMasonry = require '../mixins/with-masonry-item.coffee'

StuffPage = ProjectPage.mix(WithTabs, WithMasonry).extend {}

module.exports = StuffPage
