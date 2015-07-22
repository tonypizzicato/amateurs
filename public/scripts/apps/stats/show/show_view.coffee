Marionette = require 'backbone.marionette'
View = {}

View.StatsVeiw = Marionette.ItemView.extend
    ui:
        'table': '.js-table'

    classes:
        'shown':  'comment__form_visible_yes'
        'hidden': 's_display_none'

    events:
        'click @ui.buttonAdd':     '_onAddCommentClicked'
        'click @ui.buttonCancel':  '_onCancelClicked'
        'click @ui.buttonSave':    '_onSaveClicked'
        'transitionend @ui.input': '_onFormTransitionEnd'

    initialize: ()->
        console.log 'show stats view'

module.exports = View
