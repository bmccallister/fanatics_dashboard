import { NavMenu } from './navMenu.jsx';
import Pie from './pieComponent.jsx';
import BarGraph from './bargraphComponent.jsx';
import GaugeComponent from './gaugeComponent.jsx';
import ChartistComponent from './chartistComponent.jsx';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import { DataFetchInterface, getApi } from './dataService';

var socket = io.connect('http://localhost:8888');
let dataObject = new DataFetchInterface();

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
    this.state = {templateList: [], componentList: [], selectedContextValue: '' };
    this.updateComponents = this.updateComponents.bind(this);
    this.updateComponentData = this.updateComponentData.bind(this);
  }
  componentDidMount() 
  {
    this.contextChangeHandler = this.contextChangeHandler.bind(this);
    this._isMounted = false;
    this.updateComponents('all');
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  contextChangeHandler(e) {
    this.updateComponentData(e.target.value);
  }
  updateComponentData(context)
  {
    var self = this;
    socket.emit("componentsByContext", context);
    self.setState({ selectedContextValue : context });
  }
  updateComponents(context)
  {
    var self = this;
    console.log(context);

    self.setState({ selectedContextValue : context });
    
    var currentTime = new Date();
    var options = { hour12: true };
    self.setState({currentTime: currentTime.toLocaleString('en-US', options)});

    socket.emit("templates", '');
    socket.on("templates", function(templateData)
    {
      socket.emit("componentsByContext", '');
      socket.on("componentsByContext", function(componentData)
      {
        self.setState({templateList:templateData, componentList:componentData});

        if (!self.state.componentList) 
        {
            console.log('No component list defined');
        }
        else
        {
            for (var i = 0; i < self.state.componentList.length; i++)
            {
                const componentData = self.state.componentList[i].components;
                
                socket.emit("componentByID", componentData.id);
                socket.on("componentByID", function(data)
                {
                    for (var j = 0; j < componentData.values.length; j++)
                    {
                      var componentDataRow = componentData.values[j];
                      if (data.payload[componentDataRow.key]) 
                      {
                        componentDataRow.value = data.payload[componentDataRow.key];
                      }
                    }

                    self.setState ({componentData:data});

                    var currentTime = new Date();
                    var options = { hour12: true };
                    self.setState({currentTime: currentTime.toLocaleString('en-US', options)});
                });  
            }
        }
      }); 
    });  
  }
  
  render () {
    console.log('From the component container, component list is:', this.state.componentList);
    return (
    <div className="container-fluid">
    <NavMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-6 text-left"><ContextSelectHandler changeHandler={this.contextChangeHandler} childSelectValue={this.state.selectedContextValue}/></div>
        <div className="hidden-xs hidden-sm col-md-6 text-right">
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
          Last Updated: {this.props.currentTime}
        </div>
    );
  }
}

class ComponentOptions extends React.Component {
  constructor(props) 
  {
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
  const thresholdArray = arrayArg || [];
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
    if (!thresholdArray) {
      return '';
    }
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
  //console.log('Checking thresholdarray');

  if (thresholdArray.length < 1) {
    indicator+=' green';
  } else {
    //console.log(thresholdArray[0] + " : " + thresholdArray[1]);
    const TopVal = cleanNum(thresholdArray[0]);
    const SecondVal = cleanNum(thresholdArray[1]);
    
    if (TopVal > SecondVal) {
      //console.log('true');
      indicator = determineDesc(val, thresholdArray);
    } else {
      //console.log('false');
      indicator = determineAsc(val, thresholdArray);
    }
  }
  return indicator;
}

class FieldRepeater extends React.Component {
    render() {
    //console.log('Checking values data against object:', this.props);
      const myObject = this.props.valuesData;
      let rows = [];
      for (var i = 0 ; i < myObject.length ; i++) {
        if (!myObject[i].value) {
          myObject[i].value = myObject[i].value || '?';
        }
        let indicator = 'indicator';
        //console.log(myObject[i]);
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
    console.log(component);
    if (component.type=='pie') 
    {
      return (
        <Pie data={component}/>
      )
    } 
    else if (component.type=='bargraph') 
    {
      return (
        <BarGraph data={component}/>
      )
    } 
    else if (component.type=='gauge') 
    {
      return (
        <GaugeComponent data={component}/>
      )
    }
    else
    {
      if (!component.size)
      {
        component.size = 3;
      }
      var componentStyleClasses = "col-md-" + component.size + "";

      var currentDateTime = new Date();
      var options = { hour12: true };
      var formattedDateTime = currentDateTime.toLocaleString('en-US', options);

      return (
       <Draggable>
          <div className={componentStyleClasses}>
            <div className="panel panel-default">
              <div className="panel-heading"><h4>{component.title}</h4> {component.description}</div>
              <table className="table table-striped table-bordered component-min-height">
                <FieldRepeater valuesData={component.values} />
              </table>
              <div className="panel-footer">
              <div className="row">
                <div className="col-md-6">{component.context}</div>
                  
                <div className="col-md-6 text-right"><small>Updated: {formattedDateTime}</small></div>
              </div>
              </div>
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

      console.log('Repeater select mounted');
      this.enabledTimer = false;
    }
    componentWillUnmount () {
      this.enabledTimer = false;
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

class ContextSelectHandler extends React.Component {
    constructor(props) 
    {
      super(props);      
    }
    render() {
        return (
            <div>
                <ContextSelect 
                    url="/api/contexts/"
                    value={this.props.childSelectValue}
                    onChange={this.props.changeHandler} 
                />
            </div>
        )
    }
}

class ContextSelect extends React.Component{
    constructor(props) 
    {
      super(props);
      this.state = { options: [] };
    }
    componentDidMount() {
      console.log('Context select mounted');
        var self = this;
        // get your data
        console.log(self.props.url);
        var optionList = [];
        getApi(self.props.url, '').then(function(data) {
            // assuming data is an array of {name: "foo", value: "bar"}
            console.log(data);
            for (var i = 0; i < data.length; i++) {

                var option = data[i];

                optionList.push(
                    <option key={i} value={option.context}>{option.context} ({option.count})</option>
                );
            }
            console.log(optionList);

            self.setState({ options: optionList });

            self.forceUpdate();
        });
    }
    render() {
        return (
            <select value={this.props.value} onChange={this.props.onChange}><option value="all">All Contexts</option>{this.state.options}</select>
        )
    }
}


export default ComponentContainer;