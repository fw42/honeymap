/** config **/
var markers_visible_max = 150;
var markersrc_color = { fill: 'red', stroke: 'darkred' };
var markerdst_color = { fill: '#F8E23B', stroke: '#383F47' };

var regionhits = {};
var regionhits_countonly = {};
var markerhits = {};
var markercaptions = {};
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
  // remove old log entries from time to time
  entries = $("#log div.log_entry");
  if(entries.length > markers_visible_max) {
    // dont remove them all, only a few, so we dont see them disappear
    entries.slice(0, markers_visible_max/2).remove();
    // remove abandoned line breaks
    $('#log br').nextUntil('div.log_entry', 'br').remove();
  }
  // only automatically scroll down if the user did not manually scroll up before :-)
  var scroll = $('#log').scrollTop() + $('#log').innerHeight() == $('#log')[0].scrollHeight;
  $('#log').append('<div class="log_entry">' + msg + '</div><br/>');
  if(scroll) {
    $("#log").scrollTop($("#log")[0].scrollHeight);
  }
}

function remove_oldest_marker() {
  // only remove src markers
  toremove = $($("#world-map svg g circle.jvectormap-marker[fill=" + markersrc_color.fill + "]")[0]);
  par = toremove.parent();
  mapobj.removeMarkers( [ toremove.attr('data-index') ]);
  par.remove(); // Remove parent node too (jVectorMap does not do this by itself)
}

function add_marker_ll(lat, lng, type, eventname, region) {
  if(eventname == null) { eventname = "other"; }
  if(type == null) { type = 'src'; }
  if(type == 'src') {
    // only count src markers which are within a valid region
    if(region == null) { region = get_regioncode_ll(lat, lng); }
    if(region != null) {
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
       style: markerdst_color
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
