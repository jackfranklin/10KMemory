class WordMemory
    constructor: (startButton, formInput)->
        @startButton = startButton
        @formInput = formInput
        @timerCount
        @maxWordLength = 3
        @currentLevel = 0
        @currentScore = 0
        @currentWords = []
        @wordsGot = []
        @levelRunning = false
        @wordnik = "03e4c5fc37b23b29ff30f0af73c00c5302cff40d81eb8b139"
        @init()

    init: ->
        #capture the form submit so hitting enter doesn't do anything
        $("form").submit (e) ->
            e.preventDefault()

        @hideInput()
        $("#words").hide()
        $(@startButton).click (e) =>
            e.preventDefault()
            $(@startButton).hide()
            @startLevel()
    collectWords: (amount=5) ->
        $.ajax({
            url: "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&limit=" + amount + "&maxLength=" + @maxWordLength + "&minLength=4&excludePartOfSpeech=abbreviation&api_key=" + @wordnik,
            dataType: "json",
            method: "get",
            async: false,
            success: (d) =>
                @currentWords.push(x.word.toLowerCase()) for x in d
                console.log @currentWords
        })
        

    startLevel: ->
        $("#words").html("");
        ++@currentLevel
        ++@maxWordLength if @maxWordLength < 10
        @levelRunning = true
        if(@currentLevel < 11)
            numWords = @currentLevel*2
        else
            numWords = 20
        numWords = 5 if numWords < 5
        timeAllowed = 5000
        inputTime = 30*1000
        console.log("Set inputTime to " + inputTime)
        #clear the list of words
        @currentWords = []
        @collectWords numWords

        @flashWords timeAllowed, ->
            @activateTimer 30
            @showInput inputTime
            @monitorInput numWords
        , this

    monitorInput:(totalWords) ->
        #this monitors the input for changes & checks if the value matches one of the required words
        $(@formInput).keyup =>
            inputVal = $(@formInput).val().toLowerCase()
            if inputVal in @currentWords
                @wordsGot.push(inputVal)
                @currentScore++
                $("#currentscore").text("Current Score: " + @currentScore)
                $(@formInput).val("")
            if @wordsGot.length is totalWords
                $(@formInput).unbind()
                @endLevel totalWords


    activateTimer: (amount) ->
        @timerCount = window.setInterval ->
            $("#timer strong").text(":"+amount)
            amount = amount-1
        , 1000

    deactivateTimer: ->
        window.clearInterval(@timerCount)
        $("#timer strong").text(":")


        
        
    endLevel: (numWords) ->
        @levelRunning = false
        @hideInput()
        @deactivateTimer()
        window.clearTimeout(@inputTimeout)
        passRate = (numWords/5)*4
        passLevel = false
        passLevel = true if @wordsGot.length >= passRate
        console.log(passRate, passLevel, @wordsGot.length)
        if passLevel is true
            alert("Level " + @currentLevel + " passed!")
            $("#wordlist").text("Congratulations! You passed the Level")
            $("#currentscore strong").text(":" + @currentScore)
            @advanceLevel()

        if passLevel is false
            $("#wordlist").text("Sorry, you lost the level. Your total score is displayed in the top right")
            $("#currentscore").text(":" + @currentScore)
            alert("you lose")
            # TODO: Build in some form of reset here.
            
    advanceLevel: ->
        $("#startButton").text("On to Level " + (@currentLevel+1) + ". Get ready for more words but no more time!")
        @wordsGot = []
        setTimeout =>
            @startLevel()
        , 1000

    flashWords: (timeout, callback, scope) ->
        #adds the words to the paragraph & shows them for timeout seconds
        $("#words").append("<li>" + x + "</li>") for x in @currentWords
        $("#words").slideDown()
        setTimeout ->
            $("#words").slideUp()
            callback.call(scope)
        ,timeout
        


    showInput: (timeout=0) ->
        console.log $(@formInput)
        $(@formInput).parents("form").css("visibility", "visible")
        if timeout isnt 0 then @inputTimeout = setTimeout =>
            @hideInput()
            if @levelRunning is true
                @endLevel @currentWords.length
        , timeout


    hideInput: ->
        $(@formInput).parents("form").css("visibility", "hidden") 
    


window.game = new WordMemory "#startButton", "#wordinput"
