const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { NavMenu } from './navMenu.jsx';
import { DataFetchInterface, getApi } from './dataService';


export default class CreateTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: []};
  }
  componentDidMount() {
    var that= this;
    that.setState({currentTime: new Date().getTime()});
    console.log('Component creation page mounted');
  }
  render () {
    return (
    <div className="container">
    <NavMenu />
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <p className="infoContainer">
          Hello world!
          </p>
        </div>
      </div>
      <div className="row">
        <h2> Create a new Template  </h2>
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