const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu, NavComponentMenu} from './navMenu.jsx';
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

class ThresholdObject extends React.Component {
    constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('Clicked remove me with ', this.props);
  }
  render() {
    console.log('Entering thresholdObject!!!!!!!!!!!!');
    var contents = [];
    var data = this.props.data;
    var key = this.props.keyName;
    var fullKey;
    var iterator = this.props.iterator;
    var usableData = {};
    if (_.isArray(data[key])) {
      fullKey = 'masterData.' + key + '[' + iterator + ']'; 
      usableData = data[key][iterator]
    } else {
      fullKey = 'masterData.' + key;
      usableData = data[key];
    }
    var keyVal = usableData['key'];
    var nameVal = usableData['name'];
    var fkKey = fullKey + '.key';
    var fkName = fullKey + '.name';
    contents.push(<div className="col-md-3">Key:<BoundValueObject keyName={key} fullKey={fkKey} value={keyVal} /></div>);
    contents.push(<div className="col-md-3">Name:<BoundValueObject keyName={name} fullKey={fkName} value={nameVal} /></div>);

    console.log('checking threshold against:', data['threshold']);
    if (_.isArray(data['threshold'])) {
      if (data['threshold'].length<1) {
        data['threshold'] = [0,0,0,0];
      }
      var indicatorArray = ['Green','Yellow','Red','Black'];
      for (var i = 0 ; i < data['threshold'].length ; i++) {
        //contents+='<div class="col-md-3">' + indicatorArray[i] + '<br><input id="threshold_' + data['key'] +'_' + i + '" value="' + data['threshold'][i] + '" onChange={ function() {} }></div>';
      }
    }

    return (
      <div>{contents}</div>
    )
  }
}
/*
const renderObject = (data) => {
  var contents = '<div class="row">';
  var key = Object.keys(data)[0];
  contents = []
  contents += '<div class="col-md-3">Key:<input id="payloadKey_"' + data['key'] + '" value="' + 
    data['key'] + '" onChange={function() { console.log("Data changed"); masterHandler(data); } }></div>' +
   '<div class="col-md-3">Name:<input id="payloadName_"' + data['name'] + '" value="' + data['name'] +
   '" onChange={function() { console.log("Data changed"); masterHandler(data); } }></div></div>';

  contents += '<div class="row">Thresholds largest to smallest</div><div class="row">';
  data['threshold'] = data['threshold'] || [0,0,0,0];
  if (_.isArray(data['threshold'])) {
    if (data['threshold'].length<1) {
      data['threshold'] = [0,0,0,0];
    }
  }
  var indicatorArray = ['Green','Yellow','Red','Black'];
  for (var i = 0 ; i < data['threshold'].length ; i++) {
    contents+='<div class="col-md-3">' + indicatorArray[i] + '<br><input id="threshold_' + data['key'] +'_' + i + '" value="' + data['threshold'][i] + '" onChange={ function() {} }></div>';
  }
  contents += '</div>'
  return contents;
}
*/

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
    var data = this.props.templateData;
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
    if (this.props.templateData) {
      value = this.props.templateData[key];
    }
    var divStyle = {
      background: '#333'
    };
    console.log('Rendering boundvalue objst')
    return (
      <div className="row" style={divStyle}>
        <div className="col-md-3">Key: {key}</div>
        <div className="col-md-3">
          <BoundValueObject keyName={key} fullKey={fullKey} value={value} data={this.props.templateData} />
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
    console.log('Setting templateName');
  }
  render () {
    var name = '?';
    if (this.props.templateData) {
      name = this.props.templateData.name;
    }
    var contents = [];
    var templateData = this.props.templateData;
    for (var key in templateData) {
      if (_.isArray(templateData[key])) {  
        contents.push(<RenderArray keyName={key} templateData={templateData} />);
      }
      else {
        contents.push(<StandardField keyName={key} templateData={templateData} />);
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
      var templateName = that.props.location.query.templateName;
    	const url = '/api/tableau_components/';
      console.log('Using templateName:', templateName);
      this.setState({templateName:templateName});
    
    dataObject.fetchTemplateList(templateName).then(function(data) {
        console.log('Got back data and setting templateData:', data);
        that.setState ({templateData:data[0].templates});
        console.log('Assigned masterdata');
        masterData = data[0].templates;
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
    console.log('My template data:', this.state.templateData);
    console.log('my template name:', this.state.templateData.name)
    console.log('My master data:', window.masterData);
    dataObject.updateTemplate(window.masterData).then(function() {
      alert('Changes saved!');
    })
  }
  render () {
  console.log('ReactEditTemplate: Edit template props are:', this.props);
  console.log('Looking at state data:', this.state);
  var templateName = '?';
  var templateData = '?';
  if (this.state) {
    templateName = this.state.templateName;
    templateData = this.state.templateData;
    console.log('')
  }
    var that = this;
    return (
    <div className="container">
    <NavMenu />
    <NavComponentMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <p className="infoContainer">
          Hello world!
          </p>
        </div>
      </div>
      <div className="row">
        <h2> Editing Component: {templateName} </h2>
        <EditRows templateData={templateData} />
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

