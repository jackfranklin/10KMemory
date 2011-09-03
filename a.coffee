class WordMemory 
    constructor: (startButton)->
        @startButton = startButton
        @init()

    init: ->
        $(@startButton).click (e) ->
            e.preventDefault()
            console.log "hi"



game = new WordMemory "#startButton"
