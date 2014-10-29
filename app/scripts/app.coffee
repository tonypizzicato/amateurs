define ['marionette'], (Marionette) ->
  App = new Marionette.Application()

  App.on 'start', ()->
      console.log 'app started'
