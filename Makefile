all:	static

static: static/js/honeymap.js

static/js/honeymap.js: static/coffee/*
	coffee -cj static/js/honeymap.js static/coffee

clean:
	rm static/js/honeymap.js
