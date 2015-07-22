$ = require 'jquery'

extend = (a, b) ->
    for key of b
        if b.hasOwnProperty(key)
            a[key] = b[key]
    a

StepsForm = (el, options) ->
    @el = el
    @options = extend({}, @options)
    extend @options, options
    @_init()

# generates a unique id

randomID = ->
    id = Math.random().toString(36).substr(2, 9)
    if document.getElementById(id)
        return randomID()
    id

'use strict'
transEndEventNames =
    'WebkitTransition': 'webkitTransitionEnd'
    'MozTransition': 'transitionend'
    'OTransition': 'oTransitionEnd'
    'msTransition': 'MSTransitionEnd'
    'transition': 'transitionend'
transEndEventName = transEndEventNames[Modernizr.prefixed('transition')]
support = transitions: Modernizr.csstransitions


StepsForm::options = onSubmit: ->
    false

StepsForm::_init = ->
    # current question
    @current = 0
    # questions
    @questions = [].slice.call(@el.querySelectorAll('ol.questions > li'))
    # total questions
    @questionsCount = @questions.length
    # show first question
    $(@questions[0]).addClass 'current'
    # next question control
    @ctrlNext = @el.querySelector('button.next')
    @ctrlNext.setAttribute 'aria-label', 'Next'
    # progress bar
    @progress = @el.querySelector('div.progress')
    # set progressbar attributes
    @progress.setAttribute 'role', 'progressbar'
    @progress.setAttribute 'aria-readonly', 'true'
    @progress.setAttribute 'aria-valuemin', '0'
    @progress.setAttribute 'aria-valuemax', '100'
    @progress.setAttribute 'aria-valuenow', '0'
    # question number status
    @questionStatus = @el.querySelector('span.number')
    # give the questions status an id
    @questionStatus.id = @questionStatus.id or randomID()
    # associate "x / y" with the input via aria-describedby
    i = @questions.length - 1
    while i >= 0
        formElement = @questions[i].querySelector('input')
        formElement.setAttribute 'aria-describedby', @questionStatus.id
        i--
    # current question placeholder
    @currentNum = @questionStatus.querySelector('span.number-current')
    @currentNum.innerHTML = Number(@current + 1)
    # total questions placeholder
    @totalQuestionNum = @questionStatus.querySelector('span.number-total')
    @totalQuestionNum.innerHTML = @questionsCount
    # error message
    @error = @el.querySelector('span.error-message')
    # checks for HTML5 Form Validation support
    # a cleaner solution might be to add form validation to the custom Modernizr script
    @supportsHTML5Forms = typeof document.createElement('input').checkValidity == 'function'
    # init events
    @_initEvents()

StepsForm::_initEvents = ->
    self = this
    firstElInput = @questions[@current].querySelector('input')

    onFocusStartFn = ->
        firstElInput.removeEventListener 'focus', onFocusStartFn
        $(self.ctrlNext).addClass 'show'

    # show the next question control first time the input gets focused
    firstElInput.addEventListener 'focus', onFocusStartFn
    # show next question
    @ctrlNext.addEventListener 'click', (ev) ->
        ev.preventDefault()
        self._nextQuestion()

    # pressing enter will jump to next question
    document.addEventListener 'keydown', (ev) ->
        keyCode = ev.keyCode or ev.which
        # enter
        if keyCode == 13
            ev.preventDefault()
            self._nextQuestion()

StepsForm::_nextQuestion = ->
    if !@_validate()
        return false
    # checks HTML5 validation
    if @supportsHTML5Forms
        input = @questions[@current].querySelector('input')
        # clear any previous error messages
        input.setCustomValidity ''
        # checks input against the validation constraint
        if !input.checkValidity()
            # Optionally, set a custom HTML5 valiation message
            # comment or remove this line to use the browser default message
            input.setCustomValidity 'Уууупс, кажется это не email адрес!'
            # display the HTML5 error message
            @_showError input.validationMessage
            # prevent the question from changing
            return false
    # check if form is filled
    if @current == @questionsCount - 1
        @isFilled = true
    # clear any previous error messages
    @_clearError()
    # current question
    currentQuestion = @questions[@current]
    # increment current question iterator
    ++@current
    # update progress bar
    @_progress()
    if !@isFilled
        # change the current question number/status
        @_updateQuestionNumber()
        # add class "show-next" to form element (start animations)
        $(@el).addClass 'show-next'
        # remove class "current" from current question and add it to the next one
        # current question
        nextQuestion = @questions[@current]
        $(currentQuestion).removeClass 'current'
        $(nextQuestion).addClass 'current'
    # after animation ends, remove class "show-next" from form element and change current question placeholder
    self = this

    onEndTransitionFn = (ev) ->
        if support.transitions
            @removeEventListener transEndEventName, onEndTransitionFn
        if self.isFilled
            self._submit()
        else
            $(self.el).removeClass 'show-next'
            self.currentNum.innerHTML = self.nextQuestionNum.innerHTML
            self.questionStatus.removeChild self.nextQuestionNum
            # force the focus on the next input
            nextQuestion.querySelector('input').focus()
        return

    if support.transitions
        @progress.addEventListener transEndEventName, onEndTransitionFn
    else
        onEndTransitionFn()

# updates the progress bar by setting its width

StepsForm::_progress = ->
    currentProgress = @current * 100 / @questionsCount
    @progress.style.width = currentProgress + '%'
    # update the progressbar's aria-valuenow attribute
    @progress.setAttribute 'aria-valuenow', currentProgress

# changes the current question number

StepsForm::_updateQuestionNumber = ->
    # first, create next question number placeholder
    @nextQuestionNum = document.createElement('span')
    @nextQuestionNum.className = 'number-next'
    @nextQuestionNum.innerHTML = Number(@current + 1)
    # insert it in the DOM
    @questionStatus.appendChild @nextQuestionNum

# submits the form

StepsForm::_submit = ->
    @options.onSubmit @el

# TODO (next version..)
# the validation function

StepsForm::_validate = ->
    # current question´s input
    input = @questions[@current].querySelector('input').value
    if input == ''
        @_showError 'EMPTYSTR'
        return false
    true

# TODO (next version..)

StepsForm::_showError = (err) ->
    message = ''
    switch err
        when 'EMPTYSTR'
            message = 'Заполните поле для продолжения'
        when 'INVALIDEMAIL'
            message = 'Введите правильный email адрес'
        # ...
        else
            message = err
    @error.innerHTML = message
    $(@error).addClass 'show'

# clears/hides the current error message

StepsForm::_clearError = ->
    $(@error).removeClass 'show'

module.exports = StepsForm
