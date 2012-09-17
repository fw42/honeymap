$('#world-map').vectorMap({
  backgroundColor: '',
  markerStyle: {
    initial: {
      fill: 'red',
      stroke: 'darkred',
      r: 3
    }
  },
  series: {
    markers: [],
    regions: [{
      attribute: 'fill',
      normalizeFunction: 'linear',
      values: regionhits
    }]
  },
  onRegionLabelShow: function(ev, label, code) {
    label.html(
      "<b>" + label.html() + "</b><br/>" +
      (regionhits[code] ? regionhits[code] : 0) + " events"
    );
  },
  onMarkerLabelShow: function(ev, label, code) {
    label.html(
      "<b>" + label.html() + "</b><br/>" +
      markerhits[code] + " events"
    );
  }
});
var mapobj = $('#world-map').vectorMap('get', 'mapObject');
var svg = $('svg');
