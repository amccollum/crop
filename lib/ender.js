(function($) {
  var Cropper;
  Cropper = require('crop').Cropper;
  $.ender({
    crop: function() {
      this.each(function(el) {
        var cropper;
        return cropper = new Cropper({
          el: this
        });
      });
      return this;
    }
  }, true);
  return $.ender({
    Cropper: Cropper,
    cropper: function(el) {
      return new Cropper({
        el: el
      });
    }
  });
})(ender);