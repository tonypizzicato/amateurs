$ = require 'jquery'
_ = require 'underscore'
Backbone = require '../utils/backbone.coffee'

Tabs = require './tabs.coffee'

LazyTabs = Tabs.extend

    _selectors: ()->
        _.defaults {
            "tab-item": '.js-tab-lazy'
            'panel': '.panel__body'
            'accordion': '.js-accordion-item'
            'activeTab': '.tab__title.active .js-tab-lazy'
        }, this._super()

    _initTabs: ()->
        this._super()

        this._elem('tab-item').on 'shown.bs.tab', (e) =>
            control = $(e.target)

            console.log('tab shown');
            unless control.data 'ready'
                $.ajax
                    url: '/lazy/' + control.data('route') + '/' + control.data('name')
                    success: (data) =>
                        $(control.attr('href')).find(this._selector 'panel').fadeOut(400, ->
                            $(@).html data
                            $(@).fadeIn 500
                        )
                        $(control.attr('href')).parents(this._selector 'accordion').css({height: 'auto'})
                        control.data 'ready', true
                    error: =>
                        $(control.attr('href')).find(this._selector 'panel').html 'error'

        this._elem('activeTab').trigger("shown.bs.tab");

module.exports = LazyTabs
