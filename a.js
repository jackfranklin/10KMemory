(function() {
  var WordMemory, game;
  WordMemory = (function() {
    function WordMemory(startButton) {
      this.startButton = startButton;
      this.init();
    }
    WordMemory.prototype.init = function() {
      return $(this.startButton).click(function(e) {
        e.preventDefault();
        return console.log("hi");
      });
    };
    return WordMemory;
  })();
  game = new WordMemory("#startButton");
}).call(this);
