window.masterData = {};

const masterHandler = (keyName, value) => {
  try {
    var fullStr = 'window.';
    if(keyName.indexOf('masterData')<0) {
      fullStr+='masterData.';
    } 
    fullStr += keyName + "='"+ value + "'";
    console.log('building eval');
   
   eval(fullStr);
   } catch (exc) {
    console.log('Couldnt run eval');
   }
}

export class BoundValueObject extends React.Component {
    constructor() {
      super();
      this.handleClick = this.handleClick.bind(this);      
      this.handleChange = this.handleChange.bind(this);
    }
    getInitialState () {
      return { value: ''};
    }
    componentDidMount () {
      this.setState({value: this.props.value});
    }
    handleClick () {
      console.log('Handling click');
    }
    handleChange (event) {
      var newVal = event.target.value;
      console.log('Got an on change event against my full key of:', this.props.fullKey)
      console.log('New value:' + newVal)
      masterHandler(this.props.fullKey, newVal);
      this.setState({value: newVal});
    }
    render () {
    if (!this.state) {
      return (
        <div> Please wait </div>
      );
    } else {
      var that = this;
      var fullKey = this.props.fullKey;
      var keyName = this.props.keyName;
      var value = this.props.value;

      console.log('Rendering value object:', that.props.keyName, that.props.fullKey, that.state.value, that.props.data);
      masterHandler(that.props.fullKey, that.state.value);
      return (
        <div>
          <input value={this.state.value} id={keyName} onChange={ that.handleChange } /> 
        </div>
      )
    }
  }
}

export class ThresholdObject extends React.Component {
    constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('Clicked remove me with ', this.props);
  }
  render() {
    console.log('Entering thresholdObject!!!!!!!!!!!!');
    var contents = [];
    var data = this.props.data;
    var key = this.props.keyName;
    var fullKey;
    var iterator = this.props.iterator;
    var usableData = {};
    if (_.isArray(data[key])) {
      fullKey = 'masterData.' + key + '[' + iterator + ']'; 
      usableData = data[key][iterator]
    } else {
      fullKey = 'masterData.' + key;
      usableData = data[key];
    }
    var keyVal = usableData['key'];
    var nameVal = usableData['name'];
    var fkKey = fullKey + '.key';
    var fkName = fullKey + '.name';
    contents.push(<div export className="col-md-3">Key:<BoundValueObject keyName={key} fullKey={fkKey} value={keyVal} /></div>);
    contents.push(<div export className="col-md-3">Name:<BoundValueObject keyName={name} fullKey={fkName} value={nameVal} /></div>);

    console.log('checking threshold against:', data['threshold']);
    if (_.isArray(data['threshold'])) {
      if (data['threshold'].length<1) {
        data['threshold'] = [0,0,0,0];
      }
      var indicatorArray = ['Green','Yellow','Red','Black'];
      for (var i = 0 ; i < data['threshold'].length ; i++) {
        //contents+='<div export class="col-md-3">' + indicatorArray[i] + '<br><input id="threshold_' + data['key'] +'_' + i + '" value="' + data['threshold'][i] + '" onChange={ function() {} }></div>';
      }
    }

    return (
      <div>{contents}</div>
    )
  }
}

export class GenericObject extends React.Component {
    constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('Clicked remove me with ', this.props);
  }
  render() {
    console.log('Entering GenericObject!!!!!!!!!!!!');
    var contents = [];
    var data = this.props.data;
    var iterator = this.props.iterator;
    var key = this.props.keyName;
    var fullKey;
    var iterator = this.props.iterator;
    var usableData = {};
    if (iterator) {
      fullKey = key + '[' + iterator + ']';
    }

    return (
      <div>{contents}</div>
    )
  }
}
export class RemoveArrayItem extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('Clicked remove me with ', this.props);
  }
  render() {
    console.log('in render for RemoveArrayItem');
    return (
      <div export className="roundedBox" onClick={this.handleClick}>X</div>
    );
  }
}

export class AddArrayItem extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    console.log('Clicked add me with ', this.props);
  }
  render() {
    var self = this;
    console.log('in render for AddArrayItem');
    return (
      <div export className="roundedBox" onClick={self.handleClick}>+</div>
    );
  }
}
export class RenderObjectArray extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('Render array component mounted');
  }
  render () {
    var key = this.props.keyName;
    var data = this.props.rowData;
    var contents = [];

    contents.push(<div export className="contentRow">Array:{key}</div>)

    for (var innerKey in data[key]) {
        var usableData = data[key][innerKey];
        var fkName = 'masterData.' + key;
        if (!isNaN(parseInt(innerKey))) {
          fkName += '[' + innerKey + ']';
        }

        if (usableData.key) {
          var arrKey = fkName;
          fkName += '.name';
          var usableValue = usableData.name;
          // We have a key val pair
          contents.push(
            <div export className="row contentRow">
              <div export className="col-md-3">Usable key - {usableData.key}</div>
              <div export className="col-md-3"><BoundValueObject keyName={name} fullKey={fkName} value={usableValue} /></div>
            </div>);
            if (usableData.threshold) {
              console.log('object has threshold');
              contents.push(
                <div className="col-md-6 contentRow">
                  <RenderStandardArray fullKey={arrKey} keyName={'threshold'} rowData={usableData} />
                </div>
              )
            }

        } else {
          contents.push(
            <div export className="row contentRow">
              <div export className="col-md-3">{innerKey}</div>
              <div export className="col-md-3"><BoundValueObject keyName={name} fullKey={fkName} value={usableData} /></div>
            </div>);
          }
      }
      var styleObj = {
        background: '#262626',
        border: '1px solid #FFF'
      }
      return (
        <div export className="row" style={styleObj}>
          {contents}
        </div>
      )
    }
}

export class RenderStandardArray extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('Render array component mounted');
  }
  render () {
    var key = this.props.keyName;
    var fullKey = this.props.fullKey;
    var data = this.props.rowData;
    var contents = [];
    fullKey+='.' + key;

    contents.push(<div export className="col-md-6 contentRow">Array:{key}</div>)
    for (var i = 0; i < data[key].length; i++) {
      var tmpfullKey = fullKey + '[' + i + ']';
      var value = data[key][i];
      console.log('RenderStandardArray Value:', value);
      console.log('RenderStandardArray Iterator value Value:', value[i]);
      console.log('RenderStandardArray Full key:', fullKey);

      contents.push(<div className="col-md-6 contentRow"><BoundValueObject keyName={key} fullKey={tmpfullKey} value={value} data={this.props.rowData} iterator={i}/></div>);
    }

    var styleObj = {
      background: '#262626',
      border: '1px solid #FFF'
    }
    return (
      <div export className="row" style={styleObj}>
        {contents}
      </div>
    )
  }
} // end renderArray

export class StandardField extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    var that = this;
  }
  render () {
  console.log('Rendering standard field with data:', this.props);
    var key = this.props.keyName;
    var fullKey = key;
    var idKey = 'id_' + key;
    var value = '';
    if (this.props.rowData) {
      value = this.props.rowData[key];
    }
    var divStyle = {
      background: '#333'
    };
    console.log('Rendering boundvalue objst')
    return (
      <div export className="row" style={divStyle}>
        <div export className="col-md-3">Key: {key}</div>
        <div export className="col-md-3">
          <BoundValueObject keyName={key} fullKey={fullKey} value={value} data={this.props.rowData} />
        </div>
      </div>
    )
  }
}
//<input id={idKey} value={value} onChange={function() { console.log("Data changed"); } }/>

export class EditRows extends React.Component {
  constructor(props) {
    console.log('in the constructor for edit template');
    super(props);
  }
  componentDidMount() {
    var that= this;
    console.log('Setting componentId');
  }
  render () {
    var name = '?';
    if (this.props.rowData) {
      name = this.props.rowData.id || this.props.rowData.name;
    }
    console.log('EDIT Rows Identifier:', name);
    var contents = [];
    var rowData = this.props.rowData;
    for (var key in rowData) {
      if (_.isArray(rowData[key])) {  
        if (_.isObject(rowData[key][0])) {
          contents.push(<RenderObjectArray keyName={key} rowData={rowData} />);
        } else {
          contents.push(<RenderStandardArray fullKey={''} keyName={key} rowData={rowData} />);
        }
      }
      else if (_.isObject(rowData[key])) {
        contents.push(<GenericObject keyName={key} data={rowData} />);
      } else {
        contents.push(<StandardField keyName={key} rowData={rowData} />);
      }
    }
    return (
      <div export className="contentFields">{contents}</div>
    )
  } 
}
