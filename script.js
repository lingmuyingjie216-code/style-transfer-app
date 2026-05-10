// 画像プレビュー
const imageInput = document.getElementById('imageInput');
const previewImg = document.getElementById('previewImg');

imageInput.addEventListener('change', function() {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    previewImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// 画風ボタンの選択
const styleBtns = document.querySelectorAll('.style-btn');
let selectedStyle = '';

styleBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    styleBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedStyle = btn.dataset.style;
  });
});

// 変換ボタン
const convertBtn = document.getElementById('convertBtn');

convertBtn.addEventListener('click', function() {
  if (!previewImg.src) {
    alert('画像を選んでください！');
    return;
  }
  if (!selectedStyle) {
    alert('画風を選んでください！');
    return;
  }
  alert('変換開始！（STEP5でAI機能を追加します）');
});