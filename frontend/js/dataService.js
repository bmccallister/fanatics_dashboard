
//var socket = io.connect('http://localhost:8888');

var checkTrailingSlash = function(str) {
  var char = str.split('').reverse()[0];
  console.log('Checking trailing slash against:',char)
  return  char == '/';
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
                url+='/';
            }
            url += param;
        }
        console.log('Full url request:', url);
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
            console.error('Caught error on url:', url, err, xhr, status)
            reject(err);
          }.bind(this)
        });
    });
}

export const putApi = (route, param, data) => {
    return new Promise(function(resolve, reject) 
    {
        param = param || '';
        var url = route;
              
        if (param.length>1) {
            if (!checkTrailingSlash(route)) {
                url+='/';
            }
            url += param;
        }
        console.log('Full url request:', url);
        $.ajax({
          type: 'PUT',
          url: url,
          data: data,
          dataType: 'json',
          cache: false,
          success: function(data) {
            resolve(data);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error('Caught error on url:', url, err, xhr, status)
            reject(err);
          }.bind(this)
        });
    });
}

export const deleteApi = (route, data) => {
    return new Promise(function(resolve, reject) 
    {
        var url = route;
        console.log('Full delete url request:', url);
        $.ajax({
          type: 'DELETE',
          url: url,
          data: data,
          dataType: 'json',
          cache: false,
          success: function(data) {
            resolve(data);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error('Caught error on url:', url, err, xhr, status)
            reject(err);
          }.bind(this)
        });
    });
}

export const postApi = (route, data) => {
    return new Promise(function(resolve, reject) 
    {
        var url = route;
        console.log('Full url request:', url);
        $.ajax({
          type: 'POST',
          url: url,
          data: data,
          dataType: 'json',
          cache: false,
          success: function(data) {
            resolve(data);
          }.bind(this),
          error: function(xhr, status, err) {
            console.error('Caught error on url:', url, err, xhr, status)
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
    copyTemplate(templateData) {
      return new Promise(function( resolve, reject) {
        const url = '/api/templates/copy/' + name;
        console.log('Ulr for copy template:', url);
        postApi(url, templateData).then(function(data) {
          resolve(data);
        }).catch(reject);
      })
    }
    copyComponent(componentData) {
      return new Promise(function( resolve, reject) {
        console.log('Doing copy component')
        const url = '/api/components/copy/' + name;
        postApi(url, componentData).then(function(data) {
          resolve(data);
        }).catch(reject);
      })
    }
    deleteTemplate(name) {
      return new Promise(function( resolve, reject) {
        console.log('Calling delete template:' + name);
        const url = '/api/templates/' + name;
        deleteApi(url).then(function(data) {
          resolve(data);
        }).catch(reject);
      })
    }
    deleteComponent(id) {
      return new Promise(function( resolve, reject) {
        console.log('Calling delete component:' + id);
        const url = '/api/components/' + id;
        deleteApi(url).then(function(data) {
          resolve(data);
        }).catch(reject);
      })
    }
    createTemplate(templateData) {
      var milliseconds = (new Date).getTime();
      name = templateData.name || 'Template_' + milliseconds;
      return new Promise(function( resolve, reject) {
        const url = '/api/templates/' + name;
        postApi(url, templateData).then(function(data) {
          resolve(data);
        }).catch(reject);
      })
    }
    updateTemplate(templateData) {
      var that = this;
      var milliseconds = (new Date).getTime();
      name = templateData.name || 'Template_' + milliseconds;
      return new Promise(function( resolve, reject) {
        const url = '/api/templates';
        putApi(url, templateData.name, templateData).then(function(data) {
          resolve(data);
        }).catch(reject);
      })
    }
    fetchTemplateList (name, override) {
      var that = this;
      name = name || '';
      return new Promise(function( resolve, reject) {
        if (!that.templateList) {
          that.templateList = [];
        }
        if (that.templateList.length>0 && !override) {
          resolve(that.getTemplateList());
          return;
        }
        const url = '/api/templates';
        getApi(url, name).then(function(data) {
          that.setTemplateList(data);
          resolve(data);
        }).catch(reject);
      })
    }
    fetchComponentList(name) {
      var that = this;
      name = name || '';
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
        getApi(url, name).then(function(data) {     
          console.log('Get api returned');     
          that.setComponentList(data);
          console.log('Component Data:' + data);
          resolve(data);
        }).catch(reject);
      })
    }
}
