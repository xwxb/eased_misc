// ==UserScript==
// @name         Copy Code to Clipboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a copy button to all code blocks
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Select all code blocks
    var codeBlocks = document.querySelectorAll('pre');

    // Iterate over all code blocks
    for (var i = 0; i < codeBlocks.length; i++) {
        (function () {
            var codeBlock = codeBlocks[i];

            // Check if the code block only contains numbers and whitespace
            if (/^\s*\d+\s*$/.test(codeBlock.textContent)) {
                // If it does, skip this code block
                return;
            }

            // Create a new button
            var button = document.createElement('button');
            button.textContent = 'Copy to clipboard';

            // Add click event handler
            button.addEventListener('click', function () {
                var range = document.createRange();
                range.selectNode(codeBlock);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
                alert('Code copied to clipboard!');
            });

            // Add the button to the code block
            codeBlock.parentNode.appendChild(button);
        })();
    }
})();