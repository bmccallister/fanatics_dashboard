const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
var ChartistGraph = require('react-chartist')
import { DataFetchInterface, getApi, isRemoved } from './dataService';

class BarGraph extends React.Component {
  render() {
    var myProps = this.props.data;

    var data = {
      labels: [],
      series: [[]]
    };

    var max = 0, min = 0;

    for (var k in myProps.payload){
        if (myProps.payload.hasOwnProperty(k)) {
          if (!isRemoved(myProps, k)) {
            var val = parseInt(myProps.payload[k]);
            if (val>max)
              max = val;
            if (val < min) {
              min = val;
            }
            data.labels.push(k);
            data.series[0].push(parseInt(myProps.payload[k]));
          }
        }
    }

    var axisX = {
        labelInterpolationFnc: function(value, index) {
          return index % 2 === 0 ? value : null;
        }
      };

    // Override for now
    axisX = {};

    var options = {
      high: max,
      low: min,
      axisX: axisX
    };

    var type = 'Bar'

    return (
      <Draggable>
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="description">{myProps.id}</div>
            <div className="panel-heading">Bar Graph</div>
            <ChartistGraph data={data} options={options} type={type} />
          </div>
        </div>
      </Draggable>
    )
  }
}

export default BarGraph;