let imageCapture;
let interval;
const button = document.getElementById("button");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const asciiImage = document.getElementById("ascii-image");
let width = 256;
let height = 144;

let frameRate = 30;
// let characterRamp = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
// let characterRamp = " .:-=+*#%@";
let characterRamp = "@%#*+=-:. "

// get video stream
navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
    // show camera video
    document.querySelector('video').srcObject = mediaStream;

    const track = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(track);

}).catch(error => console.log(error));

// takes rgb values and returns the grayscale value
function getGrayscaleValue(r, g, b){
    return 0.3 * r + 0.59 * g + 0.11 * b;
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

// returns the eqivalent ascii art of the image
function getAscii(){
    let imageData = ctx.getImageData(0, 0, width, height);
    let asciiText = "";
    // the image data values for each pixel are in groups of 4. Values in the group are r, g, b ,a values.
    // this loop computes the grayscale values for all pixels
    for(let i = 0; i < imageData.data.length; i += 4){
        let newLine = width * 4;
        // at the end of each line, add a newline character
        if(i % newLine === 0 && i !== 0){
            asciiText += "\n";
        }
        // get grascale value
        let grayscaleValue = getGrayscaleValue(imageData.data[i], imageData.data[i+1], imageData.data[i+2]);
        // get character value
        let char = getCharacter(grayscaleValue);
        // add character to ascii string
        asciiText += char;

    }
    
    return asciiText;
}

// function to produce grayscale and ascii images
function produceImage() {
    imageCapture.grabFrame().then(function (imageBitmap) {
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        ctx.drawImage(imageBitmap, 0, 0, width, height);

        asciiImage.textContent = getAscii();
    }).catch(error => console.log(error));
    
}

// start ascii camera function
function startVideo(){
    interval = setInterval(produceImage, 1000/frameRate);
}

// pause ascii camera function
function pauseVideo(){
    clearInterval(interval);
}

button.addEventListener("click", function(){
    if(button.value === "start video"){
        console.log("video started");
        startVideo();
        button.value = "pause video";
    } else {
        pauseVideo();
        button.value = "start video";
    }

});
