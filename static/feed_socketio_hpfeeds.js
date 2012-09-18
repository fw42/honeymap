var socket = io.connect('/');

function set_marker_caption(id, lat, lng, countrycode, city) {
  markercaptions[id] = "<small>(" + lat + ", " + lng + ")</small><br/>";
  if(city) {
    markercaptions[id] += "<big>" + city + "</big> (" + countrycode + ")";
  }
}

socket.on('marker', function(data) {
  var lat1 = data.latitude,  lng1 = data.longitude,
      lat2 = data.latitude2, lng2 = data.longitude2;

  if(lat1 == null || lng1 == null) {
    return;
  }

  var p1 = mapobj.latLngToPoint(lat1,lng1);
  if(p1.x == 0 && p1.y == 0) { return; }

  var region1 = get_regionname_ll(lat1, lng1);
  var region2 = get_regionname_ll(lat2, lng2);

  if(region1 == null && data.countrycode != null && mapobj.regions[data.countrycode] != null) {
    region1 = mapobj.regions[data.countrycode].config.name;
  }

  if(region2 == null && data.countrycode2 != null && mapobj.regions[data.countrycode2] != null) {
    region2 = mapobj.regions[data.countrycode2].config.name;
  }

  if(region1 != null) {
    var logstr;

    if(data.type == null) { data.type = "other"; }

    logstr  = '<div class="log_timestamp">';
    logstr += new Date().toTimeString().substring(0,8);
    logstr += "</div>";
    logstr += ' <div class="log_bracket">&lt;</div>' + data.type + '<div class="log_bracket">&gt;</div> ';
    logstr += 'New ' + (data.type == "thug.events" ? "scan" : "attack") + ' from ' + 
      '<div class="log_country">' + (data.city ? (data.city + ", ") : "") + region1 + '</div>' + 
      ' <small>(' + lat1.toFixed(2) + "," + lng1.toFixed(2) + ")</small>";

    if(region2 != null) {
      logstr += ' to <div class="log_country">' + (data.city2 ? (data.city2 + ", ") : "") + region2 + "</div>" +
        " <small>(" + lat2.toFixed(2) + "," + lng2.toFixed(2) + ")</small>";
    }

    if(data.md5) {
      logstr += ' <div class="log_bracket2">[</div><div class="log_info">md5: <a href="http://www.virustotal.com/search/?query=' + data.md5 + '">' + data.md5 + '</a><div class="log_bracket2">]</div></div>';
    }
    add_log(logstr + "<br/>");
  }

  add_marker_ll(lat1, lng1, 'src', data.type);
  set_marker_caption(lat1+","+lng1, lat1, lng1, data.countrycode, data.city);
  update_regioncolors();

  if(lat2 == null || lng2 == null) { return; }
  var p2 = mapobj.latLngToPoint(lat2,lng2);
  if(p2.x == 0 || p2.y == 0) { return; }
  add_marker_ll(lat2, lng2, 'dst', data.type, data.countrycode2);
  set_marker_caption(lat2+","+lng2, lat2, lng2, data.countrycode2, data.city2);

});
