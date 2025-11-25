document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const fontColorInput = document.getElementById('fontColor');
    const bgColorInput = document.getElementById('bgColor');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const canvas = document.getElementById('bratCanvas');
    const ctx = canvas.getContext('2d');
    
    const size = 500;
    canvas.width = size;
    canvas.height = size;
    
    const fontStyle = 'bold 80px Arial, sans-serif'; 

    // Nilai Default: FONT HITAM, BACKGROUND PUTIH
    const DEFAULT_BG = '#ffffff'; 
    const DEFAULT_FONT = '#000000'; 

    
    fontColorInput.value = DEFAULT_FONT;
    bgColorInput.value = DEFAULT_BG;


    function drawBratText(text, selectedFontColor, selectedBgColor) {
    
        ctx.clearRect(0, 0, size, size);
        
        ctx.fillStyle = selectedBgColor;
        ctx.fillRect(0, 0, size, size);
        
        ctx.fillStyle = selectedFontColor;
        ctx.font = fontStyle;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        
        const maxTextWidth = size * 0.9;
        let words = processedText.split(' ');
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let word = words[i];
            let testLine = currentLine + " " + word;
            
            if (ctx.measureText(testLine).width < maxTextWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        const lineHeight = 70; 
        let startY = size / 2 - (lines.length - 1) * lineHeight / 2;

        lines.forEach((line, index) => {
            let y = startY + index * lineHeight;
            ctx.fillText(line, size / 2, y);
        });

        downloadBtn.disabled = false;
    }


    generateBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        
        const selectedFontColor = fontColorInput.value;
        const selectedBgColor = bgColorInput.value;

        if (text) {
            drawBratText(text, selectedFontColor, selectedBgColor);
        } else {
            alert("Silakan masukkan pesan!");
        }
    });


    downloadBtn.addEventListener('click', () => {
        const imageURL = canvas.toDataURL('image/png'); 
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'brat-by-Pareh.png'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });


    drawBratText("default theme", DEFAULT_FONT, DEFAULT_BG); 
});
