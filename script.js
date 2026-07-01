document.addEventListener('DOMContentLoaded', () => {
    const inputText    = document.getElementById('inputText');
    const generateBtn  = document.getElementById('generateBtn');
    const downloadBtn  = document.getElementById('downloadBtn');
    const copyLinkBtn  = document.getElementById('copyLinkBtn');
    const canvas       = document.getElementById('bratCanvas');
    const outputSection = document.getElementById('outputSection');
    const blurToggle   = document.getElementById('blurToggle');
    const bgColorInput = document.getElementById('bgColor');
    const toast        = document.getElementById('toast');
    const ctx          = canvas.getContext('2d');

    const SIZE = 500;
    canvas.width  = SIZE;
    canvas.height = SIZE;

    let currentBg   = '#8ACE00';
    let currentText = '';

    // ── Color preset buttons ──
    const colorBtns = document.querySelectorAll('.color-btn[data-color]');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.custom-color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBg = btn.dataset.color;
            bgColorInput.value = currentBg;
            if (currentText) drawBrat(currentText);
        });
    });

    // ── Custom color picker ──
    bgColorInput.addEventListener('input', (e) => {
        currentBg = e.target.value;
        colorBtns.forEach(b => b.classList.remove('active'));
        document.getElementById('color-custom').classList.add('active');
        if (currentText) drawBrat(currentText);
    });

    // ── Blur toggle ──
    blurToggle.addEventListener('change', () => {
        if (currentText) drawBrat(currentText);
    });

    // ── URL param ──
    function getTextFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('text') ? decodeURIComponent(params.get('text')) : null;
    }

    // ── Draw function ──
    function drawBrat(text) {
        const useBlur = blurToggle.checked;
        const bg = currentBg;

        // Determine font color (contrast)
        const fontColor = getContrastColor(bg);

        ctx.clearRect(0, 0, SIZE, SIZE);

        // Background
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, SIZE, SIZE);

        // Text setup
        const processedText = text.toLowerCase();
        const words = processedText.split(' ');
        let fontSize = 100;
        let lines = [];

        // Auto-fit font size
        for (fontSize = 100; fontSize >= 20; fontSize -= 4) {
            ctx.font = `900 ${fontSize}px Arial, sans-serif`;
            lines = wrapText(words, SIZE * 0.88, ctx);
            const totalHeight = lines.length * (fontSize * 1.15);
            if (totalHeight <= SIZE * 0.85) break;
        }

        ctx.font = `900 ${fontSize}px Arial, sans-serif`;
        ctx.textAlign  = 'center';
        ctx.textBaseline = 'middle';

        const lineHeight = fontSize * 1.2;
        const totalH    = lines.length * lineHeight;
        let startY      = SIZE / 2 - totalH / 2 + lineHeight / 2;

        // Apply blur effect (like brat album cover)
        if (useBlur) {
            ctx.filter = `blur(${Math.max(1.5, fontSize * 0.025)}px)`;
        } else {
            ctx.filter = 'none';
        }

        ctx.fillStyle = fontColor;
        lines.forEach((line, i) => {
            ctx.fillText(line, SIZE / 2, startY + i * lineHeight);
        });

        ctx.filter = 'none';

        // Show output
        outputSection.classList.add('visible');
    }

    // ── Word wrap ──
    function wrapText(words, maxWidth, ctx) {
        const lines = [];
        let current = words[0];
        for (let i = 1; i < words.length; i++) {
            const test = current + ' ' + words[i];
            if (ctx.measureText(test).width <= maxWidth) {
                current = test;
            } else {
                lines.push(current);
                current = words[i];
            }
        }
        lines.push(current);
        return lines;
    }

    // ── Contrast color ──
    function getContrastColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }

    // ── Toast notification ──
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // ── Generate button ──
    generateBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) {
            inputText.focus();
            inputText.style.borderColor = 'red';
            setTimeout(() => inputText.style.borderColor = '', 800);
            return;
        }
        currentText = text;
        drawBrat(text);
    });

    // ── Enter key support ──
    inputText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') generateBtn.click();
    });

    // ── Download ──
    downloadBtn.addEventListener('click', () => {
        const url  = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href     = url;
        link.download = 'brat-by-blinx.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('gambar didownload! ✓');
    });

    // ── Copy link ──
    copyLinkBtn.addEventListener('click', () => {
        if (!currentText) return;
        const shareUrl = `${window.location.origin}${window.location.pathname}?text=${encodeURIComponent(currentText)}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast('link tersalin! ✓');
        }).catch(() => {
            prompt('Salin link ini:', shareUrl);
        });
    });

    // ── Auto-load from URL ──
    const urlText = getTextFromUrl();
    if (urlText) {
        inputText.value = urlText;
        currentText = urlText;
        drawBrat(urlText);
    }
});
