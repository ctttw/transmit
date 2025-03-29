const CONFIG = {
  // Google Apps Script Web 應用部署 URL
  scriptUrl: 'https://script.google.com/macros/s/AKfycbxZlxQi1zrGXuFhk1pLMS7pRtrNsnKsU19dD0Nocr5eVcHQjjFiDrrH98AosW6Rk-B3bg/exec',
  
  // 系統設定
  hCaptchaSitekey: '10000000-ffff-ffff-ffff-000000000001', // hCaptcha site key
  cooldownTime: 28800,  // 冷卻時間（秒）- 8小時
  animationDuration: 0.3,  // 動畫時長（秒）
  progressDuration: 2,  // 進度條動畫時長（秒）
  
  // 新的設計配置
  theme: {
    enableParticles: true,      // 啟用粒子背景效果
    particleCount: 30,          // 粒子數量
    particleColor: '#6C63FF',   // 粒子顏色
    enableWaveSVG: true,        // 啟用波浪SVG效果
  }
};

