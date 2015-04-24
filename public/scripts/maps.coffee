define ['jquery', 'maps/style', 'async!http://maps.google.com/maps/api/js?sensor=false'], ($, style)->
    init = () ->
        $('.js-map').each (i, item)->
            mapOptions =
                zoom: 13
                center: new google.maps.LatLng $(item).data('lat'), $(item).data('long')
                styles: style

            new google.maps.Map item, mapOptions

    google.maps.event.addDomListener(window, 'load', init);

    return {
        init: init
    }
