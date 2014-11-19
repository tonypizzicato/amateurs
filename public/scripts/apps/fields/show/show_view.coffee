define ['marionette'], (Marionette)->
    View = {}

    View.FieldsView = Marionette.CompositeView.extend
        ui:
            'comments': '.js-comments'

        initialize: ()->
            _.each $(@ui.comments), (comments)->
                new View.CommentsView el: comments

    View.CommentView = Marionette.ItemView.extend()


    View.CommentsView = Marionette.CompositeView.extend
        childView: View.CommentView

        ui:
            'buttonAdd':    '.js-comment-button-add'
            'buttonCancel': '.js-comment-button-cancel'
            'buttonSave':   '.js-comment-button-save'
            'input':        '.js-form-input'
            'commentForm':  '.js-comment-form'

        classes:
            'shown':  'comment__form_visible_yes'
            'hidden': 's_display_none'

        events:
            'click @ui.buttonAdd':     '_onAddCommentClicked'
            'click @ui.buttonCancel':  '_onCancelClicked'
            'click @ui.buttonSave':    '_onSaveClicked'
            'transitionend @ui.input': '_onFormTransitionEnd'

        _onAddCommentClicked: ()->
            @$el.find(@ui.commentForm).addClass @classes.shown
            @$el.find(@ui.input).focus()
            @_toggleButtons()

        _onCancelClicked: ()->
            @$el.find(@ui.commentForm).removeClass @classes.shown
            @_toggleButtons()

        _onSaveClicked: ()->
            console.log 'saved'
            @$el.find(@ui.commentForm).removeClass @classes.shown
            @_toggleButtons()

        _toggleButtons: ()->
            @$el.find(@ui.buttonSave).toggleClass @classes.hidden
            @$el.find(@ui.buttonAdd).toggleClass @classes.hidden

        _onFormTransitionEnd: ()->
            console.log 'transition end'
    View
