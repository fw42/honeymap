var regionhits = {};
var markers_visible_max = 50;
var markers_total = 0;

function marker_animation(x, y) {
  $(".marker_animation").each(function(i) {
    if($(this).css("opacity") == 0) {
      $(this).remove();
    }
  });
  $("#world-map").append($('<div class="marker_animation red"></div>').css('left', x + 'px').css('top', y + 'px'));
}

function marker_animation_ll(lat, lng) {
  var xy = mapobj.latLngToPoint(lat, lng);
  marker_animation(xy.x, xy.y);
}

function get_regioncode(x, y) {
  // HACKHACKHACK
  var efp = $(document.elementFromPoint(x + $("#world-map").offset().left, y + $("#world-map").offset().top));
  return efp.is('path') ? efp.attr('data-code') : null;
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

function add_marker_ll(lat, lng) {
  var region = get_regioncode_ll(lat, lng);
  if(region) {
    regionhits[region] = regionhits[region] ? regionhits[region] + 1 : 1;
  }
  if(markers_total >= markers_visible_max) {
    mapobj.removeMarkers( [
      $($("#world-map svg g circle.jvectormap-marker")[0]).attr('data-index')
    ]);
  }
  marker_animation_ll(lat, lng);
  mapobj.addMarker(lat+","+lng, { latLng: [ lat, lng ], name: "("+lat+", "+lng+")" }, [])
  markers_total++;
}

function update_regioncolors() {
  // Force recomputation of min and max for correct color scaling
  mapobj.series.regions[0].params.min = null;
  mapobj.series.regions[0].params.max = null;
  // Update data
  mapobj.series.regions[0].setValues(regionhits);
}
