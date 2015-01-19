/** @jsx React.DOM */

var Route = React.createClass({displayName: "Route",
  showRouteDetails: function() {
    var searchTerm = $('#searchTerm').val();
    React.render(
      React.createElement(DetailsPage, {routeId: this.props.routeId, routeName: this.props.children.toString(), searchTerm: searchTerm}),
      document.getElementById('page-content')
    );
  },

  render: function() {
    var routeName = this.props.children.toString();
    return (
      React.createElement("li", {className: "item item-icon-right", onClick: this.showRouteDetails}, 
        routeName, 
        React.createElement("i", {className: "icon ion-chevron-right"})
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
    var self = this;
    floripaByBusAPI.routesByStopName(stopName, function(data) {
      self.setState({data: data.rows});
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

var StopList = React.createClass({displayName: "StopList",
  render: function() {
    var stops = this.props.data.map(function (stop) {
      return (
        React.createElement("li", {className: "item"}, 
          stop.name
        )
      );
    });
    return (
      React.createElement("div", {className: "stop-list"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("h2", null, "Stops")
        ), 
        React.createElement("div", {className: "row"}, 
          React.createElement("ul", {className: "list"}, 
            stops
          )
        )
      )
    );
  }
});

var Timetable = React.createClass({displayName: "Timetable",
  render: function() {
    var departures = {'WEEKDAY': [], 'SATURDAY': [], 'SUNDAY': []};
    this.props.data.forEach(function (departure) {
       departures[departure.calendar].push(React.createElement("li", null, departure.time));
    });
    return (
      React.createElement("div", {className: "timetable"}, 
        React.createElement("div", {className: "row"}, 
          React.createElement("h2", null, "Timetable")
        ), 
        React.createElement("div", {className: "row responsive-sm"}, 
          React.createElement("div", {className: "col"}, 
            React.createElement("h3", null, "Weekday"), 
            departures.WEEKDAY
          ), 
          React.createElement("div", {className: "col"}, 
            React.createElement("h3", null, "Saturday"), 
            departures.SATURDAY
          ), 
          React.createElement("div", {className: "col"}, 
            React.createElement("h3", null, "Sunday"), 
            departures.SUNDAY
          )
        )
      )
    );
  }
});

var IndexPage = React.createClass({displayName: "IndexPage",
  render: function() {
    var searchTerm = this.props.searchTerm || '';
    return (
      React.createElement("div", {id: "route-list"}, 
        React.createElement("form", {id: "searchRoutesForm"}, 
          React.createElement("div", {className: "bar bar-header bar-light item-input-inset"}, 
            React.createElement("label", {className: "item-input-wrapper"}, 
              React.createElement("i", {className: "icon ion-ios7-search placeholder-icon"}), 
              React.createElement("input", {type: "search", placeholder: "Street name", id: "searchTerm", defaultValue: searchTerm})
            ), 
            React.createElement("button", {className: "button button-positive"}, 
              "Search"
            )
          )
        ), 
        React.createElement(RouteList, null)
      )
    );
  }
});

var DetailsPage = React.createClass({displayName: "DetailsPage",
  getInitialState: function() {
    return {stops: [], departures: []};
  },

  componentWillMount: function () {
    var self = this,
        routeId = this.props.routeId;

    floripaByBusAPI.stopsByRouteId(routeId, function(data) {
      self.setState({stops: data.rows});
    });

    floripaByBusAPI.departuresByRouteId(routeId, function(data) {
      self.setState({departures: data.rows});
    });
  },

  goBack: function() {
    var searchTerm = this.props.searchTerm || '';
    React.render(
      React.createElement(IndexPage, {searchTerm: searchTerm}),
      document.getElementById('page-content')
    );
  },

  render: function() {
    return (
      React.createElement("div", {id: "route-details"}, 
        React.createElement("div", {className: "bar bar-header bar-light item-input-inset"}, 
          React.createElement("a", {className: "button button-clear button-dark icon ion-chevron-left", onClick: this.goBack}, 
            "Back"
          ), 
          React.createElement("h1", {className: "title"}, this.props.routeName)
        ), 
        React.createElement(StopList, {data: this.state.stops}), 
        React.createElement(Timetable, {data: this.state.departures})
      )
    );
  }
});

$(function() {
  React.render(
    React.createElement(IndexPage, null),
    document.getElementById('page-content')
  );
});
