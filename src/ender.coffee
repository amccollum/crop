(($) ->
    Cropper = require('crop').Cropper
    
    $.ender({
        crop: () ->
            this.each
                cropper = new Cropper
                    el: this
                
            return this
    }, true)
    
    $.ender
        Cropper: Cropper
        cropper: (el) ->
            return new Cropper
                el: el
    
)(ender)