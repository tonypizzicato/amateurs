$ = require 'jquery'
_ = require 'underscore'

WithStickyMenu =

    _classes: ()->
        _.defaults {
            "original": 'original'
            "fixed": 'navbar-fixed-top'
        }, this._super()

    _selectors: ()->
        _.defaults {
            "menu": '.js-sticky-menu'
        }, this._super()

    initialize: ()->
        this._super()

        this._initMenu()

    _initMenu: ()->
        this._elem('menu')
            .addClass(this._class 'original')
            .clone()
            .insertAfter(this._elem 'menu')
            .addClass(this._class 'fixed')
            .css('position', 'fixed')
            .css('top', '0')
            .css('margin-top', '0')
            .removeClass(this._class 'original')

        $('nav.navbar-fixed-top .navbar-brand img').attr('src', $('nav.navbar-fixed-top .navbar-brand img').data("active-url"));


        onScroll = ()=>
            if ($(window).scrollTop() > this._elem('original').offset().top)
                $('nav.original').css('opacity', '0');
                $('nav.navbar-fixed-top').css('opacity', '1');
            else
                $('nav.original').css('opacity', '1');
                $('nav.navbar-fixed-top').css('opacity', '0');

        setTimeout onScroll, 200

        window.addEventListener('scroll', onScroll, false);



module.exports = WithStickyMenu
