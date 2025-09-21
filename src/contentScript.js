/**
 * Content script for auto-filling password fields
 */

// Function to find password input fields on the page
function findPasswordFields() {
  const passwordSelectors = [
    'input[type="password"]',
    'input[autocomplete*="password"]',
    'input[autocomplete*="new-password"]',
    'input[autocomplete*="current-password"]',
    'input[name*="password"]',
    'input[id*="password"]',
    'input[placeholder*="password"]',
    'input[class*="password"]'
  ];

  const fields = [];
  
  passwordSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (!fields.includes(element) && element.type !== 'hidden') {
        fields.push(element);
      }
    });
  });

  return fields;
}

// Function to fill password fields with the generated password
function fillPasswordFields(password) {
  const fields = findPasswordFields();
  
  if (fields.length === 0) {
    return { success: false, message: 'No password fields found on this page', fieldsCount: 0, domain: location.hostname };
  }

  let filledCount = 0;
  
  const filledSelectors = []
  fields.forEach(field => {
    if (field.disabled || field.readOnly) {
      return;
    }

    // Focus the field first
    field.focus();
    
    // Clear existing value
    field.value = '';
    
    // Set the new password value
    field.value = password;
    
    // Dispatch input events to trigger any listeners
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Add visual feedback
    field.style.boxShadow = '0 0 0 2px #4285f4';
    field.style.transition = 'box-shadow 0.3s ease';
    
    setTimeout(() => {
      field.style.boxShadow = '';
    }, 2000);
    // Track a simple identifier for context
    const ident = field.name || field.id || field.autocomplete || field.type || 'password'
    filledSelectors.push(ident)

    filledCount++;
  });

  return { 
    success: true, 
    message: `Password filled in ${filledCount} field${filledCount === 1 ? '' : 's'}`,
    fieldsCount: filledCount,
    domain: location.hostname,
    fields: filledSelectors
  };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillPassword') {
    const result = fillPasswordFields(request.password);
    sendResponse(result);
  }
  
  if (request.action === 'findPasswordFields') {
    const fields = findPasswordFields();
    sendResponse({ 
      success: true, 
      fieldsCount: fields.length,
      message: `Found ${fields.length} password field${fields.length === 1 ? '' : 's'}`
    });
  }
});

// Optional: Add a subtle indicator when the extension is ready
console.log('SecurePass Generator: Ready to auto-fill passwords');
