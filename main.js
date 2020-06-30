var imageCapture;
const button = document.getElementById("button");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const asciiImage = document.getElementById("ascii-image");
let width = 256;
let height = 144;
let interval;
// let characterRamp = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
// let characterRamp = " .:-=+*#%@";
let characterRamp = "@%#*+=-:. "

// get video stream
navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
    // show camera video
    // document.querySelector('video').srcObject = mediaStream;

    const track = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(track);

}).catch(error => console.log(error));

// function to produce grayscale and ascii images
function produceImage() {
    imageCapture.grabFrame().then(function (imageBitmap) {
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        ctx.drawImage(imageBitmap, 0, 0, width, height);

        asciiImage.textContent = getAscii(toGrayscale(), width);
    });
    
}

// takes rgb values and returns the grayscale value
function getGrayscaleValue(r, g, b){
    return 0.3 * r + 0.59 * g + 0.11 * b;
}

// convert entire canvas to grayscale
// returns an array containing the grayscale values of all pixels on the canvas
function toGrayscale(){
    let imageData = ctx.getImageData(0, 0, width, height);
    let grayscales = [];
    // the image data values for each pixel are in groups of 4. Values in the group are r, g, b ,a values.
    // this loop computes the grayscale values for all pixels
    for(let i = 0; i < imageData.data.length; i += 4){
        let grayscaleValue = getGrayscaleValue(imageData.data[i], imageData.data[i+1], imageData.data[i+2]);

        grayscales.push(grayscaleValue);

        // manipulate canvas data
        // imageData.data[i] = grayscaleValue;
        // imageData.data[i+1] = grayscaleValue;
        // imageData.data[i+2] = grayscaleValue;
    }
    // draw grayscale
    // ctx.putImageData(imageData, 0, 0);
    
    return grayscales;
}

// given a grayscale value, get it's equvalent character
function getCharacter(grayscaleValue){
    // a grayscale value of 0 is black, a grayscale value of 255 is white
    if(grayscaleValue === 255){
        return characterRamp[characterRamp.length - 1];
    }
    let charIndex = Math.floor(grayscaleValue * characterRamp.length / 255);
    let retVal = characterRamp[charIndex];
    return retVal;
}

// given an array of grayscale values and the image width, produce a string representing an ascii image
function getAscii(grayscaleValues, imageWidth){
    let asciiText = "";

    for(let i = 0; i < grayscaleValues.length; i++){
        // at the end of each line, add a newline character
        if(i % imageWidth === 0 && i !== 0){
            asciiText += "\n";
        }
        asciiText += getCharacter(grayscaleValues[i]);
    }

    return asciiText;
}

// start ascii camera function
function startVideo(){
    interval = setInterval(produceImage, 1000/30);
}

button.addEventListener("click", startVideo);
