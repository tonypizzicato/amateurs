$ = require 'jquery'
_ = require 'underscore'

ProjectPage = require './project.coffee'
WithMasonry = require '../mixins/with-masonry-item.coffee'
ContactForm = require '../elements/contactform.coffee'

ContactsPage = ProjectPage.mix(WithMasonry).extend

    _selectors: ()->
        _.defaults {
            "form": '.js-contacts-form'
        }, this._super()


    initialize: ()->
        this._super()

        this._initForm()

    _initForm: ()->
        if this._elem('form').length
            new ContactForm
                el: this._elem('form'),
                onSubmit: ()=>
                    $.post '/orders', this._elem('form').serializeObject()

                    console.log 'submitted'

        $.fn.serializeObject = ->
            o = {}
            a = @serializeArray()
            $.each a, ->
                o[@name] = @value or ''
            o


module.exports = ContactsPage
