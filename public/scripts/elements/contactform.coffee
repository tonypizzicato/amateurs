$ = require 'jquery'
_ = require 'underscore'
Backbone = require '../utils/backbone.coffee'

require 'bootstrap'

Tabs = Backbone.View.extend

    _selectors: ()->
        _.defaults {
            "input": 'input',
            "field": '.form-field'
            "message": '.final'
            "button": '.js-button-submit'
            "buttonLabel": '.js-button-span'
            "buttonLabelOk": '.js-button-span-ok'
            "teamOrPlayer": '.js-radio-group-team-or-player input[name=teamOrPlayer]'
            "teamOrPlayerChecked": '.js-radio-group-team-or-player input:checked'
            "more": '.js-contacts-form-additional'
            "moreItem": '.js-contacts-form-additional-item'
        }, this._super();

    _classes: ()->
        _.defaults {
            "not-empty": 'not-empty'
            "error": 'error'
            "animated": 'animated'
            "fadeIn": 'fadeIn'
            "fadeInUp": 'fadeInUp'
            "fadeOut": 'fadeOutUp'
            "hidden": 's_display_none'
            "visible": 's_display_block'
        }, this._super();

    initialize: (options)->
        this._super(options);

        this._submitted = false

        this._onSubmit = options.onSubmit

        this._initForm()

    _initForm: ()->
        d = this._elem('moreItem').detach()

        this._elem('teamOrPlayer').change (e) =>
            this._elem('more').empty()
            i = this._elem('teamOrPlayer').index(e.target)
            $(d[i]).removeClass(this._class('hidden')).appendTo(this._elem('more'))

            this._elem('button').prop 'disabled', false

        this.$el.submit (e) =>
            e.preventDefault()
            error = false

            unless this._submitted
                this._elem('field').each (i, field)=>
                    $field = $(field)
                    value = $field.find('input').val()

                    if $field.hasClass(this._class 'not-empty') && value == ''
                        this._showError $field
                        error = true;
                        return false
                    else
                        this._hideError $field

                if !error
                    this._elem('buttonLabel').addClass this._class('fadeOut')
                    this._elem('buttonLabelOk').addClass this._class('fadeInUp')
                    this._submitted = true
                    this._onSubmit() if this._onSubmit

    _showError: (field)->
        field.addClass(this._class('error'))

    _hideError: (field)->
        field.removeClass(this._class('error'))


module.exports = Tabs
