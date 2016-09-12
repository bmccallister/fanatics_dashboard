const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import Pie from './pieComponent.jsx';

import NavMenu from './navMenu.jsx';
var ChartistGraph = require('react-chartist')
import { DataFetchInterface, getApi } from './dataService';

class ChartistComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: []};
  }
  componentDidMount() {
    var that= this;
    that.setState({currentTime: new Date().getTime()});
    console.log('Chartist page mounted');
  }
  render () {

	console.log('Creating new item');

    return (
    <div className="container">
    <NavMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <div className="infoContainer whiteBg">
          </div>
          <div className="infoContainer whiteBg">
			<Pie />
          </div>          
        </div>
      </div>
      <div className="row">
      Welcome to chartists test
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

export default ChartistComponent;