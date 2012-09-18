YUICOMPRESSOR ?= /path/to/YUICOMPRESSOR

all:	hm.js

hm.js: all.js
	java -jar $(YUICOMPRESSOR) -o static/hm.js all.js
	rm all.js

all.js:
	cat static/extern/jquery-*.js static/main.js static/layout.js static/extern/bootstrap.js static/feed_socketio_hpfeeds.js static/map.js > all.js

clean:
	rm -f static/hm.js

.PHONY: all clean

