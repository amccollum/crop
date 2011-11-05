(($) ->
    crop = require('crop')
    $.ender({
        crop: () ->
            cropper = new crop.Cropper
                el: this
                
            return this
    }, true)
)(ender)