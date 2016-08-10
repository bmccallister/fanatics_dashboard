var checkTrailingSlash = function(str) {
    console.log('Checking trailing slash on ' + str);
    console.log('typeof:' +typeof(str));
    console.log('Checking str reverse:', str.substr(str.length, -1) );
    return str.substr(str.length, -1) == '/';
}

var getApi = function(route, param, optionalThis, optionalParam) {
    return new Promise(function( resolve, reject) {
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

module.exports = {
    getApi: getApi
}