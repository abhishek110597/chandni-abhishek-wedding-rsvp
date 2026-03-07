document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right');

    const revealCallback = function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- RSVP Form Logic ---
    const form = document.getElementById('rsvpForm');
    const radioAttending = document.querySelectorAll('input[name="attending"]');
    const guestGroup = document.getElementById('guestCountGroup');
    const guestCountSelect = document.getElementById('guestCount');
    const customGuestGroup = document.getElementById('customGuestCountGroup');
    const dietaryGroup = document.getElementById('dietaryGroup');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    // Toggle dependent fields based on attendance
    radioAttending.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Yes') {
                guestGroup.classList.add('active');
                dietaryGroup.classList.add('active');
                // Check if 'Custom' is selected, if so make it active
                if (guestCountSelect.value === 'Custom') {
                    customGuestGroup.classList.remove('hidden');
                    customGuestGroup.classList.add('active');
                    document.getElementById('customGuestCount').disabled = false;
                    document.getElementById('customGuestCount').required = true;
                }
            } else {
                guestGroup.classList.remove('active');
                dietaryGroup.classList.remove('active');
                customGuestGroup.classList.add('hidden');
                customGuestGroup.classList.remove('active');
                document.getElementById('customGuestCount').disabled = true;
                document.getElementById('customGuestCount').required = false;
                // Optional: clear values if they select No
                document.getElementById('dietaryRestrictions').value = '';
                guestCountSelect.value = '1';
                document.getElementById('customGuestCount').value = '';
            }
        });
    });

    // Toggle custom guest count input
    guestCountSelect.addEventListener('change', (e) => {
        if (e.target.value === 'Custom') {
            customGuestGroup.classList.remove('hidden');
            customGuestGroup.classList.add('active');
            document.getElementById('customGuestCount').disabled = false;
            document.getElementById('customGuestCount').required = true;
        } else {
            customGuestGroup.classList.add('hidden');
            customGuestGroup.classList.remove('active');
            document.getElementById('customGuestCount').disabled = true;
            document.getElementById('customGuestCount').required = false;
        }
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Ensure UI updating
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        formMessage.classList.add('hidden');
        formMessage.className = 'form-message'; // reset classes

        // Grab values
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // If 'Custom' is selected, overwrite the 'guestCount' parameter in formData before sending
        if (data.guestCount === 'Custom') {
            formData.set('guestCount', data.customGuestCount);
        }

        // We will insert the Google Apps Script URL here later
        const googleScriptURL = 'https://script.google.com/macros/s/AKfycbydxbs50luidCqsUSjyYTIxdcwS8JqcjuLlbgRgAvNtbrS1BvyHknjql1SbktUnRO2E/exec';

        /* 
        ===================================================================
        Note: Currently simulating the network request for UI validation.
        Once the Google Script is written and deployed, we will uncomment
        the fetch call below and remove the setTimeout.
        ===================================================================
        */

        // SIMULATING NETWORK REQUEST FOR DEMO:
        // setTimeout(() => {
        //     submitBtn.classList.remove('loading');
        //     submitBtn.disabled = false;

        //     // Assume Success
        //     formMessage.textContent = "Thank you! Your RSVP has been received.";
        //     formMessage.classList.add('success');
        //     formMessage.classList.remove('hidden');

        //     form.reset();
        //     guestGroup.classList.remove('active');
        //     dietaryGroup.classList.remove('active');
        // }, 1500);


        // ACTUAL FETCH TO GOOGLE SCRIPT (To be uncommented later):
        fetch(googleScriptURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Required for Google Scripts web apps to prevent CORS errors on frontend
        })
            .then(response => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                formMessage.textContent = "Thank you! Your RSVP has been received.";
                formMessage.classList.add('success');
                formMessage.classList.remove('hidden');

                form.reset();
                guestGroup.classList.remove('active');
                dietaryGroup.classList.remove('active');
                customGuestGroup.classList.add('hidden');
                customGuestGroup.classList.remove('active');
                document.getElementById('customGuestCount').disabled = true;
                document.getElementById('customGuestCount').required = false;
                document.getElementById('customGuestCount').value = '';
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                formMessage.textContent = "Oops! Something went wrong. Please try again.";
                formMessage.classList.add('error');
                formMessage.classList.remove('hidden');
            });

    });

});
