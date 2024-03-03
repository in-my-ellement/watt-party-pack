import type * as Party from "partykit/server";
import { WebSocket, WebSocketServer } from 'ws'

export default class Server implements Party.Server {
  public nextId: int = 0;
  constructor(readonly room: Party.Room) {
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    this.nextId++;
    conn.send(this.nextId);
    //
  }

  async onRequest(req: Party.Request) {
	console.log("cringulum");
	let res: Response = new Response(null, {
		status: 200,
		headers: {
			"ngrok-skip-browser-warning": "aaa",
			"Content-Security-Policy": "frame-ancestors *;"
		}
	});
	return res;
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message.split(" ")}`);
    let contents = message.split(" ");

    // serialize the thing into a json obj with the users id
    let serverMsg = {
	id: sender.id,
	num: contents[0],
	btnA: false,
	btnB: false,
	joy: { x: 0, y: 0 }
    };
    
    // determine the data being sent
    if (contents[1] == "A") { 
	// button press A
	serverMsg.btnA = true;
    } else if (contents[1] == "B") {
	// button press B
	serverMsg.btnB = true;
    } else {
	// parse coordinate
	serverMsg.joy.x = parseFloat(contents[1]);
	serverMsg.joy.y = parseFloat(contents[2]);
    }

    if (serverMsg.joy.x == null || serverMsg.joy.y == null) {
	return;
    }

    // broadcast it so that the server can access it
    // this is jank
    this.room.broadcast(JSON.stringify(serverMsg));
  }
}

Server satisfies Party.Worker;
