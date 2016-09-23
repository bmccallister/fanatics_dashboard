const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu, NavComponentMenu} from './navMenu.jsx';
import { Link } from 'react-router'

import { DataFetchInterface } from './dataService';
let dataObject = new DataFetchInterface();
window.componentList = [];

class ListComponentTemplates extends React.Component {
  constructor(props) {
    super(props);
  } 
  handleCopy(event) {
    var name = event.target.id;
    var foundTemplate = {};
    for (var i = 0 ; i < window.componentList.length ; i++) {
      if (window.componentList[i].templates.name == name) {
        foundTemplate = window.componentList[i].templates;
        break;
      }
    }
    console.log('Copying:', foundTemplate);
    console.log('Found template:', foundTemplate);
    dataObject.copyTemplate(foundTemplate).then(function() {
      alert('Template copied');
    });
  }
  render () {
    console.log('Props data:', this.props.componentList)
    var that = this;
    const myObject = this.props.componentList;
      let rows = [];
      console.log('Itearting my object:', myObject);
      for (var i = 0 ; i < myObject.length ; i++) {
        var name = myObject[i].templates.name;
          console.log('my Name im pushign on to the rows: ' + name);
          rows.push(
            <tr key={i} className="componentList">
              <td>Name: {name}</td>
              <td>Desc: {myObject[i].templates.description}</td>
              <td><Link to={{ pathname: '/editTemplate', query: { templateName:name } }}>Edit</Link></td>
              <td><a href="#" id={name} onClick={that.handleCopy}>Copy {name}</a></td>
            </tr>
          );
      }
      console.log('Rows:', rows);
      return (<tbody>{rows}</tbody>);
  }
}

export default class ListTemplates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: []};
  }
  componentDidMount() {
    var that= this;
    console.log('Hitting dataobject fetchTemplatelist');
    dataObject.fetchTemplateList().then(function(templateData) {
      that.setState({componentList:templateData});
      window.componentList = templateData;
      console.log('State data set:', that.state.componentList)
    });
  }
  render () {
  console.log('In render with state cl:', this.state.componentList);
  var componentList = this.state.componentList;
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
        <h2> Available Templates </h2>
        <ListComponentTemplates componentList={componentList} />
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

