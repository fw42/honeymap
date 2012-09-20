// small helper method to format the hover labels
function event_count_summary(hash) {
  var summary = "";
  var total = 0;
  for(type in hash) {
    if(total == 0) { summary += "<hr/>"; }
    summary += "<b>" + type + "</b>: " + (hash[type] ? hash[type] : 0) + "<br/>";
    total += hash[type];
  }
  if(total > 0) {
    summary += "<hr/><b>total</b>: " + total + " events";
  }
  return summary;
}

$('#world-map').vectorMap({
  backgroundColor: '',
  markerStyle: {
    initial: {
      fill: markersrc_color.fill,
      stroke: markersrc_color.stroke,
      r: 3
    }
  },
  series: {
    markers: [],
    regions: [{
      scale: [ '#FFFFFF', '#0071A4' ],
      attribute: 'fill',
      normalizeFunction: 'linear',
      values: regionhits
    }]
  },
  onRegionLabelShow: function(ev, label, code) {
    label.html("<big>" + label.html() + "</big>");
    label.append(event_count_summary(regionhits[code]));
  },
  onMarkerLabelShow: function(ev, label, code) {
    label.html(markercaptions[code]);
    label.append(event_count_summary(markerhits[code]));
  }
});
var mapobj = $('#world-map').vectorMap('get', 'mapObject');
mapobj.regions['US'].config.name = "USA";
