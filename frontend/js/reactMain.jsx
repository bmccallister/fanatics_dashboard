var createFragment = require('react-addons-create-fragment');
var tbApi = require('./dataService');
var componentData = [];
var _ = require('lodash');
var dataObject = {
    getComponentList: function() {
      this.componentList = this.componentList || [];
      return this.componentList;
    },
    setComponentList: function(list) {
      this.componentList = list;
    },
    fetchComponentList : function() {
      var that = this;
      return new Promise(function( resolve, reject) {
        if (!that.componentList) {
          that.componentList = [];
        }
        if (that.componentList.length>0) {
          resolve(that.getComponentList());
          return;
        }
        var url = '/api/tableau_components/';
        tbApi.getApi(url, '').then(function(data) {
          that.setComponentList(data);
          resolve(data);
        }).catch(reject);
      })
    }
  }
dataObject.setComponentList([]);

var ComponentContainer = React.createClass({displayName: 'ComponentContainer',
  getInitialState: function() {
    return {componentList: [],currentTime: 0};
  },
  componentDidMount: function() {
    var that= this;
    
    that.setState({currentTime: new Date().getTime()});
    dataObject.fetchComponentList().then(function(data) {
      that.setState({componentList:data});
    }).catch(function(err) {
      console.log('error recieved:', err);
    });
  },
  render: function() {
    return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <ComponentCount componentList={this.state.componentList} />
        </div>
        <div className="col-md-3">
          <CurrentTime currentTime={this.state.currentTime} />
        </div>
      </div>
      <div className="row">
        <Repeater componentList={this.state.componentList} />
      </div>
    </div>
    )
  },
  onUpdate: function(val) {
    this.setState({
      data:val
    })
  }
})

var ComponentCount = React.createClass({displayName: 'ComponentCount',
  render: function() {
      var componentList = this.props.componentList || []
      return (
        <div className="row">
          <div className="col-md-1">#:</div>
          <div className="col-md-1">{componentList.length}</div>
        </div>
      );
    }
  });
  
var CurrentTime = React.createClass({displayName: 'CurrentTime',
  render: function() {
    return (
        <div className="row">
          <div className="col-md-1">Date:</div>
          <div className="col-md-1">{this.props.currentTime}</div>
        </div>
    );
  }
});

var ComponentOptions = React.createClass({displayName: 'ComponentOptions',
   render: function()
    {
        return (
            <div>
                <input type="text" ref="myInput" />
                <input type="button" onClick={this.update} value="Update C2"/>
            </div>
        )
    },
    update: function()
    {
        var theVal = this.refs.myInput.getDOMNode().value;
        this.props.onUpdate(theVal);
    }
});

var RepeaterRow = React.createClass({displayName: 'RepeaterRow',
    render: function() {
      var myObject = this.props.componentList[this.props.index].components;
      var myFields = createFragment(myObject['values']);
        return (
          <div className="tableauComponent">
            <div className="description">{myObject.description}</div>
            <FieldRepeater valuesData={myFields} />
          </div>
        );
    }
});

var cleanNum = function(numStr) {
  var num = numStr + '';
  var num = num.replace('%');
  return parseInt(num);
}
var establishIndicator = function(val, arrayArg) {
  var thresholdArray = arrayArg;
  var indicator = '';
  
  var determineAsc = function(val, thresholdArray) {
    var indicator = '';
    if (val>=cleanNum(thresholdArray[0])&& val<cleanNum(thresholdArray[1])) {
      indicator += ' green';
    }
    if (val>=cleanNum(thresholdArray[1])&&val<cleanNum(thresholdArray[2])) {
      indicator += ' yellow';
    }
    if (val>=cleanNum(thresholdArray[2])) {
      indicator += ' red';
    }
    return indicator;
  }
  
  var determineDesc = function(val, thresholdArray) {
    var indicator = '';
    if (val<=cleanNum(thresholdArray[0])&& val>cleanNum(thresholdArray[1])) {
      indicator += ' green';
    }
    if (val<=cleanNum(thresholdArray[1])&&val>cleanNum(thresholdArray[2])) {
      indicator += ' yellow';
    }
    if (val<=cleanNum(thresholdArray[2])) {
      indicator += ' red';
    }
    return indicator;
  }
  
  if (thresholdArray.length < 1) {
    indicator+=' green';
  } else {
    var TopVal = cleanNum(thresholdArray[0]);
    var SecondVal = cleanNum(thresholdArray[1]);
      console.log('Comparing ' + val + ' to be between ' + TopVal + ' to ' + SecondVal)
    
    if (TopVal > SecondVal) {
      indicator = determineDesc(val, thresholdArray);
    } else {
      indicator = determineAsc(val, thresholdArray);
    }
  }
  return indicator;
}

var FieldRepeater = React.createClass({displayName: 'FieldRepeater',
    render: function() {
      var myObject = this.props.valuesData;
      var rows = [];
      for (var i = 0 ; i < myObject.length ; i++) {
        if (!myObject[i].value) {
          myObject[i].value = myObject[i].value || '?';
        }
        var indicator = 'indicator';
        indicator += establishIndicator(cleanNum(myObject[i].value),myObject[i].threshold)
        rows.push(
          <div className="tableauRow" key={i}>
            <div className={indicator}></div>
            <div className="rowText">{myObject[i].name}</div>
            <div className="rowText">{myObject[i].value}</div>
          </div>
        );
      }
      return (
        <div>
        {rows}
        </div>
        );
    }
});

var Repeater = React.createClass({
    getInitialState: function() {
      var self = this;
      var updateComponentData = function() {
        var i = 0;
        var limit = self.props.componentList.length;
        var url = '/api/tableau_components/';
        
        var processNext = function(cb) {
          if (i >= limit) {
            // Process final cb
            cb(true);
            return;
          }
          var row = self.props.componentList[i].components;
          i++;
          var name = row.name;
          tbApi.getApi(url, name).then(function(data) {
            _.each(row.values, function(valueRow) {
              if (data.payload[valueRow.key]) {
              valueRow.value = data.payload[valueRow.key];
              }
            })
            self.replaceState({componentData:data});
            processNext(cb);
          }).catch(function(err) {
            console.log('Error:', err);
            cb(false);
          });
        }
        
        
        var finalCb = function(bVal) {
          //console.log('Final callback called');
        }
        
        if (self.props.componentList.length < 1) {
          finalCb();
          return;
        } else {
          processNext(finalCb);
        }
        
      }
      console.log('starting updateComponentData interval')
      setInterval(function() {
        updateComponentData(this);
      }, 3000);
      return {componentList:this.props.componentList};
    },
    render: function() {
        var rows = [];
        var self = this;
        
        var componentListTemp = self.props.componentList;
        for (var i = 0 ; i < componentListTemp.length ; i++) {
          var componentListTemp = createFragment(componentListTemp);
          rows.push(<RepeaterRow key={i} index={i} componentList={componentListTemp} />);
        }
        return <div>{rows}</div>;
    }
});



var getContainer = function() {
    return document.getElementById('example3');
}


var container = getContainer();

ReactDOM.render(
    <ComponentContainer />,
    document.getElementById('ComponentContainer')
  );
  
  

/*
ReactDOM.render(
    <SpanText url="/api/tableau_components" component={dataObject} />,
    getContainer()
)

var SpanText = React.createClass({displayName: 'SpanText',
  rawMarkup: function() {
    var md = new Remarkable();
    console.log('Creating raw markup');
    var number = this.props.number || 'No number';
    var rawMarkup = md.render(number.toString());
    return { __html: rawMarkup };
  },
    getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    console.log('in component did mount');
    var url = this.props.url ;
    console.log('url:' + url);
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        console.log('had success');
        this.setState({data: data});
        console.log('set state:', data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('Caught error:', err)
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
        <div className="parentDiv">Span data:
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
        </div>
    );
  }
});
*/