ProjectPage = require './project.coffee'
WithImages = require '../mixins/with-images.coffee'

PlayerPage = ProjectPage.mix(WithImages).extend {}

module.exports = PlayerPage
