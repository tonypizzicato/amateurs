define ['./show_view'], (ShowView)->
    show: ()->
        new ShowView.FieldsView el: $('#main')
