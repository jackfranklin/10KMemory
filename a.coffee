class WordMemory 
    constructor: (startButton)->
        @startButton = startButton
        @currentLevel = 0
        @currentScore = 0
        @currentWords = []
        @wordsGot = []
        @wordnik = "03e4c5fc37b23b29ff30f0af73c00c5302cff40d81eb8b139"
        @init()

    init: ->
        $(@startButton).click (e) =>
            e.preventDefault()
            @collectWords(5)

    collectWords: (amount=5) ->
        $.ajax({
            url: "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&limit=" + amount + "&maxLength=8&minLength=2&api_key=" + @wordnik,
            dataType: "json",
            method: "get",
            async: "false",
            success: (d) ->
                console.log d
                i = 0
                @currentWords.push d[i].word while i++ < d.length
                
        }); 



game = new WordMemory "#startButton"
