// assets/js/custom.js - SIMPLE VERSION for Lab 5

// Wait until page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - form ready!');
    
    // Get the form
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    // Get all input fields
    const nameInput = document.getElementById('userName');
    const surnameInput = document.getElementById('userSurname');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userPhone');
    const addressInput = document.getElementById('userAddress');
    const grade1Input = document.getElementById('labGrade1');
    const grade2Input = document.getElementById('labGrade2');
    const grade3Input = document.getElementById('labGrade3');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    // ============================================
    // PART 1: SIMPLE VALIDATION (Optional Task 1)
    // ============================================
    
    // Show error under input
    function showError(input, message) {
        // Remove old error
        const oldError = input.parentNode.querySelector('.simple-error');
        if (oldError) oldError.remove();
        
        // Add new error if there is a message
        if (message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'simple-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = 'color: red; font-size: 12px; margin-top: 5px;';
            input.parentNode.appendChild(errorDiv);
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = 'green';
        }
    }
    
    // Check if field is empty
    function isEmpty(value) {
        return value.trim() === '';
    }
    
    // Check if name/surname has only letters
    function hasOnlyLetters(value) {
        return /^[A-Za-z\s\-]+$/.test(value);
    }
    
    // Check if email looks right
    function isEmailValid(email) {
        return email.includes('@') && email.includes('.') && email.length > 5;
    }
    
    // Check if grade is between 1-10
    function isGradeValid(grade) {
        const num = parseInt(grade);
        return !isNaN(num) && num >= 1 && num <= 10;
    }
    
    // Real-time validation for each field
    function setupSimpleValidation() {
        // Check fields when user types
        const allInputs = [nameInput, surnameInput, emailInput, addressInput, grade1Input, grade2Input, grade3Input];
        
        allInputs.forEach(input => {
            input.addEventListener('input', function() {
                checkOneField(this);
                updateButton();
            });
        });
        
        // Special check for phone
        phoneInput.addEventListener('input', function() {
            formatPhone(this);
            updateButton();
        });
    }
    
    // Check one field
    function checkOneField(input) {
        const value = input.value.trim();
        
        if (isEmpty(value)) {
            showError(input, 'This field is required');
            return false;
        }
        
        // Check what type of field it is
        if (input === nameInput || input === surnameInput) {
            if (!hasOnlyLetters(value)) {
                showError(input, 'Only letters, spaces and hyphens allowed');
                return false;
            }
        }
        
        if (input === emailInput) {
            if (!isEmailValid(value)) {
                showError(input, 'Email must contain @ and .');
                return false;
            }
        }
        
        if (input === addressInput) {
            if (value.length < 5) {
                showError(input, 'Address too short (min 5 chars)');
                return false;
            }
        }
        
        if (input === grade1Input || input === grade2Input || input === grade3Input) {
            if (!isGradeValid(value)) {
                showError(input, 'Grade must be 1-10');
                return false;
            }
        }
        
        showError(input, ''); // No error
        return true;
    }
    
    // ============================================
    // PART 2: SIMPLE PHONE FORMATTING (Optional Task 2)
    // ============================================
    
    function formatPhone(input) {
        let numbers = input.value.replace(/\D/g, ''); // Remove non-digits
        
        // Auto-add +370 if user starts with 6
        if (numbers.startsWith('6')) {
            numbers = '370' + numbers;
        }
        
        // Format: +370 XXX XXXXX
        let formatted = '';
        if (numbers.length > 0) {
            formatted = '+';
            
            // First 3 digits (370)
            if (numbers.length >= 3) {
                formatted += numbers.substring(0, 3) + ' ';
                numbers = numbers.substring(3);
            }
            
            // Next 3 digits
            if (numbers.length >= 3) {
                formatted += numbers.substring(0, 3) + ' ';
                numbers = numbers.substring(3);
            }
            
            // Rest
            if (numbers.length > 0) {
                formatted += numbers;
            }
            
            input.value = formatted;
        }
    }
    
    // ============================================
    // PART 3: DISABLE BUTTON (Optional Task 3)
    // ============================================
    
    function updateButton() {
        // Check all required fields
        const requiredFields = [nameInput, surnameInput, emailInput, addressInput, grade1Input, grade2Input, grade3Input];
        let allValid = true;
        
        for (let field of requiredFields) {
            if (!checkOneField(field)) {
                allValid = false;
            }
        }
        
        // Enable/disable button
        if (allValid) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
        } else {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.5';
            submitButton.style.cursor = 'not-allowed';
        }
    }
    
    // ============================================
    // PART 4: FORM SUBMISSION (Required Tasks)
    // ============================================
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Don't reload page
        
        // Check if form is valid
        if (submitButton.disabled) {
            alert('Please fix all errors before submitting!');
            return;
        }
        
        console.log('Form submitted!');
        
        // Get all values
        const formData = {
            name: nameInput.value.trim(),
            surname: surnameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim(),
            grade1: parseInt(grade1Input.value),
            grade2: parseInt(grade2Input.value),
            grade3: parseInt(grade3Input.value)
        };
        
        // Calculate average
        const average = (formData.grade1 + formData.grade2 + formData.grade3) / 3;
        formData.average = average.toFixed(1);
        
        // Print to console (Required Task 4)
        console.log('Form Data:', formData);
        
        // Display results below form (Required Task 4 & 5)
        showResults(formData);
        
        // Show success message (Required Task 7)
        showSuccess();
        
        // Clear form after 2 seconds
        setTimeout(() => {
            contactForm.reset();
            updateButton();
        }, 2000);
    });
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    function showResults(data) {
        // Create or get results div
        let resultsDiv = document.getElementById('simple-results');
        if (!resultsDiv) {
            resultsDiv = document.createElement('div');
            resultsDiv.id = 'simple-results';
            resultsDiv.style.cssText = `
                margin-top: 20px;
                padding: 15px;
                background: #f5f5f5;
                border-radius: 5px;
                border: 1px solid #ddd;
            `;
            contactForm.parentNode.insertBefore(resultsDiv, contactForm.nextSibling);
        }
        
        // Choose color based on average
        let color = 'black';
        const avg = parseFloat(data.average);
        if (avg < 4) color = 'red';
        else if (avg < 7) color = 'orange';
        else color = 'green';
        
        // Create HTML for results
        resultsDiv.innerHTML = `
            <h3>Submitted Data:</h3>
            <p><b>Name:</b> ${data.name}</p>
            <p><b>Surname:</b> ${data.surname}</p>
            <p><b>Email:</b> ${data.email}</p>
            <p><b>Phone:</b> ${data.phone || 'Not provided'}</p>
            <p><b>Address:</b> ${data.address}</p>
            <p><b>Grades:</b> ${data.grade1}, ${data.grade2}, ${data.grade3}</p>
            <hr>
            <p><b>Average:</b> 
                <span style="color: ${color}; font-weight: bold;">
                    ${data.name} ${data.surname}: ${data.average}
                </span>
            </p>
        `;
        resultsDiv.style.display = 'block';
    }
    
    function showSuccess() {
        // Simple alert for success
        alert('✅ Form submitted successfully!');
        
        // Or you can create a simple popup
        const popup = document.createElement('div');
        popup.textContent = 'Form submitted successfully!';
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: green;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
        `;
        document.body.appendChild(popup);
        
        // Remove after 3 seconds
        setTimeout(() => {
            popup.remove();
        }, 3000);
    }
    
    // ============================================
    // START EVERYTHING
    // ============================================
    
    // Initialize
    setupSimpleValidation();
    updateButton(); // Start with button disabled
    
    console.log('Simple form handler ready!');
});