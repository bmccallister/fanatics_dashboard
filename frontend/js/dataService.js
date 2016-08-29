
var socket = io.connect('http://localhost:8888');

var checkTrailingSlash = function(str) {
    console.log('Checking trailing slash on ' + str);
    console.log('typeof:' +typeof(str));
    console.log('Checking str reverse:', str.substr(str.length, -1) );
    return str.substr(str.length, -1) == '/';
}

export const getApi = (route, param, optionalThis, optionalParam) => {
    
    return new Promise(function( resolve, reject) {
        param = param || '';
        var url = route;

        console.log('Attempting to connect socket');

        
              
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
}
