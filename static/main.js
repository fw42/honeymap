var regionhits = {};
var markerhits = {};
var markers_visible_max = 100;
var markers_total = 0;

function remove_finished_animations() {
  $(".marker_animation").each(function(i) {
    if($(this).css("opacity") == 0) {
      $(this).remove();
    }
  });
}

function marker_animation(x, y, css) {
  remove_finished_animations();
  $("#world-map").append(
    $('<div class="marker_animation ' + css + '"></div>')
    .css('left', x + 'px')
    .css('top', y + 'px')
    .css({ opacity: 1, scale: 0 })
    .transition({ opacity: 0, scale: 1 }, 1000)
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
    console.log(par);
    par.remove(); // Remove parent node too (jVectorMap does not do this by itself)
}

function add_marker_ll(lat, lng, type) {
  if(type == null) {
    type == 'src';
  } else if(type == 'src') {
    // only count src markers which are within a valid region
    var region = get_regioncode_ll(lat, lng);
    if(region) {
      regionhits[region] = regionhits[region] ? regionhits[region] + 1 : 1;
    }
  }
  var markerkey = lat+","+lng;
  markerhits[markerkey] = markerhits[markerkey] ? (markerhits[markerkey] + 1) : 1;
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
  mapobj.series.regions[0].setValues(regionhits);
}

/*
function draw_line(x1, y1, x2, y2) {
  svg.append('<g><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke-width="2" /></g>');
}

function draw_line_ll(lat1, lng1, lat2, lng2) {
  var p1 = mapobj.latLngToPoint(lat1, lng1);
  var p2 = mapobj.latLngToPoint(lat2, lng2);
  draw_line(p1.x, p1.y, p2.x, p2.y);
}
*/
