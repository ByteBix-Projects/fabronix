document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. STICKY HEADER & SCROLL SPY
       ========================================================================== */
    const header = document.getElementById('siteHeader');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky Header toggle class
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Spy active nav classes
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset header height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial run

    /* ==========================================================================
       2. MOBILE HAMBURGER MENU
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    const toggleMobileNav = () => {
        mobileNav.classList.toggle('open');
        mobileMenuBtn.classList.toggle('active');
    };

    mobileMenuBtn.addEventListener('click', toggleMobileNav);

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target) && mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
            mobileMenuBtn.classList.remove('active');
        }
    });

    /* ==========================================================================
       3. DRAG & DROP FILE ZONE VISUALIZATION
       ========================================================================== */
    const fileDropzone = document.getElementById('fileDropzone');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const previewFilename = document.getElementById('previewFilename');
    const removeFileBtn = document.getElementById('removeFileBtn');
    const dropzoneText = fileDropzone.querySelector('.dropzone-text');
    const dropzoneIcon = fileDropzone.querySelector('.dropzone-icon');

    // Trigger click on input
    fileDropzone.addEventListener('click', (e) => {
        if (e.target !== removeFileBtn && !removeFileBtn.contains(e.target)) {
            fileInput.click();
        }
    });

    // Drag-over styling
    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            fileDropzone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            fileDropzone.classList.remove('dragover');
        }, false);
    });

    // Handle dropped files
    fileDropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            fileInput.files = files;
            updateFilePreview(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length) {
            updateFilePreview(fileInput.files[0]);
        }
    });

    // Update Preview Container
    function updateFilePreview(file) {
        previewFilename.textContent = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        filePreview.style.display = 'flex';
        dropzoneText.style.display = 'none';
        dropzoneIcon.style.display = 'none';
        fileDropzone.style.borderColor = 'var(--accent)';
    }

    // Remove Selected File
    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        filePreview.style.display = 'none';
        dropzoneText.style.display = 'block';
        dropzoneIcon.style.display = 'block';
        fileDropzone.style.borderColor = 'var(--border-color)';
    });

    /* ==========================================================================
       4. B2B FORM SUBMISSION SIMULATION
       ========================================================================== */
    const leadForm = document.getElementById('leadForm');
    const formSuccessCard = document.getElementById('formSuccessCard');
    const submitFormBtn = document.getElementById('submitFormBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Form Validation Check
        if (!leadForm.checkValidity()) {
            leadForm.reportValidity();
            return;
        }

        // Visual feedback during "Upload / Processing"
        submitFormBtn.disabled = true;
        submitFormBtn.textContent = 'Uploading Technical Package...';

        setTimeout(() => {
            // Hide Form and display Success Card
            leadForm.style.display = 'none';
            formSuccessCard.style.display = 'flex';
            
            // Scroll to the contact section so success card is centered
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, 1500);
    });

    resetFormBtn.addEventListener('click', () => {
        // Reset inputs
        leadForm.reset();
        
        // Clear file input representation
        filePreview.style.display = 'none';
        dropzoneText.style.display = 'block';
        dropzoneIcon.style.display = 'block';
        fileDropzone.style.borderColor = 'var(--border-color)';
        
        // Swap views
        formSuccessCard.style.display = 'none';
        leadForm.style.display = 'block';
        submitFormBtn.disabled = false;
        submitFormBtn.textContent = 'Submit Request for Quote';
    });

    /* ==========================================================================
       5. DYNAMIC WHATSAPP B2B PRE-FILL MESSAGE
       ========================================================================== */
    const whatsappBtn = document.querySelector('.btn-whatsapp');
    const clientNameInput = document.getElementById('clientName');
    const companyNameInput = document.getElementById('companyName');
    const productCategorySelect = document.getElementById('productCategory');
    const productQuantityInput = document.getElementById('productQuantity');

    const updateWhatsAppLink = () => {
        const name = clientNameInput.value.trim();
        const company = companyNameInput.value.trim();
        const qty = productQuantityInput.value.trim();
        const productVal = productCategorySelect.value;
        
        let productText = '';
        if (productVal) {
            const selectOptions = productCategorySelect.options;
            productText = selectOptions[productCategorySelect.selectedIndex].text;
        }

        let msg = "Hello Fabronix, I'm interested in custom metal fabrication.";
        
        if (name || company || productText || qty) {
            msg = `Hello Fabronix, this is ${name || 'an inquirer'}`;
            if (company) msg += ` from ${company}`;
            if (productText) msg += `. We require ${productText}`;
            if (qty) msg += ` (Estimated quantity: ${qty})`;
            msg += ". Please share engineering feasibility details.";
        }

        const encodedMsg = encodeURIComponent(msg);
        const waUrl = `https://wa.me/918530554858?text=${encodedMsg}`;
        
        // Update direct link buttons (both floating button and form quick link)
        whatsappBtn.setAttribute('href', waUrl);
        
        const floatingWa = document.querySelector('.whatsapp-sticky-btn');
        if (floatingWa) {
            floatingWa.setAttribute('href', waUrl);
        }
    };

    // Watch key elements to prefill WhatsApp message on click
    [clientNameInput, companyNameInput, productCategorySelect, productQuantityInput].forEach(elem => {
        elem.addEventListener('input', updateWhatsAppLink);
    });

    // Initial trigger
    updateWhatsAppLink();
});
