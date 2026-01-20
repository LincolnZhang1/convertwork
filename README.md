# AnyConvert - 🔄 Free Online File Converter

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

**A powerful, free online file format converter built with modern web technologies**

[Live Demo](https://anyconvert.app) · [Report Bug](https://github.com/yourusername/anyconvert/issues) · [Request Feature](https://github.com/yourusername/anyconvert/issues/new)

</div>

## ✨ Features

- 🖼️ **Image Conversion**: Convert between JPG, PNG, GIF, WebP, BMP, TIFF
- 📄 **Document Processing**: Convert DOC, DOCX, PDF, TXT and more
- 🎵 **Audio Conversion**: MP3, WAV, FLAC, AAC, OGG support
- 🎬 **Video Conversion**: MP4, AVI, MKV, MOV, WebM formats
- 🗜️ **Archive Handling**: Create and extract ZIP, TAR archives
- 📥 **Video Download**: Download videos from YouTube, Vimeo and other platforms
- 🚀 **Client-Side Processing**: Fast and secure conversion in your browser
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔒 **Privacy First**: Files are processed locally, no server uploads required

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI**: React 18 with custom components
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

### Processing Engines
- **Images**: Sharp (high-performance image processing)
- **PDFs**: pdf-lib (PDF manipulation)
- **Documents**: CloudConvert API integration
- **Audio/Video**: FFmpeg.wasm (client-side processing)
- **Archives**: Archiver & Yauzl (ZIP/TAR handling)
- **Video Downloads**: ytdl-core

### Deployment
- **Hosting**: Netlify (Edge Functions)
- **CDN**: Cloudflare (optional)
- **Storage**: Cloudflare R2 (for temporary files)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/anyconvert.git
cd anyconvert
```

2. Install dependencies:
```bash
npm install
# or
bun install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

4. Run the development server:
```bash
npm run dev
# or
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# CloudConvert API (for document conversion)
CLOUDCONVERT_API_KEY=your_cloudconvert_api_key

# AWS S3 (optional, for file storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret

# API Keys for video downloads (optional)
RAPIDAPI_KEY=your_rapidapi_key
```

## 📁 Project Structure

```
anyconvert/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   └── api/               # API routes
│       └── convert/       # Conversion endpoints
├── components/             # React components
│   ├── FileUploader.tsx   # File upload component
│   ├── FormatSelector.tsx # Format selection
│   ├── ConversionProgress.tsx # Progress tracking
│   └── ConversionResult.tsx # Results display
├── lib/                   # Utility functions
│   ├── converters/        # Conversion logic
│   ├── utils.ts          # Helper functions
│   └── types.ts          # TypeScript definitions
├── public/                # Static assets
│   ├── icons/            # Favicon and icons
│   └── files/            # Downloadable files
└── styles/               # CSS files
    └── globals.css       # Global styles
```

## 🏗️ Architecture

AnyConvert follows a modern web architecture:

1. **Client-Side Processing**: Most conversions happen in the browser for privacy and speed
2. **Serverless Functions**: Heavy processing uses Netlify Functions
3. **API Integration**: External services (CloudConvert) for complex conversions
4. **Progressive Enhancement**: Works without JavaScript for basic functionality

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Conventional Commits for commit messages

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📋 Roadmap

- [ ] Add more image formats (HEIC, AVIF)
- [ ] Implement batch conversion
- [ ] Add OCR capabilities for scanned documents
- [ ] Support for more video platforms
- [ ] Desktop app version (Electron/Tauri)
- [ ] Browser extension
- [ ] API for developers

## 🐛 Troubleshooting

### Common Issues

1. **Conversion Fails**: Check file size limits and supported formats
2. **Slow Performance**: Large files may take time to process client-side
3. **API Errors**: Verify environment variables are correctly set

### Getting Help

- [Check the Issues](https://github.com/yourusername/anyconvert/issues)
- [Start a Discussion](https://github.com/yourusername/anyconvert/discussions)
- [Email Support](mailto:support@anyconvert.app)

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [CloudConvert](https://cloudconvert.com/) - Document conversion API
- [FFmpeg](https://ffmpeg.org/) - Audio/video processing
- [HTML5 UP](https://html5up.net/) - Design inspiration

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/anyconvert?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/anyconvert?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/anyconvert)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/anyconvert)

---

<div align="center">

**Made with ❤️ by the AnyConvert Team**

[Website](https://anyconvert.app) · [Twitter](https://twitter.com/anyconvert) · [Discord](https://discord.gg/anyconvert)

</div>