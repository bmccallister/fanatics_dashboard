const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu, NavComponentMenu} from './navMenu.jsx';
import { DataFetchInterface, getApi } from './dataService';

import { Link } from 'react-router'

const renderObject = (data) => {
  var contents = '<div class="row">';
  console.log('Getting key in render object from data:', data);
  var key = Object.keys(data)[0];
  contents += '<div class="col-md-3">Key:<input id="payloadKey_"' + data['key'] + '" value="' + data['key'] + '"></div>' +
            '<div class="col-md-3">Name:<input id="payloadName_"' + data['name'] + '" value="' + data['name'] + '"></div></div>';
  contents += '<div class="row">Thresholds largest to smallest</div><div class="row" style="border-bottom: 1px solid;">';
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

const renderArray = (data, key) => {
   var contents = '<div class="row" style="border-top: 1px solid #FFF; background: #262626;">' + 
                '<div class="col-md-3">' + key + '</div><div class="col-md-6">';

    for (var innerKey in data) {
      if (_.isObject(data[innerKey])) {
        console.log('Value is an object');
        contents += renderObject(data[innerKey]);
      } // end if
      else {
        contents += '<div class="row"><div class="col-md-3">' +
          '<input id="td_' + key + '_' + innerKey + '" value="' + data[innerKey] + '"></div><div class="roundedBox">X</div><div class="roundedBox">+</div></div>'; 
      } // end else
    } // end for

    contents += '</div>' + 
      '</div>';
    return contents;

} // end renderArray

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
    for (var key in templateData) {
      if (_.isArray(templateData[key])) {
       contents+=renderArray(templateData[key], key);
      }
      else {
        contents += '<div class="row" style="background: #333;"><div class="col-md-3">' + key + '</div><div class="col-md-3">' +
          '<input id="td_' + key + '" value="' + templateData[key] + '"></div></div>';
      }
    }
    return (
        <div className="contentFields" dangerouslySetInnerHTML={{__html: contents}}></div>
    ); 
  } 
}

export default class EditTemplate extends React.Component {
  constructor(props) {
    console.log('in the constructor for edit template');
    super(props);
  }
  componentDidMount() {
    var that= this;
    console.log('Setting templateName');
    try {
      var templateName = that.props.location.query.templateName;
    	const url = '/api/tableau_components/';
      console.log('Using templateName:', templateName);
      this.setState({templateName:templateName});
      console.log('Now calling getApi:', url)
      getApi(url, templateName).then(function(data) {
        console.log('Got back data and setting templateData:', data);
        that.setState ({templateData:data});
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

