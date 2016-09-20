
//var socket = io.connect('http://localhost:8888');

var checkTrailingSlash = function(str) {
    return str.substr(str.length, -1) == '/';
}
export const isRemoved = (obj, field) => {
  var ret = false;
  /*var payload = obj.payload;
  var ignoredFields = obj.ignoredFields.replace(' ','').toLowerCase().split(',');
  for (var i = 0 ; i < ignoredFields.length ; i++) {
      if (field.toLowerCase() == ignoredFields[i]) {
        ret = true;
        return ret;
      }
  }
  console.log('Returning ret:', ret)*/
  return ret;
}

/*export const getSocket = (route, param) => {
    console.log(route + param);
    return new Promise(function(resolve, reject) 
    {
        param = param || '';

        socket.emit(route, param);
        socket.on(route, function(data){
          resolve(data);
        });              
    });
}*/

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
      
      this.templateList = this.templateList || [];
    }
    getTemplateList () {
      return this.templateList;
    }
    setTemplateList (list) {
      this.templateList = list;
    }
    getComponentList () {
      return this.componentList;
    }
    setComponentList (list) {
      this.componentList = list;
    }
    initializeLists () {
      this.templateList = [];
      this.componentList = [];
    }
    fetchTemplateList () {
      var that = this;
      return new Promise(function( resolve, reject) {
        if (!that.templateList) {
          that.templateList = [];
        }
        if (that.templateList.length>0) {
          resolve(that.getTemplateList());
          return;
        }
        const url = '/api/templates';
        getApi(url, '').then(function(data) {
          
          that.setTemplateList(data);
          resolve(data);
        }).catch(reject);
      })
    }
    fetchComponentList() {
      var that = this;
      return new Promise(function( resolve, reject) {
        console.log('inside fetch fetchComponents!!!');
        // Ignore caching for now so page loads
        /*if (!that.ComponentList) {
          that.ComponentList = [];
        }
        if (that.ComponentList.length>0) {
          resolve(that.getComponentList());
          return;
        }
        */
        const url = '/api/components';
        console.log('Using url:' + url)
        getApi(url, '').then(function(data) {          
          that.setComponentList(data);
          console.log('Component Data:' + data);
          resolve(data);
        }).catch(reject);
      })
    }
}
