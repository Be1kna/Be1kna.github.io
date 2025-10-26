class ColorQuantizer {
    constructor() {
        this.files = [];
        this.processedImages = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const processBtn = document.getElementById('processBtn');
        const downloadAllBtn = document.getElementById('downloadAllBtn');
        const folderModeCheckbox = document.getElementById('folderMode');
        const quantizationModeSelect = document.getElementById('quantizationMode');
        const reductionPercentSlider = document.getElementById('reductionPercent');
        const reductionPercentValue = document.getElementById('percentValue');

        // Click to browse
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Process button
        processBtn.addEventListener('click', () => {
            this.processImages();
        });

        // Download all button
        downloadAllBtn.addEventListener('click', () => {
            this.downloadAllImages();
        });

        // Folder mode toggle
        folderModeCheckbox.addEventListener('change', () => {
            this.toggleFolderMode();
        });

        // Quantization mode toggle
        quantizationModeSelect.addEventListener('change', () => {
            this.toggleQuantizationMode();
        });

        // Slider value update
        reductionPercentSlider.addEventListener('input', (e) => {
            reductionPercentValue.textContent = e.target.value + '%';
        });
    }

    toggleFolderMode() {
        const fileInput = document.getElementById('fileInput');
        const folderMode = document.getElementById('folderMode').checked;
        
        if (folderMode) {
            fileInput.setAttribute('webkitdirectory', '');
            fileInput.setAttribute('directory', '');
        } else {
            fileInput.removeAttribute('webkitdirectory');
            fileInput.removeAttribute('directory');
        }
    }

    toggleQuantizationMode() {
        const mode = document.getElementById('quantizationMode').value;
        const percentControl = document.getElementById('percentControl');
        const colorsControl = document.getElementById('colorsControl');
        
        if (mode === 'percent') {
            percentControl.style.display = 'block';
            colorsControl.style.display = 'none';
        } else {
            percentControl.style.display = 'none';
            colorsControl.style.display = 'block';
        }
    }

    handleFiles(fileList) {
        this.files = Array.from(fileList).filter(file => file.type.startsWith('image/'));
        
        if (this.files.length > 0) {
            document.getElementById('processBtn').disabled = false;
            
            // Show file count
            const fileCount = document.getElementById('fileCount');
            const fileCountText = document.getElementById('fileCountText');
            fileCount.style.display = 'block';
            fileCountText.textContent = `${this.files.length} file${this.files.length > 1 ? 's' : ''} selected`;
            
            // Show success message
            const uploadArea = document.getElementById('uploadArea');
            uploadArea.style.borderColor = '#4CAF50';
            setTimeout(() => {
                uploadArea.style.borderColor = '#fff';
            }, 2000);
        } else {
            alert('No image files found. Please select valid image files.');
        }
    }

    async processImages() {
        const mode = document.getElementById('quantizationMode').value;
        const useDithering = document.getElementById('dithering').checked;
        
        let targetColors;
        if (mode === 'percent') {
            const reductionPercent = parseFloat(document.getElementById('reductionPercent').value);
            if (reductionPercent < 0 || reductionPercent > 99) {
                alert('Please enter a valid percentage between 0 and 99');
                return;
            }
            // Calculate target colors based on percentage (assume 256 colors initially)
            targetColors = Math.max(2, Math.floor(256 * (1 - reductionPercent / 100)));
        } else {
            targetColors = parseInt(document.getElementById('numColors').value);
            if (!targetColors || targetColors < 2 || targetColors > 256) {
                alert('Please enter a valid number of colors between 2 and 256');
                return;
            }
        }

        this.processedImages = [];
        this.showProgress(true);

        for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i];
            this.updateProgress(i, this.files.length, `Processing ${file.name}...`);

            try {
                const processedImageData = await this.quantizeImage(file, targetColors, useDithering);
                this.processedImages.push({
                    name: file.name,
                    data: processedImageData,
                    originalSize: `${file.size} bytes`
                });
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
            }
        }

        this.showProgress(false);
        this.showResults();
    }

    async quantizeImage(file, targetColors, useDithering) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    // Get image data
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    
                    // Create color palette using Median Cut algorithm
                    const palette = this.createPalette(imageData, targetColors);
                    
                    // Quantize image
                    const quantizedData = useDithering 
                        ? this.quantizeWithDithering(imageData, palette, canvas.width, canvas.height)
                        : this.quantizeWithoutDithering(imageData, palette);
                    
                    // Apply quantized data
                    const newImageData = ctx.createImageData(canvas.width, canvas.height);
                    newImageData.data.set(quantizedData);
                    ctx.putImageData(newImageData, 0, 0);
                    
                    // Convert to blob
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/png');
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    // Median Cut algorithm for palette generation
    createPalette(imageData, numColors) {
        const { data, width, height } = imageData;
        
        // Collect all unique colors
        const colorMap = new Map();
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const key = `${r},${g},${b}`;
            
            if (!colorMap.has(key)) {
                colorMap.set(key, { r, g, b, count: 0 });
            }
            colorMap.get(key).count++;
        }
        
        const colors = Array.from(colorMap.values());
        
        // If we have fewer colors than target, return all colors
        if (colors.length <= numColors) {
            return colors.map(c => ({ r: c.r, g: c.g, b: c.b }));
        }
        
        // Use median cut algorithm
        const palette = [];
        const buckets = [{ colors, indices: Array.from({ length: colors.length }, (_, i) => i) }];
        
        while (buckets.length < numColors && buckets.length > 0) {
            // Find bucket with largest range
            let maxRange = 0;
            let maxBucketIndex = 0;
            
            for (let i = 0; i < buckets.length; i++) {
                const bucket = buckets[i];
                const bucketColors = bucket.indices.map(idx => colors[idx]);
                
                const ranges = [
                    Math.max(...bucketColors.map(c => c.r)) - Math.min(...bucketColors.map(c => c.r)),
                    Math.max(...bucketColors.map(c => c.g)) - Math.min(...bucketColors.map(c => c.g)),
                    Math.max(...bucketColors.map(c => c.b)) - Math.min(...bucketColors.map(c => c.b))
                ];
                
                const range = Math.max(...ranges);
                
                if (range > maxRange) {
                    maxRange = range;
                    maxBucketIndex = i;
                }
            }
            
            // Split bucket
            const bucketToSplit = buckets[maxBucketIndex];
            const bucketColors = bucketToSplit.indices.map(idx => colors[idx]);
            
            const ranges = [
                Math.max(...bucketColors.map(c => c.r)) - Math.min(...bucketColors.map(c => c.r)),
                Math.max(...bucketColors.map(c => c.g)) - Math.min(...bucketColors.map(c => c.g)),
                Math.max(...bucketColors.map(c => c.b)) - Math.min(...bucketColors.map(c => c.b))
            ];
            
            const channel = ranges.indexOf(Math.max(...ranges));
            
            // Sort indices by the channel with largest range
            bucketToSplit.indices.sort((a, b) => {
                const aValue = colors[a][channel === 0 ? 'r' : channel === 1 ? 'g' : 'b'];
                const bValue = colors[b][channel === 0 ? 'r' : channel === 1 ? 'g' : 'b'];
                return aValue - bValue;
            });
            
            const median = Math.floor(bucketToSplit.indices.length / 2);
            const newBucket = {
                colors: [],
                indices: bucketToSplit.indices.splice(median)
            };
            buckets.push(newBucket);
        }
        
        // Calculate average color for each bucket
        for (const bucket of buckets) {
            const bucketColors = bucket.indices.map(idx => colors[idx]);
            
            const avgR = Math.round(bucketColors.reduce((sum, c) => sum + c.r, 0) / bucketColors.length);
            const avgG = Math.round(bucketColors.reduce((sum, c) => sum + c.g, 0) / bucketColors.length);
            const avgB = Math.round(bucketColors.reduce((sum, c) => sum + c.b, 0) / bucketColors.length);
            
            palette.push({ r: avgR, g: avgG, b: avgB });
        }
        
        return palette;
    }

    findClosestColor(r, g, b, palette) {
        let minDistance = Infinity;
        let closestColor = palette[0];
        
        for (const color of palette) {
            const distance = Math.sqrt(
                Math.pow(r - color.r, 2) +
                Math.pow(g - color.g, 2) +
                Math.pow(b - color.b, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = color;
            }
        }
        
        return closestColor;
    }

    quantizeWithoutDithering(imageData, palette) {
        const { data, width, height } = imageData;
        const quantized = new Uint8ClampedArray(data.length);
        
        for (let i = 0; i < data.length; i += 4) {
            const closestColor = this.findClosestColor(data[i], data[i + 1], data[i + 2], palette);
            
            quantized[i] = closestColor.r;
            quantized[i + 1] = closestColor.g;
            quantized[i + 2] = closestColor.b;
            quantized[i + 3] = data[i + 3];
        }
        
        return quantized;
    }

    quantizeWithDithering(imageData, palette, width, height) {
        const { data } = imageData;
        const quantized = new Uint8ClampedArray(data);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                
                const oldR = quantized[idx];
                const oldG = quantized[idx + 1];
                const oldB = quantized[idx + 2];
                
                const closestColor = this.findClosestColor(oldR, oldG, oldB, palette);
                
                quantized[idx] = closestColor.r;
                quantized[idx + 1] = closestColor.g;
                quantized[idx + 2] = closestColor.b;
                
                // Calculate error
                const errorR = oldR - closestColor.r;
                const errorG = oldG - closestColor.g;
                const errorB = oldB - closestColor.b;
                
                // Apply Floyd-Steinberg dithering
                const propagate = (dx, dy, factor) => {
                    const newX = x + dx;
                    const newY = y + dy;
                    
                    if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                        const newIdx = (newY * width + newX) * 4;
                        quantized[newIdx] = Math.max(0, Math.min(255, quantized[newIdx] + errorR * factor));
                        quantized[newIdx + 1] = Math.max(0, Math.min(255, quantized[newIdx + 1] + errorG * factor));
                        quantized[newIdx + 2] = Math.max(0, Math.min(255, quantized[newIdx + 2] + errorB * factor));
                    }
                };
                
                propagate(1, 0, 7 / 16);  // Right
                propagate(-1, 1, 3 / 16); // Down-left
                propagate(0, 1, 5 / 16);  // Down
                propagate(1, 1, 1 / 16);  // Down-right
            }
        }
        
        return quantized;
    }

    showProgress(show) {
        const progressSection = document.getElementById('progressSection');
        progressSection.style.display = show ? 'block' : 'none';
    }

    updateProgress(current, total, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const percentage = (current / total) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = text;
    }

    showResults() {
        const resultsSection = document.getElementById('resultsSection');
        const resultsGrid = document.getElementById('resultsGrid');
        
        resultsGrid.innerHTML = '';
        
        this.processedImages.forEach((image) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const img = document.createElement('img');
            img.src = URL.createObjectURL(image.data);
            img.alt = image.name;
            
            const filename = document.createElement('div');
            filename.className = 'filename';
            filename.textContent = image.name;
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = 'Download';
            downloadBtn.onclick = () => this.downloadImage(image.data, image.name);
            
            resultItem.appendChild(img);
            resultItem.appendChild(filename);
            resultItem.appendChild(downloadBtn);
            
            resultsGrid.appendChild(resultItem);
        });
        
        resultsSection.style.display = 'block';
    }

    downloadImage(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace(/\.[^/.]+$/, '_quantized.png');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadAllImages() {
        this.processedImages.forEach((image, index) => {
            setTimeout(() => {
                this.downloadImage(image.data, image.name);
            }, index * 100);
        });
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ColorQuantizer();
});

