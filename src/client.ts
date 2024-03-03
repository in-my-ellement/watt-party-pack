import "./styles.css";

import VirtualJoystick from "./joystick.js";
import PartySocket from "partysocket";

declare const PARTYKIT_HOST: string;

let pingInterval: ReturnType<typeof setInterval>;

// Let's append all the messages we get into this DOM element
const output = document.getElementById("app") as HTMLDivElement;

// Helper function to add a new line to the DOM
function add(text: string) {
  output.appendChild(document.createTextNode(text));
  output.appendChild(document.createElement("br"));
}

// A PartySocket is like a WebSocket, except it's a bit more magical.
// It handles reconnection logic, buffering messages while it's offline, and more.
const conn = new PartySocket({
  host: PARTYKIT_HOST,
  room: "my-new-room",
});

// listen for button presses
document.getElementById("A").addEventListener("click", () => conn.send("A"));
document.getElementById("B").addEventListener("click", () => conn.send("B"));

// instnatiate joystick
const joystick = new VirtualJoystick(
	document.getElementById("joystickDiv"), 
	{
		width: 150,
		height: 150,
		color: 'gray',
		handleColor: 'black',
		onChange: function(d) {
			conn.send(`${d.x} ${d.y}`)
		}

});

// Let's listen for when the connection opens
// And send a ping every 2 seconds right after
conn.addEventListener("open", () => {
  add("Connected!");

  // initialize a game
  document.getElementById("username").innerHtml = `Name: aaa`;

  // continually send input to the server
});
