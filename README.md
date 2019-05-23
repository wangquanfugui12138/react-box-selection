# React Box Selection
![](https://img.shields.io/npm/v/react-box-selection.svg) ![](https://img.shields.io/npm/dt/react-box-selection.svg)

React component for making box selections on elements.

### Gif

![](https://github.com/wangquanfugui12138/react-box-selection/raw/master/assets/gap.gif)

![](https://github.com/wangquanfugui12138/react-box-selection/raw/master/assets/no_gap.gif)

![](https://github.com/wangquanfugui12138/react-box-selection/raw/master/assets/content.gif)

#### Installation
```bash
npm install || yarn 
```

#### Usage

```javascript
import Selection from 'react-box-selection'

const content = [...Array(7)].map((item, row) => {
  return [...Array(14)].map((item, col) => {
    const data = Math.floor(Math.random() * 100 + 1)
    const tmp = <h3 key={`${row}-${col}`}>{data}</h3>
    return tmp
  })
})

class App extends React.Component {
  state = {}

  componentWillUnmount () {
    this.setState = () => { }
  }

  mounted = all => { //all items(dom)
    console.log(all)
  }
  selected = (positions, items, all) => { //data-position(array of string),selected items(array of dom)
    console.log(positions)
  }
  singleSelected = (position, item, all) => { //data-position(string),selected items(dom)
    console.log(position)
  }
  hovered = (position, item) => {
    console.log(position)
  }
  leaved = (position, item) => {
    console.log(position)
  }

  render () {

    return (
      <div>
        <Selection
          cols={24} 
          rows={48} 
          width={30} 
          height={50} 
          gap={10} 
          wrapperScroll={undefined}
          onMounted={this.mounted}
          onHovered={this.hovered}
          onLeaved={this.leaved}
          onSelected={this.selected}
          onSingleSelected={this.singleSelected}
          itemClass='selection_item'
          extraClass={['extra_1', 'extra_2']}
          activeClass='selection_item_active'
        >
          {content}
        </Selection>
      </div>
    )
  }
}
 
```

#### params

| name | defaultValue | must |  Effect | 
| -: | :-: | :-: | :-: |
| cols | 24 | × | columns|
| rows | 7 | × | rows |
| height | 50px | × | item's height |
| width | 30px | × | item's width |
| gap | 0 | × | item's spacing |
| wrapperScroll | window scrollTop & scrollLeft | × | outer dom scrollTop & scrollLeft |
| Children | - | × | item's dom or text |
| onMounted | - | × | mounted callback |
| onHovered | - | × | overed callback |
| onLeaved | - | × | leaved callback |
| onSelected | - | × | selected callback |
| onSingleSelected | - | × | select or click on a single callback |
| itemClass | selection_item | × | items' class |
| extraClass | [] | × | items' extra class |
| activeClass | selection_item_active | × | items' active class |
