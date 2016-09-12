
const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');

import NavMenu from './navMenu.jsx';
import Pie from './pieComponent.jsx';
import BarGraph from './bargraphComponent.jsx';
import ChartistComponent from './chartistComponent.jsx';

import { DataFetchInterface, getApi } from './dataService';
let dataObject = new DataFetchInterface();

// Set up component list and initialize (Really unnecessary with constructor, remove)
dataObject.initializeLists([]);

class ComponentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: [], interfaceList: []};
  }
  componentDidMount() {
    var that= this;
    that.setState({currentTime: new Date().getTime()});
    dataObject.fetchComponentList().then(function(componentData) {
        dataObject.fetchActiveInterfaces().then(function(data) { 
          console.log('ComponentListData:', componentData);
          console.log('InterfaceListData', data)
          that.setState({componentList:componentData, interfaceList:data});
        });
    }).catch(function(err) {
      console.log('error recieved:', err);
    });

  }
  render () {
    console.log('From the component container, interface list is:', this.state.interfaceList);
    return (
    <div className="container">
    <NavMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <div className="infoContainer">
            <ComponentCount componentList={this.state.interfaceList} />
            <CurrentTime currentTime={this.state.currentTime} />
          </div>
        </div>
      </div>
      <div className="row">
        <Repeater interfaceList={this.state.interfaceList} componentList={this.state.componentList} />
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
  console.log('Rendering component count')
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
  console.log('Checking thresholdarray');
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
    console.log('Checking values data against object:', this.props);
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
const mergeComponentData = (componentList, interfaceObject) => {
  _.each(componentList, function(row) {
    if (interfaceObject.component == row.components.name) {
      interfaceObject.title = row.components.title;
      interfaceObject.description = row.components.description;
      interfaceObject.values = row.components.values;
      console.log('Resultant object:', interfaceObject);
      return;
    }
  });
}

class RepeaterRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log('Rendering repeater row', this.props)
    var myComponents = this.props.componentList;
    var myParentObject = this.props.interfaceList[this.props.index].tableau_data;
    console.log('Meringing:', myComponents);
    console.log('My object im merging is: ', myParentObject);
    mergeComponentData(myComponents, myParentObject);

    console.log('Merge component data copmleted with:', myParentObject);
    var myObject = myParentObject;
    console.log('Merge component data cleaned with:', myObject);
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
      console.log('Inside ticket');
      const updateComponentData = () => {
        let i = 0;
        if (!self.props.componentList) {
          console.log('No component list defined');
          return false;
        }
        console.log('establishing componentlist');
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
        console.log('Checking list leng')
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
        var interfaceListTemp = self.props.interfaceList;
        console.log('upstream from render repeaterrow, the interfaceListTemp is ', interfaceListTemp)
        for (var i = 0 ; i < interfaceListTemp.length ; i++) {
          //var componentListTemp = createFragment(componentListTemp);
          rows.push(<RepeaterRow key={i} index={i} componentList={componentListTemp} interfaceList={interfaceListTemp} />);
        }
        return (
          <div>
            {rows}
          </div>
          );
    }
}

export default ComponentContainer;