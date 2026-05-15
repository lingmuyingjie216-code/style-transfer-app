const API_TOKEN = "";

const imageInput = document.getElementById('imageInput');
const previewImg = document.getElementById('previewImg');
const resultImg  = document.getElementById('resultImg');
const convertBtn = document.getElementById('convertBtn');
const styleBtns  = document.querySelectorAll('.style-btn');
let selectedStyle = '';
let uploadedBase64 = '';

imageInput.addEventListener('change', function() {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    previewImg.src = e.target.result;
    uploadedBase64 = e.target.result;
  };
  reader.readAsDataURL(file);
});

styleBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    styleBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedStyle = btn.dataset.style;
  });
});

function getPrompt(style) {
  const map = {
    anime:      'beautiful anime style illustration, detailed, vibrant colors, Studio Ghibli, masterpiece',
    oil:        'oil painting style, thick brushstrokes, rich colors, impressionist, museum quality, masterpiece',
    watercolor: 'watercolor painting style, soft colors, flowing, transparent, artistic, beautiful',
    sketch:     'pencil sketch style, detailed linework, black and white, fine art, professional illustration'
  };
  return map[style] || 'artistic style, masterpiece, high quality';
}

convertBtn.addEventListener('click', async function() {
  if (!uploadedBase64) { alert('画像を選んでください！'); return; }
  if (!selectedStyle)  { alert('画風を選んでください！'); return; }

  // CSSフィルターモード
  if (currentMode === 'css') {
    resultImg.src = uploadedBase64;
    resultImg.style.filter = cssFilters[selectedStyle] || '';
    return;
  }

  convertBtn.textContent = '変換中... ⏳';
  document.getElementById('arrowCol').classList.add('converting');
  convertBtn.disabled = true;
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: getPrompt(selectedStyle) })
   });
   const data = await response.json();
  if (!data.image) {
    throw new Error('APIエラー: ' + JSON.stringify(data));
  }
  resultImg.src = data.image;
  // ダウンロードボタンを表示
  const existingBtn = document.getElementById('downloadBtn');
  if (existingBtn) existingBtn.remove();
  const downloadBtn = document.createElement('a');
  downloadBtn.id = 'downloadBtn';
  downloadBtn.href = data.image;
  downloadBtn.download = '変換画像.jpg';
  downloadBtn.textContent = '⬇️ 画像をダウンロード';
  downloadBtn.style.cssText = 'display:block;margin-top:12px;padding:10px;background:#1D9E75;color:white;border-radius:8px;text-align:center;text-decoration:none;font-size:14px;';
    resultImg.parentElement.appendChild(downloadBtn);
  } catch(e) {
    alert('エラーが発生しました: ' + e.message);
  } finally {
    convertBtn.textContent = '変換する';
    document.getElementById('arrowCol').classList.remove('converting');
    convertBtn.disabled = false;
  }
});

// CSSフィルターモードの切り替え
const modeAI = document.getElementById('modeAI');
const modeCSS = document.getElementById('modeCSS');
let currentMode = 'ai';

const cssFilters = {
  anime:      'saturate(150%) contrast(120%) brightness(110%)',
  oil:        'saturate(200%) contrast(130%) brightness(90%)',
  watercolor: 'saturate(120%) contrast(90%) brightness(110%) blur(0.5px)',
  sketch:     'grayscale(100%) contrast(200%) brightness(120%)'
};

modeAI.addEventListener('click', function() {
  currentMode = 'ai';
  modeAI.classList.add('active');
  modeCSS.classList.remove('active');
});

modeCSS.addEventListener('click', function() {
  currentMode = 'css';
  modeCSS.classList.add('active');
  modeAI.classList.remove('active');
});