# Color Quantizer

A modern web application for reducing colors in images using color quantization techniques. Upload single images, GIFs, or entire folders and reduce their color palette with precision control.

## Features

- **Multiple Quantization Modes**:
  - **Percentage-based**: Reduce colors by a specified percentage (0-99%)
  - **Fixed Colors**: Set exact number of colors (2-256 colors)

- **Advanced Algorithms**:
  - **Median Cut Algorithm**: Intelligent color palette generation that analyzes the most important colors in your image
  - **Floyd-Steinberg Dithering**: Optional dithering for smoother color transitions and better visual quality

- **Flexible Input**:
  - Single image upload
  - Batch processing of entire folders
  - Drag and drop support
  - Supports JPEG, PNG, GIF, WebP, BMP formats

- **Smart Controls**:
  - Interactive slider for percentage reduction
  - Direct input for exact color counts
  - Toggle dithering on/off
  - Real-time preview of processed images

- **Professional Output**:
  - Individual image downloads
  - Batch download all processed images
  - High-quality PNG output

## How to Use

1. **Open the Application**: Simply open `index.html` in your web browser

2. **Upload Images**: 
   - Drag and drop images onto the upload area, or
   - Click to browse and select individual images or entire folders

3. **Choose Quantization Mode**:
   - **Reduce by Percentage**: Use the slider to specify how much to reduce colors (0-99%)
   - **Set Number of Colors**: Enter exact number of colors (2-256)

4. **Configure Settings**:
   - Toggle "Apply Dithering" for smoother results (recommended)
   - Dithering reduces banding artifacts by diffusing color errors

5. **Process Images**: Click "Process Images" to start quantization

6. **Download Results**: 
   - Download individual images using the download button on each result
   - Use "Download All" to get all processed images at once

## Quantization Methods Explained

### Percentage-based Reduction
- **Best for**: Gradual color reduction, experimenting with different levels
- **How it works**: Reduces the color space by the specified percentage
- **Example**: 50% reduction takes a 256-color palette down to ~128 colors

### Fixed Color Count
- **Best for**: Specific design requirements, creating palettes
- **How it works**: Reduces image to exactly the number of colors you specify
- **Use cases**: 
  - Posterization effects
  - Creating limited color palettes
  - Retro art styles
  - Preparing images for specific color constraints

### Dithering Explained
- **What it does**: Spreads color quantization errors across neighboring pixels
- **Result**: Smoother gradients and transitions, less visible banding
- **Trade-off**: Slightly different texture, but much better visual quality
- **Recommendation**: Keep enabled for most images, disable for pixel art

## Technical Details

- **Client-side Processing**: All image processing happens in your browser - no data is sent to external servers
- **Canvas API**: Uses HTML5 Canvas for high-performance image manipulation
- **Median Cut Algorithm**: Efficiently selects the most representative colors from your image
- **Floyd-Steinberg Dithering**: Advanced error diffusion for professional results
- **Memory Efficient**: Processes images one at a time to avoid memory issues

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## File Format Support

- **Input**: JPEG, PNG, GIF, WebP, BMP
- **Output**: PNG (for best quality and color accuracy)

## Performance Tips

- For large batches, consider processing smaller groups
- With dithering takes slightly longer but provides much better quality
- Fewer colors (e.g., 8-16) produce strong artistic effects
- More colors (e.g., 128-256) maintain more natural appearance

## Privacy & Security

- All processing happens locally in your browser
- No images are uploaded to external servers
- No data is stored or transmitted
- Your images never leave your device

## Use Cases

- **Digital Art**: Create posterized effects and artistic color reductions
- **Web Design**: Optimize images with limited color palettes
- **Retro Graphics**: Achieve 8-bit or 16-bit style aesthetics
- **File Size Optimization**: Reduce colors to decrease file sizes
- **Color Palette Generation**: Extract dominant colors from images
- **Print Preparation**: Prepare images for specific printing requirements

---

**Note**: This application works entirely in your browser. No internet connection is required after the initial page load.

