document.getElementById('invitationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const resultDiv = document.getElementById('result');
  const submitButton = document.querySelector('button[type="submit"]');
  const progressBar = document.querySelector('.progress-bar');
  const progress = document.querySelector('.progress');

  // Check if hCaptcha is completed
  const hCaptchaResponse = hcaptcha.getResponse();
  if (!hCaptchaResponse) {
    resultDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 請完成人機驗證。';
    resultDiv.className = 'result error animate__animated animate__fadeInUp';
    document.querySelector('.container').classList.add('shake');
    
    // 移除抖動效果，以便可以再次觸發
    setTimeout(() => {
      document.querySelector('.container').classList.remove('shake');
    }, 1000);
    
    return;
  }

  // 禁用按鈕並顯示加載狀態
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 發送中...';

  // 顯示進度條
  progressBar.style.display = 'block';
  gsap.to(progress, {duration: CONFIG.progressDuration, width: '100%', ease: "power1.inOut"});

  fetch(CONFIG.scriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `email=${encodeURIComponent(email)}&h-captcha-response=${encodeURIComponent(hCaptchaResponse)}`
  })
  .then(response => {
    // 由於 'no-cors' 模式，我們無法讀取實際的回應內容
    // 我們假設請求成功
    resultDiv.innerHTML = '<i class="fas fa-check-circle"></i> 邀請碼已發送到您的郵箱，請查收。';
    resultDiv.className = 'result success animate__animated animate__fadeInUp';
    showInfoModal();
    startCountdown(CONFIG.cooldownTime); // 8小時倒計時
  })
  .catch(error => {
    console.error('Error:', error);
    resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> 發送失敗，請稍後再試。';
    resultDiv.className = 'result error animate__animated animate__fadeInUp';
    document.querySelector('.container').classList.add('shake');
    
    setTimeout(() => {
      document.querySelector('.container').classList.remove('shake');
    }, 1000);
  })
  .finally(() => {
    // 恢復按鈕狀態
    submitButton.disabled = false;
    submitButton.innerHTML = '發送邀請碼';
    
    // 隱藏進度條
    gsap.to(progressBar, {duration: 0.5, opacity: 0, onComplete: () => {
      progressBar.style.display = 'none';
      progress.style.width = '0%';
    }});
    
    // 顯示結果
    gsap.to(resultDiv, {duration: 0.5, opacity: 1, y: 0, ease: "power2.out"});

    // Reset hCaptcha
    hcaptcha.reset();
  });
});

function startCountdown(seconds) {
  const countdownDiv = document.getElementById('countdown');
  const submitBtn = document.getElementById('submitBtn');
  
  function updateCountdown() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    countdownDiv.textContent = `下次可申請時間：${hours}小時${minutes}分鐘${remainingSeconds}秒`;
    
    if (seconds > 0) {
      seconds--;
      setTimeout(updateCountdown, 1000);
    } else {
      countdownDiv.textContent = '';
      submitBtn.disabled = false;
    }
  }
  
  submitBtn.disabled = true;
  updateCountdown();
}

// 添加輸入框聚焦效果
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('focus', () => {
    gsap.to(input, {duration: CONFIG.animationDuration, scale: 1.05, ease: "power2.out"});
  });
  input.addEventListener('blur', () => {
    gsap.to(input, {duration: CONFIG.animationDuration, scale: 1, ease: "power2.out"});
  });
});

// 添加按鈕懸停效果
const button = document.querySelector('button[type="submit"]');
button.addEventListener('mouseenter', () => {
  if (!button.disabled) {
    gsap.to(button, {duration: CONFIG.animationDuration, scale: 1.05, ease: "power2.out"});
  }
});
button.addEventListener('mouseleave', () => {
  gsap.to(button, {duration: CONFIG.animationDuration, scale: 1, ease: "power2.out"});
});

// 模態框功能
const modal = document.getElementById("infoModal");
const span = document.getElementsByClassName("close")[0];

function showInfoModal() {
  modal.style.display = "block";
  gsap.from(".modal-content", {duration: 0.5, opacity: 0, y: -50, ease: "back.out(1.7)"});
  gsap.from(".guide-step", {duration: 0.5, opacity: 0, x: window.innerWidth <= 768 ? 0 : -30, y: window.innerWidth <= 768 ? -20 : 0, stagger: 0.1, ease: "power2.out", delay: 0.3});
  gsap.from(".notice", {duration: 0.5, opacity: 0, y: 20, ease: "power2.out", delay: 0.6});
}

span.onclick = function() {
  gsap.to(".modal-content", {
    duration: 0.3, 
    opacity: 0, 
    y: -50, 
    ease: "power2.in",
    onComplete: () => {
      modal.style.display = "none";
    }
  });
}

window.onclick = function(event) {
  if (event.target == modal) {
    gsap.to(".modal-content", {
      duration: 0.3, 
      opacity: 0, 
      y: -50, 
      ease: "power2.in",
      onComplete: () => {
        modal.style.display = "none";
      }
    });
  }
}

// 安全措施
// 防止複製
document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
});

// 防止截圖 (僅適用於部分瀏覽器)
document.addEventListener('keyup', function(e) {
    if (e.key == 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('截圖功能已被禁用');
    }
});

// 防止右鍵點擊
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// 防止拖曳選擇文字
document.onselectstart = function() {
    return false;
};

// 手機版選單切換
const menuIcon = document.getElementById('menuIcon');
const navMenu = document.getElementById('navMenu');

menuIcon.addEventListener('click', function(e) {
  e.stopPropagation(); // 防止事件冒泡
  toggleMenu();
});

function toggleMenu() {
  navMenu.classList.toggle('active');
  
  if (navMenu.classList.contains('active')) {
    menuIcon.innerHTML = '<i class="fas fa-times"></i>';
    // 確保菜單顯示
    navMenu.style.display = 'flex';
    navMenu.style.right = '0';
    
    gsap.from(".nav-menu a", {duration: 0.3, opacity: 0, x: 20, stagger: 0.1, ease: "power2.out"});
  } else {
    menuIcon.innerHTML = '<i class="fas fa-bars"></i>';
    // 動畫結束後隱藏菜單
    gsap.to(navMenu, {
      right: '-280px',
      duration: 0.3,
      onComplete: function() {
        navMenu.style.display = '';
      }
    });
  }
}

// 添加點擊頁面其他區域關閉菜單的功能
document.addEventListener('click', function(event) {
  const isMenuIcon = event.target.closest('#menuIcon');
  const isNavMenu = event.target.closest('#navMenu');
  
  if (!isMenuIcon && !isNavMenu && navMenu.classList.contains('active')) {
    toggleMenu();
  }
});

// 添加響應式檢測，自動調整元素
function checkMobileView() {
  if (window.innerWidth <= 768) {
    // 在移動設備上自動調整 hCaptcha 的容器尺寸
    const hCaptchaContainer = document.querySelector('.h-captcha-container');
    if (hCaptchaContainer) {
      if (window.innerWidth <= 320) {
        hCaptchaContainer.style.transformOrigin = 'left top';
        hCaptchaContainer.style.transform = 'scale(0.68)';
      } else if (window.innerWidth <= 480) {
        hCaptchaContainer.style.transformOrigin = 'left top';
        hCaptchaContainer.style.transform = 'scale(0.77)';
      } else {
        hCaptchaContainer.style.transformOrigin = 'left top';
        hCaptchaContainer.style.transform = 'scale(0.85)';
      }
    }
    
    // 調整菜單樣式為移動版
    const navMenu = document.getElementById('navMenu');
    if (navMenu && !navMenu.classList.contains('active')) {
      navMenu.style.display = '';
      navMenu.style.right = '-280px';
    }
  } else {
    // 重置為桌面版佈局
    const hCaptchaContainer = document.querySelector('.h-captcha-container');
    if (hCaptchaContainer) {
      hCaptchaContainer.style.transform = 'none';
    }
    
    // 調整菜單樣式為桌面版
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
      navMenu.style.display = 'flex';
      navMenu.style.right = '0';
    }
  }
}

// 首次加載和窗口大小變化時檢查
window.addEventListener('load', checkMobileView);
window.addEventListener('resize', checkMobileView);

// 添加粒子背景效果
function setupParticles() {
  // 移除粒子效果，改為背景形狀
  return;
}

// 添加波浪SVG效果
function setupWaveSVG() {
  // 移除波浪效果，改為背景形狀
  return;
}

// 初始化頁面動畫
document.addEventListener('DOMContentLoaded', function() {
  // 使用GSAP動畫庫為背景形狀添加動畫
  const shapes = document.querySelectorAll('.shape');
  
  shapes.forEach((shape, index) => {
    gsap.to(shape, {
      x: Math.random() * 50 - 25,
      y: Math.random() * 50 - 25,
      scale: 0.9 + Math.random() * 0.3,
      duration: 15 + Math.random() * 10,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: index * 0.5
    });
  });
  
  // 標題文字效果
  gsap.from("h2", {
    opacity: 0,
    y: -20,
    duration: 1,
    ease: "power2.out"
  });
  
  // 表單元素淡入
  gsap.from("form", {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 0.3,
    ease: "power2.out"
  });
  
  // 圖標動畫
  gsap.from(".icon", {
    opacity: 0,
    scale: 0.5,
    duration: 1,
    delay: 0.2,
    ease: "back.out(1.7)"
  });
  
  // 確保菜單初始狀態正確
  const navMenu = document.getElementById('navMenu');
  const menuIcon = document.getElementById('menuIcon');
  
  // 重置菜單狀態
  navMenu.classList.remove('active');
  menuIcon.innerHTML = '<i class="fas fa-bars"></i>';
  
  // 在移動設備上設置正確的初始樣式
  if (window.innerWidth <= 768) {
    navMenu.style.display = '';
    navMenu.style.right = '-280px';
  }
});