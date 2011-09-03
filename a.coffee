class WordMemory
    constructor: (startButton, formInput)->
        @startButton = startButton
        @formInput = formInput
        @currentLevel = 0
        @currentScore = 0
        @currentWords = []
        @wordsGot = []
        @wordnik = "03e4c5fc37b23b29ff30f0af73c00c5302cff40d81eb8b139"
        @init()

    init: ->
        $(@startButton).click (e) =>
            e.preventDefault()
            $(@startButton).hide();
            @startLevel()
    collectWords: (amount=5) ->
        $.ajax({
            url: "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&limit=" + amount + "&maxLength=4&minLength=2&api_key=" + @wordnik,
            dataType: "json",
            method: "get",
            async: false,
            success: (d) =>
                @currentWords.push(x.word.toLowerCase()) for x in d
                console.log @currentWords
        })

    startLevel: ->
        ++@currentLevel
        numWords = @currentLevel*5
        timeAllowed = 5000
        inputTime = (numWords*3)*1000
        console.log timeAllowed
        @collectWords numWords

        @flashWords timeAllowed, ->
            @showInput inputTime
            @monitorInput numWords
        , this

    monitorInput:(totalWords) ->
        #this monitors the input for changes & checks if the value matches one of the required words
        $(@formInput).keyup =>
            console.log($(@formInput).val())
            for x in @currentWords when x is $(@formInput).val().toLowerCase()
                @wordsGot.push($(@formInput).val())
                $(@formInput).val("")
            console.log("wordsGot: ", @wordsGot)
            @endLevel() if @wordsGot.length is totalWords


    endLevel: (numWords) ->
        passRate = (numWords/5)*4
        passLevel = false
        passLevel = true if @wordsGot.length >= passRate
        @currentScore += @wordsGot.length
        if passLevel is true
            alert("Level " + @currentLevel + " passed!")
            $("#currentscore").text("Current Score: " + @currentScore)

        if passLevel is false
            alert("you lose")


    flashWords: (timeout, callback, scope) ->
        console.log "flash words called"
        #adds the words to the paragraph & shows them for timeout seconds
        $("#updates").hide().text(@currentWords.join(" ")).show()
        setTimeout ->
            $("#updates").hide()
            callback.call(scope)
        ,timeout
        


    showInput: (timeout=0) ->
        console.log $(@formInput)
        $(@formInput).parents("form").show()
        if timeout isnt 0 then setTimeout =>
            @hideInput()
            @endLevel()
        , timeout

    hideInput: ->
        $(@formInput).parents("form").hide()
    
    


window.game = new WordMemory "#startButton", "#wordinput"
