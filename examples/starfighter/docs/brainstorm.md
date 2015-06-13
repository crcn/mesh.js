Resources:

- http://gamedevelopment.tutsplus.com/tutorials/building-a-peer-to-peer-multiplayer-networked-game--gamedev-10074
- http://buildnewgames.com/real-time-multiplayer/
- https://developer.valvesoftware.com/wiki/Source_Multiplayer_Networking


TODO:

- fix jitteryness
- bigger server with lower latency
- reduce packet size to server
- batch updates from client <-> server
- reduce FPS on client depending on server/client ping***


Solutions:

- server sets up the framerate for each client
- batch updates into one query - can be added as ticks from the server
- double FPS on server and send changes to clients
