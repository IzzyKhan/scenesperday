/* Notes:
- finish date cannot be before start date
- fix rounding and dpw display calculation
*/

// Select DOM elements
const startDate = document.getElementById('start-date')
const endDate = document.getElementById('end-date')
const totalScenes = document.getElementById('total-scenes')
const totalDone = document.getElementById('total-done')
const daysPerWeek = document.getElementById('days-per-week')
const calculate = document.getElementById('calculate-btn')
const result = document.getElementById('result')
const totalDaysDisplay = document.getElementById('total-days-display')
const daysPrepping = document.getElementById('days-prepping')

// Total days display function
function totalDays() {

    // Convert inputs to objects
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    const mspd = 1000 * 60 * 60 * 24
    const daysStartFinish = (end - start) / mspd

    // Check if both dates exist
    if (!startDate.value || !endDate.value) {
        totalDaysDisplay.textContent = ""
        return
    }

    // Check if end is before start
    if (end < start) {
        // Set error and show pop up
        endDate.setCustomValidity("Finish date must be after start date")
        endDate.reportValidity()
        totalDaysDisplay.textContent = ""
        return
    }

    // Clear any previous error message
    endDate.setCustomValidity("")

    // Show total days     
    totalDaysDisplay.textContent = `${daysStartFinish} total days from start to finish`
}

// Total days prepping function
function totalDaysPrepping() {

    // Convert inputs to objects
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    const mspd = 1000 * 60 * 60 * 24
    const daysStartFinish = (end - start) / mspd
    const weeksStartFinish = daysStartFinish / 7
    const dpw = Number(daysPerWeek.value)
    const totalDaysPrepping = (weeksStartFinish < 1) ? dpw : dpw * weeksStartFinish
    
    // Check if both dates exist
    if (!startDate.value || !endDate.value) {
        totalDaysPrepping.textContent = ""
        return
    }

    // Check if dpw exists 
    if (!daysPerWeek.value) {
        daysPrepping.textContent = ""
        return
    }

    // Days per week range validation
    if (dpw < 1 || dpw > 7) {
        // Set error and show pop up
        daysPerWeek.setCustomValidity("Days per week must be less than or equal to 7")
        daysPerWeek.reportValidity()
        totalDaysPrepping.textContent = ""
        return
    }

    // Clear any previous error message
    daysPerWeek.setCustomValidity("")
    
    // Result rounding
    const rounded = totalDaysPrepping.toFixed(0)

    // Show total days prepping
    daysPrepping.textContent = `${rounded} total days prepping`
}

// Scenes per day function
function scenesPerDay() {

    // Input validation
    if (!startDate.value) {
        result.textContent = "Please enter start date"
        return
    }
    
    if (!endDate.value) {
        result.textContent = "Please enter end date"
        return
    }
    
    if (!totalScenes.value) {
        result.textContent = "Please enter number of scenes to prep"
        return
    }
    
    if (!daysPerWeek.value) {
        result.textContent = "Please enter days per week prepping"
        return
    }
    
    // Convert inputs to objects
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    const total = Number(totalScenes.value)
    const done = Number(totalDone.value)
    const dpw = Number(daysPerWeek.value)

    // Check if converted inputs are valid objects
    if (isNaN(start.getTime())) {
        result.textContent = "Please enter a valid start date"
        return  
    }

    if (isNaN(end.getTime())) {
        result.textContent = "Please enter a valid end date"
        return
    }

    if (isNaN(total)) {
        result.textContent = "Please enter a valid number of scenes to prep"
        return
    }

    if (isNaN(done)) {
        result.textContent = "Please enter a valid number of scenes already prepped"
        return
    }

    if (isNaN(dpw)) {
        result.textContent = "Please enter a number from 1 to 7 for days per week prepping"
        return
    }

    // Date logic
    if (end < start) {
        result.textContent = "Finish date must be after start date"
        return
    }

    // Days per week range validation
    if (dpw < 1 || dpw > 7) {
        result.textContent = "Day per week must be between 1 and 7"
        return
    }

    // Scenes done shouldn't exceed total
    if (done > total) {
        result.textContent = "Scenes done shouldn't exceed total scenes"
        return
    }

    // Check for negative numbers
    if (total <= 0 || done < 0) {
        result.textContent = "Please enter positive numbers"
        return
    }

    // Scenes remaining check
    if ((total - done) <= 0) {
        result.textContent = "All scenes are already prepped"
        return
    }

    // Use converted inputs for calulation
    let mspd = 1000 * 60 * 60 * 24
    let daysStartFinish = (end - start) / mspd
    let weeksStartFinish = daysStartFinish / 7
    let totalDaysPrepping = (weeksStartFinish < 1) ? dpw : dpw * weeksStartFinish
    let numberOfScenesPerDay = (total - done) / totalDaysPrepping

    // If less than 1 week, days per week must be less than the number of days between start and finish
    if (dpw > (daysStartFinish)) {
        result.textContent = "Day per week cannot be greater than number of days between start and finish"
        return
    }

    // Division by zero protection
    if (totalDaysPrepping <= 0) {
        result.textContent = "No prepping days available. Check your dates and day per week"
        return
    }

    // Result rounding
    const rounded = numberOfScenesPerDay.toFixed(0)

    // Result formatting
    if (rounded === "1.0") {
        result.innerHTML = `To finish on time, you need to prep <span class="number-highlight">${rounded} scene per day.</span>`
        result.classList.add('result-printed')
    } else {
        result.innerHTML = `To finish on time, you need to prep <span class="number-highlight">${rounded} scenes per day.</span>`
        result.classList.add('result-printed')
    }
    
}

// Feedback Modal Functionality
const feedbackBtn = document.getElementById('feedback-btn')
const feedbackModal = document.getElementById('feedback-modal')
const feedbackClose = document.querySelector('.feedback-close')
const feedbackForm = document.getElementById('feedback-form')

// Open modal
feedbackBtn.addEventListener('click', () => {
    feedbackModal.classList.add('active')
    document.body.style.overflow = 'hidden' // Prevent background scrolling
})

// Close modal
feedbackClose.addEventListener('click', () => {
    feedbackModal.classList.remove('active')
    document.body.style.overflow = '' // Restore scrolling
})

// Close modal when clicking outside
feedbackModal.addEventListener('click', (e) => {
    if (e.target === feedbackModal) {
        feedbackModal.classList.remove('active')
        document.body.style.overflow = ''
    }
})

// Handle form submission with Web3Forms
// Get your access key from https://web3forms.com/ (enter phenorma@gmail.com)
// Replace 'YOUR_WEB3FORMS_ACCESS_KEY' below with your access key
const WEB3FORMS_ACCESS_KEY = '8153099e-7dc4-42e2-acbe-62f1abe0eb24'

feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const submitButton = document.getElementById('feedback-submit')
    const originalButtonText = submitButton.textContent
    
    // Disable button and show loading state
    submitButton.disabled = true
    submitButton.textContent = 'Sending...'
    
    const name = document.getElementById('feedback-name').value || 'Anonymous'
    const email = document.getElementById('feedback-email').value || 'No email provided'
    const likelihood = document.getElementById('feedback-likelihood').value
    const recommend = document.getElementById('feedback-recommend').value
    const message = document.getElementById('feedback-message').value
    
    // Format message with the new questions
    const formattedMessage = `How likely to use: ${likelihood}\nWould recommend: ${recommend}\n\nMessage:\n${message}`
    
    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: 'Feedback from Scenes Per Day Calculator',
                from_name: name,
                email: email,
                message: formattedMessage,
                likelihood: likelihood,
                recommend: recommend
            })
        })
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
            alert('Thank you for your feedback!')
            feedbackForm.reset()
            feedbackModal.classList.remove('active')
            document.body.style.overflow = ''
        } else {
            // Show the actual error message from Web3Forms
            const errorMsg = result.message || 'Failed to send feedback'
            console.error('Web3Forms error:', result)
            alert(`Error: ${errorMsg}\n\nPlease check:\n1. Your email is verified at web3forms.com\n2. Your access key is correct\n3. Check browser console (F12) for details`)
        }
        
    } catch (error) {
        console.error('Error sending feedback:', error)
        console.error('Full error details:', {
            message: error.message,
            stack: error.stack,
            access_key: WEB3FORMS_ACCESS_KEY ? 'Set' : 'Missing'
        })
        alert(`Error: ${error.message}\n\nCheck the browser console (F12) for more details.\n\nCommon issues:\n- Email not verified at web3forms.com\n- Invalid access key\n- Network/CORS issue`)
    } finally {
        // Re-enable button
        submitButton.disabled = false
        submitButton.textContent = originalButtonText
    }
})


// LocalStorage persistence functions
function saveFormData() {
    const formData = {
        startDate: startDate.value,
        endDate: endDate.value,
        totalScenes: totalScenes.value,
        totalDone: totalDone.value,
        daysPerWeek: daysPerWeek.value,
        resultHTML: result.innerHTML,
        resultClass: result.className,
        totalDaysDisplayText: totalDaysDisplay.textContent,
        daysPreppingText: daysPrepping.textContent
    }
    localStorage.setItem('scenesPerDayData', JSON.stringify(formData))
}

function loadFormData() {
    const savedData = localStorage.getItem('scenesPerDayData')
    if (savedData) {
        try {
            const formData = JSON.parse(savedData)
            if (formData.startDate) startDate.value = formData.startDate
            if (formData.endDate) endDate.value = formData.endDate
            if (formData.totalScenes) totalScenes.value = formData.totalScenes
            if (formData.totalDone) totalDone.value = formData.totalDone
            if (formData.daysPerWeek) daysPerWeek.value = formData.daysPerWeek
            
            // Restore display calculations
            if (formData.startDate && formData.endDate) {
                totalDays()
                if (formData.daysPerWeek) {
                    totalDaysPrepping()
                }
            }
            
            // Restore result if it was calculated before
            if (formData.resultHTML && formData.resultHTML.trim() !== '') {
                result.innerHTML = formData.resultHTML
                result.className = formData.resultClass || ''
            }
            
            // Restore other display texts
            if (formData.totalDaysDisplayText) {
                totalDaysDisplay.textContent = formData.totalDaysDisplayText
            }
            if (formData.daysPreppingText) {
                daysPrepping.textContent = formData.daysPreppingText
            }
        } catch (error) {
            console.error('Error loading saved data:', error)
        }
    }
}

// Save data on input change
function setupAutoSave() {
    startDate.addEventListener('change', () => {
        totalDays()
        saveFormData()
    })
    endDate.addEventListener('change', () => {
        totalDays()
        saveFormData()
    })
    totalScenes.addEventListener('input', saveFormData)
    totalDone.addEventListener('input', saveFormData)
    daysPerWeek.addEventListener('change', () => {
        totalDaysPrepping()
        saveFormData()
    })
}

// Save result when calculate button is clicked
const originalCalculateHandler = () => {
    scenesPerDay()
    saveFormData() // Save after calculation
}

// Load saved data on page load
loadFormData()

// Add event listeners
setupAutoSave()
calculate.addEventListener('click', originalCalculateHandler)

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && feedbackModal.classList.contains('active')) {
        feedbackModal.classList.remove('active')
        document.body.style.overflow = ''
    }
})