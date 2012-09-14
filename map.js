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
  }
});
var mapobj = $('#world-map').vectorMap('get', 'mapObject');
