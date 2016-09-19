const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu, NavComponentMenu} from './navMenu.jsx';
import { DataFetchInterface, getApi } from './dataService';

import { Link } from 'react-router'


export default class EditTemplate extends React.Component {
  constructor(props) {
    console.log('in the constructor for edit template');
    super(props);
  }
  componentDidMount() {
    var that= this;
    console.log('Setting templateName');
    try {
      var templateName = this.props.location.query.templateName;
    	const url = '/api/tableau_components';
    	console.log('Fetching url,' + url);
      console.log('Using templateName:', templateName);
      this.setState({templateName:templateName});
    	getApi(url, name).then(function(data) {
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
  if (this.state) {
    templateName = this.state.templateName;
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
      </div>
    </div>
    )
  }
}

