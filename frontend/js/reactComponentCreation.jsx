const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import { DataFetchInterface, getApi } from './dataService';

class ComponentCreation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {componentList: []};
  }
  componentDidMount() {
    var that= this;
    that.setState({currentTime: new Date().getTime()});
    dataObject.fetchComponentList().then(function(data) {
      that.setState({componentList:data});
    }).catch(function(err) {
      console.log('error recieved:', err);
    });
  }
  render () {
    return (
    <div className="container">
      <div className="row">
        <div className="hidden-xs hidden-sm col-md-12 text-right">
          <p className="infoContainer">
            <ComponentCount componentList={this.state.componentList} />
            <CurrentTime currentTime={this.state.currentTime} />
          </p>
        </div>
      </div>
      <div className="row">
      Welcome to component creation
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

export default ComponentCreation;
