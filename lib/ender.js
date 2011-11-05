(function($) {
  var crop;
  crop = require('crop');
  return $.ender({
    crop: function() {
      var cropper;
      cropper = new crop.Cropper({
        target: this
      });
      return this;
    }
  }, true);
})(ender);