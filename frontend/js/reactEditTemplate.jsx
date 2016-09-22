const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu, NavComponentMenu} from './navMenu.jsx';
import { DataFetchInterface } from './dataService';
var ReactDOMServer = require('react-dom/server'); 
import { Link } from 'react-router'

let dataObject = new DataFetchInterface();

let masterData = {};
const masterHandler = (keyName, value) => {
  masterData[keyName] = value;
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
      this.setState({value: event.target.value});
    }
    render () {
    if (!this.state) {
      return (
        <div> Please wait </div>
      );
    } else {
      var that = this;
      console.log('Rendering value object:', that.props.keyName, that.props.fullKey, that.state.value, that.props.data);
      masterHandler(that.props.fullKey, that.state.value);
      return (
        <div>
          <input value={that.state.value} id={that.props.keyName} onClick={ function() { that.handleClick() } } onChange={ that.handleChange } /> 
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
    var contents = [];
    var data = this.props.data;
    var key = Object.keys(data)[0];
    var fullKey = 'data[' + key + '].key';
    console.log('IN TO Key:', data[key]['key']);
    console.log('IN TO Value:', data[key]['name']);

    contents.push(<div className="col-md-3">Key:<BoundValueObject keyName={key} fullKey={fullKey} value={data[key]['key']} /></div>);
    contents.push(<div className="col-md-3">Name:<BoundValueObject keyName={data['name']} fullKey={data[key]['name']} value={data[key]['name']} /></div>);
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
    var data = this.props.templateData[key];
    /*
     var contents = '<div class="row" style="border-top: 1px solid #FFF; background: #262626;">' + 
                  '<div class="col-md-3">' + key + '</div><div class="col-md-6">';

      for (var innerKey in data) {
        if (_.isObject(data[innerKey])) {
          contents += renderObject(data[innerKey]);
        } // end if
        else {
            contents +='<div class="row"><div class="col-md-3">' +
              'arr<input id="td_' + key + '_' + innerKey + '" value="' + data[innerKey] + '" onClick=>';
            contents +='</div>';
            contents += ReactDOMServer.renderToString(<AddArrayItem />);
            contents += ReactDOMServer.renderToString(<RemoveArrayItem />);
            contents +='</div>';
        } // end else
      } // end for
      contents += '</div></div>';
      console.log('Rendering...');
      return (
        <div dangerouslySetInnerHTML={{__html: contents}}></div> 
      )
      */
      var contents = [];
      for (var innerKey in data) {
        contents.push(<div className="row"><ThresholdObject keyName={innerKey} data={data} /></div>)
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
    console.log('My master data:', masterData);
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
      <div className="row">
        <button onClick={function() { that.submitForm(); } }>Submit</button>
      </div>
      <div className="row">
        Copyright 1998
      </div>
    </div>
    )
  }
}

