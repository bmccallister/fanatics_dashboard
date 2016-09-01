
const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import NavMenu from './navMenu.jsx';
import { DataFetchInterface, getApi } from './dataService';
let dataObject = new DataFetchInterface();

// Set up component list and initialize (Really unnecessary with constructor, remove)
dataObject.setComponentList([]);

class ComponentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: []};
  }
  componentDidMount() {
    var that= this;
    that.setState({currentTime: new Date().getTime()});
    dataObject.fetchComponentList().then(function(data) {
      that.setState({componentList:data});
    }).catch(function(err) {
      console.log('error recieved:', err);
    });

  }
  render () {
    return (
    <div className="container">
    <NavMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <div className="infoContainer">
            <ComponentCount componentList={this.state.componentList} />
            <CurrentTime currentTime={this.state.currentTime} />
          </div>
        </div>
      </div>
      <div className="row">
        <Repeater componentList={this.state.componentList} />
      </div>
    </div>
    )
  }
  onUpdate (val) {
    this.setState({
      data:val
    })
  }
}


class ComponentCount extends React.Component {
  render () {
    const componentList = this.props.componentList || []
    return (
      <div>
        Now monitoring {componentList.length} systems
      </div>
    );
  }
}
  
class CurrentTime extends React.Component {
  render() {
    return (
        <div>
          Current Date/Time: {this.props.currentTime}
        </div>
    );
  }
}

class ComponentOptions extends React.Component {
  constructor(props) {
    super(props);
  this.update = this.update.bind(this);
  }
  render() {
    return (
      <div>
        <input type="text" ref="myInput" />
        <input type="button" onClick={this.update} value="Update C2"/>
      </div>
    )
  }
  update() {
    // Unused for now, test code
    var theVal = this.refs.myInput.getDOMNode().value;
  }
}

class RepeaterRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var myObject = this.props.componentList[this.props.index].components;
    //var myFields = createFragment(myObject['values']);
    return (
      <div className="col-md-4">
      <div className="panel panel-default">
        <div className="description">{myObject.title}</div>
        <div className="panel-heading">{myObject.description}</div>
        <table className="table table-striped table-bordered">
          <FieldRepeater valuesData={myObject.values} />
        </table>
      </div>
      </div>
    );
  }
}
const cleanNum = (numStr) => {
  const num = (numStr + '').replace('%');
  return parseInt(num);
}

const establishIndicator = (val, arrayArg) => {
  const thresholdArray = arrayArg;
  let indicator = '';
  
  const determineAsc = (val, thresholdArray) => {
    var indicator = '';
    if (val>=cleanNum(thresholdArray[0])&& val<cleanNum(thresholdArray[1])) {
      indicator += ' green';
    }
    if (val>=cleanNum(thresholdArray[1])&&val<cleanNum(thresholdArray[2])) {
      indicator += ' yellow';
    }
    if (val>=cleanNum(thresholdArray[2])) {
      indicator += ' red';
    }
    return indicator;
  }
  
  const determineDesc = (val, thresholdArray) => {
    let indicator = '';
    if (val<=cleanNum(thresholdArray[0])&& val>cleanNum(thresholdArray[1])) {
      indicator += ' green';
    }
    if (val<=cleanNum(thresholdArray[1])&&val>cleanNum(thresholdArray[2])) {
      indicator += ' yellow';
    }
    if (val<=cleanNum(thresholdArray[2])) {
      indicator += ' red';
    }
    return indicator;
  }
  
  if (thresholdArray.length < 1) {
    indicator+=' green';
  } else {
    const TopVal = cleanNum(thresholdArray[0]);
    const SecondVal = cleanNum(thresholdArray[1]);
    
    if (TopVal > SecondVal) {
      indicator = determineDesc(val, thresholdArray);
    } else {
      indicator = determineAsc(val, thresholdArray);
    }
  }
  return indicator;
}

class FieldRepeater extends React.Component {
    render() {
      const myObject = this.props.valuesData;
      let rows = [];
      for (var i = 0 ; i < myObject.length ; i++) {
        if (!myObject[i].value) {
          myObject[i].value = myObject[i].value || '?';
        }
        let indicator = 'indicator';
        indicator += establishIndicator(cleanNum(myObject[i].value),myObject[i].threshold)
        rows.push(
          <tr key={i}>
            <td className={indicator}></td>
            <td>{myObject[i].name}</td>
            <td>{myObject[i].value}</td>
          </tr>
        );
      }
      return (<tbody>{rows}</tbody>);
    }
}

class Repeater extends React.Component {
    constructor (props) {
      super(props);
    }
    componentDidMount () {
      this.enabledTimer = true;
      this.timer = setInterval(this.tick.bind(this), 3000);
    }
    componentWillUnmount () {
      this.enabledTimer = false;
    }
    tick() {
      const self = this;
      const updateComponentData = () => {
        let i = 0;
        const limit = self.props.componentList.length;
        const url = '/api/tableau_components/';
        const processNext = function(cb) {
          if (i >= limit) {
            // Process final cb
            cb(true);
            return;
          }
          const row = self.props.componentList[i].components;
          i++;
          const name = row.name;
          getApi(url, name).then(function(data) {
            _.each(row.values, function(valueRow) {
              if (data.payload[valueRow.key]) {
              valueRow.value = data.payload[valueRow.key];
              }
            })
            self.setState ({componentData:data});
            processNext(cb);
          }).catch(function(err) {
            console.log('Error:', err);
            cb(false);
          });
        }
        
        
        const finalCb = (bVal) => {
          //console.log('Final callback called');
        }
        
        if (self.props.componentList.length < 1) {
          finalCb();
          return;
        } else {
          processNext(finalCb);
        }
        
      }
      if (self.enabledTimer) {
        updateComponentData();
    
      }
    }
    render() {
        let rows = [];
        const self = this;
        
        var componentListTemp = self.props.componentList;
        for (var i = 0 ; i < componentListTemp.length ; i++) {
          //var componentListTemp = createFragment(componentListTemp);
          rows.push(<RepeaterRow key={i} index={i} componentList={componentListTemp} />);
        }
        return (
          <div>{rows}</div>
          );
    }
}

export default ComponentContainer;