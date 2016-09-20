import { NavMenu } from './navMenu.jsx';
import Pie from './pieComponent.jsx';
import BarGraph from './bargraphComponent.jsx';
import ChartistComponent from './chartistComponent.jsx';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import { DataFetchInterface, getApi } from './dataService';

let dataObject = new DataFetchInterface();

const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
const cleanNum = (numStr) => {
  const num = (numStr).replace('%', '');
  //console.log('Parsed Number: ' + num);
  return parseInt(num);
}

// Set up component list and initialize (Really unnecessary with constructor, remove)
dataObject.initializeLists([]);

class ComponentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {templateList: [], componentList: [], };
  }
  componentDidMount() {

    this._isMounted = true;
    var self = this;
    self.setState({currentTime: new Date().getTime()});

    dataObject.fetchTemplateList().then(function(templateData) {
          dataObject.fetchComponentList().then(function(componentdata) { 
            self.setState({templateList:templateData, componentList:componentdata});
          });
      }).catch(function(err) {
        console.log('error recieved:', err);
      });
    this.timer = setInterval(this.tick.bind(this), 3000);
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  tick() {
    if (!this._isMounted) {
      return;
    }
    //console.log('ComponentContainer tick:', this);
    const self = this;
    const updateComponentData = () => {
      //console.log('Getting templates and components');
        dataObject.fetchTemplateList().then(function(templateData) {
          dataObject.fetchComponentList().then(function(componentdata) { 
            self.setState({templateList:templateData, componentList:componentdata});
          });
      }).catch(function(err) {
        console.log('error recieved:', err);
      });
    }
    updateComponentData();
  }
  render () {
    //console.log('From the component container, component list is:', this.state.componentList);
    return (
    <div className="container">
    <NavMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <div className="infoContainer">
            <ComponentCount templateList={this.state.templateList} />
            <CurrentTime currentTime={this.state.currentTime} />
          </div>
        </div>
      </div>
      <div className="row">
        <Repeater templateList={this.state.templateList} componentList={this.state.componentList} />
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
  //console.log('Rendering template count')
    const templateList = this.props.templateList || []
    return (
      <div>
        Now monitoring {templateList.length} systems
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
  let indicator ='';
  
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
    console.log(thresholdArray[0] + " : " + thresholdArray[1]);
    const TopVal = cleanNum(thresholdArray[0]);
    const SecondVal = cleanNum(thresholdArray[1]);
    
    if (TopVal > SecondVal) {
      console.log('true');
      indicator = determineDesc(val, thresholdArray);
    } else {
      console.log('false');
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
        console.log(myObject[i]);
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
const mergeComponentData = (templateList, component) => {
  _.each(templateList, function(row) {
    if (component.template == row.templates.name) {
      component.title = row.templates.title;
      component.description = row.templates.description;
      component.values = row.templates.dataDefinition; 
      return;
    }
  });
}

class RepeaterRow extends React.Component {
  constructor(props) {
    super(props);
  }
  handleDrag (e, ui) {
      const {x, y} = this.state.deltaPosition;
      this.setState({
        deltaPosition: {
          x: x + ui.deltaX,
          y: y + ui.deltaY,
        }
      });
    }
    onStart() {
      this.setState({activeDrags: ++this.state.activeDrags});
    }

    onStop() {
      this.setState({activeDrags: --this.state.activeDrags});
    }
  render() {
    var templates = this.props.templateList;
    var component = this.props.componentList[this.props.index].components;
    mergeComponentData(templates, component);

    if (component.type=='pie') {
      return (
        <Pie data={component}/>
      )
    } else if (component.type=='bargraph') {
      return (
        <BarGraph data={component}/>
      )
    } else {
      return (
       <Draggable>
          <div className="col-md-4">
            <div className="panel panel-default">
              <div className="description">{component.title}</div>
              <div className="panel-heading">{component.description}</div>
              <table className="table table-striped table-bordered">
                <FieldRepeater valuesData={component.values} />
              </table>
            </div>
          </div>
        </Draggable>
      );
    }
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
      if (!this.enabledTimer) {
        return;
      }
      console.log('Object tick:', this);
      const self = this;
      
      const updateComponentData = () => {
        console.log('In update component data');
        let i = 0;
        if (!self.props.componentList) {
          console.log('No component list defined');
          return false;
        }
        const limit = self.props.componentList.length;
        
        console.log('I have a limit of:', limit)
        const processNext = function(cb) {
          if (i >= limit) {
            // Process final cb
            cb(true);
            return;
          }
          const row = self.props.componentList[i].components;
          i++;
          const id = row.id;

          const url = '/api/component/';
          console.log('Fetching url,' + url + id);
          getApi(url, id).then(function(data) {
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
      
      var templateListTemp = self.props.templateList;
      var componentListTemp = self.props.componentList;
      //console.log('upstream from render repeaterrow, the componentListTemp is ', componentListTemp)
      for (var i = 0 ; i < componentListTemp.length ; i++) {
        //var componentListTemp = createFragment(componentListTemp);
        rows.push(<RepeaterRow key={i} index={i} templateList={templateListTemp} componentList={componentListTemp} />);
      }
      return (
      <div>
        {rows}
      </div>
      );
    }
}

export default ComponentContainer;