ProjectPage = require './project.coffee'
WithImages = require '../mixins/with-images.coffee'

AboutPage = ProjectPage.mix(WithImages).extend {}

module.exports = AboutPage
