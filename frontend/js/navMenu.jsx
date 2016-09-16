const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { DataFetchInterface, getApi } from './dataService';
import { Link , Router } from 'react-router'

export class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: []};
  }
  render () {
  console.log('In render');
  	return (
  		<div className="navMenu">
  		 <ul>
  		 <li><Link to="/">Dashboard</Link></li>
       <li><Link to="/create">Admin</Link></li>
  		 </ul>
  		 </div>
  	)
  }
};

export class NavComponentMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: []};
  }
  render () {
  console.log('In render');
    return (
      <div className="navComponentMenu">
       <ul>
       <li><Link to="/listTemplates">List Templates</Link></li>
       <li><Link to="/createTemplate">Create Template</Link></li>
       <li><Link to="/createComponent">Create Component from Template</Link></li>
       <li><Link to="/listComponents">List Components</Link></li>       
       </ul>
       </div>
    )
  }
};