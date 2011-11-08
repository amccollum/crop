var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
(function(crop) {
  var clamp;
  clamp = function(val, min, max) {
    return Math.min(Math.max(val, min), max);
  };
  return crop.Cropper = (function() {
    function Cropper(options) {
      this._dragend = __bind(this._dragend, this);
      this._dragmove = __bind(this._dragmove, this);
      this._dragbegin = __bind(this._dragbegin, this);
      this._resizeend = __bind(this._resizeend, this);
      this._resizemove = __bind(this._resizemove, this);
      this._resizebegin = __bind(this._resizebegin, this);
      this._mousedown = __bind(this._mousedown, this);      this.target = $(options.target);
      this.aspectRatio = 0.8;
      this.el = $('<div class="cropper">\n    <div class="overlay north"></div>\n    <div class="overlay south"></div>\n    <div class="overlay west"></div>\n    <div class="overlay east"></div>\n    <div class="border north"><div class="ants"></div></div>\n    <div class="border south"><div class="ants"></div></div>\n    <div class="border west"><div class="ants"></div></div>\n    <div class="border east"><div class="ants"></div></div>\n    <div class="handle north west"></div>\n    <div class="handle north east"></div>\n    <div class="handle south west"></div>\n    <div class="handle south east"></div>\n</div>');
      if (!this.aspectRatio) {
        this.el.append('<div class="handle north"></div>\n<div class="handle south"></div>\n<div class="handle west"></div>\n<div class="handle east"></div>');
      }
      this.el.bind('mousedown', this._mousedown);
      $('body').append(this.el);
      this._reset();
      this._style();
    }
    Cropper.prototype.$ = function(selector) {
      return $(selector, this.el);
    };
    Cropper.prototype._reset = function() {
      this.el.css({
        'cursor': 'crosshair'
      });
      this.x1 = this.x2 = this.y1 = this.y2 = null;
      this.xMin = this.yMin = this.xMid = this.yMid = this.xMax = this.yMax = null;
      return this.$('*').hide();
    };
    Cropper.prototype._style = function() {
      var step;
      this.offset = this.target.offset();
      this.el.css({
        'position': 'absolute',
        'z-index': 1000,
        'top': this.offset.top,
        'left': this.offset.left,
        'width': this.offset.width,
        'height': this.offset.height
      });
      this.$('*').css({
        'position': 'absolute'
      });
      this.$('.handle').css({
        'width': '9px',
        'height': '9px',
        'border': '1px solid rgba(240, 240, 240, 0.6)',
        'background-color': 'rgba(16, 16, 16, 0.5)'
      });
      this.$('.overlay').css({
        'cursor': 'crosshair',
        'background-color': 'rgba(0, 0, 0, 0.4)'
      });
      this.$('.border').css({
        'background-color': 'rgba(0, 0, 0, 0.4)',
        'overflow': 'hidden'
      });
      this.$('.ants').css({
        'width': this.offset.width + 132,
        'height': this.offset.height + 132,
        'border': '2px dashed rgba(240, 240, 240, 0.4)'
      });
      this.$('.handle.north').css({
        'cursor': 'n-resize'
      });
      this.$('.handle.south').css({
        'cursor': 's-resize'
      });
      this.$('.handle.west').css({
        'cursor': 'w-resize'
      });
      this.$('.handle.east').css({
        'cursor': 'e-resize'
      });
      this.$('.handle.north.west').css({
        'cursor': 'nw-resize'
      });
      this.$('.handle.north.east').css({
        'cursor': 'ne-resize'
      });
      this.$('.handle.south.west').css({
        'cursor': 'sw-resize'
      });
      this.$('.handle.south.east').css({
        'cursor': 'se-resize'
      });
      step = -1;
      return $.timeout(100, __bind(function() {
        if (!this.el[0].parentNode) {
          return false;
        }
        step = (step + 1) % 120;
        this.$('.border.north .ants, .border.south .ants').css({
          'margin-left': -120 + step
        });
        this.$('.border.west .ants, .border.east .ants').css({
          'margin-top': -120 + step
        });
        return true;
      }, this));
    };
    Cropper.prototype._update = function() {
      this.xMin = Math.round(Math.min(this.x1, this.x2));
      this.xMax = Math.round(Math.max(this.x1, this.x2));
      this.yMin = Math.round(Math.min(this.y1, this.y2));
      this.yMax = Math.round(Math.max(this.y1, this.y2));
      this.xMid = this.xMin + (this.xMax - this.xMin) / 2;
      this.yMid = this.yMin + (this.yMax - this.yMin) / 2;
      this.$('.overlay.north').css({
        'top': 0,
        'bottom': this.offset.height - this.yMin,
        'left': 0,
        'right': 0
      });
      this.$('.overlay.south').css({
        'top': this.yMax,
        'bottom': 0,
        'left': 0,
        'right': 0
      });
      this.$('.overlay.west').css({
        'top': this.yMin,
        'bottom': this.offset.height - this.yMax,
        'left': 0,
        'right': this.offset.width - this.xMin
      });
      this.$('.overlay.east').css({
        'top': this.yMin,
        'bottom': this.offset.height - this.yMax,
        'right': 0,
        'left': this.xMax
      });
      this.$('.border.north').css({
        'top': this.yMin,
        'bottom': (this.offset.height - this.yMin) - 1,
        'left': this.xMin,
        'right': this.offset.width - this.xMax
      });
      this.$('.border.south').css({
        'top': this.yMax - 1,
        'bottom': this.offset.height - this.yMax,
        'left': this.xMin,
        'right': this.offset.width - this.xMax
      });
      this.$('.border.west').css({
        'top': this.yMin + 1,
        'bottom': (this.offset.height - this.yMax) + 1,
        'left': this.xMin,
        'right': (this.offset.width - this.xMin) - 1
      });
      this.$('.border.east').css({
        'top': this.yMin + 1,
        'bottom': (this.offset.height - this.yMax) + 1,
        'left': this.xMax - 1,
        'right': this.offset.width - this.xMax
      });
      this.$('.handle').css({
        'top': this.yMid - 5,
        'left': this.xMid - 5
      });
      this.$('.handle.north').css({
        'top': this.yMin - 5
      });
      this.$('.handle.south').css({
        'top': this.yMax - 6
      });
      this.$('.handle.west').css({
        'left': this.xMin - 5
      });
      return this.$('.handle.east').css({
        'left': this.xMax - 6
      });
    };
    Cropper.prototype._mousedown = function(e) {
      if (this.x1 === null || $(e.target).hasClass('overlay') || $(e.target).hasClass('handle')) {
        return this._resizebegin(e);
      } else {
        return this._dragbegin(e);
      }
    };
    Cropper.prototype._resizebegin = function(e) {
      var handle;
      e.preventDefault();
      e.stopPropagation();
      $(document).bind('mousemove', this._resizemove);
      $(document).bind('mouseup', this._resizeend);
      this.$('*').show();
      this.resizeX = this.resizeY = true;
      handle = $(e.target);
      if (handle.hasClass('handle')) {
        if (handle.hasClass('north')) {
          this.y1 = this.yMax;
        } else if (handle.hasClass('south')) {
          this.y1 = this.yMin;
        } else {
          this.resizeY = false;
        }
        if (handle.hasClass('west')) {
          return this.x1 = this.xMax;
        } else if (handle.hasClass('east')) {
          return this.x1 = this.xMin;
        } else {
          return this.resizeX = false;
        }
      } else {
        this.x1 = this.x2 = clamp(e.clientX - this.offset.left, 0, this.offset.width);
        this.y1 = this.y2 = clamp(e.clientY - this.offset.top, 0, this.offset.height);
        this.$('.handle').hide();
        return this._update();
      }
    };
    Cropper.prototype._resizemove = function(e) {
      var clamped, diffX, diffY, ratio;
      e.preventDefault();
      e.stopPropagation();
      if (this.resizeX) {
        this.x2 = clamp(e.clientX - this.offset.left, 0, this.offset.width);
      }
      if (this.resizeY) {
        this.y2 = clamp(e.clientY - this.offset.top, 0, this.offset.height);
      }
      if (this.aspectRatio) {
        diffX = this.x2 - this.x1;
        diffY = this.y2 - this.y1;
        ratio = Math.abs(diffX / diffY);
        if (ratio < this.aspectRatio) {
          diffX *= this.aspectRatio / ratio;
          if (this.x1 + diffX < 0) {
            clamped = -this.x1;
          } else if (this.x1 + diffX > this.offset.width) {
            clamped = this.offset.width - this.x1;
          } else {
            clamped = diffX;
          }
          diffY *= clamped / diffX;
          diffX = clamped;
        } else {
          diffY *= ratio / this.aspectRatio;
          if (this.y1 + diffY < 0) {
            clamped = -this.y1;
          } else if (this.y1 + diffY > this.offset.height) {
            clamped = this.offset.height - this.y1;
          } else {
            clamped = diffY;
          }
          diffX *= clamped / diffY;
          diffY = clamped;
        }
        this.x2 = this.x1 + diffX;
        this.y2 = this.y1 + diffY;
      }
      return this._update();
    };
    Cropper.prototype._resizeend = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(document).unbind('mousemove', this._resizemove);
      $(document).unbind('mouseup', this._resizeend);
      if (this.x1 === this.x2 && this.y1 === this.y2) {
        return this._reset();
      } else {
        this.$('.handle').show();
        return this.el.css({
          'cursor': 'move'
        });
      }
    };
    Cropper.prototype._dragbegin = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(document).bind('mousemove', this._dragmove);
      $(document).bind('mouseup', this._dragend);
      this.lastX = e.clientX;
      return this.lastY = e.clientY;
    };
    Cropper.prototype._dragmove = function(e) {
      var diffX, diffY;
      e.preventDefault();
      e.stopPropagation();
      diffX = e.clientX - this.lastX;
      diffY = e.clientY - this.lastY;
      if (this.xMin + diffX <= 0) {
        diffX = -this.xMin;
      } else if (this.xMax + diffX >= this.offset.width) {
        diffX = this.offset.width - this.xMax;
      }
      if (this.yMin + diffY <= 0) {
        diffY = -this.yMin;
      } else if (this.yMax + diffY >= this.offset.height) {
        diffY = this.offset.height - this.yMax;
      }
      this.x1 += diffX;
      this.x2 += diffX;
      this.y1 += diffY;
      this.y2 += diffY;
      this.lastX = this.lastX + diffX;
      this.lastY = this.lastY + diffY;
      return this._update();
    };
    Cropper.prototype._dragend = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(document).unbind('mousemove', this._dragmove);
      return $(document).unbind('mouseup', this._dragend);
    };
    return Cropper;
  })();
})(typeof exports !== "undefined" && exports !== null ? exports : (this['crop'] = {}));