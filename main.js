let timeoutID;
const video = document.querySelector('video');
const button = document.getElementById("button");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const asciiImage = document.getElementById("ascii-image");
const resolutionSelect = document.getElementById("resolution");
const frameRateSelect = document.getElementById("frame-rate");
const message = document.getElementById("message-container");
let desiredWidth;
let width = 320;
let height = 240;

let frameRate = 30;
// let characterRamp = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
// let characterRamp = " .:-=+*#%@";
let characterRamp = "@%#*+=-:. ";

// takes rgb values and returns the grayscale value
function getGrayscaleValue(r, g, b) {
    return 0.3 * r + 0.59 * g + 0.11 * b;
}

// given a grayscale value, get it's equvalent character
function getCharacter(grayscaleValue) {
    // a grayscale value of 0 is black, a grayscale value of 255 is white
    if (grayscaleValue === 255) {
        return characterRamp[characterRamp.length - 1];
    }
    let charIndex = Math.floor(grayscaleValue * characterRamp.length / 255);
    let retVal = characterRamp[charIndex];
    return retVal;
}

// returns the eqivalent ascii art of the image
function getAscii() {
    let imageData = ctx.getImageData(0, 0, width, height);
    let asciiText = "";
    // the image data values for each pixel are in groups of 4. Values in the group are r, g, b ,a values.
    // this loop computes the grayscale values for all pixels
    for (let i = 0; i < imageData.data.length; i += 4) {
        let newLine = width * 4;
        // at the end of each line, add a newline character
        if (i % newLine === 0 && i !== 0) {
            asciiText += "\n";
        }
        // get grascale value
        let grayscaleValue = getGrayscaleValue(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]);
        // get character value
        let char = getCharacter(grayscaleValue);
        // add character to ascii string
        asciiText += char;

    }

    return asciiText;
}

// function to produce grayscale and ascii images
function produceImage() {
    // get resolution chosen by user
    let resOption = resolutionSelect.value.split("x");
    // set width and height of ascii image
    width = resOption[0];
    height = resOption[1];

    canvas.width = width;
    canvas.height = height;
    // set font size
    let fontSize = 500 / height;
    fontSize = fontSize.toString() + "px";
    asciiImage.style.fontSize = fontSize;
    // produce ascii text
    ctx.drawImage(video, 0, 0, width, height);
    asciiImage.textContent = getAscii();
    // get user chosen frame rate
    let rateOption = Number(frameRateSelect.value);
    timeoutID = window.setTimeout(produceImage, 1000/rateOption);
    
}

// pause ascii camera function
function pauseVideo() {
    window.clearTimeout(timeoutID);
}

// get video stream
navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
    video.srcObject = mediaStream;
    message.style.display = "none";
    produceImage();
}).catch(error => console.log(error));

button.addEventListener("click", function () {
    if (button.value === "resume video") {
        produceImage();
        button.value = "pause video";
    } else {
        pauseVideo();
        button.value = "resume video";
    }
});
