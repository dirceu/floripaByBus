/** @jsx React.DOM */

var Route = React.createClass({displayName: "Route",
  render: function() {
    var routeName = this.props.children.toString();
    return (
      React.createElement("li", {className: "item item-icon-right"}, 
        routeName, 
        React.createElement("i", {className: "icon ion-chevron-right"})
      )
    );
  }
});

var RouteList = React.createClass({displayName: "RouteList",
  getInitialState: function() {
    return {data: [{"id":22,"shortName":"131","longName":"AGRONÔMICA VIA GAMA D'EÇA","lastModifiedDate":"2009-10-26T02:00:00+0000","agencyId":9},{"id":32,"shortName":"133","longName":"AGRONÔMICA VIA MAURO RAMOS","lastModifiedDate":"2012-07-23T03:00:00+0000","agencyId":9}]};
  },

  componentDidMount: function() {
    var self = this,
        searchCallback = function(evt) {
          evt.preventDefault();
          self.searchRoutes($('#searchTerm').val());
        };
    $('#searchRoutesForm').submit(searchCallback);
    $('#searchRoutesForm').find('button').click(searchCallback);
  },

  searchRoutes: function(stopName) {
    floripaByBusAPI.routesByStopName(stopName, function(data) {
      this.setState({data: data.rows});
    });
  },

  render: function() {
    var routeNodes = this.state.data.map(function (route) {
      return (
        React.createElement(Route, {routeId: route.id}, 
          route.longName
        )
      );
    });
    return (
      React.createElement("ul", {className: "list"}, 
        routeNodes
      )
    );
  }
});

$(function() {
  React.render(
    React.createElement(RouteList, null),
    document.getElementById('route-list')
  );
});
