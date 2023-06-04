(() => {

    function getSelectionText() {
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    }

    function isNumeric(num) {
        return !isNaN(num);
    }

    function update() {
        var selected = getSelectionText();
        console.log("selected: " + selected);
        if (selected != '' && isNumeric(selected)) {
            //get selected text and send request to bkgd page to create menu
            console.log("send event");
            chrome.runtime.sendMessage({
                'message': 'updateContextMenu',
                'selection': selected
            });
        }
    }

    document.addEventListener("contextmenu", function (event) {
        // console.log("contextmenu");
        update();
    }, true);

    document.addEventListener('mousemove', e => {
        elem = document.elementFromPoint(e.clientX, e.clientY)
        text = elem.textContent || elem.value;
        text = text.match(/[\d\.]+/g)[0];
        // console.log("over number: " + text);
        if (text != '' && isNumeric(text)) {
            chrome.runtime.sendMessage({
                'message': 'updateContextMenu',
                'selection': text
            });
        }
    }, { passive: true })


})();


