/**
 * Testing stuff, create some markers at random and when clicking
 **/

// Create markers at random
function random_point() {
  var lat, lng;
  do {
    lat = Math.random() * 180 - 90;
    lng = Math.random() * 360 - 180;
  } while(get_regionname_ll(lat,lng) == null);

  marker_animation_ll(lat, lng);
  add_log("New event in " + get_regionname_ll(lat,lng) + " (" + lat.toFixed(2) + ", " + lng.toFixed(2) + ")<br/>");
  $("#world-map").vectorMap("get", "mapObject").addMarker(lat+","+lng, { latLng: [ lat, lng ], name: "("+lat+","+lng+")" }, [])
}
function timer() {
  window.setTimeout(random_point, Math.random() * 1000);
}
window.setInterval(timer, 500);

// Create marker animations when clicking
$("#world-map").click(function(ev) {
  var x = ev.pageX, y = ev.pageY;
  x -= $("#world-map").offset().left;
  y -= $("#world-map").offset().top;
  if(get_regionname(x, y) != null) {
    marker_animation(x,y);
    add_log("New event in " + get_regionname(x, y) + " (" + x + ", " + y + ")<br/>");
  }
});
