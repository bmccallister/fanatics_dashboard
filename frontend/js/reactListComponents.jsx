const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu, NavComponentMenu} from './navMenu.jsx';
import { DataFetchInterface, getApi } from './dataService';



export default class ListTemplates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: []};
  }
  componentDidMount() {
    var that= this;
    that.setState({currentTime: new Date().getTime()});
	const url = '/api/tableau_components';
	console.log('Fetching url,' + url);
	getApi(url, name).then(function(data) {
		this.setState({componentList:data});
	});
  }
  render () {
  	console.log('Rendering with this state:', this.state.componentList);
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
        <h2> List of available components  </h2>
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

