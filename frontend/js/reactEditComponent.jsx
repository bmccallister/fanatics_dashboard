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

