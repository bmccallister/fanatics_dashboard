const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { DataFetchInterface, getApi } from './dataService';
import { Link , Router } from 'react-router'

export class NavMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
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
                      <li><Link to="/listTemplates">List Templates</Link></li>
                      <li><Link to="/createTemplate">Create Template</Link></li>
                      <li><Link to="/listComponents">List Components</Link></li> 
                      <li><Link to="/createComponent">Create Component</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
  	)}
};

/*
export class NavComponentMenu extends React.Component {
  constructor(props) {
    super(props);
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
};*/