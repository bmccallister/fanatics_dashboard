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

    var divName = 'line_' +myProps.id; //'chart2div';

    var chart = AmCharts.makeChart( divName, {
      "type": "serial",
      "theme": "light",
      "dataProvider": [ {
        "country": "USA",
        "visits": 2025
      }, {
        "country": "China",
        "visits": 1882
      }, {
        "country": "Japan",
        "visits": 1809
      }, {
        "country": "Germany",
        "visits": 1322
      }, {
        "country": "UK",
        "visits": 1122
      }, {
        "country": "France",
        "visits": 1114
      }, {
        "country": "India",
        "visits": 984
      }, {
        "country": "Spain",
        "visits": 711
      }, {
        "country": "Netherlands",
        "visits": 665
      }, {
        "country": "Russia",
        "visits": 580
      }, {
        "country": "South Korea",
        "visits": 443
      }, {
        "country": "Canada",
        "visits": 441
      }, {
        "country": "Brazil",
        "visits": 395
      } ],
      "valueAxes": [ {
        "gridColor": "#FFFFFF",
        "gridAlpha": 0.2,
        "dashLength": 0
      } ],
      "gridAboveGraphs": true,
      "startDuration": 1,
      "graphs": [ {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "fillAlphas": 0.8,
        "lineAlpha": 0.2,
        "type": "column",
        "valueField": "visits"
      } ],
      "chartCursor": {
        "categoryBalloonEnabled": false,
        "cursorAlpha": 0,
        "zoomable": false
      },
      "categoryField": "country",
      "categoryAxis": {
        "gridPosition": "start",
        "gridAlpha": 0,
        "tickPosition": "start",
        "tickLength": 20
      },
      "export": {
        "enabled": true
      }
    });
    
    var type = 'Bar'
    if (!myProps.size)
    {
      myProps.size = 3;
    }
    var componentStyleClasses = "col-md-" + myProps.size + "";
    return (
        <Draggable>
          <div className={componentStyleClasses}>
            <div className="panel panel-default">
              <div className="panel-heading"><h4>{myProps.title}</h4> Line Graph: {myProps.description}</div>
              <div className="panel-body component-min-height">
              Chart:
                <div id={divName} className="fanCharts"></div>
              </div>
              <div className="panel-footer">{myProps.context}</div>
            </div>
          </div>
        </Draggable>
      )
  }
}

export default BarGraph;