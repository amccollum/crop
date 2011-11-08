((crop) ->
    Widget = require('widget').Widget

    clamp = (val, min, max) -> Math.min(Math.max(val, min), max)
    
    class crop.Cropper extends Widget
        constructor: (options) ->
            @target = $(options.target)
            @aspectRatio = options.aspectRatio

            @el = $('''
                <div class="cropper">
                    <div class="overlay north"></div>
                    <div class="overlay south"></div>
                    <div class="overlay west"></div>
                    <div class="overlay east"></div>
                    <div class="border north"><div class="ants"></div></div>
                    <div class="border south"><div class="ants"></div></div>
                    <div class="border west"><div class="ants"></div></div>
                    <div class="border east"><div class="ants"></div></div>
                    <div class="handle north west"></div>
                    <div class="handle north east"></div>
                    <div class="handle south west"></div>
                    <div class="handle south east"></div>
                </div>
            ''')
            
            if not @aspectRatio
                @el.append('''
                    <div class="handle north"></div>
                    <div class="handle south"></div>
                    <div class="handle west"></div>
                    <div class="handle east"></div>
                ''')

            @el.bind 'mousedown', @_mousedown
            $('body').append(@el)
            
        init: ->
            @destroyed = false
            @el.css
                'cursor': 'crosshair'

            @x1 = @x2 = @y1 = @y2 = null
            @xMin = @yMin = @xMid = @yMid = @xMax = @yMax = null
            
            @$('*').hide()
        
            # Animate the marching ants
            step = -1
            $.timeout 100, () =>
                if @destroyed
                    return false
                
                step = (step + 1) % 120
                @$('.border.north .ants, .border.south .ants').css
                    'margin-left': -120 + step
                    
                @$('.border.west .ants, .border.east .ants').css
                    'margin-top': -120 + step

                return true

        create: ->
            @offset = @target.offset()
            
            @el.css
                'position': 'absolute'
                'z-index': 1000
                'top': @offset.top
                'left': @offset.left
                'width': @offset.width
                'height': @offset.height
    
            @$('*').css
                'position': 'absolute'
            
            @$('.handle').css
                'width': '9px'
                'height': '9px'
                'border': '1px solid rgba(240, 240, 240, 0.6)'
                'background-color': 'rgba(16, 16, 16, 0.5)'
            
            @$('.overlay').css
                'cursor': 'crosshair'
                'background-color': 'rgba(0, 0, 0, 0.4)'

            @$('.border').css
                'background-color': 'rgba(0, 0, 0, 0.4)'
                'overflow': 'hidden'
                
            @$('.ants').css
                'width': @offset.width + 132
                'height': @offset.height + 132
                'border': '2px dashed rgba(240, 240, 240, 0.4)'
            
            @$('.handle.north').css
                'cursor': 'n-resize'

            @$('.handle.south').css
                'cursor': 's-resize'
            
            @$('.handle.west').css
                'cursor': 'w-resize'
            
            @$('.handle.east').css
                'cursor': 'e-resize'
            
            @$('.handle.north.west').css
                'cursor': 'nw-resize'
            
            @$('.handle.north.east').css
                'cursor': 'ne-resize'
            
            @$('.handle.south.west').css
                'cursor': 'sw-resize'
            
            @$('.handle.south.east').css
                'cursor': 'se-resize'
        
        destroy: ->    
            @destroyed = true
            super()
        
        _update: ->
            @xMin = Math.round(Math.min(@x1, @x2))
            @xMax = Math.round(Math.max(@x1, @x2))
            @yMin = Math.round(Math.min(@y1, @y2))
            @yMax = Math.round(Math.max(@y1, @y2))
            
            @xMid = @xMin + (@xMax - @xMin) / 2
            @yMid = @yMin + (@yMax - @yMin) / 2
        
            # Overlays
            @$('.overlay.north').css
                'top': 0
                'bottom': (@offset.height - @yMin)
                'left': 0
                'right': 0
                
            @$('.overlay.south').css
                'top': @yMax
                'bottom': 0
                'left': 0
                'right': 0

            @$('.overlay.west').css
                'top': @yMin
                'bottom': (@offset.height - @yMax)
                'left': 0
                'right': (@offset.width - @xMin)

            @$('.overlay.east').css
                'top': @yMin
                'bottom': (@offset.height - @yMax)
                'right': 0
                'left': @xMax

            # Borders
            @$('.border.north').css
                'top': @yMin
                'bottom': (@offset.height - @yMin) - 1
                'left': @xMin
                'right': (@offset.width - @xMax)
            
            @$('.border.south').css
                'top': @yMax - 1
                'bottom': (@offset.height - @yMax)
                'left': @xMin
                'right': (@offset.width - @xMax)

            @$('.border.west').css
                'top': @yMin + 1
                'bottom': (@offset.height - @yMax) + 1
                'left': @xMin
                'right': (@offset.width - @xMin) - 1
            
            @$('.border.east').css
                'top': @yMin + 1
                'bottom': (@offset.height - @yMax) + 1
                'left': @xMax - 1
                'right': (@offset.width - @xMax)
            
            # Handles
            @$('.handle').css
                'top': @yMid - 5
                'left': @xMid - 5
            
            @$('.handle.north').css
                'top': @yMin - 5
            
            @$('.handle.south').css
                'top': @yMax - 6
                
            @$('.handle.west').css
                'left': @xMin - 5
            
            @$('.handle.east').css
                'left': @xMax - 6
        
        _mousedown: (e) =>
            if @x1 == null or $(e.target).hasClass('overlay') or $(e.target).hasClass('handle')
                @_resizebegin(e)
            else
                @_dragbegin(e)
        
        _resizebegin: (e) =>
            e.preventDefault()
            e.stopPropagation()
            $(document).bind 'mousemove', @_resizemove
            $(document).bind 'mouseup', @_resizeend
            
            @$('*').show()
            @resizeX = @resizeY = true
            
            handle = $(e.target)
            if handle.hasClass('handle')
                if handle.hasClass('north')
                    @y1 = @yMax
                else if handle.hasClass('south')
                    @y1 = @yMin
                else
                    @resizeY = false

                if handle.hasClass('west')
                    @x1 = @xMax
                else if handle.hasClass('east')
                    @x1 = @xMin
                else
                    @resizeX = false
                    
            else
                @x1 = @x2 = clamp((e.clientX - @offset.left), 0, @offset.width)
                @y1 = @y2 = clamp((e.clientY - @offset.top), 0, @offset.height)
                @$('.handle').hide()
                @_update()
        
        _resizemove: (e) =>
            e.preventDefault()
            e.stopPropagation()
        
            if @resizeX
                @x2 = clamp((e.clientX - @offset.left), 0, @offset.width)
                
            if @resizeY
                @y2 = clamp((e.clientY - @offset.top), 0, @offset.height)
            
            if @aspectRatio
                diffX = @x2 - @x1
                diffY = @y2 - @y1
                ratio = Math.abs(diffX / diffY)
                if ratio < @aspectRatio
                    diffX *= @aspectRatio / ratio
                    
                    if @x1 + diffX < 0
                        clamped = -@x1
                    else if @x1 + diffX > @offset.width
                        clamped = @offset.width - @x1
                    else
                        clamped = diffX
                        
                    diffY *= clamped / diffX
                    diffX = clamped
                
                else
                    diffY *= ratio / @aspectRatio
                    
                    if @y1 + diffY < 0
                        clamped = -@y1
                    else if @y1 + diffY > @offset.height
                        clamped = @offset.height - @y1
                    else
                        clamped = diffY
                        
                    diffX *= clamped / diffY
                    diffY = clamped
                    
                @x2 = @x1 + diffX
                @y2 = @y1 + diffY

            @_update()
            
        _resizeend: (e) =>
            e.preventDefault()
            e.stopPropagation()
            $(document).unbind 'mousemove', @_resizemove
            $(document).unbind 'mouseup', @_resizeend

            if @x1 == @x2 and @y1 == @y2
                @init()
            else
                @$('.handle').show()
                @el.css
                    'cursor': 'move'

        _dragbegin: (e) =>
            e.preventDefault()
            e.stopPropagation()
            $(document).bind 'mousemove', @_dragmove
            $(document).bind 'mouseup', @_dragend
            
            @lastX = e.clientX
            @lastY = e.clientY
        
        _dragmove: (e) =>
            e.preventDefault()
            e.stopPropagation()
            
            diffX = e.clientX - @lastX
            diffY = e.clientY - @lastY
            
            if @xMin + diffX <= 0 
                diffX = -@xMin
            else if @xMax + diffX >= @offset.width
                diffX = @offset.width - @xMax
                
            if @yMin + diffY <= 0
                diffY = -@yMin
            else if @yMax + diffY >= @offset.height
                diffY = @offset.height - @yMax
            
            @x1 += diffX
            @x2 += diffX
            @y1 += diffY
            @y2 += diffY
            @lastX = @lastX + diffX
            @lastY = @lastY + diffY
                
            @_update()
        
        _dragend: (e) =>
            e.preventDefault()
            e.stopPropagation()
            $(document).unbind 'mousemove', @_dragmove
            $(document).unbind 'mouseup', @_dragend
    

)(exports ? (@['crop'] = {}))