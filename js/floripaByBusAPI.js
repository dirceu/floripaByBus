$.support.cors = true;

var floripaByBusAPI = {
  __callEndpoint: function callEndpoint(methodName, params, callback) {
    var ajaxParams = {
      success: callback,
      data: JSON.stringify({ 'params': params }),
      dataType: "json",
      headers: {
        "Content-type": "application/json",
        "X-AppGlu-Environment": "staging"
      },
      password: "DtdTtzMLQlA0hk2C1Yi5pLyVIlAQ68",
      type: "POST",
      url: "https://api.appglu.com/v1/queries/" + methodName + "/run",
      username: "WKD4N7YMA1uiM8V"
    };
    $.ajax(ajaxParams);
  },

  routesByStopName: function routesByStopName(stopName, callback) {
    this.__callEndpoint("findRoutesByStopName", { 'stopName': "%" + stopName + "%" }, callback);
  },

  stopsByRouteId: function stopsByRouteId(routeId, callback) {
    this.__callEndpoint("findStopsByRouteId", { 'routeId': routeId }, callback);
  },

  departuresByRouteId: function departuresByRouteId(routeId, callback) {
    this.__callEndpoint("findDeparturesByRouteId", { 'routeId': routeId }, callback);
  }
};
