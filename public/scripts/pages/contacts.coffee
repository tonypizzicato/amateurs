$ = require 'jquery'
_ = require 'underscore'

ProjectPage = require './project.coffee'
WithMasonry = require '../mixins/with-masonry-item.coffee'
StepForm = require '../elements/stepform.coffee'

ContactsPage = ProjectPage.mix(WithMasonry).extend

    _selectors: ()->
        _.defaults {
            "form": '.js-contacts-form'
            "stepform": '.js-stepform-inner'
            "message": '.final-message'
        }, this._super()


    initialize: ()->
        this._super()

        this._initForm()

    _initForm: ()->

        if this._elem('form').length
            new StepForm this._elem('form').get(0),
                onSubmit: ()=>
                    $.post '/orders', this._elem('form').serializeObject()

                    console.log 'submitted'
                    this._elem('stepform').addClass 'hide'
                    this._elem('message').addClass 'show'
                    setTimeout =>
                        this._elem('message').removeClass 'show'
                        this._elem('form').removeClass 's_mb_40'
                        this._elem('form').addClass 'hide'
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


module.exports = ContactsPage
