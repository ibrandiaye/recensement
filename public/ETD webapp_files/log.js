class Log {

    // Change the color based on id and color value
    changeColor(id, color) {
        $(id).css("backgroundColor", color);
    }

    header(msg) {
        $("#log").append(`<h2 class='has-text-primary title is-5' id='titleh2'>${msg}</h2>`);
    }

    subHeader(msg) {
        this.log(msg);
        $("#log").append(`<div class='is-medium'><h3 class='has-text-primary subtitle is-5'>${msg}\n</h3></div>`);
    }

    cApdu(msg) {
        var cApdu = util.formatHexPattern(util.uint8ArrayToHexString(msg, true))
        if (isLogEnabled)
            $("#log").append(`<div class='is-large'><h3 id='apdu' style='color: orange'>${cApdu}</h3></div>`);
    }

    rApdu(msg) {
        var rApdu = util.formatHexPattern(util.uint8ArrayToHexString(msg, true));
        if (isLogEnabled) {
            $("#log").append(`<div style='text-align:right;'><h3 id='apdu' class='has-text-info'>${rApdu}</h3></div>`);
            $("#log").append("<br>");
        }
    }

    status(msg) {
        if (isLogEnabled) {
            $("#log").append(`<div style='text-align:right;'><h3 id='apdu' class='has-text-info'>${msg}</h3></div>`);
            $("#log").append("<br>");
        }
    }

    timeTaken(msg) {
        if (isLogEnabled) {
            $("#log").append(`<div style='text-align:right;'><h3 id='apdu' class='has-text-info'>${msg}</h3></div>`);
            $("#log").append("<br>");
        }
    }

    errorResponse(msg) {
        if (isLogEnabled) {
            $("#log").append(`<div style='text-align:right;'><h3 id='apdu' class='has-text-danger'>${msg}</h3></div>`);
            $("#log").append("<br>");
        }
    }

    log(info, style) {
        if (isLogEnabled) {
            switch (style) {
                case 1: {
                    console.log(`%c${info}`, "color:orange; font-size:13px");
                    break;
                }
                case 2: {
                    console.log(`%c${info}`, "color:blue; font-size:13px");
                    break;
                }
                case 3: {
                    console.log(`%c${info}`, "color:green; font-size:13px");
                    break;
                }
                case 4: {
                    console.log(`%c${info}`, "color:red; font-size:13px");
                    break;
                }
                case 5: {
                    console.log(`%c${info}`, "color:green; font-size:14px");
                    break;
                }
                default: {
                    if (isDetailedLogEnabled) {
                        console.log(`%c${info}`, "color:gray; font-size:10px");
                        break;
                    }
                }
            }
        }
    }

    /*
     * Prints byte array to log.
     */
    logByArray(msg, abyData, length = 0) {
        if (abyData == null)
            return;
        if (!length)
            length = abyData.length;
        this.log(`${msg} (${length} bytes): ${util.toHexString(abyData)}`);
    }

    /*
     * Prints byte array to log.
     */
    logFuncName(funcName) {
        if (funcName == null)
            return;
        this.log(`--> ${funcName}()`);
    }
}
