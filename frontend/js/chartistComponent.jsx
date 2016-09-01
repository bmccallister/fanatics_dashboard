const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import NavMenu from './navMenu.jsx';

var ChartistGraph = require('react-chartist')
import { DataFetchInterface, getApi } from './dataService';


class Pie extends React.Component {
  render() {

    var data = {
    labels: ['Biggest', 'Smallest', 'Medium', 'Med-small'],
    series: [10,2,4,3]
    };
    var options = {
		
    };

    return (
      <div>
        <ChartistGraph data={data} options={options} type={'Pie'} />
      </div>
    )
  }
}

class Bar extends React.Component {
  render() {

    var data = {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
      series: [
        [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
      ]
    };

    var options = {
      high: 10,
      low: -10,
      axisX: {
        labelInterpolationFnc: function(value, index) {
          return index % 2 === 0 ? value : null;
        }
      }
    };

    var type = 'Bar'

    return (
      <div>
        <ChartistGraph data={data} options={options} type={type} />
      </div>
    )
  }
}




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
