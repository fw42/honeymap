var socket = io.connect('/');

socket.on('marker', function(data) {
  var lat1 = data.latitude,  lng1 = data.longitude,
      lat2 = data.latitude2, lng2 = data.longitude2;

  var p1 = mapobj.latLngToPoint(lat1,lng1);
  var p2 = mapobj.latLngToPoint(lat2,lng2);

  if(lat1 == null || lng1 == null) {
    return;
  }

  if(get_regionname_ll(lat1, lng1) != null) {
    var logstr;

    if(data.type == null) { data.type = "other"; }

    logstr  = '<div class="log_timestamp">';
    logstr += new Date().toTimeString().substring(0,8);
    logstr += "</div>";
    logstr += ' <div class="log_bracket">&lt;</div>' + data.type + '<div class="log_bracket">&gt;</div> ';
    logstr += "New attack in " + get_regionname_ll(lat1, lng1) +
      " <small>(" + lat1.toFixed(2) + ", " + lng1.toFixed(2) + ")</small>";

    if(data.md5) {
      logstr += ' [md5: <a href="http://www.virustotal.com/search/?query=' + data.md5 + '">' + data.md5 + '</a>]';
    }
    add_log(logstr + "<br/>");
  }

  if(p1.x == 0 && p1.y == 0) { return; }
  add_marker_ll(lat1, lng1, 'src', data.type);
  update_regioncolors();

  if(lat2 == null || lng2 == null) { return; }
  if(p2.x == 0 || p2.y == 0) { return; }
  add_marker_ll(lat2, lng2, 'dst');
});
