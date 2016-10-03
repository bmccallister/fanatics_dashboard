const _ = require('lodash');
import { NavMenu } from './navMenu.jsx';
import { BoundValueObject, ThresholdObject, GenericObject, RemoveArrayItem, AddArrayItem, RenderArray, StandardField, EditRows} from './reactFormWidgets.jsx';
import { DataFetchInterface } from './dataService';
var ReactDOMServer = require('react-dom/server'); 
import { Link } from 'react-router'

let dataObject = new DataFetchInterface();





export default class EditTemplate extends React.Component {
  constructor(props) {
    console.log('in the constructor for edit template');
    super(props);
  }
  onUpdate (val) {
    console.log('OnUpdate called with val:', val);
  }
  componentDidMount() {

    this.externalUpdate = this.externalUpdate.bind(this);
    window.masterUpdate = this.externalUpdate;
    var that= this;
    try {
      var templateName = that.props.location.query.templateName;
      if (!templateName) {
        window.masterData = sampleTemplate;
        that.setState ({templateData:sampleTemplate});
        this.setState({templateName:sampleTemplate.name});
        console.log('No id specified, creating new');
        return;
      }
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
  externalUpdate() {
    console.log('External force render called');
    this.setState({templateData:window.masterData});
  }
  submitForm () {
    console.log('Form submit called');
    console.log('My template data:', this.state.templateData);
    console.log('my template name:', this.state.templateData.name)
    console.log('My master data:', window.masterData);
    if (window.masterData.newTemplate) {
      delete window.masterData.newTemplate;
      dataObject.createTemplate(window.masterData).then(function() {
        alert('Changes saved!');
      })
    } else {
      dataObject.updateTemplate(window.masterData).then(function() {
        alert('Changes saved!');
      })
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
    var that = this;
    console.log('I have editrows:', EditRows);
    return (
    <div className="container">
    <NavMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <p className="infoContainer">
          Templates
          </p>
        </div>
      </div>
      <div className="row">
        <h2> Editing Component: {templateName} </h2>
        <EditRows rowData={templateData} editableObjects="false" />
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

var sampleTemplate = {
  "name": "sample_template",
  "title":"Sample sampleTemplate",
  "description": "Your Sample Template",
  "acceptPush": false,
  "newTemplate": true,
  "dataDefinition": [
    {
      "name": "Some Field",
      "threshold": [],
      "key": "someField"
    },
    {
      "name": "Another Field",
      "threshold": [
        "0",
        "3",
        "5"
      ],
      "key": "anotherField"
    },
    {
      "name": "Third Field",
      "threshold": [],
      "key": "thirdField"
    },
    {
      "name": "Fourth Field",
      "threshold": [
        "0%",
        "5%",
        "100%"
      ],
      "key": "fourthField"
    },
    {
      "name": "Fifth Field",
      "threshold": [
        "10%",
        "7%",
        "3%",
        "0%"
      ],
      "key": "fifthField"
    }
  ],
  "thresholdFields": [
    "fourthField",
    "fifthField"
  ],
  "module": "sample_template"
};

