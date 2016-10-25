const _ = require('lodash');
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
import 'amcharts3/amcharts/amcharts';
import 'amcharts3/amcharts/gauge';
import 'amcharts3/amcharts/themes/dark';

class GaugeComponent extends React.Component {
  render()  {
    console.log('Rendering gauge component');
    var myProps = this.props.data;
    var firstKey = Object.keys(myProps.payload)[0];
    var currentValue = parseInt(myProps.payload[firstKey]);
    var endValue = parseInt(myProps.endValue);
    if (currentValue > endValue) {
      endValue = currentValue + (currentValue/5);
    }

    var data = {
      endValue: endValue,
      startValue: myProps.startValue,
      unit: myProps.unit,
      valueInterval: myProps.valueInterval,
      value: currentValue
    };

    var divName = 'gauge_' + myProps.id;
    var chartConfig = AmCharts.makeChart(divName, {
      "theme": "dark",
      "type": "gauge",
      "axes": [{
        "topText": data.value + " " + data.unit,
        "topTextFontSize": 20,
        "topTextYOffset": 40,
        "axisColor": "#31d6ea",
        "axisThickness": 1,
        "endValue": data.endValue,
        "gridInside": true,
        "inside": true,
        "radius": 95,
        "centerY": 90,
        "valueInterval": data.valueInterval,
        "tickColor": "#67b7dc",
        "startAngle": -90,
        "endAngle": 90,
        "unit": data.unit,
        "bandOutlineAlpha": 0,
        "bands": [{
          "color": "#0080ff",
          "endValue": data.endValue,
          "innerRadius": "125%",
          "radius": "150%",
          "gradientRatio": [0.5, 0, -0.5],
          "startValue": data.startValue
        }, {
          "color": "#3cd3a3",
          "endValue": data.value,
          "innerRadius": "125%",
          "radius": "150%",
          "gradientRatio": [0.5, 0, -0.5],
          "startValue": 0
        }]
      }],
      "arrows": [{
        "alpha": 1,
        "innerRadius": "35%",
        "nailRadius": 0,
        "radius": "150%",
        "value": data.value        
      }]
    });
        
    var type = 'Gauge'

    if (!myProps.size)
    {
      myProps.size = 3;
    }

    var componentStyleClasses = "col-md-" + myProps.size + "";

    return (
      <Draggable>
        <div className={componentStyleClasses}>
          <div className="panel panel-default">
            <div className="panel-heading"><h4>{myProps.title}</h4> Gauge: {myProps.description}</div>
            <div className="panel-body component-min-height">
              <div id={divName} className="fanCharts"></div>
            </div>
            <div className="panel-footer">{myProps.context}</div>
          </div>
        </div>
      </Draggable>
    )
  }
}

export default GaugeComponent;