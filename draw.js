var canvas,
    ctx,
    rect,
    handlesSize,
    currentHandle,
    drag = false;

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
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx = canvas.getContext('2d'),
    rect = {
        x: 50,
        y: 50,
        w: 100,
        h: 50
    },
    handlesSize = 8,
    currentHandle = false,
    drag = false;
}

function point(x, y) {
    return {
        x: x,
        y: y
    };
}

function dist(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

function getHandle(mouse) {
    if (dist(mouse, point(rect.x, rect.y)) <= handlesSize) return 'topleft';
    if (dist(mouse, point(rect.x + rect.w, rect.y)) <= handlesSize) return 'topright';
    if (dist(mouse, point(rect.x, rect.y + rect.h)) <= handlesSize) return 'bottomleft';
    if (dist(mouse, point(rect.x + rect.w, rect.y + rect.h)) <= handlesSize) return 'bottomright';
    if (dist(mouse, point(rect.x + rect.w / 2, rect.y)) <= handlesSize) return 'top';
    if (dist(mouse, point(rect.x, rect.y + rect.h / 2)) <= handlesSize) return 'left';
    if (dist(mouse, point(rect.x + rect.w / 2, rect.y + rect.h)) <= handlesSize) return 'bottom';
    if (dist(mouse, point(rect.x + rect.w, rect.y + rect.h / 2)) <= handlesSize) return 'right';
    return false;
}

function mouseDown(e) {
    if (currentHandle) drag = true;
    drawRect();
}

function mouseUp() {
    drag = false;
    currentHandle = false;
    drawRect();
}

function mouseMove(e) {
    // console.log(point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop));
    var previousHandle = currentHandle;
    if (!drag) currentHandle = getHandle(point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop));
    if (currentHandle && drag) {
        var mousePos = point(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        switch (currentHandle) {
            case 'topleft':
                rect.w += rect.x - mousePos.x;
                rect.h += rect.y - mousePos.y;
                rect.x = mousePos.x;
                rect.y = mousePos.y;
                break;
            case 'topright':
                rect.w = mousePos.x - rect.x;
                rect.h += rect.y - mousePos.y;
                rect.y = mousePos.y;
                break;
            case 'bottomleft':
                rect.w += rect.x - mousePos.x;
                rect.x = mousePos.x;
                rect.h = mousePos.y - rect.y;
                break;
            case 'bottomright':
                rect.w = mousePos.x - rect.x;
                rect.h = mousePos.y - rect.y;
                break;

            case 'top':
                rect.h += rect.y - mousePos.y;
                rect.y = mousePos.y;
                break;

            case 'left':
                rect.w += rect.x - mousePos.x;
                rect.x = mousePos.x;
                break;

            case 'bottom':
                rect.h = mousePos.y - rect.y;
                break;

            case 'right':
                rect.w = mousePos.x - rect.x;
                break;
        }
    }
    if (drag || currentHandle != previousHandle) drawRect();
}

function drawRect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.stroke();
    if (currentHandle) {
        var posHandle = point(0, 0);
        switch (currentHandle) {
            case 'topleft':
                posHandle.x = rect.x;
                posHandle.y = rect.y;
                break;
            case 'topright':
                posHandle.x = rect.x + rect.w;
                posHandle.y = rect.y;
                break;
            case 'bottomleft':
                posHandle.x = rect.x;
                posHandle.y = rect.y + rect.h;
                break;
            case 'bottomright':
                posHandle.x = rect.x + rect.w;
                posHandle.y = rect.y + rect.h;
                break;
            case 'top':
                posHandle.x = rect.x + rect.w / 2;
                posHandle.y = rect.y;
                break;
            case 'left':
                posHandle.x = rect.x;
                posHandle.y = rect.y + rect.h / 2;
                break;
            case 'bottom':
                posHandle.x = rect.x + rect.w / 2;
                posHandle.y = rect.y + rect.h;
                break;
            case 'right':
                posHandle.x = rect.x + rect.w;
                posHandle.y = rect.y + rect.h / 2;
                break;
        }
        ctx.globalCompositeOperation = 'xor';
        ctx.beginPath();
        ctx.arc(posHandle.x, posHandle.y, handlesSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
}

// const fs = require('fs');
// const {
//   PDFDocumentFactory,
//   PDFDocumentWriter,
//   StandardFonts,
//   drawLinesOfText,
//   drawImage,
//   drawRectangle,
// } = require('pdf-lib');
// const pdfDoc;
// const COURIER_FONT = 'Courier';
// const [courierRef, courierFont] = pdfDoc.embedStandardFont(
//     StandardFonts.Courier,
//   );

// $(document).on("click", "#downloadpdf", function(){  
//     pdfDoc = PDFDocumentFactory.load(assets.taxVoucherPdfBytes);
//     const pages = pdfDoc.getPages();
//     const existingPage = pages[0]
//   .addFontDictionary(COURIER_FONT, courierRef);

//   const newContentStream = pdfDoc.createContentStream(
//     // Now let's draw 2 lines of red Courier text near the bottom of the page.
//     drawLinesOfText(
//       ['Lienholder Name!'].map(courierFont.encodeText),
//       {
//         x: 30,
//         y: 150, // TO FIX
//         font: COURIER_FONT,
//         size: 12,
//         colorRgb: [0, 0, 0],
//       },
//     ),
//   );

//   existingPage.addContentStreams(pdfDoc.register(newContentStream));
//   const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);
//   const filePath = `content/modified.pdf`;
//     fs.writeFileSync(filePath, pdfBytes);
// });





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
