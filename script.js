/* ============================================================
   Askari Horizon Officers Academy — Application Logic
   File: script.js
   Description: All interactive JavaScript for the portal.
                Handles SPA navigation, form submission,
                slip generation, and input formatting.
   ============================================================ */
// AUTO-FORMAT CNIC: enforces XXXXX-XXXXXXX-X as user types
        document.addEventListener('DOMContentLoaded', function () {
            const cnicInput = document.getElementById('reg-cnic');
            if (cnicInput) {
                cnicInput.addEventListener('input', function () {
                    let val = this.value.replace(/[^0-9]/g, '');
                    if (val.length > 5 && val.length <= 12) val = val.slice(0,5) + '-' + val.slice(5);
                    else if (val.length > 12) val = val.slice(0,5) + '-' + val.slice(5,12) + '-' + val.slice(12,13);
                    this.value = val;
                });
            }
        });

        // AUTO-FORMAT PHONE: enforces XXXX-XXXXXXX as user types
        function formatPhone(el) {
    if (!el) return;
    let val = el.value.replace(/[^0-9]/g, '');
    if (val.length > 4) val = val.slice(0,4) + '-' + val.slice(4,11);
    el.value = val;
}

// PAGE NAVIGATION SWITCHER
function switchPage(pageId) {
            const pages = document.querySelectorAll('.page-content');
            pages.forEach(p => p.classList.add('hidden'));

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.className = "nav-link text-slate-300 hover:text-gold-400 px-3 py-2 transition";
    });

    const activeBtn = document.getElementById('nav-' + pageId);
    if (activeBtn) {
        activeBtn.className = "nav-link text-gold-400 border-b-2 border-gold-500 px-3 py-2 transition font-bold";
    }

    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileDrawer) {
        mobileDrawer.classList.add('hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// TOGGLE MOBILE NAVIGATION DRAWER
function toggleMobileNav() {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) {
        drawer.classList.toggle('hidden');
    }
}

// TOGGLE COURSE DURATION TABS (4-WEEK vs 6-DAY)
function toggleCourseTab(type) {
    const btn4 = document.getElementById('tab-btn-4week');
    const btn6 = document.getElementById('tab-btn-6day');
    const view4 = document.getElementById('course-4week');
    const view6 = document.getElementById('course-6day');

    if (!btn4 || !btn6 || !view4 || !view6) return;

    if (type === '4week') {
        btn4.className = "px-6 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition bg-gold-500 text-navy-950";
        btn6.className = "px-6 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition text-slate-300 hover:text-white";
        view4.classList.remove('hidden');
        view6.classList.add('hidden');
    } else {
        btn6.className = "px-6 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition bg-gold-500 text-navy-950";
        btn4.className = "px-6 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider transition text-slate-300 hover:text-white";
        view6.classList.remove('hidden');
        view4.classList.add('hidden');
    }
}

// PRE-SELECT COURSE FROM PRICING CARDS AND SWITCH TO REGISTER
function selectCourseAndRegister(courseName) {
    switchPage('register');
    const selectEl = document.getElementById('reg-course');
    if (selectEl) {
        selectEl.value = courseName;
    }
}

function validateRegistrationInput(fieldName, value) {
    const trimmed = value.trim();

    if (!trimmed) {
        return `${fieldName} is required.`;
    }

    if (fieldName === 'CNIC' && !/^\d{5}-\d{7}-\d{1}$/.test(trimmed)) {
        return 'CNIC must follow the format: 37405-1234567-1';
    }

    if (fieldName === 'Phone' && !/^\d{4}-\d{7}$/.test(trimmed)) {
        return 'Phone must follow the format 03XX-XXXXXXX.';
    }

    if (fieldName === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return 'Please enter a valid email address.';
    }

    return '';
}

// HANDLE FORM SUBMISSION & GENERATE PRINTABLE SLIP
function handleRegistration(e) {
    e.preventDefault();

    const form = e.target;
    const fields = {
        name: document.getElementById('reg-name'),
        fname: document.getElementById('reg-fname'),
        cnic: document.getElementById('reg-cnic'),
        phone: document.getElementById('reg-phone'),
        email: document.getElementById('reg-email'),
        district: document.getElementById('reg-district'),
        branch: document.getElementById('reg-branch'),
        course: document.getElementById('reg-course')
    };

    const data = {};
    let errorMessage = '';

    for (const [key, input] of Object.entries(fields)) {
        if (!input) continue;
        const value = input.value || '';
        const cleaned = value.trim();
        data[key] = cleaned;

        if (key === 'district' && !cleaned) {
            errorMessage = 'District is required.';
            input.focus();
            break;
        }

        if (['name', 'fname', 'branch', 'course'].includes(key) && !cleaned) {
            errorMessage = `${input.previousElementSibling?.textContent || 'This field'} is required.`;
            input.focus();
            break;
        }

        if (key === 'cnic') {
            errorMessage = validateRegistrationInput('CNIC', cleaned);
        }

        if (key === 'phone') {
            errorMessage = validateRegistrationInput('Phone', cleaned);
        }

        if (key === 'email') {
            errorMessage = validateRegistrationInput('Email', cleaned);
        }

        if (errorMessage) {
            input.focus();
            break;
        }
    }

    if (errorMessage) {
        alert(errorMessage);
        return;
    }

    const { name, fname, cnic, phone, email, district, branch, course } = data;
    const randomID = 'AH-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const submission = {
        randomID,
        name,
        fname,
        cnic,
        phone,
        email,
        district,
        branch,
        course,
        submittedAt: new Date().toISOString()
    };

    try {
        const existing = JSON.parse(localStorage.getItem('ah_registrations') || '[]');
        existing.push(submission);
        localStorage.setItem('ah_registrations', JSON.stringify(existing));
    } catch (err) {
        console.warn('Registration could not be saved locally:', err);
    }

    const slipFields = {
        id: document.getElementById('slip-id'),
        name: document.getElementById('slip-name'),
        fname: document.getElementById('slip-fname'),
        cnic: document.getElementById('slip-cnic'),
        phone: document.getElementById('slip-phone'),
        email: document.getElementById('slip-email'),
        district: document.getElementById('slip-district'),
        branch: document.getElementById('slip-branch'),
        course: document.getElementById('slip-course')
    };

    Object.entries(slipFields).forEach(([key, el]) => {
        if (!el) return;
        const value = key === 'id' ? randomID : data[key] || '';
        el.innerText = value;
    });

    const slipModal = document.getElementById('slip-modal');
    if (slipModal) {
        slipModal.classList.remove('hidden');
    }

    if (form && typeof form.reset === 'function') {
        form.reset();
    }
}

// CLOSE MODAL
function closeModal() {
    const modal = document.getElementById('slip-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}
