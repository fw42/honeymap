HoneyMap
========

HoneyMap is a web application which visualizes a live stream of
GPS locations on a SVG world map. In principle, it can be used
with any stream of GPS data. For our application, we use honeypot
captures, provided by several [hpfeeds](https://github.com/rep/hpfeeds)
from the [Honeynet Project](http://www.honeynet.org/). For more information
on our instance of HoneyMap, see
[HoneyMap - Visualizing Worldwide Attacks in Real-Time](http://www.honeynet.org/node/960).

Front-end code is written in [CoffeeScript](http://coffeescript.org/) and makes use of
[SockJS](http://sockjs.org/) (HTML5 websockets), [jQuery](http://jquery.com/),
[jVectorMap](http://jvectormap.com/) and
[jQuery Transit](http://ricostacruz.com/jquery.transit/) (CSS3 animations).

Back-end code is written in [Go](http://golang.org/) and makes use of
[sockjs-go](https://github.com/fzzy/sockjs-go/) and
[go-hpfeeds](https://github.com/fw42/go-hpfeeds/).

An alternative back-end is available using [node.js](http://nodejs.org/)
instead of Go. Have a look in the `server/old` source directory.

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
* [Computer Incident Response Center Luxembourg](http://map.circl.lu/)

Installation
------------
* apt-get install git golang mercurial make
* git clone https://github.com/fw42/honeymap
* In honeymap/server/
  * go get
  * go build
  * cp config.json.example config.json
  * edit config.json
* In honeymap/
  * On Ubuntu: apt-get install coffeescript
  * On Debian: Install node.js, then npm install coffeescript
  * make
* Run server/server
* Go to http://your-server:3000/
* Optionally, use nginx as reverse proxy
