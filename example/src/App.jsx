import React from 'react'
import PropTypes from "prop-types"

import { Spin, Popover, Modal, Radio, InputNumber, Button } from 'antd'
import Selection from 'react-box-selection'

import './App.less'
import 'antd/dist/antd.min.css'
const RadioGroup = Radio.Group

function getParents (el, parentClass) {
  if (parentClass === undefined) {
    return el.parentNode
  }
  var result = el.parentNode

  while ([...result.classList].indexOf(parentClass) === -1) {
    var o = result
    result = o.parentNode
  }

  return result
}
const weekMap = {
  0: 'Mon',
  1: 'Tue',
  2: 'May',
  3: 'Thu',
  4: 'Fri',
  5: 'Sat',
  6: 'Sun'
}

//投放时间默认数据
const defaultTemplates = {
  custom: [],
  industry: [],
  target: [...Array(7)].map(item => JSON.parse(JSON.stringify(Array(24).fill(100)))),
  using: [],
  all_day: [...Array(7)].map(item => JSON.parse(JSON.stringify(Array(24).fill(100)))),
  personal: [...Array(7)].map(item => JSON.parse(JSON.stringify(Array(24).fill(0))))
}

const simpleDeepClone = obj => JSON.parse(JSON.stringify(obj))

const limitDecimals = value => {
  const reg = /^(\d+)*/

  if (typeof value === 'string') {
    return !isNaN((value)) ? value.match(reg)[0] : ''
  } else if (typeof value === 'number') {
    return !isNaN(value) ? String(value).match(reg)[0] : ''
  } else {
    return ''
  }
}

class App extends React.Component {
  static propTypes = {
    template: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
  }
  constructor(props) {
    super(props)
    if (typeof props.template === 'object' && typeof props.template[0] === 'object') {
      Object.assign(defaultTemplates.target, simpleDeepClone(props.template))
    }

    this.state = {
      wrapperScroll: undefined,
      templates: defaultTemplates,
      curTempType: 'using',
      tooltipVisible: false,
      allItems: [],
      selectedItems: [],
      selectedItemPostions: [],
      discount: '',
      discountType: 0,
      discountTitle: '确认时间',
      discountVisible: false
    }
  }
  componentWillUnmount () {
    this.setState({
      allItems: null,
      selectedItems: null,
    })
    this.setState = () => { }
  }
  scroll = e => {

    this.setState({ wrapperScroll: { scrollLeft: e.target.scrollLeft, scrollTop: e.target.scrollTop } })
  }
  mounted = allItems => {
    this.setState({ allItems }, () => this.draw(true))
  }
  selected = (positions, items, all) => {
    this.setState({ selectedItems: items, selectedItemPostions: positions }, () => this.initDiscount())
  }
  singleSelected = (position, item, all) => {
    this.setState({ selectedItems: [item], selectedItemPostions: [position] }, () => this.initDiscount())
  }
  hovered = (position, item) => {
    position = position.split('-')
    const discount = item.dataset['discount']

    this.setState({
      tooltipVisible: true,
      tipTitle: weekMap[position[0]],
      tipContent: `
      ${Math.floor(position[1] % 24) >= 10 ? `${Math.floor(position[1] % 24)} : 00` : `0${Math.floor(position[1] % 24)} : 00`} 
      - ${Math.floor((position[1] % 24) + 1) >= 10 ? `${Math.floor((position[1] % 24) + 1)} : 00` : `0${Math.floor((position[1] % 24) + 1)} : 00`}
      ${discount}% discount`
    })

  }
  leaved = () => {
    this.setState({ tooltipVisible: false })
  }


  draw = (isInit = false) => {
    const { allItems, templates } = this.state

    templates.target.forEach((template, x) => {
      template.forEach((discount, y) => {
        allItems.forEach(item => {
          const position = item.dataset['position'].split('-')

          if (+position[0] === +x && +position[1] === +y) {
            const classList = item.classList
            !isInit && classList.remove(classList[1])

            classList.add(`discount_${!discount % 10 ? discount : `${~~(discount / 10)}0`}`)
            item.dataset['discount'] = discount
          }
        })
      })
    })
  }


  initDiscount = () => {
    const { selectedItemPostions } = this.state
    const startToEnd = { start: '', end: '' }

    selectedItemPostions.forEach(position => {
      const info = position.split('-')

      if (!startToEnd.start) startToEnd.start = { x: info[0], y: info[1] }
      startToEnd.end = { x: info[0], y: info[1] }
    })

    const discountTitle = `
      ${weekMap[startToEnd.start.x]}  
      ${startToEnd.start.x !== startToEnd.end.x ? `~ ${weekMap[startToEnd.end.x]}` : ''} 
      ${Math.floor(+startToEnd.start.y) >= 10 ? Math.floor(+startToEnd.start.y % 24) : `0${Math.floor(+startToEnd.start.y % 24)}`}
      : 00 - 
      ${Math.floor(+startToEnd.end.y + 1) >= 10 ? Math.floor(+startToEnd.end.y + 1) : `0${Math.floor(+startToEnd.end.y + 1)}`}
      : 00
    `
    this.draw()

    this.setState({ discountTitle, discountVisible: true })
  }
  ensureDiscount = () => {
    const { discount, discountType, templates, selectedItemPostions } = this.state

    const discountMap = {
      0: discount,
      1: 100,
      2: 0
    }

    selectedItemPostions.forEach(position => {
      position = position.split('-')

      templates.target[position[0]][position[1]] = discountMap[discountType]
    })


    this.setState({
      templates,
      discount: '',
      discountType: 0,
      discountTitle: '确认时间',
      discountVisible: false
    }, () => this.draw())
  }
  cancelDiscount = () => {
    this.setState({
      discount: '',
      discountType: 0,
      discountTitle: '确认时间',
      discountVisible: false
    })
  }

  //选择投放时间的折扣类型
  chooseDiscountType = e => {
    this.setState({ discountType: e.target.value })
  }
  inputDiscount = val => {
    this.setState({ discount: val })
  }
  click = () => {
    this.setState({ vis: true })
    const self = this
    setTimeout(function () {
      let sel = document.getElementById('createAdgroup')
      let modalWrapper = getParents(sel, 'ant-modal-wrap')

      modalWrapper.addEventListener('scroll', self.scroll)

      modalWrapper = null
      sel = null
    })
  }
  can = () => {
    this.setState({ vis: false })
  }
  render () {
    const {
      vis,
      wrapperScroll,
      tipTitle,
      tipContent,
      tooltipVisible,
      discount,
      discountType,
      discountTitle,
      discountVisible
    } = this.state

    return (
      <div>
        <Button onClick={this.click}>Popup</Button>
        <Modal
          onScroll={this.scroll}
          onCancel={this.can}
          okText='ok'
          cancelText='cancel'
          width={1000}
          visible={vis}
        >
          <div id='createAdgroup' className='releaseTime'>
            <table
              border="0"
              cellSpacing="0"
              cellPadding="0"
            >
              <tbody>
                <tr>
                  <td>
                    <ul className="releaseTimeX">
                      <li>Days\Hours</li>
                      <li>
                        <h3>00:00 - 06:00</h3>
                        <ul>
                          <li>0</li>
                          <li>1</li>
                          <li>2</li>
                          <li>3</li>
                          <li>4</li>
                          <li>5</li>
                        </ul>
                      </li>
                      <li>
                        <h3>06:00 - 12:00</h3>
                        <ul>
                          <li>6</li>
                          <li>7</li>
                          <li>8</li>
                          <li>9</li>
                          <li>10</li>
                          <li>11</li>
                        </ul>
                      </li>
                      <li>
                        <h3>12:00 - 18:00</h3>
                        <ul>
                          <li>12</li>
                          <li>13</li>
                          <li>14</li>
                          <li>15</li>
                          <li>16</li>
                          <li>17</li>
                        </ul>
                      </li>
                      <li>
                        <h3>18:00 - 24:00</h3>
                        <ul>
                          <li>18</li>
                          <li>19</li>
                          <li>20</li>
                          <li>21</li>
                          <li>22</li>
                          <li>23</li>
                        </ul>
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td style={{ display: 'flex' }}>
                    <ul className="releaseTimeY">
                      <li>Mon</li>
                      <li>Tue</li>
                      <li>May</li>
                      <li>Thu</li>
                      <li>Fri</li>
                      <li>Sat</li>
                      <li>Sun</li>
                    </ul>
                    <Spin spinning={false}>
                      <div>
                        <Popover placement="topLeft" visible={tooltipVisible} title={tipTitle} content={tipContent} >
                          <Selection
                            onMounted={this.mounted}
                            onHovered={this.hovered}
                            onMoved={this.moved}
                            onLeaved={this.leaved}
                            onSelected={this.selected}
                            onSingleSelected={this.singleSelected}
                            wrapperScroll={wrapperScroll}
                          />
                        </Popover>
                      </div>
                    </Spin>
                  </td>
                </tr>
              </tbody>
            </table>
            <Modal
              destroyOnClose={true}
              title={discountTitle}
              okText="ok"
              cancelText="cancel"
              visible={discountVisible}
              onOk={this.ensureDiscount}
              onCancel={this.cancelDiscount}
            >
              <RadioGroup onChange={this.chooseDiscountType} value={discountType}>
                <Radio style={{ display: 'block', height: 50 }} value={0}>
                  <span style={{ marginRight: 10 }}>Uniform Bid</span>
                  <InputNumber
                    formatter={limitDecimals}
                    parser={limitDecimals}
                    min={50}
                    max={300}
                    autoFocus={true}
                    onChange={this.inputDiscount}
                    onFocus={() => this.setState({ discountType: 0 })}
                    value={discount}
                  /> %
            </Radio>
                <Radio style={{ display: 'block', height: 40 }} value={1}>100%(No discount)</Radio>
                <Radio style={{ display: 'block' }} value={2}>0%(No delivery)</Radio>
              </RadioGroup>
            </Modal>

          </div>

        </Modal>

      </div>
    )
  }
}
export default App