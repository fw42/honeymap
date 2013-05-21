all:	hpfeeds

hpfeeds: hpfeeds_client hpfeeds_server

random: random_client random_server

hpfeeds_client: client/coffee/* client/coffee/feeds/hpfeeds.coffee
	coffee -cj client/js/honeymap.js client/coffee/*.coffee client/coffee/feeds/hpfeeds.coffee

hpfeeds_server: server/coffee/* server/coffee/honeymap/hpfeeds.coffee
	coffee -cj server/js/honeymap.js server/coffee/config.coffee server/coffee/http.coffee server/coffee/socketio.coffee server/coffee/honeymap/hpfeeds.coffee server/coffee/main.coffee

random_client: client/coffee/* client/coffee/feeds/random_remote.coffee
	coffee -cj client/js/honeymap.js client/coffee/*.coffee client/coffee/feeds/random_remote.coffee

random_server: server/coffee/* server/coffee/honeymap/random.coffee
	coffee -cj server/js/honeymap.js server/coffee/config.coffee server/coffee/http.coffee server/coffee/socketio.coffee server/coffee/honeymap/random.coffee server/coffee/main.coffee

clean:
	rm client/js/honeymap.js
	rm server/js/honeymap.js
