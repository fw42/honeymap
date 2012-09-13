function set_map_size() {
	$('#world-map').width(0.95 * $(document).width());
	$('#world-map').height(0.8 * $(document).height());
}

function set_log_size() {
	$('#log').width(0.5 * $(document).width());
	$('#log').css("margin-top", 0.025 * $(document).height());
	$('#log').height(0.15 * $(document).height());
}

function add_marker(x, y) {

  // Remove existing markers, which are not visible any more
  $(".marker").each(function(i) {
    if($(this).css("opacity") == 0) {
      $(this).remove();
    }
  });

  // Add new marker
  $("body").append($('<div class="marker"></div>').css('left', x + 'px').css('top', y + 'px'));

}

function add_marker_ll(lat, lng) {
  var xy;
  xy = $('#world-map').vectorMap('get', 'mapObject').latLngToPoint(lat, lng);
  add_marker(xy.x, xy.y);
  add_log("DEBUG: " + xy.x + ", " + xy.y + "<br/>");
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
  onRegionClick: function(e, c) {
    add_log($('#world-map').vectorMap('get', 'mapObject').getRegionName(c) + "<br/>");   
  }
});
