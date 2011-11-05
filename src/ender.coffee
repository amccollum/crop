(($) ->
    crop = require('crop')
    $.ender({
        crop: () ->
            cropper = new crop.Cropper
                target: this
                
            return this
    }, true)
)(ender)