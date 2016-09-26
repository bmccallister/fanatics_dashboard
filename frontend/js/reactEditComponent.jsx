const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu } from './navMenu.jsx';
import { DataFetchInterface } from './dataService';
var ReactDOMServer = require('react-dom/server'); 
import { Link } from 'react-router'

let dataObject = new DataFetchInterface();

window.masterData = {};
const masterHandler = (keyName, value) => {
  try {
    var fullStr = 'window.';
    if(keyName.indexOf('masterData')<0) {
      fullStr+='masterData.';
    } 
    fullStr += keyName + "='"+ value + "'";
    console.log('building eval');
   
   eval(fullStr);
   } catch (exc) {
    console.log('Couldnt run eval');
   }
}

class BoundValueObject extends React.Component {
    constructor() {
      super();
      this.handleClick = this.handleClick.bind(this);      
      this.handleChange = this.handleChange.bind(this);
    }
    getInitialState () {
      return { value: ''};
    }
    componentDidMount () {
      this.setState({value: this.props.value});
    }
    handleClick () {
      console.log('Handling click');
    }
    handleChange (event) {
      var newVal = event.target.value;
      console.log('Got an on change event against my full key of:', this.props.fullKey)
      console.log('New value:' + newVal)
      masterHandler(this.props.fullKey, newVal);
      this.setState({value: newVal});
    }
    render () {
    if (!this.state) {
      return (
        <div> Please wait </div>
      );
    } else {
      var that = this;
      var fullKey = this.props.fullKey;
      var keyName = this.props.keyName;
      var value = this.props.value;
      console.log('Rendering value object:', that.props.keyName, that.props.fullKey, that.state.value, that.props.data);
      masterHandler(that.props.fullKey, that.state.value);
      return (
        <div>
          <input value={this.state.value} id={keyName} onChange={ that.handleChange } /> 
        </div>
      )
    }
  }
}

class GenericObject extends React.Component {
    constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('Clicked remove me with ', this.props);
  }
  render() {
    console.log('Entering GenericObject!!!!!!!!!!!!');
    var contents = [];
    var data = this.props.data;
    var key = this.props.keyName;
    var fullKey;
    var iterator = this.props.iterator;
    var usableData = {};

    for (var innerKey in data[key]) {
      var usableData = data[key][innerKey];
      var fkKey = 'masterData.' + key + '.' + innerKey + '.key';
      var fkName = 'masterData.' + key + '.' + innerKey + '.value';
      console.log('Usable data:', usableData)
      contents.push(
        <div className="row contentRow">
          <div className="col-md-3">Key:<BoundValueObject keyName={key} fullKey={fkKey} value={innerKey} /></div>
          <div className="col-md-3">Name:<BoundValueObject keyName={name} fullKey={fkName} value={usableData} /></div>
        </div>);
    }



    return (
      <div>{contents}</div>
    )
  }
}
class RemoveArrayItem extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('Clicked remove me with ', this.props);
  }
  render() {
    console.log('in render for RemoveArrayItem');
    return (
      <div className="roundedBox" onClick={this.handleClick}>X</div>
    );
  }
}

class AddArrayItem extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('Clicked add me with ', this.props);
  }
  render() {
    var self = this;
    console.log('in render for AddArrayItem');
    return (
      <div className="roundedBox" onClick={self.handleClick}>+</div>
    );
  }
}

class RenderArray extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('Render array component mounted');
  }
  render () {
    var key = this.props.keyName;
    var data = this.props.componentData;
    var contents = [];

    contents.push(<div className="contentRow">Array:{key}</div>)
    for (var i = 0; i < data[key].length; i++) {
      contents.push(<div className="contentRow"><ThresholdObject keyName={key} iterator={i} data={data} /></div>)
    }
    var styleObj = {
      background: '#262626',
      border: '1px solid #FFF'
    }
    return (
      <div className="row" style={styleObj}>
        {contents}
      </div>
    )
  }
} // end renderArray

class StandardField extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    var that = this;
  }
  render () {
  console.log('Rendering standard field with data:', this.props);
    var key = this.props.keyName;
    var fullKey = key;
    var idKey = 'id_' + key;
    var value = '';
    if (this.props.componentData) {
      value = this.props.componentData[key];
    }
    var divStyle = {
      background: '#333'
    };
    console.log('Rendering boundvalue objst')
    return (
      <div className="row" style={divStyle}>
        <div className="col-md-3">Key: {key}</div>
        <div className="col-md-3">
          <BoundValueObject keyName={key} fullKey={fullKey} value={value} data={this.props.componentData} />
        </div>
      </div>
    )
  }
}
//<input id={idKey} value={value} onChange={function() { console.log("Data changed"); } }/>

class EditRows extends React.Component {
  constructor(props) {
    console.log('in the constructor for edit template');
    super(props);
  }
  componentDidMount() {
    var that= this;
    console.log('Setting componentId');
  }
  render () {
    var name = '?';
    if (this.props.componentData) {
      name = this.props.componentData.id;
    }
    var contents = [];
    var componentData = this.props.componentData;
    for (var key in componentData) {
      if (_.isArray(componentData[key])) {  
        contents.push(<RenderArray keyName={key} componentData={componentData} />);
      }
      else if (_.isObject(componentData[key])) {
        console.log('data is object');
        contents.push(<GenericObject keyName={key} data={componentData} />);
      } else {
        contents.push(<StandardField keyName={key} componentData={componentData} />);
      }
    }
    return (
      <div className="contentFields">{contents}</div>
    )
  } 
}

export default class EditTemplate extends React.Component {
  constructor(props) {
    console.log('in the constructor for edit template');

    super(props);
  }
  onUpdate (val) {
    console.log('OnUpdate called with val:', val);
  }
  componentDidMount() {
    var that= this;
    try {
      var componentId = that.props.location.query.componentId;
      console.log('My componentId:', componentId)
    	const url = '/api/tableau_components/';
      console.log('Using componentId:', componentId);
      this.setState({componentId:componentId});
    
    dataObject.fetchComponentList(componentId).then(function(data) {
        console.log('Got back data and setting componentData:', data);
        that.setState ({componentData:data[0].components});
        console.log('Assigned masterdata');
        masterData = data[0].components;
      }).catch(function(err) {
        console.log('Error:', err);
        throw(err);
      });
    }
    catch (exc) {
      console.log('Caught exception:', exc);
    }
  }
  submitForm () {
    console.log('Form submit called');
    console.log('My template data:', this.state.componentData);
    console.log('my template name:', this.state.componentData.id)
    console.log('My master data:', window.masterData);
    dataObject.updateComponent(window.masterData).then(function() {
      alert('Changes saved!');
    })
  }
  render () {
  console.log('ReactEditTemplate: Edit template props are:', this.props);
  console.log('Looking at state data:', this.state);
  var componentId = '?';
  var componentData = '?';
  if (this.state) {
    componentId = this.state.componentId;
    componentData = this.state.componentData;
    console.log('')
  }
    var that = this;
    return (
    <div className="container">
    <NavMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <p className="infoContainer">
          Components
          </p>
        </div>
      </div>
      <div className="row">
        <h2> Editing Component: {componentId} </h2>
        <EditRows componentData={componentData} />
      </div>
      <div className="contentRow">
        <button className="saveButton" onClick={function() { that.submitForm(); } }>Save Changes</button>
      </div>
      <div className="row">
        Copyright 1998
      </div>
    </div>
    )
  }
}

