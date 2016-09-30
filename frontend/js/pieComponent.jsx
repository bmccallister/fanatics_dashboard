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
    if (!myProps.size)
    {
      myProps.size = 3;
    }
    var componentStyleClasses = "col-md-" + myProps.size + "";
    return (
      <Draggable>
        <div className={componentStyleClasses}>
          <div className="panel panel-default">
            <div className="panel-heading"><h4>{myProps.title}</h4>Pie Chart: {myProps.description}</div>
            <div className="panel-body component-min-height">
              <ChartistGraph data={data} options={options} type={'Pie'} />
            </div>
            <div className="panel-footer"><span>{myProps.context}</span></div>
          </div>
        </div>
      </Draggable>
    )
  }
}

export default Pie;
