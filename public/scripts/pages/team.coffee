ProjectPage = require './project.coffee'
WithImages = require '../mixins/with-images.coffee'

TeamPage = ProjectPage.mix(WithImages).extend {}

module.exports = TeamPage
