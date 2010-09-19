var nodes;
var kPixelWidth = 500;
var kPixelHeight= 500;

var gCanvasElement = 0;
var gDrawingContext;
var selection ;
var colors = [ '#4682b4', '#006400', '#ffff00', '#9400d3', '#8b8682', '#ff0000', '#0000ff', '#ff69b4', '#ffa500', '#e6e6fa' ]
function postwith(to,p) {
  var myForm = document.createElement("form");
  myForm.method="post" ;
  myForm.action = to ;
  for (var k in p) {
    var myInput = document.createElement("input") ;
    myInput.setAttribute("name", k) ;
    myInput.setAttribute("value", p[k]);
    myForm.appendChild(myInput);
  }
  document.body.appendChild(myForm) ;
  myForm.submit() ;
  document.body.removeChild(myForm) ;

}
function Coord(x, y) {
    this.x = x;
    this.y = y;
}

function getCursorPosition(e) {
    /* returns Cell with .row and .column properties */
    var x;
    var y;
    if (e.pageX || e.pageY) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    var coord = new Coord(x, y);
    return coord;
}

function select(cord) {
	var xcord = cord[0];
	var ycord = cord[1];
	var rad;
	for(var i = 0; i < nodes.length; i++) {
		rad = Math.sqrt( Math.pow((nodes[i].x - xcord),2) + Math.pow((nodes[i].y - ycord),2) );
		if(rad < 10)
			return nodes[i].id;
	}
	return -1;
}


function nodeOnClick(e) {
	
    var ord = getCursorPosition(e);
	var a = [ord.x, ord.y];
	var check = select(a);
	if(check >= 0) {
		if (selection[0] >= 0) {
			a = nodes[selection[0]];
			b = nodes[check];
			if (a.id == b.id) {
				selection[0] = a.id;
				return;
			} else {
				selection[0] = -1;
				if(a.id < b.id)
					postwith("/", ["select", a.id, b.id] );
				else
					postwith("/", ["select", b.id, a.id] );
			}
		} else {
			selection[0] = nodes[check].id;
			return;
		}
	} else
		postwith("/", ["create", ord.x, ord.y]);
}

function draw(nodes) {
	var radius = 10;
    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);
	for(var i=0; i < nodes.length; i++) {
		var x = nodes[i].x;
		var y = nodes[i].y;
		var adj = nodes[i].adj;
		var color = colors[nodes[i].color];
		
		gDrawingContext.beginPath();

		for(var j = 0; j < adj.length; j++) {
			gDrawingContext.moveTo(x, y);
			gDrawingContext.lineTo(nodes[adj[j]].x,nodes[adj[j]].y);
    	}
		gDrawingContext.closePath();
		gDrawingContext.strokeStyle = "#eee";
	    gDrawingContext.stroke();

		gDrawingContext.beginPath();
		gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
		gDrawingContext.closePath();
		gDrawingContext.strokeStyle = "#000";
	    gDrawingContext.stroke();
		gDrawingContext.fillStyle = color;
		gDrawingContext.fill();

	}

}

function init(nodes) {
	this.nodes = nodes;
	this.selection = [-1, 0];

    gCanvasElement = document.getElementById("node");
   	gCanvasElement.width = kPixelWidth;
   	gCanvasElement.height = kPixelHeight;
   	gCanvasElement.addEventListener("click", nodeOnClick, false);
   	gDrawingContext = gCanvasElement.getContext("2d");
	draw(nodes);
}

