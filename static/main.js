var regionhits = {};
var regionhits_countonly = {};
var markerhits = {};
var markercaptions = {};
var markers_visible_max = 150;
var markers_total = 0;

function marker_animation(x, y, css) {
  $("#world-map").append(
    $('<div class="marker_animation ' + css + '"></div>')
    .css('left', x + 'px')
    .css('top', y + 'px')
    .css({ opacity: 1, scale: 0 })
    .transition({ opacity: 0, scale: 1 }, 1000, 'linear', function(){ $(this).remove(); })
  );
}

function marker_animation_ll(lat, lng, css) {
  var xy = mapobj.latLngToPoint(lat, lng);
  marker_animation(xy.x, xy.y, css);
}

function get_regioncode(x, y) {
  // HACKHACKHACK
  var efp = $(document.elementFromPoint(x + $("#world-map").offset().left, y + $("#world-map").offset().top));
  if(efp.is('path')) {
    return efp.attr('data-code');
  } else if(efp.is('circle') || (efp.is('div') && efp.hasClass('marker_animation'))) {
    // This is as ugly as it gets. If we hit an existing marker, make it invisible,
    // look again and then make it visible again.
    efp.hide();
    var rc = get_regioncode(x, y);
    efp.show();
    return rc;
  } else {
    return null;
  }
}

function get_regioncode_ll(lat, lng) {
  var xy = mapobj.latLngToPoint(lat, lng);
  return get_regioncode(xy.x, xy.y);
}

function get_regionname_ll(lat, lng) {
  var code = get_regioncode_ll(lat,lng);
  return code ? mapobj.getRegionName(code) : null;
}

function add_log(msg) {
  $('#log').append(msg);
  $("#log").scrollTop($("#log")[0].scrollHeight);
}

function remove_oldest_marker() {
    toremove = $($("#world-map svg g circle.jvectormap-marker")[0]);
    par = toremove.parent();
    mapobj.removeMarkers( [ toremove.attr('data-index') ]);
    par.remove(); // Remove parent node too (jVectorMap does not do this by itself)
}

function add_marker_ll(lat, lng, type, eventname) {
  if(eventname == null) { eventname = "other"; }
  if(type == null) {
    type = 'src';
  }
  if(type == 'src') {
    // only count src markers which are within a valid region
    var region = get_regioncode_ll(lat, lng);
    if(region) {
      if(regionhits[region] == null) { regionhits[region] = {}; regionhits_countonly[region] = 0; }
      if(regionhits[region][eventname] == null) { regionhits[region][eventname] = 0; }
      regionhits[region][eventname]++;
      regionhits_countonly[region]++;
    }
  }
  var markerkey = lat + "," + lng;
  if(markerhits[markerkey] == null) { markerhits[markerkey] = {}; }
  if(markerhits[markerkey][eventname] == null) { markerhits[markerkey][eventname] = 0; }
  markerhits[markerkey][eventname]++;
  marker_animation_ll(lat, lng, type == 'dst' ? 'markerdst' : 'markersrc');
  // only add markers which do not exist yet
  if(mapobj.markers[markerkey] == null) {
    if(markers_total >= markers_visible_max) {
      remove_oldest_marker();
    }
    if(type == 'dst') {
      mapobj.addMarker(markerkey, {
       latLng: [ lat, lng ], name: "(" + lat + ", " + lng + ")",
       style: { fill: '#F8E23B', stroke: '#383f47' }
      }, []);
    } else {
      mapobj.addMarker(markerkey, {
       latLng: [ lat, lng ], name: "(" + lat + ", " + lng + ")"
      }, []);
    }
    markers_total++;
  }
}

function update_regioncolors() {
  // Force recomputation of min and max for correct color scaling
  mapobj.series.regions[0].params.min = null;
  mapobj.series.regions[0].params.max = null;
  // Update data
  mapobj.series.regions[0].setValues(regionhits_countonly);
}
