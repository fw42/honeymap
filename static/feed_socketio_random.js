var socket = io.connect('/');

socket.on('marker', function(data) {
  var lat = data.latitude, lng = data.longitude;
  var color = data.color;
  if(get_regionname_ll(lat,lng) != null) {
    add_log("New event in " + get_regionname_ll(lat,lng) + " (" + lat.toFixed(2) + ", " + lng.toFixed(2) + ") " + data.msg);
  } else {
  	add_log("New event (" + lat.toFixed(2) + ", " + lng.toFixed(2) + ") " + data.msg);
  }
  add_marker_ll(lat, lng, color);
  update_regioncolors();
});
