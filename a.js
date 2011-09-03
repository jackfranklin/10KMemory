(function() {
  var WordMemory, game;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  WordMemory = (function() {
    function WordMemory(startButton) {
      this.startButton = startButton;
      this.currentLevel = 0;
      this.currentScore = 0;
      this.currentWords = [];
      this.wordsGot = [];
      this.wordnik = "03e4c5fc37b23b29ff30f0af73c00c5302cff40d81eb8b139";
      this.init();
    }
    WordMemory.prototype.init = function() {
      return $(this.startButton).click(__bind(function(e) {
        e.preventDefault();
        return this.collectWords(5);
      }, this));
    };
    WordMemory.prototype.collectWords = function(amount) {
      if (amount == null) {
        amount = 5;
      }
      return $.ajax({
        url: "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&limit=" + amount + "&maxLength=8&minLength=2&api_key=" + this.wordnik,
        dataType: "json",
        method: "get",
        async: "false",
        success: function(d) {
          var i, _results;
          console.log(d);
          i = 0;
          _results = [];
          while (i++ < d.length) {
            _results.push(this.currentWords.push(d[i].word));
          }
          return _results;
        }
      });
    };
    return WordMemory;
  })();
  game = new WordMemory("#startButton");
}).call(this);
