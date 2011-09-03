(function() {
  var WordMemory;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  WordMemory = (function() {
    function WordMemory(startButton, formInput) {
      this.startButton = startButton;
      this.formInput = formInput;
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
        return this.startLevel();
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
        async: false,
        success: __bind(function(d) {
          var x, _i, _len;
          for (_i = 0, _len = d.length; _i < _len; _i++) {
            x = d[_i];
            this.currentWords.push(x.word);
          }
          return console.log(this.currentWords);
        }, this)
      });
    };
    WordMemory.prototype.startLevel = function() {
      var inputTime, numWords, timeAllowed;
      ++this.currentLevel;
      numWords = this.currentLevel * 5;
      timeAllowed = 5000;
      inputTime = (numWords * 3) * 1000;
      console.log(timeAllowed);
      this.collectWords(numWords);
      return this.flashWords(timeAllowed, function() {
        this.showInput(inputTime);
        return this.monitorInput(numWords);
      }, this);
    };
    WordMemory.prototype.monitorInput = function(totalWords) {
      return $(this.formInput).keyup(__bind(function() {
        var x, _i, _len, _ref;
        console.log($(this.formInput).val());
        _ref = this.currentWords;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          x = _ref[_i];
          if (x === $(this.formInput).val()) {
            this.wordsGot.push($(this.formInput).val());
            $(this.formInput).val("");
          }
        }
        console.log("wordsGot: ", this.wordsGot);
        if (this.wordsGot.length === totalWords) {
          return this.endLevel();
        }
      }, this));
    };
    WordMemory.prototype.flashWords = function(timeout, callback, scope) {
      console.log("flash words called");
      $("#updates").hide().text(this.currentWords.join(" ")).show();
      return setTimeout(function() {
        $("#updates").hide();
        return callback.call(scope);
      }, timeout);
    };
    WordMemory.prototype.showInput = function(timeout) {
      if (timeout == null) {
        timeout = 0;
      }
      console.log($(this.formInput));
      $(this.formInput).parents("form").show();
      if (timeout !== 0) {
        return setTimeout(__bind(function() {
          this.hideInput();
          return this.endLevel();
        }, this), timeout);
      }
    };
    WordMemory.prototype.hideInput = function() {
      return $(this.formInput).parents("form").hide();
    };
    return WordMemory;
  })();
  window.game = new WordMemory("#startButton", "#wordinput");
}).call(this);
