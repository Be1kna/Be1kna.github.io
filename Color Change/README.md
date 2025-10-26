# Photo Color Manipulator - Batch Processing Edition

A powerful web application that allows you to manipulate photo colors using RGB or HSV color values. Upload single images or entire folders, choose target colors, select which color channels to modify, and download the processed results.

## 🚀 Features

- **📁 Folder Upload**: Process entire folders of images at once
- **🖼️ Multiple Format Support**: Supports JPEG, PNG, GIF, WebP, BMP, TIFF
- **⚡ Batch Processing**: Process hundreds of images with progress tracking
- **📦 Bulk Download**: Download all processed images individually
- **🎯 Selective Channel Modification**: Choose up to 2 channels to modify (prevents solid color results)
- **🔄 Real-time Preview**: See processed images before downloading

## Features

- **Dual Upload Options**: Single image or entire folder processing
- **Interactive Color Picker**: HEX, RGB, and HSV input support with live conversion
- **Dual Color Modes**: Choose between RGB and HSV color manipulation
- **Progress Tracking**: Real-time progress bar for batch operations
- **Format Preservation**: Maintains original image quality and format
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

### Single Image Processing
1. **Upload Image**: Click "Choose Single Image" or drag and drop an image file
2. **Choose Target Color**: Use color picker or enter HEX/RGB/HSV values
3. **Select Color Mode**: Choose RGB or HSV manipulation
4. **Select Channels**: Choose up to 2 channels to modify
5. **Process**: Click "Process Image(s)" to apply changes
6. **Download**: Click "Download Result" to save the processed image

### Batch Folder Processing
1. **Upload Folder**: Click "Choose Folder" to select an entire folder
2. **Preview Images**: See thumbnails of all images in the folder
3. **Choose Target Color**: Use color picker or enter HEX/RGB/HSV values
4. **Select Color Mode**: Choose RGB or HSV manipulation
5. **Select Channels**: Choose up to 2 channels to modify
6. **Process All**: Click "Process Image(s)" to process all images
7. **Monitor Progress**: Watch the progress bar as images are processed
8. **Download Results**: 
   - Individual downloads: Click download links for each image
   - Bulk download: Click "Download All" to download all processed images

## Supported Image Formats

- **JPEG/JPG**: Standard photo format
- **PNG**: Lossless format with transparency
- **GIF**: Animated and static images
- **WebP**: Modern web format
- **BMP**: Bitmap images
- **TIFF**: High-quality format

## Examples

### Example 1: Batch Process Vacation Photos
- Upload folder containing vacation photos
- Choose warm color (e.g., #ff6b35)
- Select HSV mode
- Check "Saturation (S)" and "Value (V)" channels
- Process all images to create warm-toned photos
- Download all processed images

### Example 2: Single Image Color Correction
- Upload a single photo
- Choose blue color (#0000ff)
- Select RGB mode
- Check only "Blue (B)" channel
- Process to enhance blue tones
- Download the result

## Technical Details

- **Color Conversion**: Automatic conversion between RGB and HSV color spaces
- **Pixel Processing**: Canvas-based image manipulation for high-quality results
- **Channel Limitation**: Maximum 2 channels to prevent solid color results
- **Memory Management**: Efficient processing of large batches
- **Format Support**: Input supports multiple formats, output is PNG for consistency
- **Progress Tracking**: Non-blocking UI updates during batch processing

## Browser Compatibility

- **Chrome** (recommended for best performance)
- **Firefox**
- **Safari**
- **Edge**

## Performance Notes

- **Single Images**: Instant processing
- **Small Batches** (1-10 images): Very fast processing
- **Medium Batches** (10-50 images): Fast processing with progress updates
- **Large Batches** (50+ images): Efficient processing with memory management

## File Structure

```
Color Change/
├── index.html      # Main HTML structure with batch processing UI
├── styles.css      # CSS styling with responsive design
├── script.js       # JavaScript with batch processing logic
└── README.md       # This documentation
```

## Getting Started

1. Open `index.html` in a web browser
2. Choose between single image or folder upload
3. Follow the usage instructions above
4. Start processing your photos!

## Tips for Best Results

- **Folder Organization**: Organize images in folders by project or theme
- **Channel Selection**: Choose complementary channels (e.g., S+V in HSV mode)
- **Color Choice**: Use vibrant colors for more dramatic effects
- **Batch Size**: Process folders with 20-50 images for optimal performance
- **Format Consistency**: All output images are saved as PNG for quality

## License

This project is open source and available under the MIT License.
