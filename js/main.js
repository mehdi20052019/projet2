/*
  PowerShield Pro interactions.
  Keeps behavior separate from markup: quantity controls, FAQ accordion,
  reveal animations, capacity switching (2KVA/3KVA), and order button feedback all live here.
*/
(function () {
  let qty = 1;
  let isInitialized = false;

  // مصفوفة البيانات الخاصة بالمنتجات لتغيير المحتوى ديناميكيًا
  const productsData = {
  '1kva': {
    image: 'KVA123.png', 
    power: '1KVA',
    rack: '2U',
    efficiency: '99%',
    battery: '2 x 9A'
  },
  '2kva': {
    image: 'KVA123.png', 
    power: '2KVA',
    rack: '2U',
    efficiency: '99%',
    battery: '3 x 9A'
  },
  '3kva': {
    image: 'KVA123.png', 
    power: '3KVA',
    rack: '2U',
    efficiency: '99%',
    battery: '4 x 9A'
  }
};

  function updateQuantity(delta) {
    const display = document.getElementById('qtyDisplay');
    if (!display) return;

    qty = Math.max(1, Math.min(10, qty + delta));
    display.textContent = qty;
  }

  function toggleFaq(question) {
    const item = question.closest('.faq-item');
    if (!item) return;

    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((faqItem) => faqItem.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  // دالة تبديل المنتجات الذكية مع تأثير التلاشي (Fade Effect)
  function switchProduct(key, clickedBtn) {
    if (!productsData[key]) return;

    // تحديث حالة الأزرار النشطة (Active State) داخل حاضن التبديل
    const selector = clickedBtn.closest('.capacity-selector');
    if (selector) {
      selector.querySelectorAll('.cap-btn').forEach(btn => btn.classList.remove('active'));
    }
    clickedBtn.classList.add('active');

    const imgElement = document.getElementById('ups-product-img');
    if (!imgElement) return;
    
    // إضافة تأثير تلاشي سلس للخروج (Fade out)
    imgElement.classList.add('image-fade-out');
    
    setTimeout(() => {
      // تغيير الصورة والمواصفات بناءً على المفتاح المختار
      imgElement.src = productsData[key].image;
      
      const specPower = document.getElementById('spec-power');
      const specRack = document.getElementById('spec-rack');
      const specEfficiency = document.getElementById('spec-efficiency');
      const specBattery = document.getElementById('spec-battery');

      if (specPower) specPower.textContent = productsData[key].power;
      if (specRack) specRack.textContent = productsData[key].rack;
      if (specEfficiency) specEfficiency.textContent = productsData[key].efficiency;
      if (specBattery) specBattery.textContent = productsData[key].battery;
      
      // إزالة تأثير التلاشي لتعود الصورة للظهور بشكل سلس (Fade in)
      imgElement.classList.remove('image-fade-out');
    }, 300);
  }

  function submitOrder(button) {
    const submitButton = button || document.querySelector('.btn-submit');
    if (!submitButton) return;

    submitButton.textContent = '⏳ جاري الإرسال...';
    submitButton.classList.add('is-submitting');
    submitButton.classList.remove('is-success');

    setTimeout(() => {
      submitButton.textContent = '✅ تم إرسال طلبك! سنتصل بك قريباً';
      submitButton.classList.remove('is-submitting');
      submitButton.classList.add('is-success');
    }, 1500);
  }

  function initRevealAnimations() {
    const revealItems = document.querySelectorAll('.reveal');
    if (!revealItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    revealItems.forEach((element) => observer.observe(element));
  }

  function initEvents() {
    document.addEventListener('click', (event) => {
      // 1. التحكم في الكمية
      const qtyButton = event.target.closest('[data-qty-delta]');
      if (qtyButton) {
        updateQuantity(Number(qtyButton.dataset.qtyDelta));
        return;
      }

      // 2. التبديل الديناميكي لسعة الـ KVA
      const capButton = event.target.closest('.cap-btn[data-kva]');
      if (capButton) {
        switchProduct(capButton.dataset.kva, capButton);
        return;
      }

      // 3. الأكورديون (FAQ)
      const faqQuestion = event.target.closest('.faq-q');
      if (faqQuestion) {
        toggleFaq(faqQuestion);
        return;
      }

      // 4. إرسال الطلب
      const submitButton = event.target.closest('[data-submit-order]');
      if (submitButton) {
        submitOrder(submitButton);
      }
    });
  }

  function initPage() {
    if (isInitialized) return;
    isInitialized = true;

    initEvents();
    initRevealAnimations();

    setTimeout(() => {
      const firstFaq = document.querySelector('.faq-item');
      if (firstFaq) firstFaq.classList.add('open');
    }, 500);
  }

  document.addEventListener('sections:loaded', initPage, { once: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage, { once: true });
  } else {
    initPage();
  }
}());