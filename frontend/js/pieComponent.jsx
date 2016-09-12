const createFragment = require('react-addons-create-fragment');
const _ = require('lodash');

var ChartistGraph = require('react-chartist')
import { DataFetchInterface, getApi } from './dataService';


class Pie extends React.Component {
  render() {
    var myProps = this.props.data;
    //{"component":"tcs_orders","id":"tcs_orders_1","payload":{"abandonedOrders":"15","conversionRate":"6","fulfilledOrders":"400","orders":"545","stuckOrders":"30"},"timestamp":"1470669993"};
    var data = {
    labels: [],
    series: []
    };
    console.log('Props for data:', myProps.payload);
    
    for (var k in myProps.payload){
        if (myProps.payload.hasOwnProperty(k)) {
          data.labels.push(k);
          data.series.push(myProps.payload[k]);
        }
    }
    console.log('Data after:', data);
    var options = {};

    return (
      <div className="col-md-4">
        <div class="panel panel-default">
          <ChartistGraph data={data} options={options} type={'Pie'} />
        </div>
      </div>
    )
  }
}


export default Pie;
