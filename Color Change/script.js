class PhotoColorManipulator {
    constructor() {
        this.currentImage = null;
        this.currentImages = [];
        this.isBatchMode = false;
        this.currentMode = 'rgb';
        this.targetColor = { r: 255, g: 0, b: 0, h: 0, s: 100, v: 100 };
        this.selectedChannels = [];
        this.processedImageData = null;
        this.processedImages = [];
        this.processingQueue = [];
        
        this.initializeElements();
        this.bindEvents();
        this.updateColorInputs();
    }

    initializeElements() {
        this.imageInput = document.getElementById('imageInput');
        this.folderInput = document.getElementById('folderInput');
        this.imagePreview = document.getElementById('imagePreview');
        this.batchPreview = document.getElementById('batchPreview');
        this.colorPicker = document.getElementById('colorPicker');
        this.hexInput = document.getElementById('hexInput');
        this.rgbInput = document.getElementById('rgbInput');
        this.hsvInput = document.getElementById('hsvInput');
        this.rgbMode = document.getElementById('rgbMode');
        this.hsvMode = document.getElementById('hsvMode');
        this.rgbChannels = document.getElementById('rgbChannels');
        this.hsvChannels = document.getElementById('hsvChannels');
        this.processBtn = document.getElementById('processBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.downloadAllBtn = document.getElementById('downloadAllBtn');
        this.resultPreview = document.getElementById('resultPreview');
        this.batchResults = document.getElementById('batchResults');
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        // Channel checkboxes
        this.redChannel = document.getElementById('redChannel');
        this.greenChannel = document.getElementById('greenChannel');
        this.blueChannel = document.getElementById('blueChannel');
        this.hueChannel = document.getElementById('hueChannel');
        this.saturationChannel = document.getElementById('saturationChannel');
        this.valueChannel = document.getElementById('valueChannel');
    }

    bindEvents() {
        // Image upload
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.folderInput.addEventListener('change', (e) => this.handleFolderUpload(e));
        
        // Color picker events
        this.colorPicker.addEventListener('input', (e) => this.handleColorPickerChange(e));
        this.hexInput.addEventListener('input', (e) => this.handleHexInputChange(e));
        this.rgbInput.addEventListener('input', (e) => this.handleRgbInputChange(e));
        this.hsvInput.addEventListener('input', (e) => this.handleHsvInputChange(e));
        
        // Mode selection
        this.rgbMode.addEventListener('click', () => this.setMode('rgb'));
        this.hsvMode.addEventListener('click', () => this.setMode('hsv'));
        
        // Channel selection
        [this.redChannel, this.greenChannel, this.blueChannel].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateChannelSelection());
        });
        [this.hueChannel, this.saturationChannel, this.valueChannel].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateChannelSelection());
        });
        
        // Action buttons
        this.processBtn.addEventListener('click', () => this.processImages());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.downloadAllBtn.addEventListener('click', () => this.downloadAllImages());
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.isBatchMode = false;
        this.currentImages = [];
        this.batchPreview.innerHTML = '';
        this.batchResults.innerHTML = '';

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded image">`;
                this.processBtn.disabled = false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    handleFolderUpload(event) {
        const files = Array.from(event.target.files);
        const imageFiles = files.filter(file => this.isImageFile(file));
        
        if (imageFiles.length === 0) {
            alert('No image files found in the selected folder.');
            return;
        }

        this.isBatchMode = true;
        this.currentImage = null;
        this.currentImages = [];
        this.imagePreview.innerHTML = '';
        this.batchResults.innerHTML = '';

        // Process each image file
        let loadedCount = 0;
        imageFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.currentImages.push({
                        image: img,
                        file: file,
                        name: file.name,
                        dataUrl: e.target.result
                    });
                    loadedCount++;
                    
                    if (loadedCount === imageFiles.length) {
                        this.displayBatchPreview();
                        this.processBtn.disabled = false;
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    isImageFile(file) {
        const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
        return imageTypes.includes(file.type.toLowerCase());
    }

    displayBatchPreview() {
        this.batchPreview.innerHTML = '';
        this.currentImages.forEach((imgData, index) => {
            const item = document.createElement('div');
            item.className = 'image-item';
            item.innerHTML = `
                <img src="${imgData.dataUrl}" alt="${imgData.name}">
                <div class="image-name">${imgData.name}</div>
            `;
            this.batchPreview.appendChild(item);
        });
    }

    handleColorPickerChange(event) {
        const hex = event.target.value;
        this.updateColorFromHex(hex);
        this.updateColorInputs();
    }

    handleHexInputChange(event) {
        const hex = event.target.value;
        if (this.isValidHex(hex)) {
            this.updateColorFromHex(hex);
            this.updateColorInputs();
        }
    }

    handleRgbInputChange(event) {
        const rgb = event.target.value;
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            this.updateColorFromRgb(r, g, b);
            this.updateColorInputs();
        }
    }

    handleHsvInputChange(event) {
        const hsv = event.target.value;
        const match = hsv.match(/hsv\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (match) {
            const h = parseInt(match[1]);
            const s = parseInt(match[2]);
            const v = parseInt(match[3]);
            this.updateColorFromHsv(h, s, v);
            this.updateColorInputs();
        }
    }

    setMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        this.rgbMode.classList.toggle('active', mode === 'rgb');
        this.hsvMode.classList.toggle('active', mode === 'hsv');
        
        // Show/hide channel groups
        this.rgbChannels.style.display = mode === 'rgb' ? 'block' : 'none';
        this.hsvChannels.style.display = mode === 'hsv' ? 'block' : 'none';
        
        // Clear channel selections
        this.clearChannelSelections();
    }

    updateChannelSelection() {
        this.selectedChannels = [];
        
        if (this.currentMode === 'rgb') {
            if (this.redChannel.checked) this.selectedChannels.push('r');
            if (this.greenChannel.checked) this.selectedChannels.push('g');
            if (this.blueChannel.checked) this.selectedChannels.push('b');
        } else {
            if (this.hueChannel.checked) this.selectedChannels.push('h');
            if (this.saturationChannel.checked) this.selectedChannels.push('s');
            if (this.valueChannel.checked) this.selectedChannels.push('v');
        }
        
        // Limit to 2 channels
        if (this.selectedChannels.length > 2) {
            // Uncheck the last selected channel
            const lastChannel = this.selectedChannels[this.selectedChannels.length - 1];
            if (this.currentMode === 'rgb') {
                if (lastChannel === 'r') this.redChannel.checked = false;
                if (lastChannel === 'g') this.greenChannel.checked = false;
                if (lastChannel === 'b') this.blueChannel.checked = false;
            } else {
                if (lastChannel === 'h') this.hueChannel.checked = false;
                if (lastChannel === 's') this.saturationChannel.checked = false;
                if (lastChannel === 'v') this.valueChannel.checked = false;
            }
            this.selectedChannels.pop();
        }
    }

    clearChannelSelections() {
        [this.redChannel, this.greenChannel, this.blueChannel, 
         this.hueChannel, this.saturationChannel, this.valueChannel].forEach(checkbox => {
            checkbox.checked = false;
        });
        this.selectedChannels = [];
    }

    updateColorFromHex(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        this.updateColorFromRgb(r, g, b);
    }

    updateColorFromRgb(r, g, b) {
        this.targetColor.r = r;
        this.targetColor.g = g;
        this.targetColor.b = b;
        
        // Convert to HSV
        const hsv = this.rgbToHsv(r, g, b);
        this.targetColor.h = hsv.h;
        this.targetColor.s = hsv.s;
        this.targetColor.v = hsv.v;
    }

    updateColorFromHsv(h, s, v) {
        this.targetColor.h = h;
        this.targetColor.s = s;
        this.targetColor.v = v;
        
        // Convert to RGB
        const rgb = this.hsvToRgb(h, s, v);
        this.targetColor.r = rgb.r;
        this.targetColor.g = rgb.g;
        this.targetColor.b = rgb.b;
    }

    updateColorInputs() {
        const hex = this.rgbToHex(this.targetColor.r, this.targetColor.g, this.targetColor.b);
        this.colorPicker.value = hex;
        this.hexInput.value = hex;
        this.rgbInput.value = `rgb(${this.targetColor.r}, ${this.targetColor.g}, ${this.targetColor.b})`;
        this.hsvInput.value = `hsv(${this.targetColor.h}, ${this.targetColor.s}%, ${this.targetColor.v}%)`;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        let h = 0;
        if (diff !== 0) {
            if (max === r) h = ((g - b) / diff) % 6;
            else if (max === g) h = (b - r) / diff + 2;
            else h = (r - g) / diff + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        const s = max === 0 ? 0 : Math.round((diff / max) * 100);
        const v = Math.round(max * 100);
        
        return { h, s, v };
    }

    hsvToRgb(h, s, v) {
        h /= 360;
        s /= 100;
        v /= 100;
        
        const c = v * s;
        const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
        const m = v - c;
        
        let r, g, b;
        if (h < 1/6) [r, g, b] = [c, x, 0];
        else if (h < 2/6) [r, g, b] = [x, c, 0];
        else if (h < 3/6) [r, g, b] = [0, c, x];
        else if (h < 4/6) [r, g, b] = [0, x, c];
        else if (h < 5/6) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }

    isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    processImages() {
        if (this.selectedChannels.length === 0) {
            alert('Please select at least one channel to modify.');
            return;
        }

        if (this.isBatchMode) {
            this.processBatchImages();
        } else {
            this.processSingleImage();
        }
    }

    processSingleImage() {
        if (!this.currentImage) {
            alert('Please upload an image first.');
            return;
        }

        this.processBtn.classList.add('loading');
        this.processBtn.disabled = true;

        const processedData = this.processImageData(this.currentImage);
        this.processedImageData = processedData;

        // Show result
        this.resultPreview.innerHTML = `<img src="${processedData}" alt="Processed image">`;
        this.downloadBtn.disabled = false;

        this.processBtn.classList.remove('loading');
        this.processBtn.disabled = false;
    }

    async processBatchImages() {
        if (this.currentImages.length === 0) {
            alert('Please upload images first.');
            return;
        }

        this.processBtn.disabled = true;
        this.progressSection.style.display = 'block';
        this.processedImages = [];

        const totalImages = this.currentImages.length;
        let processedCount = 0;

        for (let i = 0; i < this.currentImages.length; i++) {
            const imgData = this.currentImages[i];
            const processedData = this.processImageData(imgData.image);
            
            this.processedImages.push({
                ...imgData,
                processedData: processedData
            });

            processedCount++;
            const progress = (processedCount / totalImages) * 100;
            this.updateProgress(progress, processedCount, totalImages);

            // Allow UI to update
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        this.displayBatchResults();
        this.downloadAllBtn.disabled = false;
        this.processBtn.disabled = false;
    }

    processImageData(image) {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw image
        ctx.drawImage(image, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Process each pixel
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            let newR = r, newG = g, newB = b;
            
            if (this.currentMode === 'rgb') {
                // RGB mode
                if (this.selectedChannels.includes('r')) newR = this.targetColor.r;
                if (this.selectedChannels.includes('g')) newG = this.targetColor.g;
                if (this.selectedChannels.includes('b')) newB = this.targetColor.b;
            } else {
                // HSV mode
                const hsv = this.rgbToHsv(r, g, b);
                let newH = hsv.h, newS = hsv.s, newV = hsv.v;
                
                if (this.selectedChannels.includes('h')) newH = this.targetColor.h;
                if (this.selectedChannels.includes('s')) newS = this.targetColor.s;
                if (this.selectedChannels.includes('v')) newV = this.targetColor.v;
                
                const rgb = this.hsvToRgb(newH, newS, newV);
                newR = rgb.r;
                newG = rgb.g;
                newB = rgb.b;
            }
            
            data[i] = newR;
            data[i + 1] = newG;
            data[i + 2] = newB;
        }

        // Put modified data back
        ctx.putImageData(imageData, 0, 0);

        return canvas.toDataURL('image/png');
    }

    updateProgress(percentage, current, total) {
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `${Math.round(percentage)}% Complete (${current}/${total})`;
    }

    displayBatchResults() {
        this.batchResults.innerHTML = '';
        this.processedImages.forEach((imgData, index) => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `
                <img src="${imgData.processedData}" alt="${imgData.name}">
                <div class="filename">${imgData.name}</div>
                <a href="${imgData.processedData}" download="${imgData.name.replace(/\.[^/.]+$/, '')}_processed.png" class="download-link">Download</a>
            `;
            this.batchResults.appendChild(item);
        });
    }

    downloadImage() {
        if (!this.processedImageData) return;

        const link = document.createElement('a');
        link.download = 'color-manipulated-image.png';
        link.href = this.processedImageData;
        link.click();
    }

    downloadAllImages() {
        if (this.processedImages.length === 0) return;

        // Create a zip-like experience by downloading all images
        this.processedImages.forEach((imgData, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.download = imgData.name.replace(/\.[^/.]+$/, '') + '_processed.png';
                link.href = imgData.processedData;
                link.click();
            }, index * 100); // Stagger downloads to avoid browser blocking
        });
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PhotoColorManipulator();
});
