const _ = require('lodash');
import { NavMenu } from './navMenu.jsx';
import { DataFetchInterface, isSelectable, cleanPayload } from './dataService';
var ReactDOMServer = require('react-dom/server'); 
import { Link } from 'react-router'
import { BoundValueObject, ThresholdObject, GenericObject, RemoveArrayItem, AddArrayItem, RenderArray, StandardField, EditRows} from './reactFormWidgets.jsx';

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
    console.log('Component Mounted');
    this.externalUpdate = this.externalUpdate.bind(this);  
    try {
      var componentId = that.props.location.query.componentId;
      console.log('My componentId:', componentId)
    	const url = '/api/tableau_components/';
      console.log('Using componentId:', componentId);
      this.setState({componentId:componentId});
      window.selectableKeys = {};
      //window.selectableKeys['type'] = ['bargraph', 'pie', 'gauge', 'tree', 'heatmap'];
      console.log('Preloading selectable keys');
      dataObject.fetchTemplateList().then(function(data) {
      console.log('Setting selectable keys')

        window.selectableKeys['template'] = [];
        _.each(data, function(row) {
          window.selectableKeys['template'].push(row.templates.name);
        })
        dataObject.fetchComponentList(componentId).then(function(data) {
          console.log('Got back data and setting componentData:', data);
          console.log('Checking empty payload');
          if (!data[0].components.payload) {
            data[0].components.payload = {};
          }
          that.setState ({componentData:data[0].components});
          var templateName = that.state.componentData.template;
          window.masterData = that.state.componentData;
          console.log('Getting template data');
          dataObject.fetchTemplateList().then(function(data) {
            console.log('Got back data and setting templateData:', data);
            var templates = [];
            _.each(data, function(row) {
              templates.push(row.templates);
            })
            window.templateOptions = templates;
            window.templateData = _.find(window.templateOptions, {name:templateName});
            console.log('Assigning name!!!!!!!!!');
            if (!window.templateData.name) {
              window.templateData.name = window.templateData.id;
            }
            console.log('Assigning charts');
            window.selectableKeys['type'] = window.templateData.charts;
            that.setState({templateOptions:templates });
          });
        }).catch(function(err) {
          console.log('Error:', err);
          throw(err);
        });
      });
    
    }
    catch (exc) {
      console.log('Caught exception:', exc);
    }
  }
  submitForm () {
    console.log('Form submit called');
    console.log('My component data:', this.state.componentData);
    console.log('My master data:', window.masterData);
    dataObject.updateComponent(window.masterData).then(function() {
      alert('Changes saved!');
    })
  }
  externalUpdate() {
    console.log('External force render called');
    var that = this;

    window.templateData = _.find(window.templateOptions, {name:window.masterData.template});
    window.masterData.payload = cleanPayload(window.templateData.dataDefinition, window.masterData.payload);
    this.setState({componentData:window.masterData});
  }
  render () {
  console.log('setting window master update');
  window.masterUpdate = this.externalUpdate;

  console.log('ReactEditTemplate: Edit template props are:', this.props);
  console.log('Looking at state data:', this.state);
  var componentId = '?';
  var payloadOptions = [];
  var componentData = '?';
  if (this.state) {
    if (this.state.templateOptions) {
      componentId = this.state.componentId;
      componentData = this.state.componentData;
      //payloadOptions = this.state.templateData.dataDefinition;
      payloadOptions = _.find(window.templateOptions, {name:componentData.template}).dataDefinition;
    }
  }
    var that = this;
    console.log('setting editableObjects to true');
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
        <EditRows rowData={componentData} editableObjects="true" payloadOptions={payloadOptions} externalUpdate={this.externalUpdate}/>
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

