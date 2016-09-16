
var socket = io.connect('http://localhost:8888');

var checkTrailingSlash = function(str) {
    return str.substr(str.length, -1) == '/';
}
export const isRemoved = (obj, field) => {
  var payload = obj.payload;
  var ignoredFields = obj.ignoredFields.replace(' ','').toLowerCase().split(',');
  var ret = false;

  for (var i = 0 ; i < ignoredFields.length ; i++) {
      if (field.toLowerCase() == ignoredFields[i]) {
        ret = true;
        return ret;
      }
  }
  console.log('Returning ret:', ret)
  return ret;
}

export const getSocket = (route, param) => {
    console.log(route + param);
    return new Promise(function(resolve, reject) 
    {
        param = param || '';

        socket.emit(route, param);
        socket.on(route, function(data){
          resolve(data);
        });              
    });
}

export const getApi = (route, param, optionalThis, optionalParam) => {
    
    return new Promise(function(resolve, reject) 
    {
        param = param || '';
        var url = route;
              
        if (param.length>1) {
            if (!checkTrailingSlash(route)) {
                route+='/';
            }
            url += param;
        }
        $.ajax({
          url: url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            if (optionalThis&&optionalParam) {
                var newState = {};
                newState[optionalParam] = data;
                optionalThis.setState(newState);
            }
            resolve(data);
          }.bind(this),
          error: function(xhr, status, err) {
            console.log('Caught error:', err)
            console.error(this.props.url, status, err.toString());
            reject(err);
          }.bind(this)
        });
    });
}

export class DataFetchInterface {
    constructor() {
      
      this.componentList = this.componentList || [];
    }
    getComponentList () {
      return this.componentList;
    }
    setComponentList (list) {
      this.componentList = list;
    }
    getInterfaceList () {
      return this.interfaceList;
    }
    setInterfaceList (list) {
      this.interfaceList = list;
    }
    initializeLists () {
      this.componentList = [];
      this.interfaceList = [];
    }
    fetchComponentList () {
      var that = this;
      return new Promise(function( resolve, reject) {
        if (!that.componentList) {
          that.componentList = [];
        }
        if (that.componentList.length>0) {
          resolve(that.getComponentList());
          return;
        }
        const url = '/api/tableau_components/';
        getApi(url, '').then(function(data) {
          
          that.setComponentList(data);
          resolve(data);
        }).catch(reject);
      })
    }
    fetchActiveInterfaces() {
      var that = this;
      return new Promise(function( resolve, reject) {
        console.log('inside fetch fetchActiveInterfaces!!!');
        // Ignore caching for now so page loads
        /*if (!that.interfaceList) {
          that.interfaceList = [];
        }
        if (that.interfaceList.length>0) {
          resolve(that.getInterfaceList());
          return;
        }
        */
        const url = '/api/tableau_interfaces/';
        console.log('Using url:' + url)
        getApi(url, '').then(function(data) {          
          that.setInterfaceList(data);
          resolve(data);
        }).catch(reject);
      })
    }
}
