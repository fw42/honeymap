package main

import (
	"fmt"
	"github.com/fzzy/sockjs-go/sockjs"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"
)

const staticDirRel = "../../client"
const bind = "0.0.0.0:3000"

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

func broadcast(input chan string) {
	for msg := range input {
		sockjsClients.Broadcast([]byte(msg))
	}
}

func generateRandomData(random chan string) {
	for {
		lat := rand.Float32()*180 - 90
		lng := rand.Float32()*360 - 180
		random <- fmt.Sprintf("{ \"latitude\": %f, \"longitude\": %f }", lat, lng)
		time.Sleep(100 * time.Millisecond)
	}
}

func main() {
	http.Handle("/", http.FileServer(http.Dir(staticDirAbs())))
	sockjsMux := sockjs.NewServeMux(http.DefaultServeMux)
	sockjsConf := sockjs.NewConfig()
	sockjsMux.Handle("/data", dataHandler, sockjsConf)

	random := make(chan string)
	go broadcast(random)
	go generateRandomData(random)

	log.Printf("Binding Honeymap webserver to %s...", bind)
	err := http.ListenAndServe(bind, sockjsMux)
	checkFatalError(err)
}
