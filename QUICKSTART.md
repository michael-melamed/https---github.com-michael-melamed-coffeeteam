# 🚀 CoffeeTeam Pro - Quick Start Guide

## Prerequisites

Before running the application, you need to install Node.js and npm.

### Install Node.js

1. **Download Node.js**: Visit [nodejs.org](https://nodejs.org/) and download the LTS version
2. **Install**: Run the installer and follow the prompts
3. **Verify**: Open a new terminal and run:
   ```bash
   node --version
   npm --version
   ```

## Installation

Once Node.js is installed, navigate to the project directory and run:

```bash
# Install dependencies
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start a development server at `http://localhost:3000`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing Multi-Device Setup

To test the P2P functionality locally:

1. **Open the app in multiple browser tabs/windows**
2. **Register each as a different device:**
   - Tab 1: Register as "Cashier 1" (CASHIER role)
   - Tab 2: Register as "Cashier 2" (CASHIER role)
   - Tab 3: Register as "Barista" (BARISTA role)
3. **Use the same branch ID for all** (e.g., "TLV-01")
4. **Create an order in Tab 1** and watch it appear in Tab 3
5. **Change status in Tab 3** and watch it update everywhere

## Troubleshooting

### "npm: command not found"
- Node.js is not installed or not in PATH
- Restart your terminal after installing Node.js
- On Windows, you may need to restart your computer

### STT Not Working
- Ensure you're using Chrome or Edge browser
- Grant microphone permissions when prompted
- Check browser console for errors

### P2P Connection Issues
- Ensure all devices use the same branch ID
- Check browser console for connection errors
- Try refreshing all tabs

### Port Already in Use
If port 3000 is already in use, Vite will automatically try the next available port (3001, 3002, etc.)

## Browser Support

- ✅ **Chrome/Edge**: Full support (recommended)
- ⚠️ **Firefox**: Limited STT support
- ⚠️ **Safari**: Requires WebRTC polyfill

## Next Steps

After successful setup:
1. Read the [README.md](file:///c:/Users/20312/OneDrive/שולחן%20העבודה/CT/README.md) for detailed documentation
2. Review the [walkthrough.md](file:///C:/Users/20312/.gemini/antigravity/brain/a310e721-ec37-4f9b-a15e-6a74ada5a89e/walkthrough.md) for implementation details
3. Start customizing the NLP keywords in `src/services/nlp-parser.ts`
4. Add your own products and menu items

---

**Happy brewing! ☕**
