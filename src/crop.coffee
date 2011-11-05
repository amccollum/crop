((crop) ->
    clamp = (val, min, max) -> Math.min(Math.max(val, min), max)
    
    class crop.Cropper
        constructor: (options) ->
            @el = $('''
                <div class="cropper">
                    <div class="overlay north"></div>
                    <div class="overlay south"></div>
                    <div class="overlay west"></div>
                    <div class="overlay east"></div>
                    <div class="ants north"></div>
                    <div class="ants south"></div>
                    <div class="ants west"></div>
                    <div class="ants east"></div>
                    <div class="handle north"></div>
                    <div class="handle south"></div>
                    <div class="handle west"></div>
                    <div class="handle east"></div>
                    <div class="handle north west"></div>
                    <div class="handle north east"></div>
                    <div class="handle south west"></div>
                    <div class="handle south east"></div>
                </div>
            ''')
            
            $('body').append(@el)
            
            @x1 = @x2 = @y1 = @y2 = null
            @xMin = @yMin = @xMid = @yMid = @xMax = @yMax = null
            @resizeX = @resizeY = null
            @lastX = @lastY = null
            @selecting = false
            
            @target = $(options.target)
            @offset = @target.offset()
            
            @el.css
                position: 'absolute'
                top: @offset.top
                left: @offset.left
                width: @offset.width
                height: @offset.height
    
            @$('*').css
                position: 'absolute'
            
            @$('.handle').css
                'border-width': 1
                'border-style': 'solid'
                'border-color': 'rgba(0, 0, 0, 0.1)'
                'background-color': 'rgba(0, 0, 0, 0.1)'
            
            @$('.overlay').css
                'background-color': 'rgba(0, 0, 0, 0.2)'
                
            @$('.ants').css
                'background-image': 'data:image/gif;base64,R0lGODlhCAAIAJEAAKqqqv///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAACAAIAAACDZQFCadrzVRMB9FZ5SwAIfkECQoAAAAsAAAAAAgACAAAAg+ELqCYaudeW9ChyOyltQAAIfkECQoAAAAsAAAAAAgACAAAAg8EhGKXm+rQYtC0WGl9oAAAIfkECQoAAAAsAAAAAAgACAAAAg+EhWKQernaYmjCWLF7qAAAIfkECQoAAAAsAAAAAAgACAAAAg2EISmna81UTAfRWeUsACH5BAkKAAAALAAAAAAIAAgAAAIPFA6imGrnXlvQocjspbUAACH5BAkKAAAALAAAAAAIAAgAAAIPlIBgl5vq0GLQtFhpfaIAACH5BAUKAAAALAAAAAAIAAgAAAIPlIFgknq52mJowlixe6gAADs='
            
            @$('cropper').bind 'mousedown', @_dragbegin
            @$('overlay').bind 'mousedown', @_resizebegin
            @$('handle').bind 'mousedown', @_resizebegin
        
        $: (selector) -> $(selector, @el)
        
        update: () ->
            @xMin = Math.min(@x1, @x2)
            @xMax = Math.max(@x1, @x2)
            @yMin = Math.min(@y1, @y2)
            @yMax = Math.max(@y1, @y2)
            
            @xMid = @xMin + (@xMax - @xMin) / 2
            @yMid = @yMin + (@yMax - @yMin) / 2
            
            # Overlays
            @$('.overlay').css
                top: 0
                bottom: 0
                left: 0
                right: 0
            
            @$('.overlay.north').css
                bottom: (@offset.height - @yMin)
                
            @$('.overlay.south').css
                top: @yMax

            @$('.overlay.west').css
                right: (@offset.width - @xMin)

            @$('.overlay.east').css
                left: @xMax


            # Marching Ants
            @$('.ants').css
                top: @yMin
                bottom: (@offset.height - @yMax)
                left: @xMin
                right: (@offset.width - @xMax)
            
            @$('.ants.north').css
                bottom: (@offset.height - @yMax) + 1
        
            @$('.ants.south').css
                top: @yMax + 1

            @$('.ants.west').css
                right: (@offset.width - @xMax) + 1
        
            @$('.ants.east').css
                left: @xMin + 1
        
        
            # Handles
            @$('.handle').css
                top: @yMid - 3
                left: @xMid - 3
            
            @$('.handle.north').css
                top: @yMin - 3
            
            @$('.handle.south').css
                bottom: (@offset.height - @yMax) - 3
                
            @$('.handle.west').css
                left: @xMin - 3
        
            @$('.handle.east').css
                right: (@offset.width - @xMax) - 3
        

            if @selecting
                @$('.handle').hide()
                
        
        _resizebegin: (e) =>
            e.preventDefault()
            e.stopPropagation()
            @el.bind 'mousemove', @_resizemove
            @el.bind 'mouseup', @_resizeend
        
            @resizeX = @resizeY = true
            
            handle = $(e.target)
            if handle.hasClass('overlay')
                @x1 = @x2 = clamp((e.clientX - @offset.left), 0, @offset.width)
                @y1 = @y2 = clamp((e.clientY - @offset.top), 0, @offset.height)
                @selecting = true
                @update()
                
            else
                if handle.hasClass('north')
                    @y1 = @yMax
                else if handle.hasClass('south')
                    @y1 = @yMin
                else
                    @resizeY = false

                if handle.hasClass('west')
                    @x1 = @yMax
                else if handle.hasClass('east')
                    @x1 = @xMin
                else
                    @resizeX = false
        
        _resizemove: (e) =>
            e.preventDefault()
            e.stopPropagation()
        
            if @resizeX
                @x2 = clamp((e.clientX - @offset.left), 0, @offset.width)
                
            if @resizeY
                @y2 = clamp((e.clientY - @offset.top), 0, @offset.height)
            
            @update()
            
        _resizeend: (e) =>
            e.preventDefault()
            e.stopPropagation()
            @el.unbind 'mousemove', @_resizemove
            @el.unbind 'mouseup', @_resizeend
    
            @selecting = false
            @update()

        _dragbegin: (e) =>
            e.preventDefault()
            e.stopPropagation()
            @el.bind 'mousemove', @_dragmove
            @el.bind 'mouseup', @_dragend
            
            @lastX = e.clientX
            @lastY = e.clientY
        
        _dragmove: (e) =>
            e.preventDefault()
            e.stopPropagation()
            
            diffX = e.clientX - @lastX
            diffY = e.clientY - @lastY
            
            if @yMin + diffY > 0 and @yMax + diffY <= @offset.height
                @lastY = e.clientY
                @y1 += diffY
                @y2 += diffY

            if @xMin + diffX > 0 and @xMax + diffX <= @offset.width
                @lastX = e.clientX
                @x1 += diffX
                @x2 += diffX
                
            @update()
        
        _dragend: (e) =>
            e.preventDefault()
            e.stopPropagation()
            @el.unbind 'mousemove', @_dragmove
            @el.unbind 'mouseup', @_dragend
    

)(exports ? (@['crop'] = {}))