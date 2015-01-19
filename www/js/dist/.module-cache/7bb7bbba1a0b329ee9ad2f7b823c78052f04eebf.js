/** @jsx React.DOM */

var Route = React.createClass({displayName: "Route",
  render: function() {
    var routeName = this.props.children.toString();
    return (
      React.createElement("li", {class: "item item-icon-right"}, 
        routeName, 
        React.createElement("i", {class: "icon ion-chevron-right"})
      )
    );
  }
});

var RouteList = React.createClass({displayName: "RouteList",
  getInitialState: function() {
    return {data: []};
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
    var routeNodes = this.props.data.map(function (route) {
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
