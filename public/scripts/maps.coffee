define ['jquery', 'maps/style', 'async!http://maps.google.com/maps/api/js?sensor=false'], ($, style)->
    init = () ->
        $('.js-map').each (i, item)->
            center = new google.maps.LatLng $(item).data('lat'), $(item).data('long')
            mapOptions =
                zoom: 14
                center: center

            map = new google.maps.Map item, mapOptions

            new google.maps.Marker
                position: center
                map: map
                title: $(item).data('title')



    google.maps.event.addDomListener(window, 'load', init);

    return {
        init: init
    }
