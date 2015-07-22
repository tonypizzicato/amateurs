$ = require 'jquery'
_ = require 'underscore'
Backbone = require '../utils/backbone.coffee'

ProjectPage = require './project.coffee'

WithLazyTabs = require '../mixins/with-lazy-tabs.coffee'

IndexPage = ProjectPage.mix(WithLazyTabs).extend

    initialize: ()->
        console.log 'initialize index page'
        this._super()

        this._initForm()

    _initForm: ()->

        if $('.js-contacts-form').length
            new StepForm $('.js-contacts-form')[0],
                onSubmit: ()->
                    $.post '/orders', $('.js-contacts-form').serializeObject()

                    console.log 'submitted'
                    $('.js-stepform-inner').addClass 'hide'
                    $('.final-message').addClass 'show'
                    setTimeout ->
                        $('.final-message').removeClass 'show'
                        $('.js-contacts-form').removeClass 's_mb_40'
                        $('.js-contacts-form').addClass 'hide'
                    , 3000

        $.fn.serializeObject = ->
            o = {}
            a = @serializeArray()
            $.each a, ->
                if o[@name] != undefined
                    if !o[@name].push
                        o[@name] = [o[@name]]
                    o[@name].push @value or ''
                else
                    o[@name] = @value or ''
                return
            o


module.exports = IndexPage
