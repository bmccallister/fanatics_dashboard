import { DataFetchInterface, getApi, isRemoved } from './dataService';
const _ = require('lodash');
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/pie';
import 'amcharts3/amcharts/themes/dark';

class Pie extends React.Component {
  render() {
    var myProps = this.props.data;
    var data = [];

    for (var k in myProps.payload){
        if (myProps.payload.hasOwnProperty(k)) {
          if (!isRemoved(myProps, k)) {
            var newObject = { label: k, value: myProps.payload[k] };
            data.push(newObject);
            //data.labels.push(k);
            //data.series.push(myProps.payload[k]);
          }
        }
    }
    var options = {};
    if (!myProps.size)
    {
      myProps.size = 3;
    }
    var componentStyleClasses = "col-md-" + myProps.size + "";

    var divName = 'line_' +myProps.id; //'chart2div';

    var chart2Config = AmCharts.makeChart(divName, {
        "type": "pie",
        "theme": "light",
        "dataProvider": data,
        "valueField": "value",
        "titleField": "label", 
        "labelsEnabled": false,
        "autoMargins": false,
        "marginTop": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "marginRight": 0,
        "pullOutRadius": 0,
         "balloon":{
         "fixedPosition":true
        },
        "export": {
          "enabled": true
        }
      } );
    return (
        <Draggable>
          <div className={componentStyleClasses}>
            <div className="panel panel-default">
              <div className="panel-heading"><h4>{myProps.title}</h4> Line Graph: {myProps.description}</div>
              <div className="panel-body component-min-height">
              Chart:
                <div id={divName} className="pieChart"></div>
              </div>
              <div className="panel-footer">{myProps.context}</div>
            </div>
          </div>
        </Draggable>
      )
  /*
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
    */
  }
}

export default Pie;
