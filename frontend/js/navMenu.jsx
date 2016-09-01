const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { DataFetchInterface, getApi } from './dataService';
import { Link , Router } from 'react-router'

class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: []};
  }
  render () {
  console.log('In render');
  	return (
  		<div>
  		 Nav menu! 
  		 <ul>
  		 <li><Link to="/">Main</Link></li>
       <li><Link to="/create">Create Component</Link></li>
       <li><Link to="/chartistComponent">Chartist</Link></li>
  		 </ul>
  		 </div>
  	)
  }
};
console.log('Exporting navmenu');
export default NavMenu;