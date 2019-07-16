var canvas = document.getElementById('shapes'),
ctx,
rect = {},
drag = false,
mouseX,
mouseY,
closeEnough = 3,
dragTL = dragBL = dragTR = dragBR = false,
dragBox = false;

var canvasOffset;
var offsetX;
var offsetY;

$(document).on("click", "#submitbox", function(){
    canvas = document.getElementById('shapes');
    ctx = canvas.getContext('2d');
    init();
    drawRect();
});

function init() {
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    $canvas = $("#shapes");
    canvasOffset = $canvas.offset();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
    rect = {
        startX: 50,
        startY: 50,
        w: 90,
        h: 50
    }
}

function mouseDown(e) {
    console.log("mouse down'd");
    // mouseX = e.pageX - this.offsetLeft;
    // mouseY = e.pageY - this.offsetTop;
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY - 100);
    // if there isn't a rect yet
    if (rect.w === undefined) {
        rect.startX = mouseY;
        rect.startY = mouseX;
        dragBR = true;
    }

    // if there is, check which corner
    //   (if any) was clicked
    //
    // 4 cases:
    // 1. top left
    else if (checkCloseEnough(mouseX, rect.startX) && checkCloseEnough(mouseY, rect.startY)) {
        console.log("TL");
        dragTL = true;
    }
    // 2. top right
    else if (checkCloseEnough(mouseX, rect.startX + rect.w) && checkCloseEnough(mouseY, rect.startY)) {
        console.log("TR");
        dragTR = true;

    }
    // 3. bottom left
    else if (checkCloseEnough(mouseX, rect.startX) && checkCloseEnough(mouseY, rect.startY + rect.h)) {
        console.log("BL");
        dragBL = true;

    }
    // 4. bottom right
    else if (checkCloseEnough(mouseX, rect.startX + rect.w) && checkCloseEnough(mouseY, rect.startY + rect.h)) {
        console.log("BR");
        dragBR = true;

    }
    // Check if moving box
    else if (boxHittest(mouseX, mouseY)) {
        dragBox = true;
    }
    console.log(boxHittest(mouseX, mouseY));
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

function checkCloseEnough(p1, p2) {
    // console.log("p1: "+ p1);
    // console.log("p2: " + p2)
return Math.abs(p1 - p2) < 30;
}

function mouseUp() {
    dragTL = dragTR = dragBL = dragBR = dragBox = false;
}

function mouseMove(e) {
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY - 100);
    // console.log(offsetX + " , " + offsetY);
    // console.log("mouse: " + mouseX + ", " + mouseY);
    if (dragTL) {
        rect.w += rect.startX - mouseX;
        rect.h += rect.startY - mouseY;
        rect.startX = mouseX;
        rect.startY = mouseY;
    } else if (dragTR) {
        rect.w = Math.abs(rect.startX - mouseX);
        rect.h += rect.startY - mouseY;
        rect.startY = mouseY;
    } else if (dragBL) {
        rect.w += rect.startX - mouseX;
        rect.h = Math.abs(rect.startY - mouseY);
        rect.startX = mouseX;
    } else if (dragBR) {
        rect.w = Math.abs(rect.startX - mouseX);
        rect.h = Math.abs(rect.startY - mouseY);
    } else if (dragBox) {
        rect.startX += Math.abs(rect.startX - mouseX);
        rect.startY += Math.abs(rect.startY - mouseY);
    }
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRect();
}

function drawRect() {
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 0.5;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(rect.startX, rect.startY, rect.w, rect.h);
	ctx.stroke();
    // ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
    drawHandles();
}

function drawCircle(x, y, radius) {
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawHandles() {
    // console.log("X: " + rect.startX + ", Y: " + rect.startY);
    drawCircle(rect.startX, rect.startY, closeEnough);
    drawCircle(rect.startX + rect.w, rect.startY, closeEnough);
    drawCircle(rect.startX + rect.w, rect.startY + rect.h, closeEnough);
    drawCircle(rect.startX, rect.startY + rect.h, closeEnough);
    ctx.stroke();
}

function boxHittest(x, y) {
    // console.log(x + ", " + y);
    // console.log(rect.startX + ", " + rect.startY);
     console.log("Y: " + rect.startY + ", " + rect.startY - rect.h);

    // console.log(y >= rect.startY + rect.h && y <= rect.h);
    return (x >= rect.startX && x <= rect.startX + rect.w && y >= rect.startY && y <= rect.h + rect.startY);
}

// init();

// $( document ).ready(function() {
//     console.log( "ready!" );
// });

// // canvas related variables
// var canvas;
// var ctx;

// // variables used to get mouse position on the canvas
// var $canvas;
// var canvasOffset;
// var offsetX;
// var offsetY;
// var scrollX;
// var scrollY;

// function refresh () {
//     canvas = document.getElementById("pdf-canvas");
//     ctx = canvas.getContext("2d");
//     $canvas = $("#pdf-canvas");
//     canvasOffset = $canvas.offset();
//     offsetX = canvasOffset.left;
//     offsetY = canvasOffset.top;
//     scrollX = $canvas.scrollLeft();
//     scrollY = $canvas.scrollTop();
// }

// // variables to save last mouse position
// // used to see how far the user dragged the mouse
// // and then move the text by that distance
// var startX;
// var startY;

// // an array to hold text objects
// var texts = [];

// // this var will hold the index of the hit-selected text
// var selectedText = -1;

// // clear the canvas & redraw all texts
// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     for (var i = 0; i < texts.length; i++) {
//         var text = texts[i];
//         ctx.fillText(text.text, text.x, text.y);
//     }
// }

// // test if x,y is inside the bounding box of texts[textIndex]
// function textHittest(x, y, textIndex) {
//     var text = texts[textIndex];
//     return (x >= text.x && x <= text.x + text.width && y >= text.y - text.height && y <= text.y);
// }

// // handle mousedown events
// // iterate through texts[] and see if the user
// // mousedown'ed on one of them
// // If yes, set the selectedText to the index of that text
// function handleMouseDown(e) {
// 		if (selectedText > -1){
//     	e.preventDefault();
//       startX = parseInt(e.clientX - offsetX);
//       startY = parseInt(e.clientY - offsetY);
//        // Put your mousedown stuff here
//        for (var i = 0; i < texts.length; i++) {
//            if (textHittest(startX, startY, i)) {
//                selectedText = i;
//            }
//        }
//     }
// }

// // done dragging
// function handleMouseUp(e) {
//     e.preventDefault();
//     selectedText = -1;
// }

// // also done dragging
// function handleMouseOut(e) {
//     e.preventDefault();
//     selectedText = -1;
// }

// // handle mousemove events
// // calc how far the mouse has been dragged since
// // the last mousemove event and move the selected text
// // by that distance
// function handleMouseMove(e) {
//     if (selectedText < 0) {
//         return;
//     }
//     e.preventDefault();
//     mouseX = parseInt(e.clientX - offsetX);
//     mouseY = parseInt(e.clientY - offsetY);

//     // Put your mousemove stuff here
//     var dx = mouseX - startX;
//     var dy = mouseY - startY;
//     startX = mouseX;
//     startY = mouseY;

//     var text = texts[selectedText];
//     text.x += dx;
//     text.y += dy;
//     draw();
// }

// // listen for mouse events
// $(document).on("mousedown", "#pdf-canvas", function(e){
//     handleMouseDown(e);
// });

// $(document).on("mouseup", "#pdf-canvas", function(e){
//     handleMouseUp(e);
// });

// $(document).on("mousemove", "#pdf-canvas", function(e){
//     handleMouseMove(e);
// });

// $(document).on("mouseout", "#pdf-canvas", function(e){
//     handleMouseOut(e);
// });

// // $("#pdf-canvas").mouseout(function (e) {
// //     handleMouseOut(e);
// // });

// $('#file-to-upload').click(function () {
//     refresh();
// });

// $(document).on("click", "#submittext", function(){
//     refresh();
//     console.log("HI");
//     // calc the y coordinate for this text on the canvas
//     var y = texts.length * 20 + 20;

//     // get the text from the input element
//     var text = {
//         text: $("#theText").val(),
//         x: 20,
//         y: y
//     };

//     // calc the size of this text for hit-testing purposes
//     ctx.font = "16px verdana";
//     text.width = ctx.measureText(text.text).width;
//     text.height = 16;

//     // put this new text in the texts array
//     texts.push(text);

//     // redraw everything
//     draw();

// });



// // var __PDF_DOC,
// // 	__CURRENT_PAGE,
// // 	__TOTAL_PAGES,
// // 	__PAGE_RENDERING_IN_PROGRESS = 0,
// // 	__CANVAS = $('#pdf-canvas').get(0),
// // 	__CANVAS_CTX = __CANVAS.getContext('2d');

// // function showPDF(pdf_url) {
// // 	$("#pdf-loader").show();

// // 	PDFJS.getDocument({ url: pdf_url }).then(function(pdf_doc) {
// // 		__PDF_DOC = pdf_doc;
// // 		__TOTAL_PAGES = __PDF_DOC.numPages;
		
// // 		// Hide the pdf loader and show pdf container in HTML
// // 		$("#pdf-loader").hide();
// // 		$("#pdf-contents").show();
// // 		$("#pdf-total-pages").text(__TOTAL_PAGES);

// // 		// Show the first page
// // 		showPage(1);
// // 	}).catch(function(error) {
// // 		// If error re-show the upload button
// // 		$("#pdf-loader").hide();
// // 		$("#upload-button").show();
		
// // 		alert(error.message);
// // 	});;
// // }

// // function showPage(page_no) {
// // 	__PAGE_RENDERING_IN_PROGRESS = 1;
// // 	__CURRENT_PAGE = page_no;

// // 	// Disable Prev & Next buttons while page is being loaded
// // 	$("#pdf-next, #pdf-prev").attr('disabled', 'disabled');

// // 	// While page is being rendered hide the canvas and show a loading message
// // 	$("#pdf-canvas").hide();
// // 	$("#page-loader").show();
// // 	$("#download-image").hide();

// // 	// Update current page in HTML
// // 	$("#pdf-current-page").text(page_no);
	
// // 	// Fetch the page
// // 	__PDF_DOC.getPage(page_no).then(function(page) {
// // 		// As the canvas is of a fixed width we need to set the scale of the viewport accordingly
// // 		var scale_required = __CANVAS.width / page.getViewport(1).width;

// // 		// Get viewport of the page at required scale
// // 		var viewport = page.getViewport(scale_required);

// // 		// Set canvas height
// // 		__CANVAS.height = viewport.height;

// // 		var renderContext = {
// // 			canvasContext: __CANVAS_CTX,
// // 			viewport: viewport
// // 		};
		
// // 		// Render the page contents in the canvas
// // 		page.render(renderContext).then(function() {
// // 			__PAGE_RENDERING_IN_PROGRESS = 0;

// // 			// Re-enable Prev & Next buttons
// // 			$("#pdf-next, #pdf-prev").removeAttr('disabled');

// // 			// Show the canvas and hide the page loader
// // 			$("#pdf-canvas").show();
// // 			$("#page-loader").hide();
// // 			$("#download-image").show();
// // 		});
// // 	});
// // }


// // $(document).on("click", "#upload-button", function () {
// //     $("#file-to-upload").trigger('click');
// // });

// // $(document).on("change", "#file-to-upload", function () {
// //     // Validate whether PDF
// //     if(['application/pdf'].indexOf($("#file-to-upload").get(0).files[0].type) == -1) {
// //         alert('Error : Not a PDF');
// //         return;
// //     }

// // 	$("#upload-button").hide();

// // 	// Send the object url of the pdf
// // 	showPDF(URL.createObjectURL($("#file-to-upload").get(0).files[0]));
// // });

// // $(document).on("click", "#pdf-prev", function () {
// //     if(__CURRENT_PAGE != 1)
// // 		showPage(--__CURRENT_PAGE);
// // });


// // // Next page of the PDF
// // $(document).on("click", "#pdf-next", function () {
// // 	if(__CURRENT_PAGE != __TOTAL_PAGES)
// // 		showPage(++__CURRENT_PAGE);
// // });

// // // Download button
// // $(document).on("click", "#download-image", function () {
// // 	$(this).attr('href', __CANVAS.toDataURL()).attr('download', 'page.png');
// // });
