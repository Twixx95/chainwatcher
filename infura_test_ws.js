var Web3 = require('web3');
var Five = require("johnny-five");
var OledJs = require('oled-js');
var Font = require('oled-font-5x7');

//connect to blockchain client
//var web3ws = new Web3JS(new Web3JS.providers.WebsocketProvider('ws://141.55.229.170:855(5-7)'));


//based on websocket by infura 
var web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));
//load board ressources
//Initialize the board ressources
var board = new Five.Board();
var oled;


board.on("ready", function() {

	//oled parameters
	const opts = {width: 128, height: 64, adress: 0x3C};

	//initialize display
	oled = new OledJs(board, Five, opts);

	oled.clearDisplay(true);
	oled.update();
	oled.clearDisplay();
	//wait for blockheader
	listenToBlockchain();
})

//listen for blockchain events (only works on web socket connections)
function listenToBlockchain() {

	//event listener
	web3ws.eth.subscribe('newBlockHeaders')
	.on("data", function(blockHeader){

		console.log("Block: "+blockHeader.number);
		output(blockHeader);
	})
	.on("error", function(e){
		console.log("FEHLER: "+e);
	})

	//output function
	function output(block) {
		oled.setCursor(1,1);
		oled.writeString(Font,1,'0000'+block.number,1,false,2);
		oled.setCursor(1,15);
		oled.writeString(Font,1,'0000'+block.hash,1,true,2);
	}
}