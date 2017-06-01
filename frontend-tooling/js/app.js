/*(function (w) {
  w.app = {
    // Message to display
    startupMessage: 'Houston we have liftoff',
    shutdownMessage: 'Houston we have landed',
    /**
     * Initial startup method. 
     * Initializes app and prepares any necessary configuratio

    bootstrap: function () {
      console.log(this.startupMessage);
      this.$running = true;
    },
    stop: function () {
      if (this.$running) {
        console.log(this.shutdownMessage);
        this.$running = false;
      }
    }
  };
})(window); */

//See post here for more explanation of commented out code vs, implemented
// below: https://qa.moderndeveloper.com/t/front-end-tooling-cant-get-gulp-jasmine-unit-test-to-work/2779/3

module.exports = (function () {
    return {
        // Message to display
        startupMessage: 'Houston we have liftoff',
        shutdownMessage: 'Houston we have landed',
        /**
         * Initial startup method.
         * Initializes app and prepares any necessary configuratio
         **/
        bootstrap: function () {
            console.log(this.startupMessage);
            this.$running = true;
        },
        stop: function () {
            if (this.$running) {
                console.log(this.shutdownMessage);
                this.$running = false;
            }
        }
    }
})();