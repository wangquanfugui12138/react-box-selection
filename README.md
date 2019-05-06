# React Box Selection
![](https://img.shields.io/npm/v/react-box-selection.svg) ![](https://img.shields.io/npm/dt/react-box-selection.svg)

React component for making box selections on elements.

### Gif

![](https://github.com/wangquanfugui12138/react-box-selection/master/assets/gap.gif)

![](https://github.com/wangquanfugui12138/react-box-selection/master/assets/no_gap.gif)

#### Installation
```bash
npm install / yarn 
```

#### Usage

```javascript
import Selection from 'react-box-selection'

class App extends React.Component {
  state = {}

  componentWillUnmount () {
    this.setState = () => { }
  }

  mounted = allItems => {
    console.log(allItems)
  }
  selected = (positions, items, all) => {
    console.log(positions)
  }
  singleSelected = (position, item, all) => {
    console.log(position)
  }
  hovered = (position, item) => {
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
          positions={[]} 
          onMounted={this.mounted}
          onHovered={this.hovered}
          onSelected={this.selected}
          onSingleSelected={this.singleSelected}
          itemClass='selection_item'
          extraClass={['extra_1', 'extra_2']}
          activeClass='selection_item_active'
        />
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
| positions | [] | × | target items |
| onMounted | - | × | mounted callback |
| onHovered | - | × | hovered callback |
| onSelected | - | × | selected callback |
| onSingleSelected | - | × | select or click on a single callback |
| itemClass | selection_item | × | items' class |
| extraClass | [] | × | items' extra class |
| activeClass | selection_item_active | × | items' active class |
