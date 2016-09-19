const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu, NavComponentMenu} from './navMenu.jsx';
import { DataFetchInterface, getApi } from './dataService';
import { Link } from 'react-router'

class ListComponentTemplates extends React.Component {
  constructor(props) {
    super(props);
  } 
  render () {
    console.log('Props data:', this.props.componentList)
    const myObject = this.props.componentList;
      let rows = [];
      console.log('Itearting my object:', myObject);
      for (var i = 0 ; i < myObject.length ; i++) {
        var name = myObject[i].components.name;
          console.log('my Name im pushign on to the rows: ' + name);
          rows.push(
            <tr key={i} className="componentList">
              <td>Name: {name}</td>
              <td>Desc: {myObject[i].components.description}</td>
              <td><Link to={{ pathname: '/editTemplate', query: { templateName:name } }}>Edit</Link></td>
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
    const url = '/api/tableau_components';
    console.log('Fetching url,' + url);
    getApi(url, name).then(function(data) {
      console.log('Got component list data:', data);
      that.setState({componentList:data});
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

