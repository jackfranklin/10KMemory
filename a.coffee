class WordMemory 
    constructor: (startButton, formInput)->
        @startButton = startButton
        @formInput = formInput;
        @currentLevel = 0
        @currentScore = 0
        @currentWords = []
        @wordsGot = []
        @wordnik = "03e4c5fc37b23b29ff30f0af73c00c5302cff40d81eb8b139"
        @init()

    init: ->
        $(@startButton).click (e) =>
            e.preventDefault()
            @startLevel()
    collectWords: (amount=5) ->
        $.ajax({
            url: "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&limit=" + amount + "&maxLength=8&minLength=2&api_key=" + @wordnik,
            dataType: "json",
            method: "get",
            async: "false",
            success: (d) =>
                @currentWords.push(x.word) for x in d
        })

    startLevel: ->
        ++@currentLevel
        numWords = @currentLevel*5
        timeAllowed = (numWords*3)*1000
        @collectWords numWords
        @showInput()

    monitorInput: ->
        #this monitors the input for changes & checks if the value matches one of the required words

    flashWords: (timeout) ->
        #adds the words to the paragraph & shows them for timeout seconds
        $("#updates").hide().text(@currentWords.join(" "))
        setTimeout ->
            $("#updates").hide()
        ,timeout
        


    showInput: (timeout=0) ->
        console.log $(@formInput);
        $(@formInput).parents("form").show()
        if timeout isnt 0 then setTimeout =>
            @hideInput
        , timeout

    hideInput: ->
        $(@formInput).parents("form").hide()
    
    


window.game = new WordMemory "#startButton", "#wordinput"
