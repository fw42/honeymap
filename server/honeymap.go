package main

import (
	"encoding/json"
	"github.com/fw42/go-hpfeeds"
	"github.com/fzzy/sockjs-go/sockjs"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
)

const staticDirRel = "../client"
const bind = "0.0.0.0:3000"

type Config struct {
	Host  string
	Port  int
	Ident string
	Auth  string
}

func readConfig() Config {
	wd, err := os.Getwd()
	checkFatalError(err)
	blob, err := ioutil.ReadFile(wd + "/" + "config.json")
	checkFatalError(err)

	var conf Config
	err = json.Unmarshal(blob, &conf)
	checkFatalError(err)

	return conf
}

func staticDirAbs() string {
	dir, err := os.Getwd()
	checkFatalError(err)
	return dir + "/" + staticDirRel + "/"
}

func checkFatalError(err error) {
	if err != nil {
		log.Printf("%s\n", err)
		os.Exit(-1)
	}
}

var sockjsClients *sockjs.SessionPool = sockjs.NewSessionPool()

func dataHandler(s sockjs.Session) {
	sockjsClients.Add(s)
	defer sockjsClients.Remove(s)
	for {
		m := s.Receive()
		if m == nil {
			break
		}
	}
}

func broadcast(input chan hpfeeds.Message) {
	for msg := range input {
		sockjsClients.Broadcast(msg.Payload)
	}
}

func hpfeedsConnect(config Config, geolocEvents chan hpfeeds.Message) {
	backoff := 0
	hp := hpfeeds.NewHpfeeds(config.Host, config.Port, config.Ident, config.Auth)
	hp.Log = true
	log.Printf("Connecting to %s:%d...\n", config.Host, config.Port)
	for {
		err := hp.Connect()
		if err == nil {
			log.Printf("Connected to Hpfeeds server.")
			hp.Subscribe("geoloc.events", geolocEvents)
			<-hp.Disconnected
			log.Printf("Lost connection to %s:%d :-(\n", config.Host, config.Port)
		}
		log.Printf("Reconnecting to %s:%d\n", config.Host, config.Port)
		time.Sleep(time.Duration(backoff) * time.Second)
		if backoff <= 10 {
			backoff++
		}
	}
}

func main() {
	config := readConfig()

	http.Handle("/", http.FileServer(http.Dir(staticDirAbs())))
	sockjsMux := sockjs.NewServeMux(http.DefaultServeMux)
	sockjsConf := sockjs.NewConfig()
	sockjsMux.Handle("/data", dataHandler, sockjsConf)

	geolocEvents := make(chan hpfeeds.Message)
	go hpfeedsConnect(config, geolocEvents)
	go broadcast(geolocEvents)

	log.Printf("Binding Honeymap webserver to %s...", bind)
	err := http.ListenAndServe(bind, sockjsMux)
	checkFatalError(err)
}
