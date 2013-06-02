all:	hpfeeds

hpfeeds: hpfeeds_client hpfeeds_server

random: basic_client random_server

hpfeeds_client: client/coffee/* client/coffee/feeds/hpfeeds.coffee
	coffee -cj client/js/honeymap.js client/coffee/*.coffee client/coffee/feeds/hpfeeds.coffee

hpfeeds_server: server/honeymap.go
	cd server; go build

basic_client: client/coffee/* client/coffee/feeds/basic.coffee
	coffee -cj client/js/honeymap.js client/coffee/*.coffee client/coffee/feeds/basic.coffee

random_server: server/example/example.go
	cd server/example; go build

clean:
	rm client/js/honeymap.js
	rm server/js/honeymap.js
