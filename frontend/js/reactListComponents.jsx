const _ = require('lodash');
import { NavMenu } from './navMenu.jsx';
import { Link } from 'react-router'

import { DataFetchInterface } from './dataService';
let dataObject = new DataFetchInterface();
window.componentList = [];

class ListComponentObjects extends React.Component {
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
    var id = event.target.id;
    dataObject.deleteComponent(id).then(function() {
      console.log('Object deleted')
      that.props.parentCallback();
    });
  }
  handleCopy(event) {
    var that = this;
    var id = event.target.id;
    var foundComponent = {};
    console.log('Handling copy for reactListComponents')
    for (var i = 0 ; i < window.componentList.length ; i++) {
      if (window.componentList[i].components.id == id) {
        foundComponent = window.componentList[i].components;
        break;
      }
    }
    dataObject.copyComponent(foundComponent).then(function() {
      that.props.parentCallback();
    });
  }
  render () {
    var that = this;
    const myObject = this.props.componentList;
      let rows = [];
      for (var i = 0 ; i < myObject.length ; i++) {
        var id = myObject[i].components.id;
          rows.push(
            <tr key={i} className="componentList">
              <td>
                <div className="col-md-4">Name: {id}</div>
                <div className="col-md-4">Type: {myObject[i].components.template} </div>          
                <div className="col-md-4">Context: {myObject[i].components.context}</div>
              </td>
              <td>
                <div className="col-md-1 optionItem"><Link to={{ pathname: '/editComponent', query: { componentId:id } }}>Edit</Link></div>
                <div className="col-md-1 optionItem"><a href="#" id={id} onClick={that.handleCopy} cb={that.props.parentCallback}>Copy</a></div>
                <div className="col-md-1 optionItem"><a href="#" id={id} onClick={that.handleDelete} cb={that.props.parentCallback}>Delete</a></div>
              </td>
            </tr>
          );
      }
      return (<tbody>{rows}</tbody>);
  }
}

export default class ListComponents extends React.Component {
  constructor(props) {
    super(props);
    console.log('in list templates constructor');
    this.state = {componentList: []};
  }
  componentDidMount() {
    var that= this;
    console.log('Hitting dataobject fetchComponentList');

    this.externalUpdate = this.externalUpdate.bind(this);  

    dataObject.fetchComponentList().then(function(templateData) {
      that.setState({componentList:templateData});
      window.componentList = templateData;
      console.log('State data set:', that.state.componentList)
    });
  }
  externalUpdate() {
    console.log('External force render called');
    var that = this;
    dataObject.fetchComponentList('',true).then(function(templateData) {
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
        <h2> Available Components </h2>
        <ListComponentObjects componentList={componentList} parentCallback={that.externalUpdate}/>
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

