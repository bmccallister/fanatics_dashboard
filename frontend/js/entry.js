// Entry

// CSS
require('bootstrap-loader');
require('../css/style.css');

import React from 'react'

import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'

import HomePage from './reactMain.jsx';
import ComponentOptions from './reactComponentOptions.jsx';
import ChartistComponent from './chartistComponent.jsx';
import ListTemplates from './reactListTemplates.jsx';
import ListComponents from './reactListComponents.jsx';
import CreateTemplate from './reactCreateTemplate.jsx';
import CreateComponent from './reactCreateComponent.jsx';

import Component from './reactCreateComponent.jsx';
import { NavMenu } from './navMenu.jsx';



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
			<Route path="/create" component={ComponentOptions} />
			<Route path="/chartistComponent" component={ChartistComponent} />
			<Route path="/listTemplates" component={ListTemplates} />
			<Route path="/createTemplate" component={CreateTemplate} />
			<Route path="/createComponent" component={CreateComponent} />			
			<Route path="/listComponents" component={ListComponents} />
			<Route path="*" component={NoMatch} />
		</Router>
	</div>
), document.getElementById('ComponentContainer'))