_ = require 'underscore'

ProjectPage = require './project.coffee'
WithImages = require '../mixins/with-images.coffee'

React = require('react');
Reactable = require('reactable');

StatsPage = ProjectPage.mix(WithImages).extend
    _selectors: ()->
        _.defaults {
            "table": '.js-stats-table'
        }, this._super()

    initialize: () ->
        this._initTable()

    _initTable: () ->
        Table = Reactable.Table
        unsafe = Reactable.unsafe

        tableEl = this._elem 'table'
        data = tableEl.data('data')

        data = data.map (item, i)->
            newItem = {}
#            newItem[unsafe('<i class="fa fa-sort-numeric-asc"></i>')] = i + '.'
            newItem[' '] = i + '.'

            newItem['Имя']  = item.playerName
            newItem['Клуб'] = unsafe('<span class="tl tl-' + _.last(item.teams)._id + '-20 s_mr_10"></span>' + _.last(item.teams).name)
            newItem['И']    = item.played
            newItem['Г']    = item.goals
            newItem['П']    = item.assists
            newItem['Г+П']  = item.goals + item.assists
            newItem['ЖК']   = item.yellowCards
            newItem['КК']   = item.redCards
            newItem['З']    = item.stars
            newItem['Очки'] = item.goals_assists_hearts_stars
            newItem

        return React.render(React.createElement(Table, {
            "className": "table",
            "data": data,
            "itemsPerPage": 50,
            "sortable": true
        }), tableEl.get(0));


module.exports = StatsPage
