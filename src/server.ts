import type * as Party from "partykit/server";
import { WebSocket, WebSocketServer } from 'ws'

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    // conn.send("hello from server");
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
	
    // serialize the thing into a json obj with the users id
    let serverMsg = {
	id: sender.id,
	btnA: false,
	btnB: false,
	joy: { x: 0, y: 0 }
    };

    // determine the data being sent
    if (message == "A") { 
	// button press A
	serverMsg.btnA = true;
    } else if (message == "B") {
	// button press B
	serverMsg.btnB = true;
    } else {
	// parse coordinates
	let coords = message.split(" ").map(parseFloat);
	serverMsg.joy.x = coords[0];
	serverMsg.joy.y = coords[1];
    }

    // broadcast it so that the server can access it
    // this is jank
    this.room.broadcast(JSON.stringify(serverMsg));
  }
}

Server satisfies Party.Worker;
