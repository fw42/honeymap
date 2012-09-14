/** Testing stuff, create some markers at random  **/

function random_point() {
  var lat, lng;
  do {
    lat = Math.random() * 180 - 90;
    lng = Math.random() * 360 - 180;
  } while(get_regionname_ll(lat,lng) == null);

  add_log("New event in " + get_regionname_ll(lat,lng) + " (" + lat.toFixed(2) + ", " + lng.toFixed(2) + ")<br/>");
  add_marker_ll(lat, lng);
  update_regioncolors();
}

function timer() {
  window.setTimeout(random_point, Math.random() * 1000);
}

window.setInterval(timer, 500);
