function set_map_size() {
	$('#world-map').width(0.95 * $(document).width());
	$('#world-map').height(0.8 * $(document).height());
}

function set_log_size() {
	$('#log').width(0.5 * $(document).width());
	$('#log').css("margin-top", 0.025 * $(document).height());
	$('#log').height(0.15 * $(document).height());
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
		$('#log').append($('#world-map').vectorMap('get', 'mapObject').getRegionName(c) + "<br/>");
		$("#log").scrollTop($("#log")[0].scrollHeight);
        }
});

/*
var x;
x = $('#world-map').vectorMap('get', 'mapObject').latLngToPoint(41.90, 12.45);
$('#log').append(x.x + ", " + x.y);
*/
