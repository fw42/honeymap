all:	hpfeeds

hpfeeds: hpfeeds_client hpfeeds_server

random: basic_client random_server

udp: basic_client udp_server

hpfeeds_client: client/coffee/* client/coffee/feeds/hpfeeds.coffee
	coffee -cj client/js/honeymap.js client/coffee/*.coffee client/coffee/feeds/hpfeeds.coffee

hpfeeds_server: server/coffee/* server/coffee/honeymap/hpfeeds.coffee
	coffee -cj server/js/honeymap.js server/coffee/config.coffee server/coffee/http.coffee server/coffee/socketio.coffee server/coffee/honeymap/hpfeeds.coffee server/coffee/main.coffee

basic_client: client/coffee/* client/coffee/feeds/basic.coffee
	coffee -cj client/js/honeymap.js client/coffee/*.coffee client/coffee/feeds/basic.coffee

random_server: server/coffee/* server/coffee/honeymap/random.coffee
	coffee -cj server/js/honeymap.js server/coffee/config.coffee server/coffee/http.coffee server/coffee/socketio.coffee server/coffee/honeymap/random.coffee server/coffee/main.coffee

udp_server: server/coffee/* server/coffee/honeymap/udp.coffee
	coffee -cj server/js/honeymap.js server/coffee/config.coffee server/coffee/http.coffee server/coffee/socketio.coffee server/coffee/honeymap/udp.coffee server/coffee/main.coffee

clean:
	rm client/js/honeymap.js
	rm server/js/honeymap.js
