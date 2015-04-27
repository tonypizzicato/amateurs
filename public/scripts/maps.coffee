define ['jquery', 'maps/style', 'async!http://maps.google.com/maps/api/js?sensor=false'], ($, style)->
    init = () ->
        $('.js-map').each (i, item)->
            mapOptions =
                zoom: 14
                center: new google.maps.LatLng $(item).data('lat'), $(item).data('long')

            new google.maps.Map item, mapOptions

    google.maps.event.addDomListener(window, 'load', init);

    return {
        init: init
    }
