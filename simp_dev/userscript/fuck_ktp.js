// ==UserScript==
// @name         嗅探组装课堂不允许下载的pdf图片资源
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fuck ketangpai
// @author       xban
// @match        *://*/*
// @grant        none
// ==/UserScript==

// 这个是要花时间的，不要无效验证，还是拆解着尝试：
// 1. 尝试抓一个图片生成pdf下载，走通流程
// 2. 基本这个过程还需要继续细化看看哪一步是否有问题，如何加载下载器
// 3. 

(function() {
    'use strict';

    // Minimum image size
    const MIN_SIZE = 100;

    // Create a new jsPDF instance
    let doc = new jsPDF();

    // Function to add image to PDF
    function addImageToPDF(img) {
        let imgData = img.src;
        doc.addImage(imgData, 'JPEG', 15, 40, 180, 160);
    }

    // Function to check if an image is loaded
    function isImageLoaded(img) {
        return img.complete && img.naturalHeight !== 0;
    }

    // Function to scroll to the bottom of the page
    function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Function to handle new images
    function handleNewImages() {
        // Get all images
        let images = Array.from(document.images);

        // Filter out small images
        images = images.filter(img => img.naturalWidth > MIN_SIZE && img.naturalHeight > MIN_SIZE);

        // Add images to PDF
        images.forEach(img => {
            if (isImageLoaded(img)) {
                addImageToPDF(img);
            }
        });
    }

    // Create a MutationObserver to watch for changes in the DOM
    let observer = new MutationObserver(handleNewImages);

    // Start observing the document
    observer.observe(document, { childList: true, subtree: true });

    // Scroll to the bottom of the page every second
    setInterval(scrollToBottom, 1000);

    // Handle new images every second
    setInterval(handleNewImages, 1000);

    // Create a download button
    let downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download PDF';
    downloadButton.style.position = 'fixed';
    downloadButton.style.bottom = '10px';
    downloadButton.style.right = '10px';
    document.body.prepend(downloadButton);

    // Add a click event handler to the download button
    downloadButton.addEventListener('click', function() {
        doc.save('download.pdf');
    });
})();