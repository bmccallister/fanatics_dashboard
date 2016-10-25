const _ = require('lodash');
import { DataFetchInterface, getApi } from './dataService';
import { Link , Router } from 'react-router'

export class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    // This is a work around to stop the non stop default props error messages
    delete Link.getDefaultProps;
  }
  render () {
    var emptyProps = {};
  	return (
      <nav className="navbar navbar-default">
          <div className="container-fluid">
            
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#mainNavigation" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="collapse navbar-collapse" id="mainNavigation">
              <ul className="nav navbar-nav">
                <li className="active"><Link to="/">Dashboard</Link></li>
                <li className="dropdown">
                <Link to="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Admin <span className="caret"></span></Link>
                  <ul className="dropdown-menu">
                      <li key="1"><Link to="/listTemplates" id="test" defaultProps={emptyProps}>List Templates</Link></li>
                      <li key="2"><Link to="/editTemplate" defaultProps={emptyProps}>Create Template</Link></li>
                      <li key="3"><Link to="/listComponents" defaultProps={emptyProps}> List Components</Link></li> 
                      <li key="4"><Link to="/createComponent" defaultProps={emptyProps}>Create Component</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
  	)}
};