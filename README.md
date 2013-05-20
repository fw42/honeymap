HoneyMap
========

HoneyMap is a web application which visualizes a live stream of
GPS locations on a SVG world map. In principle, it can be used
with any stream of GPS data. For our application, we use honeypot
captures, provided by several [hpfeeds](https://github.com/rep/hpfeeds)
from the [Honeynet Project](http://www.honeynet.org/).

It is written in [CoffeeScript](http://coffeescript.org/) and makes use of
[jQuery](http://jquery.com/), [node.js](http://nodejs.org/),
[socket.io](http://socket.io/) (HTML5 websockets), [jVectorMap](http://jvectormap.com/)
and [jQuery Transit](http://ricostacruz.com/jquery.transit/) (CSS3 animations).

Tested with node.js v0.8.9 and socket.io v0.9.10.

Example
-------
![http://map.honeycloud.net/](https://raw.github.com/fw42/honeymap/doc/honeymap.png)

* [http://map.honeycloud.net/](http://map.honeycloud.net/)

License
-------
This software is distributed under the terms of the
[GNU Lesser General Public License (LGPL)](http://github.com/fw42/honeymap/blob/master/LICENSE),
with the following exception/change: If you want to use parts of this software
in a commercial environment or product, you are required to publicly attribute credit to this
project by including it's name and a link to [this website](https://github.com/fw42/honeymap/).

Authors
-------
* [Florian Weingarten](mailto:flo@hackvalue.de) ([fw42](https://github.com/fw42/))
* [Mark Schloesser](mailto:mark.schloesser@rwth-aachen.de) ([rep](https://github.com/rep/))
* [Johannes Gilger](mailto:heipei@heipei.net) ([heipei](https://github.com/heipei/))

Forks
-----
* [German Telecom (DTAG) Sicherheitstacho](http://www.sicherheitstacho.eu/)
