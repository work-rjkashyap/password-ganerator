# Password Generator Chrome Extension

A modern, secure Chrome extension for generating strong passwords with multiple password types and customizable options. Built with React.js and modern security practices.

## Features

### 🔒 Security Features
- **Cryptographically Secure Random Generation**: Uses Web Crypto API (`crypto.getRandomValues()`) for true randomness
- **Rejection Sampling**: Eliminates modulo bias for uniform distribution
- **Password Strength Assessment**: Advanced scoring algorithm based on entropy, length, and character diversity
- **No Password Storage**: All generation happens locally with no logging or storage
- **Chrome Storage Integration**: Securely stores user preferences using Chrome Storage API

### 🎨 User Experience
- **Modern Compact UI**: Clean, optimized interface for Chrome extension popup
- **Dark Mode Support**: System preference detection with manual toggle
- **Responsive Design**: Works on different screen sizes with smooth animations
- **Lucide Icons**: Beautiful, consistent iconography throughout the interface
- **Transparent Background**: Clean popup appearance with glass-like design

### ⚙️ Password Types & Options

#### Random Passwords
- **Length**: 4-50 characters (default: 20)
- **Character Types**: Uppercase, lowercase, numbers, symbols
- **Symbol Selection**: Choose from predefined sets or create custom symbols
- **Symbol Sets**: Basic, Extended, Safe, Brackets, Punctuation, Math, Custom
- **Real-time Preview**: See selected symbols before generation

#### Memorable Passwords
- **Word Count**: 2-6 words (default: 3)
- **Capitalization**: Toggle for better memorability
- **Common Words**: Uses dictionary of common English words
- **Random Separators**: Automatic separator insertion for security

#### PIN Generation
- **Length**: 4-12 digits (default: 4)
- **Cryptographically Secure**: Uses Web Crypto API for random digits
- **Entropy Assessment**: Real-time strength calculation

## Installation

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/password-generator-extension.git
   cd password-generator-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

The extension will now be available in your Chrome toolbar.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Make changes to the source code in the `src` folder
4. Build for production:
   ```bash
   npm run build
   ```

## Usage

### Getting Started
1. Click the extension icon in your Chrome toolbar
2. Choose from three password types using the tabs:
   - **Random**: Traditional character-based passwords
   - **Memorable**: Word-based passwords for easier recall
   - **PIN**: Numeric passwords for simple authentication

### Random Passwords
1. Adjust password length using the slider (4-50 characters)
2. Toggle numbers and symbols as needed
3. When symbols are enabled, choose from symbol sets:
   - **Basic**: `!@#$%&*+-=?`
   - **Extended**: `!@#$%^&*()_+-=[]{}|;:,.<>?`
   - **Safe**: `!@#$%&*+-=?.` (excludes confusing characters)
   - **Custom**: Enter your own symbols
4. Click "Refresh password" to generate
5. Click "Copy password" to copy to clipboard

### Memorable Passwords
1. Select word count (2-6 words)
2. Toggle capitalization for better memorability
3. Generate password with common English words and separators

### PIN Generation
1. Choose digit length (4-12 digits)
2. Generate cryptographically secure numeric passwords

### Settings Persistence
All your preferences (theme, symbol selections, options) are automatically saved and restored between sessions.

## Security Implementation

### Cryptographic Security
- **Web Crypto API**: Uses `crypto.getRandomValues()` for cryptographically secure random number generation
- **Rejection Sampling**: Prevents modulo bias by rejecting values that would create uneven distribution
- **Entropy Calculation**: Password entropy = length × log₂(charset_size)
- **No Weak Randomness**: No use of `Math.random()` or predictable algorithms

### Password Strength Assessment
The extension uses a comprehensive scoring system:
- **Length Factor**: Longer passwords score higher
- **Character Diversity**: Bonus points for using multiple character types
- **Entropy Threshold**: Minimum entropy requirements for each strength level
- **Time-to-Crack**: Realistic estimates assuming 1 billion guesses/second

### Security Best Practices
- **Local Processing**: All generation happens in the browser, no network requests
- **No Storage**: Passwords are never stored or logged
- **Memory Safety**: Generated passwords exist only in component state
- **Input Validation**: Strict validation of all user inputs
- **Error Handling**: Graceful handling of crypto API failures

## Project Structure

```
password-generator-extension/
├── src/
│   ├── App.jsx                          # Main React component with UI logic
│   ├── popup.css                        # Comprehensive styling with dark mode
│   ├── securePasswordGenerator.js       # Random password generation engine
│   ├── memorablePasswordGenerator.js    # Word-based password generation
│   └── storageUtils.js                  # Chrome storage utilities
├── public/
│   └── popup.html                       # Extension popup HTML template
├── manifest.json                        # Chrome extension manifest (V3)
├── package.json                         # Dependencies and build scripts
├── vite.config.js                       # Vite build configuration
└── README.md                            # This file
```

### Core Components
- **SecurePasswordGenerator**: Cryptographic random password generation
- **MemorablePasswordGenerator**: Word-based password creation
- **StorageManager**: Chrome storage API wrapper with fallbacks
- **App Component**: Main React UI with state management and persistence
- **Modern CSS**: Responsive design with CSS custom properties and dark mode

### Technical Features
- **React 18**: Modern React with hooks for state management
- **Vite**: Fast build tool for development and production
- **Chrome Storage API**: Persistent settings across browser sessions
- **Web Crypto API**: Cryptographically secure random generation
- **Lucide Icons**: Beautiful, consistent icon library

## Browser Compatibility

- **Chrome 88+**: Full Manifest V3 support
- **Edge 88+**: Chromium-based Edge
- **Brave, Vivaldi**: Other Chromium-based browsers
- **Requirements**: Web Crypto API and Chrome Storage API support

## Permissions

The extension requires minimal permissions:
- `storage`: To save user preferences (theme, symbol selections, etc.)
- `clipboardWrite`: To copy generated passwords to clipboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Implement improvements following security best practices
4. Test thoroughly with different password types
5. Submit a pull request with clear description

### Development Guidelines
- Follow React best practices and hooks patterns
- Maintain cryptographic security standards
- Add comprehensive error handling
- Update tests for new functionality
- Follow existing code style and conventions

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release with three password types
- Chrome storage persistence
- Dark mode support with system detection
- Symbol selection with predefined and custom options
- Modern UI with Lucide icons
- Responsive design optimized for extension popup
- Comprehensive security implementation

## Privacy & Security

### Privacy
- **No Data Collection**: Extension doesn't collect or transmit any user data
- **Local Processing**: All password generation happens locally in the browser
- **No Analytics**: No tracking, analytics, or telemetry
- **Settings Only**: Only user preferences are stored using Chrome Storage API

### Security
- **Cryptographic Standards**: Uses Web Crypto API for secure random generation
- **No Password Storage**: Generated passwords are never stored or logged
- **Rejection Sampling**: Eliminates statistical bias in character selection
- **Input Validation**: Comprehensive validation of all user inputs
- **Error Handling**: Graceful handling of API failures and edge cases

## Support

For issues, feature requests, or questions:
- Open an issue on [GitHub](https://github.com/yourusername/password-generator-extension/issues)
- Provide detailed steps to reproduce any bugs
- Include browser version and operating system information