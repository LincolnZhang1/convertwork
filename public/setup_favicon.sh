#!/bin/bash
# Favicon setup script for img_8818.png
# This script will create the necessary favicon files from img_8818.png

if [ ! -f 'img_8818.png' ]; then
    echo 'Error: img_8818.png not found in public directory'
    echo 'Please place your img_8818.png file in the public directory first'
    exit 1
fi

echo 'Setting up favicon files from img_8818.png...'

# Copy img_8818.png to create favicon.ico (you may want to convert this to .ico format later)
cp img_8818.png favicon.ico

# Create apple-touch-icon.png
cp img_8818.png apple-touch-icon.png

# Create icon-192.png and icon-512.png for PWA
cp img_8818.png icon-192.png
cp img_8818.png icon-512.png

# Create mstile-150x150.png for Microsoft tiles
cp img_8818.png mstile-150x150.png

echo 'Favicon files created successfully!'
echo 'Note: For best results, you may want to resize these images to the appropriate dimensions:'
echo '- favicon.ico: 16x16, 32x32'
echo '- apple-touch-icon.png: 180x180'
echo '- icon-192.png: 192x192'
echo '- icon-512.png: 512x512'
echo '- mstile-150x150.png: 150x150'