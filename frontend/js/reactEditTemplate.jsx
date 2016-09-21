const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu, NavComponentMenu} from './navMenu.jsx';
import { DataFetchInterface } from './dataService';
var ReactDOMServer = require('react-dom/server'); 
import { Link } from 'react-router'

let dataObject = new DataFetchInterface();

const renderObject = (data) => {
  var contents = '<div class="row">';
  var key = Object.keys(data)[0];
  contents += '<div class="col-md-3">Key:<input id="payloadKey_"' + data['key'] + '" value="' + data['key'] + '"></div>' +
            '<div class="col-md-3">Name:<input id="payloadName_"' + data['name'] + '" value="' + data['name'] + '"></div></div>';
  contents += '<div class="row">Thresholds largest to smallest</div><div class="row">';
  data['threshold'] = data['threshold'] || [0,0,0,0];
  if (_.isArray(data['threshold'])) {
    if (data['threshold'].length<1) {
      data['threshold'] = [0,0,0,0];
    }
  }
  var indicatorArray = ['Green','Yellow','Red','Black'];
  for (var i = 0 ; i < data['threshold'].length ; i++) {
    contents+='<div class="col-md-3">' + indicatorArray[i] + '<br><input id="threshold_' + data['key'] +'_' + i + '" value="' + data['threshold'][i] + '"></div>';
  }
  contents += '</div>'
  return contents;
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
  onChange (val) {
    console.log('Updated val for standard field:', val);
  }
  render () {
    var data = this.props.templateData;
    var key = this.props.keyName;

     var contents = '<div class="row" style="border-top: 1px solid #FFF; background: #262626;">' + 
                  '<div class="col-md-3">' + key + '</div><div class="col-md-6">';

      for (var innerKey in data) {
        if (_.isObject(data[innerKey])) {
          contents += renderObject(data[innerKey]);
        } // end if
        else {
            contents +='<div class="row"><div class="col-md-3">' +
              '<input id="td_' + key + '_' + innerKey + '" value="' + data[innerKey] + '">';
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
    }
} // end renderArray

class StandardField extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    var that = this;
  }
  onChange (val) {
    console.log('Updated val for standard field:', val);
  }
  render () {
  console.log('Rendering standard field with data:', this.props);
    var key = this.props.keyName;
    var idKey = 'id_' + key;
    var value = '';
    if (this.props.templateData) {
      value = this.props.templateData[key];
    }
    var divStyle = {
      background: '#333'
    };
    return (
      <div className="row" style={divStyle}>
        <div className="col-md-3">Key: {key}</div>
        <div className="col-md-3">
          <input id={idKey} value={value} />
        </div>
      </div>
    )
  }
}

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
    var contents = '';
    var templateData = this.props.templateData;
    console.log('My template data is:', templateData);
    for (var key in templateData) {
      console.log('Iterated first key:', key);
      if (_.isArray(templateData[key])) {
        console.log('pushing contents');      
        var compiledContents = ReactDOMServer.renderToString(<div><RenderArray keyName={key} templateData={templateData[key]} /></div>);
        contents+=compiledContents;
      }
      else {
        console.log('Pushign standard field with key:', key);
        var compiledContents = ReactDOMServer.renderToString(<div><StandardField keyName={key} templateData={templateData} /></div>);
        console.log('Contents compiled for standard field')
        contents+=compiledContents;
      }
    }
    console.log('Compining conents')
    //var compiledContents = ReactDOMServer.renderToString(contents);
    console.log('Creating markup')
    function createMarkup() { return {__html: contents}; };
    return (<div className="contentFields" dangerouslySetInnerHTML={createMarkup()} />);
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
    console.log('Setting templateName');
    try {
      var templateName = that.props.location.query.templateName;
    	const url = '/api/tableau_components/';
      console.log('Using templateName:', templateName);
      this.setState({templateName:templateName});
      console.log('Calling fetch template list with name:', templateName);
    dataObject.fetchTemplateList(templateName).then(function(data) {
        console.log('Got back data and setting templateData:', data);
        that.setState ({templateData:data[0].templates});
      }).catch(function(err) {
        console.log('Error:', err);
        throw(err);
      });
    }
    catch (exc) {
      console.log('Caught exception:', exc);
    }
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
    </div>
    )
  }
}

