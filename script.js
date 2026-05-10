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
    anime:      'anime style illustration',
    oil:        'oil painting style',
    watercolor: 'watercolor painting style',
    sketch:     'pencil sketch style'
  };
  return map[style] || 'artistic style';
}

convertBtn.addEventListener('click', async function() {
  if (!uploadedBase64) { alert('画像を選んでください！'); return; }
  if (!selectedStyle)  { alert('画風を選んでください！'); return; }
  convertBtn.textContent = '変換中... ⏳';
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
  } catch(e) {
    alert('エラーが発生しました: ' + e.message);
  } finally {
    convertBtn.textContent = '変換する';
    convertBtn.disabled = false;
  }
});