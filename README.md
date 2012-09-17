HoneyMap
========

HoneyMap is a web application which displays a live stream of
GPS locations on a SVG world map. It makes use of
[node.js](http://nodejs.org/) and
[socket.io](http://socket.io/) (HTML5 websockets),
[jVectorMap](http://jvectormap.com/) and HTML5/CSS3 animations.

In principle, it can be used with any stream of GPS data. For our application,
we use honeypot captures, provided by several [hpfeeds](https://github.com/rep/hpfeeds)
from the [Honeynet Project](http://www.honeynet.org/).

Tested with node.js v0.8.9 and socket.io v0.9.10.

Example
-------
[http://81.166.122.239/](http://81.166.122.239/)

TODO
----
* Browser compatibility (only webkit atm)
