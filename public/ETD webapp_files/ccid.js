class Ccid {

    // ICC Power-on
    iccPowerOn() {
        const CMD_ICC_PWRON = new Uint8Array([0x62, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x00]);
        usbDev.send(CMD_ICC_PWRON);
    }

    // ICC Get slot status
    getSlotStatus() {
        const CMD_ICC_GETSLOTSTATUS = new Uint8Array([0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00]);
        usbDev.send(CMD_ICC_GETSLOTSTATUS);
    }

    // ICC Xfer block
    xfrBlock(payload) {
        var cmd = new Uint8Array(CCID_HDR_LEN + payload.length);
        cmd[0] = 0x6F;
        cmd[1] = (payload.length & 0xFF);
        cmd[2] = (payload.length >> 8) & 0xFF;
        cmd[3] = (payload.length >> 16) & 0xFF;
        cmd[4] = (payload.length >> 24) & 0xFF;
        cmd[5] = 0x00;
        cmd[6] = 0x01;
        cmd[7] = 0x00;
        cmd[8] = (payload.length == 0) ? 0x10 : 0x00;
        cmd[9] = 0x00;
        for (var i = 0; i < payload.length; i++) {
            cmd[CCID_HDR_LEN + i] = payload[i];
        }
        usbDev.send(cmd);
    }

    // Check card presence
    parseGetSlotStatusResponse(u8Data, length) {
        console_ely.log("slot status value " + u8Data[length - 3]);
        if (u8Data[length - 3] === 0) {
            isCardPresent = webapp_config.TRUE;
            currentEvent = events.EVENT_ICC_POWER_ON;
        } else {
            isCardPresent = webapp_config.FALSE;
            gui.update(guiEvents.GUI_CARD_ABSENT);
            if (urlparams_pcsc != '1') {
                webusb.listenInterrupt(); // Enable interrupt listener to perform PACE once card arrived.
            }
        }
    }

    // Parse ATR
    parseAtrResponse(u8Data) {
        var cardATR = util.toHexString(u8Data).toUpperCase();
        var position = (urlparams_pcsc == '1') ? 0 : CCID_HDR_LEN;
        if (u8Data[position] == 0x3B) {
            this.ATRInfo = cardATR.substring(30);
            gui.update(guiEvents.GUI_ATR, this.ATRInfo);
        }
    }
}
