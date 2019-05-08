import React from 'react'
import PropTypes from 'prop-types'

import './Selection.css'
import { getTop, getLeft, clearEventBubble, scroll, isInPath, getParents } from '../utils/utils'

class Selection extends React.Component {
  static propTypes = {
    cols: PropTypes.number,
    rows: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    gap: PropTypes.number,
    itemClass: PropTypes.string,
    extraClass: PropTypes.array,
    activeClass: PropTypes.string,
    onMounted: PropTypes.func,
    onHovered: PropTypes.func,
    onLeaved: PropTypes.func,
    onSelected: PropTypes.func,
    onSingleSelected: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      cols: props.cols || 24,
      rows: props.rows || 7,
      width: props.width || 30,
      height: props.height || 50,
      margin: props.gap || 0,
      isMouseDown: false,
      templates: [...Array(props.rows || 7)].map(item => [...Array(props.cols || 24).keys()]),
      allItems: [],
      selectedItems: [],
      selectedPostions: [],
      selectEle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        display: 'none'
      }
    }

  }

  addActiveClass = target => {
    const { activeClass } = this.props

    target.classList.add(activeClass || 'selection_item_active')
  }

  removeActiveClass = target => {
    const { activeClass } = this.props

    target.classList.remove(activeClass || 'selection_item_active')
  }

  componentDidMount () {
    const { onMounted } = this.props
    const table = document.getElementById('selection_table')
    const allItems = [...table.getElementsByTagName('td')]

    onMounted && onMounted(allItems)
    this.setState({ allItems })
  }

  componentWillUnmount () {
    this.setState({ allItems: null, selectedItems: null })
    this.setState = () => { }
  }

  down = e => {
    clearEventBubble(e)
    const { selectEle } = this.state
    const { clientX, clientY } = e

    const top = getTop(e.currentTarget)
    const left = getLeft(e.currentTarget)
    const { scrollTop, scrollLeft } = scroll()

    const startX = clientX - left + scrollLeft
    const startY = clientY - top + scrollTop

    selectEle.left = startX
    selectEle.top = startY

    this.setState({ isMouseDown: true, startX, startY, selectEle })
  }
  move = e => {
    clearEventBubble(e)
    const { isMouseDown, selectEle, startX, startY, selectedItems, selectedPostions } = this.state
    if (!isMouseDown) return

    const top = getTop(e.currentTarget)
    const left = getLeft(e.currentTarget)
    const { scrollTop, scrollLeft } = scroll()

    const { clientX, clientY } = e
    const _x = clientX - left + scrollLeft
    const _y = clientY - top + scrollTop

    selectEle.left = Math.min(_x, startX)
    selectEle.top = Math.min(_y, startY)
    selectEle.width = Math.abs(_x - startX)
    selectEle.height = Math.abs(_y - startY)
    selectEle.display = 'block'

    const items = [...e.currentTarget.getElementsByTagName('td')]
    selectedPostions.length = 0
    selectedItems.length = 0

    items.forEach(item => {
      this.removeActiveClass(item)

      if (isInPath(item, selectEle)) {
        this.addActiveClass(item)

        selectedPostions.push(item.dataset['position'])
        selectedItems.push(item)
      }
    })

    this.setState({ selectEle, selectedItems, selectedPostions })

  }
  up = e => {
    clearEventBubble(e)
    const { allItems, selectEle, selectedPostions, selectedItems } = this.state
    const { onSelected, onSingleSelected } = this.props
    const target = e.target.tagName === 'TD' ? e.target : getParents(e.target, 'TD')

    selectEle.left = 0
    selectEle.top = 0
    selectEle.width = 0
    selectEle.height = 0
    selectEle.display = 'none'

    allItems.forEach(item => {
      this.removeActiveClass(item)
    })

    if (selectedPostions.length === 0) {
      onSingleSelected && onSingleSelected(target.dataset['position'], target, allItems)
    } else if (selectedPostions.length === 1) {

      onSingleSelected && onSingleSelected(selectedPostions[0], selectedItems, allItems)
    } else {
      onSelected && onSelected(selectedPostions, selectedItems, allItems)
    }

    this.setState({ isMouseDown: false, selectEle, selectedPostions: [] })
  }

  over = e => {
    clearEventBubble(e)
    const { onHovered } = this.props
    const target = e.target.tagName === 'TD' ? e.target : getParents(e.target, 'TD')

    this.addActiveClass(target)
    onHovered && onHovered(target.dataset['position'], target)
  }
  leave = e => {
    clearEventBubble(e)
    const { isMouseDown } = this.state
    const { onLeaved } = this.props
    const target = e.target.tagName === 'TD' ? e.target : getParents(e.target, 'TD')

    !isMouseDown && this.removeActiveClass(target)
    onLeaved && onLeaved(target.dataset['position'], target)
  }

  render () {
    const { templates, selectEle, width, height, cols, rows, margin } = this.state
    const { children, itemClass, extraClass } = this.props
    const self = this

    return (
      <div
        className='selection_wrapper'
        style={{
          width: cols * width + margin * (1 + cols),
          height: rows * height + margin * (1 + rows),
        }}
        onMouseDown={this.down}
        onMouseMove={this.move}
        onMouseUp={this.up}
      >
        <div className='selection_element' style={{ ...selectEle }} />
        <table
          className='selection_content'
          border="1"
          cellSpacing="0"
          cellPadding="0"
          id='selection_table'
        >
          <tbody>
            {
              templates.map(function (rows, row) {
                return (
                  <tr key={`row-${row}`}>
                    {
                      rows.map(function (col) {
                        const className = `${itemClass || 'selection_item'} ${extraClass ? extraClass.join(' ') : ''}`

                        return (
                          <td
                            onMouseOver={self.over}
                            onMouseLeave={self.leave}
                            onClick={self.single}
                            className={className}
                            style={{ width, height, margin: `${margin}px ${margin}px 0 ${margin}px` }}
                            key={`col-${col}`}
                            data-position={`${row}-${col}`}
                          >
                            {
                              (children && children[row]) ? children[row][col] || '' : ''
                            }
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Selection