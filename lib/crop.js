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
      this._resizebegin = __bind(this._resizebegin, this);      this.el = $('<div class="cropper">\n    <div class="overlay north"></div>\n    <div class="overlay south"></div>\n    <div class="overlay west"></div>\n    <div class="overlay east"></div>\n    <div class="ants north"></div>\n    <div class="ants south"></div>\n    <div class="ants west"></div>\n    <div class="ants east"></div>\n    <div class="handle north"></div>\n    <div class="handle south"></div>\n    <div class="handle west"></div>\n    <div class="handle east"></div>\n    <div class="handle north west"></div>\n    <div class="handle north east"></div>\n    <div class="handle south west"></div>\n    <div class="handle south east"></div>\n</div>');
      $('body').append(this.el);
      this.x1 = this.x2 = this.y1 = this.y2 = null;
      this.xMin = this.yMin = this.xMid = this.yMid = this.xMax = this.yMax = null;
      this.resizeX = this.resizeY = null;
      this.lastX = this.lastY = null;
      this.selecting = false;
      this.target = $(options.target);
      this.offset = this.target.offset();
      this.el.css({
        position: 'absolute',
        top: this.offset.top,
        left: this.offset.left,
        width: this.offset.width,
        height: this.offset.height
      });
      this.$('*').css({
        position: 'absolute'
      });
      this.$('.handle').css({
        'border-width': 1,
        'border-style': 'solid',
        'border-color': 'rgba(0, 0, 0, 0.1)',
        'background-color': 'rgba(0, 0, 0, 0.1)'
      });
      this.$('.overlay').css({
        'background-color': 'rgba(0, 0, 0, 0.2)'
      });
      this.$('.ants').css({
        'background-image': 'data:image/gif;base64,R0lGODlhCAAIAJEAAKqqqv///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAACAAIAAACDZQFCadrzVRMB9FZ5SwAIfkECQoAAAAsAAAAAAgACAAAAg+ELqCYaudeW9ChyOyltQAAIfkECQoAAAAsAAAAAAgACAAAAg8EhGKXm+rQYtC0WGl9oAAAIfkECQoAAAAsAAAAAAgACAAAAg+EhWKQernaYmjCWLF7qAAAIfkECQoAAAAsAAAAAAgACAAAAg2EISmna81UTAfRWeUsACH5BAkKAAAALAAAAAAIAAgAAAIPFA6imGrnXlvQocjspbUAACH5BAkKAAAALAAAAAAIAAgAAAIPlIBgl5vq0GLQtFhpfaIAACH5BAUKAAAALAAAAAAIAAgAAAIPlIFgknq52mJowlixe6gAADs='
      });
      this.$('cropper').bind('mousedown', this._dragbegin);
      this.$('overlay').bind('mousedown', this._resizebegin);
      this.$('handle').bind('mousedown', this._resizebegin);
    }
    Cropper.prototype.$ = function(selector) {
      return $(selector, this.el);
    };
    Cropper.prototype.update = function() {
      this.xMin = Math.min(this.x1, this.x2);
      this.xMax = Math.max(this.x1, this.x2);
      this.yMin = Math.min(this.y1, this.y2);
      this.yMax = Math.max(this.y1, this.y2);
      this.xMid = this.xMin + (this.xMax - this.xMin) / 2;
      this.yMid = this.yMin + (this.yMax - this.yMin) / 2;
      this.$('.overlay').css({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      });
      this.$('.overlay.north').css({
        bottom: this.offset.height - this.yMin
      });
      this.$('.overlay.south').css({
        top: this.yMax
      });
      this.$('.overlay.west').css({
        right: this.offset.width - this.xMin
      });
      this.$('.overlay.east').css({
        left: this.xMax
      });
      this.$('.ants').css({
        top: this.yMin,
        bottom: this.offset.height - this.yMax,
        left: this.xMin,
        right: this.offset.width - this.xMax
      });
      this.$('.ants.north').css({
        bottom: (this.offset.height - this.yMax) + 1
      });
      this.$('.ants.south').css({
        top: this.yMax + 1
      });
      this.$('.ants.west').css({
        right: (this.offset.width - this.xMax) + 1
      });
      this.$('.ants.east').css({
        left: this.xMin + 1
      });
      this.$('.handle').css({
        top: this.yMid - 3,
        left: this.xMid - 3
      });
      this.$('.handle.north').css({
        top: this.yMin - 3
      });
      this.$('.handle.south').css({
        bottom: (this.offset.height - this.yMax) - 3
      });
      this.$('.handle.west').css({
        left: this.xMin - 3
      });
      this.$('.handle.east').css({
        right: (this.offset.width - this.xMax) - 3
      });
      if (this.selecting) {
        return this.$('.handle').hide();
      }
    };
    Cropper.prototype._resizebegin = function(e) {
      var handle;
      e.preventDefault();
      e.stopPropagation();
      this.el.bind('mousemove', this._resizemove);
      this.el.bind('mouseup', this._resizeend);
      this.resizeX = this.resizeY = true;
      handle = $(e.target);
      if (handle.hasClass('overlay')) {
        this.x1 = this.x2 = clamp(e.clientX - this.offset.left, 0, this.offset.width);
        this.y1 = this.y2 = clamp(e.clientY - this.offset.top, 0, this.offset.height);
        this.selecting = true;
        return this.update();
      } else {
        if (handle.hasClass('north')) {
          this.y1 = this.yMax;
        } else if (handle.hasClass('south')) {
          this.y1 = this.yMin;
        } else {
          this.resizeY = false;
        }
        if (handle.hasClass('west')) {
          return this.x1 = this.yMax;
        } else if (handle.hasClass('east')) {
          return this.x1 = this.xMin;
        } else {
          return this.resizeX = false;
        }
      }
    };
    Cropper.prototype._resizemove = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (this.resizeX) {
        this.x2 = clamp(e.clientX - this.offset.left, 0, this.offset.width);
      }
      if (this.resizeY) {
        this.y2 = clamp(e.clientY - this.offset.top, 0, this.offset.height);
      }
      return this.update();
    };
    Cropper.prototype._resizeend = function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.el.unbind('mousemove', this._resizemove);
      this.el.unbind('mouseup', this._resizeend);
      this.selecting = false;
      return this.update();
    };
    Cropper.prototype._dragbegin = function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.el.bind('mousemove', this._dragmove);
      this.el.bind('mouseup', this._dragend);
      this.lastX = e.clientX;
      return this.lastY = e.clientY;
    };
    Cropper.prototype._dragmove = function(e) {
      var diffX, diffY;
      e.preventDefault();
      e.stopPropagation();
      diffX = e.clientX - this.lastX;
      diffY = e.clientY - this.lastY;
      if (this.yMin + diffY > 0 && this.yMax + diffY <= this.offset.height) {
        this.lastY = e.clientY;
        this.y1 += diffY;
        this.y2 += diffY;
      }
      if (this.xMin + diffX > 0 && this.xMax + diffX <= this.offset.width) {
        this.lastX = e.clientX;
        this.x1 += diffX;
        this.x2 += diffX;
      }
      return this.update();
    };
    Cropper.prototype._dragend = function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.el.unbind('mousemove', this._dragmove);
      return this.el.unbind('mouseup', this._dragend);
    };
    return Cropper;
  })();
})(typeof exports !== "undefined" && exports !== null ? exports : (this['crop'] = {}));