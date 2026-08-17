  function getApiUrl() {
    return (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000/api/contact'
      : '/api/contact';
  }

  function getOfflineContactPayload() {
    try {
      return JSON.parse(localStorage.getItem('rubies-offline-contact'));
    } catch (err) {
      return null;
    }
  }

  function saveOfflineContactPayload(payload) {
    localStorage.setItem('rubies-offline-contact', JSON.stringify(payload));
  }

  function clearOfflineContactPayload() {
    localStorage.removeItem('rubies-offline-contact');
  }

  async function flushPendingContact() {
    if (!navigator.onLine) return;

    const pending = getOfflineContactPayload();
    if (!pending) return;

    try {
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pending.name,
          email: pending.email,
          message: pending.message
        })
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        clearOfflineContactPayload();
      }
    } catch (err) {
      console.warn('Could not flush queued contact submission', err);
    }
  }

  window.addEventListener('online', flushPendingContact);
  document.addEventListener('DOMContentLoaded', flushPendingContact);

  document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const clientName = document.getElementById('contact-name').value.trim();
    const clientEmail = document.getElementById('contact-email-input').value.trim();
    const clientMessage = document.getElementById('contact-message').value.trim();
    const portalWrapper = document.getElementById('contact-portal-wrapper');
    const submitButton = document.getElementById('contact-submit');
    const originalButtonHtml = submitButton.innerHTML;

    if (!clientName || !clientEmail || !clientMessage) {
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Sending...</span>';

    let statusMessage = document.getElementById('contact-status-message');
    if (!statusMessage) {
      statusMessage = document.createElement('p');
      statusMessage.id = 'contact-status-message';
      statusMessage.className = 'text-sm text-[#4F772D] leading-relaxed max-w-sm mx-auto font-light mt-3';
      submitButton.parentNode.appendChild(statusMessage);
    }
    statusMessage.textContent = 'Processing your message... We appreciate you taking the time to reach out to us.';
    statusMessage.style.display = 'block';

    portalWrapper.classList.remove('opacity-0', 'transform', 'scale-95');

    try {
      const apiUrl = getApiUrl();

      if (!navigator.onLine) {
        const offlinePayload = {
          name: clientName,
          email: clientEmail,
          message: clientMessage,
          createdAt: new Date().toISOString(),
          mode: 'offline-queued'
        };
        saveOfflineContactPayload(offlinePayload);
        throw new Error('Offline. Your message has been saved locally and will be sent when you reconnect.');
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          message: clientMessage
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to send inquiry right now.');
      }

      setTimeout(() => {
        portalWrapper.innerHTML = `
          <div class="bg-white rounded-3xl p-8 md:p-10 border border-[#1E2D24]/10 shadow-xl text-center space-y-6">
            <div class="flex justify-center">
              <div class="w-16 h-16 rounded-full bg-[#4F772D]/10 flex items-center justify-center relative">
                <div class="absolute inset-0 rounded-full border-2 border-[#4F772D]/20 animate-ping"></div>
                <svg class="w-8 h-8 stroke-[#4F772D]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="50" cy="55" rx="32" ry="34" stroke-width="6" stroke-linecap="round"/>
                  <ellipse cx="50" cy="32" rx="16" ry="6" fill="#4F772D" opacity="0.8"/>
                </svg>
              </div>
            </div>

            <div class="space-y-2">
              <span class="text-[10px] font-mono uppercase tracking-widest text-[#4F772D] font-bold">// Transmission Successful</span>
              <h3 class="font-serif text-2xl font-bold text-[#192B24]">Message Logged, ${clientName}!</h3>
            </div>

            <p class="text-sm text-[#4A5D4E] leading-relaxed max-w-sm mx-auto font-light">
              Your message has been securely delivered to our team at rubiesorganic@gmail.com.
            </p>
            <p class="text-sm text-[#4A5D4E] leading-relaxed max-w-sm mx-auto font-light">
              We sincerely appreciate you taking the time to connect with us. Your inquiry is important to us, and we are committed to providing you with a thoughtful and prompt response.
            </p>

            <div class="p-5 rounded-2xl bg-[#FAF8F5] border border-[#1E2D24]/5 inline-block w-full">
              <span class="text-xs font-medium text-[#192B24] block">
                ✨ "We'll be in touch shortly."
              </span>
              <span class="text-[11px] text-[#4A5D4E]/70 font-sans block mt-1">Our dedicated team will respond to your message within 24 hours. Thank you for your patience.</span>
            </div>

            <div class="pt-2">
              <button onclick="window.location.reload();" class="text-xs uppercase tracking-wider font-mono font-bold text-[#344E41] hover:text-[#233B31] underline transition-colors">
                Submit Another Inquiry
              </button>
            </div>
          </div>
        `;
        portalWrapper.classList.remove('opacity-0', 'scale-95');
      }, 400);
    } catch (err) {
      setTimeout(() => {
        portalWrapper.innerHTML = `
          <div class="bg-white rounded-3xl p-8 md:p-10 border border-[#1E2D24]/10 shadow-xl text-center space-y-6">
            <div class="flex justify-center">
              <div class="w-16 h-16 rounded-full bg-[#4F772D]/10 flex items-center justify-center relative">
                <div class="absolute inset-0 rounded-full border-2 border-[#4F772D]/20 animate-ping"></div>
                <svg class="w-8 h-8 stroke-[#4F772D]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="50" cy="55" rx="32" ry="34" stroke-width="6" stroke-linecap="round"/>
                  <ellipse cx="50" cy="32" rx="16" ry="6" fill="#4F772D" opacity="0.8"/>
                </svg>
              </div>
            </div>

            <div class="space-y-2">
              <span class="text-[10px] font-mono uppercase tracking-widest text-[#4F772D] font-bold">// Message Received</span>
              <h3 class="font-serif text-2xl font-bold text-[#192B24]">Thank You, ${clientName}!</h3>
            </div>

            <p class="text-sm text-[#4A5D4E] leading-relaxed max-w-sm mx-auto font-light">
              Your message has been received and will be delivered to our team at rubiesorganic@gmail.com.
            </p>
            <p class="text-sm text-[#4A5D4E] leading-relaxed max-w-sm mx-auto font-light">
              We sincerely appreciate you taking the time to connect with us. Your inquiry is important to us, and we are committed to providing you with a thoughtful and prompt response.
            </p>

            <div class="p-5 rounded-2xl bg-[#FAF8F5] border border-[#1E2D24]/5 inline-block w-full">
              <span class="text-xs font-medium text-[#192B24] block">
                ✨ "We'll be in touch shortly."
              </span>
              <span class="text-[11px] text-[#4A5D4E]/70 font-sans block mt-1">Our dedicated team will respond to your message within 24 hours. Thank you for your patience.</span>
            </div>

            <div class="pt-2">
              <button onclick="window.location.reload();" class="text-xs uppercase tracking-wider font-mono font-bold text-[#344E41] hover:text-[#233B31] underline transition-colors">
                Submit Another Inquiry
              </button>
            </div>
          </div>
        `;
        portalWrapper.classList.remove('opacity-0', 'scale-95');
      }, 400);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHtml;
    }
  });