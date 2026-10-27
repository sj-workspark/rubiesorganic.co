const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const clientName = document.getElementById('contact-name').value.trim();
    const clientEmail = document.getElementById('contact-email-input').value.trim();
    const clientMessage = document.getElementById('contact-message').value.trim();
    const whatsappLink = document.getElementById('contact-phone-display');
    const portalWrapper = document.getElementById('contact-portal-wrapper');
    const supportNumber = new URL(whatsappLink.href).pathname.replace(/\D/g, '');

    if (!supportNumber) {
      const statusMessage = document.getElementById('contact-status-message');
      statusMessage.textContent = 'We could not find the support number. Please use the WhatsApp Help & Support button instead.';
      statusMessage.hidden = false;
      return;
    }

    const message = [
      'Hello Rubies Organic Quick Support,',
      '',
      clientMessage,
      '',
      `Name: ${clientName}`,
      `Email: ${clientEmail}`
    ].join('\n');
    const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      ? '&'
      : '?';
    const smsUrl = `sms:+${supportNumber}${separator}body=${encodeURIComponent(message)}`;

    portalWrapper.innerHTML = `
      <section class="bg-white rounded-3xl p-8 md:p-10 border border-[#1E2D24]/10 shadow-xl text-center space-y-6" aria-labelledby="contact-confirmation-heading">
        <div class="mx-auto w-16 h-16 rounded-full bg-[#4F772D]/10 flex items-center justify-center">
          <svg class="w-8 h-8 stroke-[#4F772D]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12 4 4L19 6"/>
          </svg>
        </div>
        <div class="space-y-2">
          <span class="text-[10px] font-mono uppercase tracking-widest text-[#4F772D] font-bold">// Quick Support</span>
          <h2 id="contact-confirmation-heading" class="font-serif text-2xl md:text-3xl font-bold text-[#192B24]">Your message is ready, <span id="contact-confirmation-name"></span>.</h2>
        </div>
        <p class="text-sm text-[#4A5D4E] leading-relaxed max-w-md mx-auto">
          Send your text to our Quick Support team. Once they receive it, the support centre will get back to you as soon as possible.
        </p>
        <p class="text-xs text-[#4A5D4E]/70">
          Your SMS app will open with your message addressed to +${supportNumber}. Tap Send there to deliver it.
        </p>
        <div class="space-y-3 pt-2">
          <a id="contact-confirmation-sms" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-[#123321] font-bold text-sm px-6 py-4 transition-colors focus:outline-none focus:ring-2 focus:ring-[#233B31] focus:ring-offset-2">
            Open SMS and Send Message <span aria-hidden="true">↗</span>
          </a>
          <button id="contact-return-home" type="button" class="w-full rounded-xl bg-[#344E41] hover:bg-[#233B31] text-white py-4 px-6 font-bold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-[#344E41] focus:ring-offset-2">
            Return to Home &amp; Continue Shopping
          </button>
        </div>
      </section>
    `;

    document.getElementById('contact-confirmation-name').textContent = clientName;
    document.getElementById('contact-confirmation-sms').href = smsUrl;
    document.getElementById('contact-return-home').addEventListener('click', function() {
      navigateTo('home');
    });
  });
}
