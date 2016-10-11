const _ = require('lodash');
import { NavMenu } from './navMenu.jsx';
import { DataFetchInterface, isSelectable } from './dataService';
var ReactDOMServer = require('react-dom/server'); 
import { Link } from 'react-router'
import { BoundValueObject, ThresholdObject, GenericObject, RemoveArrayItem, AddArrayItem, RenderArray, StandardField, EditRows} from './reactFormWidgets.jsx';

let dataObject = new DataFetchInterface();

export default class CreateComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {templateList: [], masterData: undefined};
    this.handleChange = this.handleChange.bind(this);    
    this.externalUpdate = this.externalUpdate.bind(this);  
  }
  componentDidMount() {
    var that= this;
    that.setState({currentTime: new Date().getTime()});
    console.log('Component creation page mounted ffs');
    window.selectableKeys = {};
    dataObject.fetchTemplateList().then(function(data) {    
      that.setState({templateDataList: data});
      console.log('Setting selectable keys')
      window.selectableKeys['template'] = [];
      _.each(data, function(row) {
        window.selectableKeys['template'].push(row.templates.name);
      })
      that.setState({templateList:window.selectableKeys['template']});
    });
  }

  externalUpdate() {
    console.log('External force render called');
    var that = this;
    this.setState({componentData:window.masterData});
  }
  submitForm () {
    console.log('Form submit called');
    console.log('My component data:', this.state.componentData);
    console.log('My master data:', window.masterData);
    dataObject.createComponent(window.masterData).then(function() {
      alert('Changes saved!');
    })
  }
  handleChange(e) {
    var that= this;
    console.log('I am handling the on change:', e.target.value);
    var newComponent = {
      "context": "dev",
      "id": "new_component",
      "lastModified": "1470669993",
      "payload": {
      },
      "template": e.target.value,
      "type": "normal"
    }
    for (var i = 0 ; i < this.state.templateDataList.length ; i++) {
      if (this.state.templateDataList[i].templates.name == e.target.value) {
        console.log('Found the tempalte data list');
        that.setState({templateData:this.state.templateDataList[i].templates});
        break;
      }
    }
    window.masterData = newComponent;
    this.setState({componentData:window.masterData});
  }
  render () {
    var contents = [];
    var options = [];
    var that = this;

    if (!that.state.componentData) {
      if (that.state.templateList) {
        _.each(that.state.templateList, function(row) {
            options.push(<option key={row} value={row}>{row}</option>);
        });
        console.log('options:', options);
        var thisName = 'template';
        contents.push(<div>Please choose a template: <select name={thisName} id={thisName} onChange={this.handleChange}>{options}</select></div>)
        } else {
          contents.push(<div> Please wait </div>)
        }
    } else {
      var payloadOptions = [];
      if (this.state.templateData) {
        var componentData = this.state.componentData;
        payloadOptions = this.state.templateData.dataDefinition;

        var that = this;
        console.log('setting editableObjects to true');
        contents.push(<EditRows rowData={componentData} editableObjects="true" payloadOptions={payloadOptions} externalUpdate={this.externalUpdate}/>)
        contents.push(<div className="contentRow">
          <button className="saveButton" onClick={function() { that.submitForm(); } }>Save Changes</button>
        </div>)
      } else {
        contents.push(<div>Loading template data</div>)
      }
    }
    return (
    <div className="container">
    <NavMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <p className="infoContainer">
          Hello world!
          </p>
        </div>
      </div>
      <div className="row">
        {contents}
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

