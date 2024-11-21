// config.js

const config = {
    // API Configurations
    apis: {
        jobs: {
            endpoint: 'YOUR_JOBS_API_ENDPOINT',
            key: 'YOUR_API_KEY',
            rateLimit: 100, // requests per minute
            timeout: 5000, // milliseconds
            endpoints: {
                search: '/api/v1/search',
                details: '/api/v1/job-details',
                analytics: '/api/v1/analytics'
            }
        },

        skills: {
            endpoint: 'YOUR_SKILLS_API_ENDPOINT',
            key: 'YOUR_API_KEY',
            rateLimit: 50,
            timeout: 3000,
            endpoints: {
                assessment: '/api/v1/assessment',
                analysis: '/api/v1/analysis',
                recommendations: '/api/v1/recommendations'
            }
        },

        resume: {
            endpoint: 'YOUR_RESUME_API_ENDPOINT',
            key: 'YOUR_API_KEY',
            rateLimit: 30,
            timeout: 10000,
            endpoints: {
                parse: '/api/v1/parse',
                generate: '/api/v1/generate',
                optimize: '/api/v1/optimize'
            }
        },

        military: {
            endpoint: 'YOUR_MILITARY_API_ENDPOINT',
            key: 'YOUR_API_KEY',
            rateLimit: 50,
            timeout: 5000,
            endpoints: {
                translate: '/api/v1/translate',
                search: '/api/v1/search',
                details: '/api/v1/details'
            }
        }
    },

    // Application Settings
    app: {
        name: 'SCOUT Career Platform',
        version: '1.0.0',
        environment: 'development', // 'development', 'staging', 'production'
        debug: true,
        defaultLocation: 'United States',
        defaultRadius: 50, // miles
        maxSearchResults: 100,
        pagination: {
            itemsPerPage: 20,
            maxPages: 5
        }
    },

    // Cache Settings
    cache: {
        enabled: true,
        duration: 3600, // seconds
        maxSize: 100, // MB
        types: {
            jobs: 1800, // 30 minutes
            skills: 86400, // 24 hours
            military: 604800 // 1 week
        }
    },

    // Security Settings
    security: {
        corsEnabled: true,
        allowedOrigins: [
            'http://localhost:3000',
            'https://your-production-domain.com'
        ],
        rateLimit: {
            window: 900000, // 15 minutes
            max: 100 // requests per window
        },
        headers: {
            'Content-Security-Policy': "default-src 'self'",
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Content-Type-Options': 'nosniff'
        }
    },

    // Analytics Settings
    analytics: {
        enabled: true,
        provider: 'YOUR_ANALYTICS_PROVIDER',
        trackingId: 'YOUR_TRACKING_ID',
        events: {
            track: true,
            categories: ['search', 'assessment', 'resume', 'military']
        }
    },

    // Error Messages
    errorMessages: {
        api: {
            notFound: 'The requested resource was not found.',
            serverError: 'An unexpected server error occurred.',
            rateLimit: 'Rate limit exceeded. Please try again later.',
            timeout: 'The request timed out. Please try again.',
            unauthorized: 'Unauthorized access. Please check your credentials.'
        },
        validation: {
            required: 'This field is required.',
            invalid: 'Please enter a valid value.',
            tooLong: 'The input exceeds maximum length.',
            tooShort: 'The input is too short.'
        }
    },

    // Feature Flags
    features: {
        compareJobs: true,
        skillsAssessment: true,
        resumeBuilder: true,
        militaryTranslator: true,
        salaryEstimator: true,
        careerPath: true
    },

    // Notification Settings
    notifications: {
        enabled: true,
        position: 'top-right',
        duration: 5000,
        types: {
            success: {
                icon: '✓',
                className: 'success-notification'
            },
            error: {
                icon: '✕',
                className: 'error-notification'
            },
            warning: {
                icon: '⚠',
                className: 'warning-notification'
            },
            info: {
                icon: 'ℹ',
                className: 'info-notification'
            }
        }
    },

    // Development Tools
    development: {
        logging: {
            enabled: true,
            level: 'debug', // debug, info, warn, error
            format: 'json'
        },
        mocking: {
            enabled: true,
            delay: 1000 // millisecond delay for mock responses
        }
    }
};

// Environment-specific overrides
const env = process.env.NODE_ENV || 'development';
const envConfig = {
    development: {
        app: {
            debug: true,
            apiBaseUrl: 'http://localhost:3000'
        }
    },
    staging: {
        app: {
            debug: true,
            apiBaseUrl: 'https://staging-api.yourapp.com'
        }
    },
    production: {
        app: {
            debug: false,
            apiBaseUrl: 'https://api.yourapp.com'
        }
    }
};

// Merge environment-specific config
if (envConfig[env]) {
    Object.assign(config, envConfig[env]);
}

// Freeze configuration to prevent modifications
Object.freeze(config);

export default config;