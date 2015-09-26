ProjectPage = require './project.coffee'
WithMasonryTabs = require '../mixins/with-masonry-tabs.coffee'

StuffPage = ProjectPage.mix(WithMasonryTabs).extend {}

module.exports = StuffPage
