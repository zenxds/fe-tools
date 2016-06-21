// from uglify
function to_ascii(str) {
    return str.replace(/[\u0080-\uffff]/g, function(ch) {
        var code = ch.charCodeAt(0).toString(16);
        if (code.length <= 2) {
            while (code.length < 2) code = "0" + code;
            return "\\x" + code;
        } else {
            while (code.length < 4) code = "0" + code;
            return "\\u" + code;
        }
    });
}

module.exports = {
    encode: to_ascii,

    decode: function(str) {
        return str.replace(/\\u([0-9a-f]{4})|\\x([0-9a-f]{2})/g, function(match, p1, p2) {
            return String.fromCharCode(parseInt(p1 || p2, 16))
        })
    }
}