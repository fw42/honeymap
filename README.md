HoneyMap
========

HoneyMap is a web application which visualizes a live stream of
GPS locations on a SVG world map. In principle, it can be used
with any stream of GPS data. For our application, we use honeypot
captures, provided by several [hpfeeds](https://github.com/rep/hpfeeds)
from the [Honeynet Project](http://www.honeynet.org/). For more information
on our instance of HoneyMap, see
[HoneyMap - Visualizing Worldwide Attacks in Real-Time](http://www.honeynet.org/node/960).

It is written in [CoffeeScript](http://coffeescript.org/) and makes use of
[jQuery](http://jquery.com/), [node.js](http://nodejs.org/),
[socket.io](http://socket.io/) (HTML5 websockets), [jVectorMap](http://jvectormap.com/)
and [jQuery Transit](http://ricostacruz.com/jquery.transit/) (CSS3 animations).

Tested with node.js v0.10.7 and socket.io v0.9.14.

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

Setup
-----
* Install node.js (tested with [0.10.7](http://nodejs.org/dist/v0.10.7/node-v0.10.7.tar.gz))
* Go to ```server/```
* ```npm install node-static@0.6.9```
* ```npm install socket.io@0.9.14```
* ```npm install validator@1.1.1```
* Copy ```server_hpfeeds_config.js.example``` to ```server_hpfeeds_config.js``` and fill in
  your [hpfriends](http://hpfriends.honeycloud.net) credentials.
* ```node server_hpfeeds```
