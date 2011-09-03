(function() {
  var WordMemory;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  WordMemory = (function() {
    function WordMemory(startButton, formInput) {
      this.startButton = startButton;
      this.formInput = formInput;
      this.currentLevel = 0;
      this.currentScore = 0;
      this.currentWords = [];
      this.wordsGot = [];
      this.levelRunning = false;
      this.wordnik = "03e4c5fc37b23b29ff30f0af73c00c5302cff40d81eb8b139";
      this.init();
    }
    WordMemory.prototype.init = function() {
      return $(this.startButton).click(__bind(function(e) {
        e.preventDefault();
        $(this.startButton).hide();
        return this.startLevel();
      }, this));
    };
    WordMemory.prototype.collectWords = function(amount) {
      if (amount == null) {
        amount = 5;
      }
      return $.ajax({
        url: "http://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&limit=" + amount + "&maxLength=4&minLength=2&api_key=" + this.wordnik,
        dataType: "json",
        method: "get",
        async: false,
        success: __bind(function(d) {
          var x, _i, _len;
          for (_i = 0, _len = d.length; _i < _len; _i++) {
            x = d[_i];
            this.currentWords.push(x.word.toLowerCase());
          }
          return console.log(this.currentWords);
        }, this)
      });
    };
    WordMemory.prototype.startLevel = function() {
      var inputTime, numWords, timeAllowed;
      ++this.currentLevel;
      this.levelRunning = true;
      numWords = this.currentLevel * 5;
      timeAllowed = 5000;
      inputTime = (numWords * 3) * 1000;
      this.currentWords = [];
      this.collectWords(numWords);
      return this.flashWords(timeAllowed, function() {
        this.showInput(inputTime);
        return this.monitorInput(numWords);
      }, this);
    };
    WordMemory.prototype.monitorInput = function(totalWords) {
      return $(this.formInput).keyup(__bind(function() {
        var inputVal;
        inputVal = $(this.formInput).val().toLowerCase();
        if (__indexOf.call(this.currentWords, inputVal) >= 0) {
          this.wordsGot.push(inputVal);
          this.currentScore++;
          $("#currentscore").text("Current Score: " + this.currentScore);
          $(this.formInput).val("");
        }
        if (this.wordsGot.length === totalWords) {
          $(this.formInput).unbind();
          return this.endLevel(totalWords);
        }
      }, this));
    };
    WordMemory.prototype.endLevel = function(numWords) {
      var passLevel, passRate;
      this.levelRunning = false;
      this.hideInput();
      passRate = (numWords / 5) * 4;
      passLevel = false;
      if (this.wordsGot.length >= passRate) {
        passLevel = true;
      }
      console.log(passRate, passLevel, this.wordsGot.length);
      this.currentScore += this.wordsGot.length;
      if (passLevel === true) {
        alert("Level " + this.currentLevel + " passed!");
        $("#wordlist").text("Congratulations! You passed the Level");
        $("#currentscore").text("Current Score: " + this.currentScore);
        this.advanceLevel();
      }
      if (passLevel === false) {
        $("#wordlist").text("Sorry, you lost the level. Your total score is displayed in the top right");
        $("#currentscore").text("Current Score: " + this.currentScore);
        return alert("you lose");
      }
    };
    WordMemory.prototype.advanceLevel = function() {
      $("#wordlist").text("On to Level " + (this.currentLevel + 1) + ". Get ready for more words but no more time!");
      this.wordsGot = [];
      return setTimeout(__bind(function() {
        return this.startLevel();
      }, this), 1000);
    };
    WordMemory.prototype.flashWords = function(timeout, callback, scope) {
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
          if (this.levelRunning === true) {
            return this.endLevel(this.currentWords.length);
          }
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
