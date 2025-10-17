# Speech-to-Text Frontend

A production-grade React frontend for the Speech-to-Text OpenAI service built with modern web technologies and accessibility in mind.

## Features

### Core Functionality
- **File Upload**: Drag-and-drop interface with comprehensive file validation
- **Multiple Formats**: Support for MP3, WAV, M4A, FLAC, MP4, OGG, WebM (up to 25MB)
- **Language Detection**: Auto-detect or manually specify transcription language
- **Output Formats**: JSON, plain text, SRT subtitles, VTT subtitles, verbose JSON
- **Real-time Progress**: Upload progress tracking and status updates
- **Download Options**: Export transcriptions in multiple formats
- **Copy to Clipboard**: One-click text copying functionality

### Production-Grade Features
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **Internationalization**: Multi-language support (English, Spanish)
- **Responsive Design**: Mobile-first design that works on all devices
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Code splitting, lazy loading, optimized bundle size
- **Security**: XSS protection, secure file uploads, CSP headers
- **Progressive Enhancement**: Works without JavaScript (basic functionality)

### Technical Excellence
- **Type Safety**: Full TypeScript implementation with strict types
- **State Management**: React Query for server state, Context for app state
- **Form Validation**: Zod schema validation with react-hook-form
- **Testing**: Comprehensive test setup with React Testing Library
- **Code Quality**: ESLint, TypeScript strict mode, accessibility linting

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Spring Boot backend running on port 8080

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type checking
npm run type-check
```

### Development
```bash
# Development server with hot reload
npm run dev
# Visit http://localhost:3000

# Run tests in watch mode
npm run test

# Generate test coverage report
npm run test:coverage
```

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## Architecture

### Component Structure
```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── forms/           # Form components with validation
│   ├── layout/          # Layout and navigation
│   └── transcription/   # Transcription-specific components
├── pages/               # Route components
├── services/            # API client and data services
├── hooks/               # Custom React hooks
├── providers/           # Context providers
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── constants/           # Application constants
├── locales/             # Translation files
└── styles/              # Global styles
```

### Key Technologies
- **React 18**: Modern React with concurrent features
- **TypeScript**: Type-safe development with strict configuration
- **Vite**: Fast build tool with HMR and optimized production builds
- **React Router**: Client-side routing with lazy loading
- **React Query**: Server state management with caching
- **React Hook Form**: Performant forms with validation
- **Zod**: Schema validation and type inference
- **React i18next**: Internationalization with language detection
- **CSS Modules**: Scoped styling with responsive design

## API Integration

### Endpoints
- `POST /api/v1/speech/transcribe` - Synchronous transcription
- `POST /api/v1/speech/transcribe/async` - Asynchronous transcription
- `GET /api/v1/speech/health` - Health check

### Error Handling
- Network error recovery with retry logic
- RFC 9457 Problem Details API error format
- User-friendly error messages with actionable feedback
- Global error boundary for unexpected errors

## Accessibility Features

### WCAG 2.1 AA Compliance
- Semantic HTML structure with proper heading hierarchy
- Keyboard navigation support for all interactive elements
- Screen reader announcements for dynamic content
- High contrast mode support
- Focus management and visible focus indicators
- Alternative text for all images and icons

### Inclusive Design
- Reduced motion support for users with vestibular disorders
- Scalable text up to 200% without horizontal scrolling
- Color contrast ratios exceeding 4.5:1 for normal text
- Touch targets minimum 44x44 pixels on mobile devices

## Performance Optimizations

### Core Web Vitals
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1

### Bundle Optimization
- Code splitting with lazy loading
- Tree shaking to eliminate dead code
- Asset optimization and compression
- Service worker for caching (future enhancement)

### Runtime Performance
- Virtual scrolling for large lists (future enhancement)
- Memoization of expensive calculations
- Efficient re-rendering with React.memo
- Debounced user inputs

## Security Features

### Client-Side Security
- Content Security Policy (CSP) headers
- XSS protection with input sanitization
- Secure file upload validation
- HTTPS enforcement in production

### Data Protection
- No sensitive data in localStorage
- Secure API communication
- File type and size validation
- CSRF protection

## Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills
- ES2020 features polyfilled automatically
- Web APIs gracefully degraded

## Testing

### Test Coverage
- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for API interactions
- Accessibility tests with jest-axe

### Running Tests
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# UI test runner
npm run test:ui
```

## Deployment

### Spring Boot Integration
- Built files are output to `target/classes/static/`
- Automatic integration with Spring Boot static resource serving
- Development proxy configuration for API calls

### Production Considerations
- Enable gzip compression on server
- Configure proper cache headers
- Set up monitoring and error tracking
- Consider CDN for static assets

## Environment Variables

### Development
```bash
# Optional: Custom API base URL
VITE_API_BASE_URL=http://localhost:8080
```

### Production
- All configuration is handled through Vite build-time variables
- No runtime environment variables needed

## Contributing

### Code Style
- ESLint configuration enforces consistent code style
- Prettier for automatic code formatting
- TypeScript strict mode for type safety
- Conventional commit messages

### Development Workflow
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Make changes with hot reload
4. Run tests: `npm test`
5. Type check: `npm run type-check`
6. Build for production: `npm run build`

## Troubleshooting

### Common Issues
- **Port conflicts**: Change dev server port in `vite.config.ts`
- **TypeScript errors**: Run `npm run type-check` for detailed errors
- **Build failures**: Clear node_modules and reinstall dependencies
- **API errors**: Ensure Spring Boot backend is running on port 8080

### Performance Issues
- Use React DevTools Profiler to identify bottlenecks
- Check bundle analyzer: `npm run analyze`
- Monitor Core Web Vitals in browser DevTools

## License

This project is part of the Spring AI learning repository and follows the same license terms.