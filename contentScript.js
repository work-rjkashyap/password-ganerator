// Content script for SecurePass Generator
// Handles auto-fill functionality for password fields

(function() {
    'use strict';

    // Listen for messages from the extension popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'fillPassword') {
            const result = fillPasswordIntoPage(request.password);
            sendResponse(result);
        }
        return true; // Keep the message channel open for async response
    });

    function fillPasswordIntoPage(password) {
        try {
            // Find password input fields
            const passwordFields = findPasswordFields();
            
            if (passwordFields.length === 0) {
                return {
                    success: false,
                    message: 'No password fields found on this page'
                };
            }

            // Fill the password into the first available password field
            const field = passwordFields[0];
            
            // Set the value
            field.value = password;
            
            // Trigger events to ensure the page recognizes the change
            triggerInputEvents(field);
            
            // Highlight the field briefly to show it was filled
            highlightField(field);
            
            return {
                success: true,
                message: `Password filled into ${getFieldDescription(field)}`
            };
        } catch (error) {
            console.error('Error filling password:', error);
            return {
                success: false,
                message: 'Failed to fill password: ' + error.message
            };
        }
    }

    function findPasswordFields() {
        const fields = [];
        
        // Look for password input fields
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        fields.push(...passwordInputs);
        
        // Look for text inputs that might be password fields based on attributes
        const textInputs = document.querySelectorAll('input[type="text"], input:not([type])');
        textInputs.forEach(input => {
            const attributes = [
                input.name,
                input.id,
                input.className,
                input.placeholder,
                input.getAttribute('aria-label')
            ].join(' ').toLowerCase();
            
            if (attributes.includes('password') || 
                attributes.includes('passwd') || 
                attributes.includes('pwd')) {
                fields.push(input);
            }
        });
        
        // Filter out disabled and hidden fields
        return fields.filter(field => 
            !field.disabled && 
            !field.readOnly && 
            field.offsetParent !== null && // Not hidden
            getComputedStyle(field).visibility !== 'hidden'
        );
    }

    function triggerInputEvents(field) {
        // Create and dispatch various events that modern web apps might listen for
        const events = [
            new Event('input', { bubbles: true }),
            new Event('change', { bubbles: true }),
            new Event('keyup', { bubbles: true }),
            new Event('blur', { bubbles: true })
        ];
        
        events.forEach(event => {
            field.dispatchEvent(event);
        });
        
        // Also trigger React-style events if they exist
        if (field._valueTracker) {
            field._valueTracker.setValue('');
        }
        
        // Focus the field briefly
        field.focus();
        setTimeout(() => field.blur(), 100);
    }

    function highlightField(field) {
        const originalStyle = {
            outline: field.style.outline,
            outlineOffset: field.style.outlineOffset,
            transition: field.style.transition
        };
        
        // Apply highlight style
        field.style.outline = '2px solid #4CAF50';
        field.style.outlineOffset = '2px';
        field.style.transition = 'outline 0.3s ease';
        
        // Remove highlight after 2 seconds
        setTimeout(() => {
            field.style.outline = originalStyle.outline;
            field.style.outlineOffset = originalStyle.outlineOffset;
            field.style.transition = originalStyle.transition;
        }, 2000);
    }

    function getFieldDescription(field) {
        // Try to get a meaningful description of the field
        const label = field.labels && field.labels[0] ? field.labels[0].textContent.trim() : '';
        const placeholder = field.placeholder || '';
        const name = field.name || '';
        const id = field.id || '';
        
        if (label) return `"${label}" field`;
        if (placeholder) return `"${placeholder}" field`;
        if (name) return `"${name}" field`;
        if (id) return `"${id}" field`;
        
        return 'password field';
    }

})();