const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');

import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
var ChartistGraph = require('react-chartist')
import { DataFetchInterface, getApi, isRemoved } from './dataService';

class Pie extends React.Component {
  render() {
    var myProps = this.props.data;
    var data = {
      labels: [],
      series: []
    };
    
    for (var k in myProps.payload){
        if (myProps.payload.hasOwnProperty(k)) {
          if (!isRemoved(myProps, k)) {
            data.labels.push(k);
            data.series.push(myProps.payload[k]);
          }
        }
    }
    console.log('Pie Data:', data);
    var options = {};

    return (
      <Draggable>
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="description">{myProps.id}</div>
            <div className="panel-heading">TCS Load Monitoring</div>
            <ChartistGraph data={data} options={options} type={'Pie'} />
          </div>
        </div>
      </Draggable>
    )
  }
}

export default Pie;
