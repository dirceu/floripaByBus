/** @jsx React.DOM */

var Route = React.createClass({
  showRouteDetails: function() {
    var searchTerm = $('#searchTerm').val();
    React.render(
      <DetailsPage routeId={this.props.routeId} routeName={this.props.children.toString()} searchTerm={searchTerm} />,
      document.getElementById('page-content')
    );
  },

  render: function() {
    var routeName = this.props.children.toString();
    return (
      <li className="item item-icon-right" onClick={this.showRouteDetails}>
        {routeName}
        <i className="icon ion-chevron-right"></i>
      </li>
    );
  }
});

var RouteList = React.createClass({
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
        <Route routeId={route.id}>
          {route.longName}
        </Route>
      );
    });
    return (
      <ul className="list">
        {routeNodes}
      </ul>
    );
  }
});

var StopList = React.createClass({
  render: function() {
    var stops = this.props.data.map(function (stop) {
      return (
        <li className="item">
          {stop.name}
        </li>
      );
    });
    return (
      <div className="stop-list">
        <div className="row">
          <h2>Stops</h2>
        </div>
        <div className="row">
          <ul className="list">
            {stops}
          </ul>
        </div>
      </div>
    );
  }
});

var Timetable = React.createClass({
  render: function() {
    var departures = {'WEEKDAY': [], 'SATURDAY': [], 'SUNDAY': []};
    this.props.data.forEach(function (departure) {
       departures[departure.calendar].push(<li>{departure.time}</li>);
    });
    return (
      <div className="timetable">
        <div className="row">
          <h2>Timetable</h2>
        </div>
        <div className="row responsive-sm">
          <div className="col">
            <h3>Weekday</h3>
            {departures.WEEKDAY}
          </div>
          <div className="col">
            <h3>Saturday</h3>
            {departures.SATURDAY}
          </div>
          <div className="col">
            <h3>Sunday</h3>
            {departures.SUNDAY}
          </div>
        </div>
      </div>
    );
  }
});

var IndexPage = React.createClass({
  render: function() {
    var searchTerm = this.props.searchTerm || '';
    return (
      <div id="route-list">
        <form id='searchRoutesForm'>
          <div className="bar bar-header bar-light item-input-inset">
            <label className="item-input-wrapper">
              <i className="icon ion-ios7-search placeholder-icon"></i>
              <input type="search" placeholder="Street name" id='searchTerm' defaultValue={searchTerm} />
            </label>
            <button className="button button-positive">
              Search
            </button>
          </div>
        </form>
        <RouteList />
      </div>
    );
  }
});

var DetailsPage = React.createClass({
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
      <IndexPage searchTerm={searchTerm} />,
      document.getElementById('page-content')
    );
  },

  render: function() {
    return (
      <div id="route-details">
        <div className="bar bar-header bar-light item-input-inset">
          <a className="button button-clear button-dark icon ion-chevron-left" onClick={this.goBack}>
            Back
          </a>
          <h1 className="title">{this.props.routeName}</h1>
        </div>
        <StopList data={this.state.stops} />
        <Timetable data={this.state.departures} />
      </div>
    );
  }
});

$(function() {
  React.render(
    <IndexPage />,
    document.getElementById('page-content')
  );
});
