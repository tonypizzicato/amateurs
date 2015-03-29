define ['jquery', 'photoswipe', 'photoswipe.ui'], ($, PhotoSwipe, PhotoSwipeUi)->

#  if $('.pswp-gallery').length > 0
#    gallery = new PhotoSwipe $('.pswp-gallery')[0], PhotoSwipeUi
#    gallery.init()
  initPhotoSwipeFromDOM = (gallerySelector) ->

    parseThumbnailElements = (el) ->
      thumbElements = el.childNodes
      numNodes = thumbElements.length
      items = []
      i = 0
      while i < numNodes
        el = thumbElements[i]
        # include only element nodes
        if el.nodeType != 1
          i++
          continue
        childElements = el.children
        size = el.getAttribute('data-size').split('x')
        # create slide object
        item =
          src: el.getAttribute('href')
          w: parseInt(size[0], 10)
          h: parseInt(size[1], 10)
          author: el.getAttribute('data-author')
        item.el = el
        # save link to element for getThumbBoundsFn
        if childElements.length > 0
          item.msrc = childElements[0].getAttribute('src')
          # thumbnail url
          if childElements.length > 1
            item.title = childElements[1].innerHTML
        # caption (contents of figure)
        mediumSrc = el.getAttribute('data-med')
        if mediumSrc
          size = el.getAttribute('data-med-size').split('x')
          # "medium-sized" image
          item.m =
            src: mediumSrc
            w: parseInt(size[0], 10)
            h: parseInt(size[1], 10)
        # original image
        item.o =
          src: item.src
          w: item.w
          h: item.h
        items.push item
        i++
      items

    # find nearest parent element

    closest = (el, fn) ->
      el and (if fn(el) then el else closest(el.parentNode, fn))

    onThumbnailsClick = (e) ->
      e = e or window.event
      if e.preventDefault then e.preventDefault() else (e.returnValue = false)
      eTarget = e.target or e.srcElement
      clickedListItem = closest(eTarget, (el) ->
        el.tagName == 'A'
      )
      if !clickedListItem
        return
      clickedGallery = clickedListItem.parentNode
      childNodes = clickedListItem.parentNode.childNodes
      numChildNodes = childNodes.length
      nodeIndex = 0
      index = undefined
      i = 0
      while i < numChildNodes
        if childNodes[i].nodeType != 1
          i++
          continue
        if childNodes[i] == clickedListItem
          index = nodeIndex
          break
        nodeIndex++
        i++
      if index >= 0
        openPhotoSwipe index, clickedGallery
      false

    photoswipeParseHash = ->
      hash = window.location.hash.substring(1)
      params = {}
      if hash.length < 5
        # pid=1
        return params
      vars = hash.split('&')
      i = 0
      while i < vars.length
        if !vars[i]
          i++
          continue
        pair = vars[i].split('=')
        if pair.length < 2
          i++
          continue
        params[pair[0]] = pair[1]
        i++
      if params.gid
        params.gid = parseInt(params.gid, 10)
      if !params.hasOwnProperty('pid')
        return params
      params.pid = parseInt(params.pid, 10)
      params

    openPhotoSwipe = (index, galleryElement, disableAnimation) ->
      pswpElement = document.querySelectorAll('.pswp')[0]
      items = parseThumbnailElements(galleryElement)
      # define options (if needed)
      options =
        index: index
        galleryUID: galleryElement.getAttribute('data-pswp-uid')
        getThumbBoundsFn: (index) ->
          # See Options->getThumbBoundsFn section of docs for more info
          thumbnail = items[index].el.children[0]
          pageYScroll = window.pageYOffset or document.documentElement.scrollTop
          rect = thumbnail.getBoundingClientRect()
          {
            x: rect.left
            y: rect.top + pageYScroll
            w: rect.width
          }
        addCaptionHTMLFn: (item, captionEl, isFake) ->
          if !item.title
            captionEl.children[0].innerText = ''
            return false
          captionEl.children[0].innerHTML = item.title + '<br/><small>Photo: ' + item.author + '</small>'
          true
        shareButtons: [
          {id:'facebook', label:'Поделиться на Facebook', url:'https://www.facebook.com/sharer/sharer.php?u='},
          {id:'twitter', label:'Оставить Tweet', url:'https://twitter.com/intent/tweet?text=&url='},
          {id:'pinterest', label:'Закрепить Pin', url:'http://www.pinterest.com/pin/create/button/?url=&media=&description='},
          {id:'download', label:'Сохранить изображение', url:'', download:true}
        ]
      radios = document.getElementsByName('gallery-style')
      i = 0
      length = radios.length
      while i < length
        if radios[i].checked
          if radios[i].id == 'radio-all-controls'
          else if radios[i].id == 'radio-minimal-black'
            options.mainClass = 'pswp--minimal--dark'
            options.barsSize =
              top: 0
              bottom: 0
            options.captionEl = false
            options.fullscreenEl = false
            options.shareEl = false
            options.bgOpacity = 0.85
            options.tapToClose = true
            options.tapToToggleControls = false
          break
        i++
      if disableAnimation
        options.showAnimationDuration = 0
      # Pass data to PhotoSwipe and initialize it
      gallery = new PhotoSwipe(pswpElement, PhotoSwipeUi, items, options)
      # see: http://photoswipe.com/documentation/responsive-images.html
      useLargeImages = false
      firstResize = true
      gallery.listen 'beforeResize', ->
        dpiRatio = if window.devicePixelRatio then window.devicePixelRatio else 1
        dpiRatio = Math.min(dpiRatio, 2.5)
        realViewportWidth = gallery.viewportSize.x * dpiRatio
        if realViewportWidth >= 1200 or !gallery.likelyTouchDevice and realViewportWidth > 800 or screen.width > 1200
          if !useLargeImages
            useLargeImages = true
            imageSrcWillChange = true
        else
          if useLargeImages
            useLargeImages = false
            imageSrcWillChange = true
        if imageSrcWillChange and !firstResize
          gallery.invalidateCurrItems()
        if firstResize
          firstResize = false
        imageSrcWillChange = false
        return
      gallery.listen 'gettingData', (index, item) ->
        if useLargeImages
          item.src = item.o.src
          item.w = item.o.w
          item.h = item.o.h
        else
          item.src = item.m.src
          item.w = item.m.w
          item.h = item.m.h
        return
      gallery.init()
      return

    # select all gallery elements
    galleryElements = document.querySelectorAll(gallerySelector)
    i = 0
    l = galleryElements.length
    while i < l
      galleryElements[i].setAttribute 'data-pswp-uid', i + 1
      galleryElements[i].onclick = onThumbnailsClick
      i++
    # Parse URL and open gallery if it contains #&pid=3&gid=1
    hashData = photoswipeParseHash()
    if hashData.pid > 0 and hashData.gid > 0
      openPhotoSwipe hashData.pid - 1, galleryElements[hashData.gid - 1], true
    return

  initPhotoSwipeFromDOM '.pswp-gallery'
