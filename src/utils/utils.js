export function getTop(e) {
    var offset = e.offsetTop
    if (e.offsetParent != null) offset += getTop(e.offsetParent)
    return offset
}

export function getLeft(e) {
    var offset = e.offsetLeft
    if (e.offsetParent != null) offset += getLeft(e.offsetParent)
    return offset
}

export function clearEventBubble(e) {
    if (e.stopPropagation) e.stopPropagation()
    else e.cancelBubble = true

    if (e.preventDefault) e.preventDefault()
    else e.returnValue = false
}

export function scroll() {
    if (window.pageYOffset) {
        return {
            scrollLeft: window.pageXOffset,
            scrollTop: window.pageYOffset
        }
    } else if (document.compatMode === 'CSS1Compat') {
        return {
            scrollLeft: document.documentElement.scrollLeft,
            scrollTop: document.documentElement.scrollTop
        }
    }

    return {
        scrollLeft: document.body.scrollLeft,
        scrollTop: document.body.scrollTop
    }
}

export function isInPath(target, wrapper) {
    const iOffLeft = target.offsetLeft
    const iOffTop = target.offsetTop
    const iLeft = target.offsetWidth + iOffLeft
    const iTop = target.offsetHeight + iOffTop

    if (iLeft > wrapper.left && iTop > wrapper.top && iOffLeft < (wrapper.left + wrapper.width) && iOffTop < (wrapper.top + wrapper.height)) {
        return true
    }
    return false
}

export function getParents(el, parentTag) {
    if (parentTag === undefined) {
        return el.parentNode
    }
    var result = el.parentNode

    while (result.tagName !== parentTag) {
        var o = result
        result = o.parentNode
    }

    return result
}