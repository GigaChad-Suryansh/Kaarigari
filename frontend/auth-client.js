/* Kaarigari production OTP client. Loaded by the main app to replace demo OTP behavior. */
(() => {
  const API = `${location.protocol}//${location.hostname}:8000`;
  let otpPhone = '';
  let otpRole = 'customer';
  let resendTimer = null;

  async function post(path, body) {
    const response = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  function toastSafe(message) {
    if (typeof window.toast === 'function') window.toast(message);
    else console.log(message);
  }

  window.kaarigariRealOtp = {
    chooseRole(role) {
      otpRole = role;
      const loginStep = document.getElementById('loginStep');
      const otpStep = document.getElementById('otpStep');
      if (loginStep) loginStep.style.display = 'none';
      if (otpStep) otpStep.style.display = 'block';
    },
    async sendOtp() {
      const input = document.getElementById('phone');
      const phone = String(input?.value || '').replace(/\D/g, '').slice(-10);
      if (phone.length !== 10) return toastSafe('Enter a valid 10-digit mobile number');
      try {
        const data = await post('/api/auth/send-otp', { phone });
        otpPhone = phone;
        document.getElementById('otpStep').style.display = 'none';
        document.getElementById('verifyStep').style.display = 'block';
        const hint = document.querySelector('#verifyStep p');
        if (hint) hint.textContent = data.message || 'OTP sent to your mobile number.';
        startResendCountdown();
        toastSafe('OTP sent successfully');
      } catch (error) { toastSafe(error.message); }
    },
    async verifyOtp() {
      const otp = String(document.getElementById('otp')?.value || '').trim();
      if (!/^\d{6}$/.test(otp)) return toastSafe('Enter the 6-digit OTP');
      try {
        const data = await post('/api/auth/verify-otp', { phone: otpPhone, otp, role: otpRole });
        localStorage.setItem('kaarigari_session', JSON.stringify({ token: data.token, role: data.role, phone: otpPhone }));
        if (data.role === 'seller') {
          document.getElementById('login')?.classList.remove('show');
          document.getElementById('customerView')?.style.setProperty('display', 'none');
          document.getElementById('sellerView')?.classList.add('show');
        } else {
          location.href = 'customer.html';
        }
        toastSafe('Login successful');
      } catch (error) { toastSafe(error.message); }
    }
  };

  function startResendCountdown() {
    const button = document.querySelector('#otpStep button');
    if (!button) return;
    clearInterval(resendTimer);
    let seconds = 30;
    button.disabled = true;
    const original = 'Send OTP';
    const tick = () => {
      button.textContent = seconds ? `Resend in ${seconds}s` : original;
      if (!seconds) { button.disabled = false; clearInterval(resendTimer); }
      seconds -= 1;
    };
    tick();
    resendTimer = setInterval(tick, 1000);
  }
})();
