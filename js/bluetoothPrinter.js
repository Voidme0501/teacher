// Bluetooth Printer Constants and Functions
const BluetoothPrinter = {
    // Service and Characteristic UUIDs
    PRINTER_SERVICE_UUID: '000018f0-0000-1000-8000-00805f9b34fb',
    PRINTER_CHARACTERISTIC_UUID: '00002af1-0000-1000-8000-00805f9b34fb',

    // Connection state
    device: null,
    characteristic: null,
    isConnected: false,

    // Connect to printer
    async connectToPrinter() {
        try {
            console.log('Requesting Bluetooth Device...');
            this.device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: [this.PRINTER_SERVICE_UUID]
            });

            console.log('Connecting to GATT Server...');
            const server = await this.device.gatt.connect();

            console.log('Getting Printer Service...');
            const service = await server.getPrimaryService(this.PRINTER_SERVICE_UUID);

            console.log('Getting Printer Characteristic...');
            this.characteristic = await service.getCharacteristic(this.PRINTER_CHARACTERISTIC_UUID);

            this.isConnected = true;
            console.log('Connected to printer!');
            return true;
        } catch (error) {
            console.error('Error connecting to printer:', error);
            this.isConnected = false;
            return false;
        }
    },

    // Disconnect from printer
    async disconnect() {
        if (this.device && this.device.gatt.connected) {
            await this.device.gatt.disconnect();
            this.isConnected = false;
            console.log('Disconnected from printer');
        }
    },

    // Print text
    async printText(text) {
        if (!this.isConnected || !this.characteristic) {
            throw new Error('Printer not connected');
        }

        try {
            // Convert text to bytes
            const encoder = new TextEncoder();
            const data = encoder.encode(text);

            // Send data to printer
            await this.characteristic.writeValue(data);
            console.log('Text sent to printer');
        } catch (error) {
            console.error('Error printing text:', error);
            throw error;
        }
    },

    // Print QR code
    async printQRCode(data) {
        if (!this.isConnected || !this.characteristic) {
            throw new Error('Printer not connected');
        }

        try {
            // QR code command
            const qrCommand = `\x1D\x28\x6B\x03\x00\x31\x43${data.length}\x1D\x28\x6B${data.length}\x00\x31\x50\x30${data}`;
            const encoder = new TextEncoder();
            const qrData = encoder.encode(qrCommand);

            await this.characteristic.writeValue(qrData);
            console.log('QR code sent to printer');
        } catch (error) {
            console.error('Error printing QR code:', error);
            throw error;
        }
    },

    // Print barcode
    async printBarcode(data) {
        if (!this.isConnected || !this.characteristic) {
            throw new Error('Printer not connected');
        }

        try {
            // Barcode command (Code 128)
            const barcodeCommand = `\x1D\x68\x40\x1D\x77\x02\x1D\x6B\x02${data.length}\x00${data}`;
            const encoder = new TextEncoder();
            const barcodeData = encoder.encode(barcodeCommand);

            await this.characteristic.writeValue(barcodeData);
            console.log('Barcode sent to printer');
        } catch (error) {
            console.error('Error printing barcode:', error);
            throw error;
        }
    },

    // Print image
    async printImage(imageData) {
        if (!this.isConnected || !this.characteristic) {
            throw new Error('Printer not connected');
        }

        try {
            // Image printing command
            const imageCommand = `\x1D\x76\x30\x00${imageData}`;
            const encoder = new TextEncoder();
            const imageBytes = encoder.encode(imageCommand);

            await this.characteristic.writeValue(imageBytes);
            console.log('Image sent to printer');
        } catch (error) {
            console.error('Error printing image:', error);
            throw error;
        }
    },

    // Cut paper
    async cutPaper() {
        if (!this.isConnected || !this.characteristic) {
            throw new Error('Printer not connected');
        }

        try {
            const cutCommand = '\x1D\x56\x41';
            const encoder = new TextEncoder();
            const cutData = encoder.encode(cutCommand);

            await this.characteristic.writeValue(cutData);
            console.log('Paper cut command sent');
        } catch (error) {
            console.error('Error cutting paper:', error);
            throw error;
        }
    }
};

// Export the BluetoothPrinter object
window.BluetoothPrinter = BluetoothPrinter;

// Add the printToBluetoothPrinter function that will be called from Blazor
window.printToBluetoothPrinter = async function(text) {
    try {
        if (!window.BluetoothPrinter.isConnected) {
            const connected = await window.BluetoothPrinter.connectToPrinter();
            if (!connected) {
                throw new Error('Failed to connect to printer');
            }
        }

        await window.BluetoothPrinter.printText(text);
        await window.BluetoothPrinter.cutPaper();
        await window.BluetoothPrinter.disconnect();
    } catch (error) {
        console.error('Error in printToBluetoothPrinter:', error);
        throw error;
    }
}; 