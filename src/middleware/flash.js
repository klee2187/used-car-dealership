// Flash message middleware for Express.js
const flashMiddleware = (req, res, next) => {
    // Track if flash messages were set (need to save session before redirect)
    let sessionNeedsSave = false;

    // Override res.redirect to save session before redirecting
    const originalRedirect = res.redirect.bind(res);
    res.redirect = (...args) => {
        if (sessionNeedsSave && req.session) {
            // Save session before redirecting
            return req.session.save(() => {
                originalRedirect.apply(res, args);
            });
        } else {
            return originalRedirect.apply(res, args);
        }
    };

    // Flash function to set or get flash messages
    req.flash = function(type, message) {
        // Guard: If session doesn"t exist (e.g., after session.destroy()), 
        // return early to prevent errors. Flash messages require a session to store.
        if (!req.session) {
            // If setting a message (both type and message provided), can"t do without session
            if (type && message) {
                return; // Silently fail - no session to store in
            }
            // If getting messages, return empty structure
            return { success: [], error: [], warning: [], info: [] };
        }

        // Initialize flash storage if it doesn"t exist
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        // SETTING: Two arguments means we"re storing a new message
        if (type && message) {
            // Ensure this message type"s array exists
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            // Add the message to the appropriate type array
            req.session.flash[type].push(message);
            // Mark that session needs to be saved before redirect
            sessionNeedsSave = true;
            return;
        }

        // GETTING ONE TYPE: One argument means retrieve messages of that type
        if (type && !message) {
            const messages = req.session.flash[type] || [];
            // Clear this type"s messages after retrieving
            req.session.flash[type] = [];
            return messages;
        }

        // GETTING ALL: No arguments means retrieve all message types
        const allMessages = req.session.flash || {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        // Clear all flash messages after retrieving
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };

        return allMessages;
    };

    next();
};

// Middleware to make flash messages available in templates via res.locals.flash
const flashLocals = (req, res, next) => {
    // Make flash messages available in res.locals for templates to access
    res.locals.flash = req.flash;
    next();
};

// Combined middleware to handle flash messages and make them available in templates
const flash = (req, res, next) => {
    flashMiddleware(req, res, () => {
        flashLocals(req, res, next);
    });
};

export default flash;