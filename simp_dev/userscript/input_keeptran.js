// ==UserScript==
// @name         Input Box Keep Translation
// @version      0.2
// @description  Keep translation of input box text using Google Translate API
// @author       xban
// @match        *://*/*
// @license MIT
// ==/UserScript==

const translate = require('google-translate-api');
// Function to call Google Translate API for translation
async function translateText(text) {
    const sourceLang = 'zh-CN'; // Source language (Chinese)
    const targetLang = 'en'; // Target language (English)

    try {
        const translation = await translate(text, { from: sourceLang, to: targetLang });
        return translation.text;
    } catch (error) {
        console.error('Translation error:', error);
        return '';
    }
}

// Function to add translated text to the input box
function addTranslatedText(inputBox, translatedText) {
    const separator = '\n----..\n'; // Separator between original and translated text
    inputBox.value += separator + translatedText;
}

// Function to detect fast consecutive 't' key presses
function detectFastConsecutiveTKeyPresses() {
    let tKeyPressCount = 0;
    let lastKeyPressTime = 0;

    // todo 问题是应该只给输入框添加监听，不然容易被阻止
    document.addEventListener('keydown', (event) => {
        console.log(event.key)
        const currentTime = new Date().getTime();
        const timeSinceLastKeyPress = currentTime - lastKeyPressTime;

        if (event.key === 't' && timeSinceLastKeyPress < 500) {
            console.log('Detected fast consecutive "t" key press');
            tKeyPressCount++;
        } else {
            tKeyPressCount = 0;
        }

        if (tKeyPressCount === 3) {
            console.log('Detected fast consecutive "t" key presses');
            console.log(translateText('你好'))

            // const inputBox = document.querySelector('input[type="text"]'); // Replace with your input box selector
            // const textToTranslate = inputBox.value.trim().replace(/t/g, '');

            // if (textToTranslate) {
            //     translateText(textToTranslate)
            //         .then((translatedText) => {
            //             addTranslatedText(inputBox, translatedText);
            //         })
            //         .catch((error) => {
            //             console.error('Translation error:', error);
            //         });
            // }

            // tKeyPressCount = 0;
        }

        lastKeyPressTime = currentTime;
    });
}

// Call the function to start detecting fast consecutive 't' key presses
detectFastConsecutiveTKeyPresses();
