document.addEventListener('DOMContentLoaded', () => {
    const inputText     = document.getElementById('inputText');
    const generateBtn   = document.getElementById('generateBtn');
    const downloadBtn   = document.getElementById('downloadBtn');
    const copyLinkBtn   = document.getElementById('copyLinkBtn');
    const canvas        = document.getElementById('bratCanvas');
    const placeholder   = document.getElementById('canvasPlaceholder');
    const blurToggle    = document.getElementById('blurToggle');
    const bgColorInput  = document.getElementById('bgColor');
    const toast         = document.getElementById('toast');
    const ctx           = canvas.getContext('2d');

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
        document.querySelector('.custom-color-btn').classList.add('active');
        if (currentText) drawBrat(currentText);
    });

    // ── Blur toggle real-time ──
    blurToggle.addEventListener('change', () => {
        if (currentText) drawBrat(currentText);
    });

    // ── URL param ──
    function getTextFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('text') ? decodeURIComponent(params.get('text')) : null;
    }

    // ── Draw function (supports multi-line) ──
    function drawBrat(text) {
        const useBlur   = blurToggle.checked;
        const bg        = currentBg;
        const fontColor = getContrastColor(bg);

        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, SIZE, SIZE);

        // Split by newline first, then word-wrap each paragraph
        const rawLines = text.toLowerCase().split('\n').filter(l => l.trim() !== '');
        
        let fontSize = 90;
        let allLines = [];

        // Auto-fit: shrink font until all lines fit
        for (fontSize = 90; fontSize >= 14; fontSize -= 3) {
            ctx.font = `900 ${fontSize}px Arial, sans-serif`;
            allLines = [];
            for (const paragraph of rawLines) {
                const wrapped = wrapText(paragraph.trim().split(' '), SIZE * 0.88, ctx);
                allLines.push(...wrapped);
            }
            const totalH = allLines.length * (fontSize * 1.25);
            if (totalH <= SIZE * 0.90) break;
        }

        ctx.font         = `900 ${fontSize}px Arial, sans-serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        const lineHeight = fontSize * 1.25;
        const totalH     = allLines.length * lineHeight;
        const startY     = (SIZE - totalH) / 2 + lineHeight / 2;

        // Blur effect
        ctx.filter    = useBlur ? `blur(${Math.max(1, fontSize * 0.022)}px)` : 'none';
        ctx.fillStyle = fontColor;

        allLines.forEach((line, i) => {
            ctx.fillText(line, SIZE / 2, startY + i * lineHeight);
        });

        ctx.filter = 'none';

        // Hide placeholder
        placeholder.classList.add('hidden');
    }

    // ── Word wrap helper ──
    function wrapText(words, maxW, ctx) {
        if (!words.length || (words.length === 1 && words[0] === '')) return [''];
        const lines = [];
        let cur = words[0];
        for (let i = 1; i < words.length; i++) {
            const test = cur + ' ' + words[i];
            if (ctx.measureText(test).width <= maxW) {
                cur = test;
            } else {
                lines.push(cur);
                cur = words[i];
            }
        }
        lines.push(cur);
        return lines;
    }

    // ── Contrast color ──
    function getContrastColor(hex) {
        const r = parseInt(hex.slice(1,3),16);
        const g = parseInt(hex.slice(3,5),16);
        const b = parseInt(hex.slice(5,7),16);
        return (0.299*r + 0.587*g + 0.114*b)/255 > 0.5 ? '#000000' : '#ffffff';
    }

    // ── Toast ──
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // ── Generate ──
    generateBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) {
            inputText.focus();
            inputText.style.borderLeftColor = 'red';
            setTimeout(() => inputText.style.borderLeftColor = 'var(--brat-green)', 800);
            return;
        }
        currentText = text;
        drawBrat(text);
    });

    // ── Ctrl+Enter untuk generate (Enter biasa = newline) ──
    inputText.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.ctrlKey) generateBtn.click();
    });

    // ── Download ──
    downloadBtn.addEventListener('click', () => {
        if (!currentText) return;
        const link = document.createElement('a');
        link.href     = canvas.toDataURL('image/png');
        link.download = 'brat-by-blinx.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('gambar didownload! ✓');
    });

    // ── Copy link ──
    copyLinkBtn.addEventListener('click', () => {
        if (!currentText) return;
        const url = `${location.origin}${location.pathname}?text=${encodeURIComponent(currentText)}`;
        navigator.clipboard.writeText(url)
            .then(() => showToast('link tersalin! ✓'))
            .catch(() => prompt('Salin link ini:', url));
    });

    // ── Auto-load dari URL ──
    const urlText = getTextFromUrl();
    if (urlText) {
        inputText.value = urlText;
        currentText = urlText;
        drawBrat(urlText);
    }
});
