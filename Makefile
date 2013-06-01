all:	hpfeeds_client server

hpfeeds_client: client/coffee/* client/coffee/feeds/hpfeeds.coffee
	coffee -cj client/js/honeymap.js client/coffee/*.coffee client/coffee/feeds/hpfeeds.coffee

basic_client: client/coffee/* client/coffee/feeds/basic.coffee
	coffee -cj client/js/honeymap.js client/coffee/*.coffee client/coffee/feeds/basic.coffee

server: server/honeymap.go
	cd server; go build

clean:
	rm client/js/honeymap.js
	rm server/js/honeymap.js
