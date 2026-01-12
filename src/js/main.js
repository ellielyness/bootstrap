// Import our custom CSS
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';

// Variables

    let imagePreviewOptions = {}
    let iframeUrl = '';
    let mode = 'dark';
    let logo = false;

// Get DOM Elements

    const imageTreatmentUrl = document.getElementById("imgTreatmentUrl");
    const imgTreatmentSelect = document.getElementById("imgTreatmentSelect");
    const imgTreatmentLogoEnabled = document.getElementById("imgTreatmentLogoEnabled");
    

    const imagePreview = document.getElementById("imagePreview");
    const dimensionsWidth = document.getElementById("width");
    const dimensionsHeight = document.getElementById("height");
    const imagePreviewBtn = document.getElementById("imagePreviewBtn");

// Functions

    function resizePreview(w,h) {

        if (w && h) {

            imagePreview.style.setProperty("aspect-ratio",w+' / '+h);
            if (h>w) {
                imagePreview.style.setProperty("max-width",(75*(w/h))+'%');
            } else {
                imagePreview.style.setProperty("max-width",(75)+'%')
            }

        } else {

            console.log('Awaiting both dimensions..');

        }

        resetDownload();

    }

    function updateDimension(dimension,x) {

        if ((typeof x) != 'number') {
            console.log('Dimension isnt a valid number');
        } else {
            if (dimension == 'width') {
                imagePreviewOptions.width = x;
            } else {
                imagePreviewOptions.height = x;
            }
        }
        
        resizePreview(imagePreviewOptions.width,imagePreviewOptions.height);

    }

    function updateSource() {
        iframeUrl = imageTreatmentUrl.value;
        imagePreview.setAttribute("src",`https://app.ellielyness.co.uk/image-tools/image-treatment/?image=${iframeUrl}&mode=${mode}&logo=${logo}`);
        resetDownload();
    }

    function updateMode() {
        mode = imgTreatmentSelect.value;
        if (iframeUrl) {
            updateSource();
        }
    }

    function updateLogo() {

        if (logo) {
            logo = false;
        } else {
            logo = true;
        }

        console.log(logo);
        
        if (iframeUrl) {
            updateSource();
        }
    }

    function waiting(element,timeout) {
        element.setAttribute("data-waiting","true");
        const originalHTML = element.innerHTML;
        let dots = ".";
        let i = 0;

        const timer = setInterval(()=>{

            if (element.dataset.waiting!=="true") {
                clearInterval(timer);
                return;
            }

            element.innerHTML = "Rendering"+dots;

            if (dots.length<3) {
                dots = dots + ".";
            } else {
                dots = ".";
                i++;
                if (i==timeout) {
                    clearInterval(timer);
                    element.setAttribute("data-waiting","false");
                    element.innerHTML = originalHTML;
                    return `Timer for ${element.id} expired.`;
                }
            }
                
        },333)

    }

    function resetDownload() {

        if (imagePreviewBtn.classList.contains("btn-success")) {
            imagePreviewBtn.classList.add("btn-dark");
            imagePreviewBtn.classList.remove("btn-success");
            imagePreviewBtn.removeAttribute("href");
            imagePreviewBtn.addEventListener('click',()=>{renderImage()});
            imagePreviewBtn.innerHTML = 'Render';
        }
        
    }

    async function renderImage() {
        waiting(imagePreviewBtn,30);

        const url = imagePreview.getAttribute("src");
        const width = imagePreviewOptions.width ?? 1080;
        const height = imagePreviewOptions.height ?? 1080;

        const body = {
            url: url,
            width:width,
            height:height
        };
        const request = await fetch('https://app.ellielyness.co.uk/render/',{method:"POST",headers:{"Content-type": "application/json"},body: JSON.stringify(body)});
        const text = await request.text();
        const responseJSON = JSON.parse(text);

        imagePreviewBtn.setAttribute("data-waiting","false");
        imagePreviewBtn.classList.remove("btn-dark");
        imagePreviewBtn.classList.add("btn-success");
        imagePreviewBtn.removeEventListener("click",updateLogo);
        imagePreviewBtn.setAttribute("href",`${responseJSON.body}`);
        imagePreviewBtn.innerHTML = "Download";

    }
    

// Listeners

    dimensionsWidth.addEventListener('input',()=>{updateDimension('width',parseInt(dimensionsWidth.value))});
    dimensionsHeight.addEventListener('input',()=>{updateDimension('height',parseInt(dimensionsHeight.value))});
    imageTreatmentUrl.addEventListener('focusout',()=>{updateSource()});
    imgTreatmentSelect.addEventListener('input',()=>{updateMode()});
    imgTreatmentLogoEnabled.addEventListener('input',()=>{updateLogo()});
    imagePreviewBtn.addEventListener('click',()=>{renderImage()});

// Script
