const _ = require('lodash');
import { NavMenu } from './navMenu.jsx';
import { Link } from 'react-router'

import { DataFetchInterface } from './dataService';
let dataObject = new DataFetchInterface();
window.componentList = [];

class ListComponentTemplates extends React.Component {
  constructor(props) {
  console.log('Entering list component templates');
    super(props);
  } 
  componentDidMount() {
      this.handleCopy = this.handleCopy.bind(this);   
      this.handleDelete = this.handleDelete.bind(this);   
  }
  handleDelete(event) {
    var that = this;
    var name = event.target.id;
    dataObject.deleteTemplate(name).then(function() {
      console.log('Object deleted')
      that.props.parentCallback();
    });
  }
  handleCopy(event) {
    var that = this;
    var name = event.target.id;
    var foundTemplate = {};
    for (var i = 0 ; i < window.componentList.length ; i++) {
      if (window.componentList[i].templates.name == name) {
        foundTemplate = window.componentList[i].templates;
        break;
      }
    }
    dataObject.copyTemplate(foundTemplate).then(function() {
      that.props.parentCallback();
    });
  }
  render () {
    var that = this;
    const myObject = this.props.componentList;
      let rows = [];
      for (var i = 0 ; i < myObject.length ; i++) {
        var name = myObject[i].templates.name;
        var desc = myObject[i].templates.description;
          rows.push(
            <tr key={i} className="componentList">
              <td>Name: {name}</td>
              <td>Desc: {desc}</td>
              <td>
                <div className="col-md-1 optionItem"><Link to={{ pathname: '/editTemplate', query: { templateName:name } }}>Edit</Link></div>
                <div className="col-md-1 optionItem"><a href="#" id={name} onClick={that.handleCopy} cb={that.props.parentCallback}>Copy</a></div>
                <div className="col-md-1 optionItem"><a href="#" id={name} onClick={that.handleDelete} cb={that.props.parentCallback}>Delete</a></div>
              </td>
            </tr>
          );
      }
      return (<tbody>{rows}</tbody>);
  }
}

export default class ListTemplates extends React.Component {
  constructor(props) {
    super(props);
    console.log('in list templates constructor');
    this.state = {componentList: []};
  }
  componentDidMount() {
    var that= this;
    console.log('Hitting dataobject fetchTemplatelist');

    this.externalUpdate = this.externalUpdate.bind(this);  

    dataObject.fetchTemplateList().then(function(templateData) {
      that.setState({componentList:templateData});
      window.componentList = templateData;
      console.log('State data set:', that.state.componentList)
    });
  }
  externalUpdate() {
    console.log('External force render called');
    var that = this;
    dataObject.fetchTemplateList('',true).then(function(templateData) {
        that.setState({componentList:templateData});
        window.componentList = templateData;
        console.log('State data set:', that.state.componentList)
      });
  }
  render () {
  var that = this;
  console.log('In render with state cl:', this.state.componentList);
  console.log("as i render component list my pcb is :", this.externalUpdate)
  console.log('Generating render')
  var componentList = this.state.componentList;
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
        <h2> Available Templates </h2>
        <ListComponentTemplates componentList={componentList} parentCallback={that.externalUpdate}/>
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

