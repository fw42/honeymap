var socket = io.connect('/');

socket.on('marker', function(data) {
  var lat = data.lat, lng = data.lng;
  if(get_regionname_ll(lat,lng) != null) {
    add_log("New event in " + get_regionname_ll(lat,lng) + " (" + lat.toFixed(2) + ", " + lng.toFixed(2) + ")<br/>");
  }
  add_marker_ll(lat, lng);
  update_regioncolors();
});
