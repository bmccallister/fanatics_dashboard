// Entry

// CSS
require('bootstrap-loader');
require('../css/style.css');

import React from 'react'

import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

import HomePage from './reactMain.jsx';
import ComponentCreation from './reactComponentCreation.jsx';
import NavMenu from './navMenu.jsx';


const NoMatch = React.createClass({
	render() {
		return (
			<div>
				No match for that!
			</div>
		)
	}
})

render((
	<div>
		<Router history={browserHistory}>
			<Route path="/" component={HomePage}>
			<Route path="/create" component={ComponentCreation}/>
			<Route path="*" component={NoMatch}/>
		</Route>
		</Router>
	</div>
), document.getElementById('ComponentContainer'))