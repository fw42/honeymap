function set_map_size() {
	$('#world-map').width(0.95 * $(document).width());
	$('#world-map').height(0.8 * $(document).height());
}

function set_log_size() {
	$('#log').width(0.5 * $(document).width());
	$('#log').css("margin-top", 0.025 * $(document).height());
	$('#log').height(0.15 * $(document).height());
}

function marker_animation(x, y) {
  $(".marker_animation").each(function(i) {
    if($(this).css("opacity") == 0) {
      $(this).remove();
    }
  });
  $("#world-map").append($('<div class="marker_animation"></div>').css('left', x + 'px').css('top', y + 'px'));
}

function marker_animation_ll(lat, lng) {
  var xy = $('#world-map').vectorMap('get', 'mapObject').latLngToPoint(lat, lng);
  marker_animation(xy.x, xy.y);
}

function get_regionname(x, y) {
  var efp = $(document.elementFromPoint(x + $("#world-map").offset().left, y + $("#world-map").offset().top));
  return efp.is('path') ? $("#world-map").vectorMap("get", "mapObject").getRegionName(efp.attr('data-code')) : null;
}

function get_regionname_ll(lat, lng) {
  var xy = $('#world-map').vectorMap('get', 'mapObject').latLngToPoint(lat, lng);
  return get_regionname(xy.x, xy.y);
}

function add_log(msg) {
  $('#log').append(msg);
  $("#log").scrollTop($("#log")[0].scrollHeight);
}

$(window).resize(function(){
  set_map_size();
  set_log_size();
});

set_map_size();
set_log_size();

$('#world-map').vectorMap({
  backgroundColor: '#021320',
});
