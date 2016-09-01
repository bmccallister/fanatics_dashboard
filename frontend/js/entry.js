// Entry

// CSS
require('bootstrap-loader');
require('../css/style.css');

import React from 'react'

import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

import HomePage from './reactMain.jsx';
import ComponentCreation from './reactComponentCreation.jsx';
import ChartistComponent from './chartistComponent.jsx';
import NavMenu from './navMenu.jsx';


const NoMatch = React.createClass({
	render() {
		console.log('Rendering no match');
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
			<Route path="/" component={HomePage} />
			<Route path="/create" component={ComponentCreation} />
			<Route path="/chartistComponent" component={ChartistComponent} />
			<Route path="*" component={NoMatch} />
		</Router>
	</div>
), document.getElementById('ComponentContainer'))