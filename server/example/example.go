package main

import (
	"fmt"
	"github.com/fzzy/sockjs-go/sockjs"
	"log"
	"math/rand"
	"net/http"
	"time"
)

const bind = "0.0.0.0:3000"

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

func main() {
	http.Handle("/", http.FileServer(http.Dir("../../client/")))
	sockjsMux := sockjs.NewServeMux(http.DefaultServeMux)
	sockjsConf := sockjs.NewConfig()
	sockjsMux.Handle("/data", dataHandler, sockjsConf)

	go func() {
		for {
			lat := rand.Float32()*180 - 90
			lng := rand.Float32()*360 - 180
			sockjsClients.Broadcast([]byte(fmt.Sprintf("{ \"latitude\": %f, \"longitude\": %f }", lat, lng)))
			time.Sleep(100 * time.Millisecond)
		}
	}()

	log.Printf("Binding Honeymap webserver to %s...", bind)
	http.ListenAndServe(bind, sockjsMux)
}
