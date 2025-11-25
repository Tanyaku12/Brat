document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const canvas = document.getElementById('bratCanvas');
    const ctx = canvas.getContext('2d');
    
    const size = 500;
    canvas.width = size;
    canvas.height = size;
    
    const fontStyle = 'bold 80px Arial, sans-serif'; 

    const FIXED_BG = '#ffffff'; 
    const FIXED_FONT = '#000000'; 


    function getTextFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const textFromUrl = urlParams.get('text');
        return textFromUrl ? decodeURIComponent(textFromUrl) : null;
    }


    function drawBratText(text) {
        ctx.clearRect(0, 0, size, size);
        ctx.fillStyle = FIXED_BG;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = FIXED_FONT;
        ctx.font = fontStyle;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const processedText = text; 
        
        
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

        downloadBtn.style.display = 'block';
    }


    
    const textFromUrl = getTextFromUrl();
    const initialText = textFromUrl || "DEFAULT TEXT"; 
    inputText.value = initialText;
    drawBratText(initialText); 




    generateBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        
        if (text) {
            drawBratText(text);
        } else {
            alert("Silakan masukkan pesan!");
        }
    });

    downloadBtn.addEventListener('click', () => {
        const imageURL = canvas.toDataURL('image/png'); 
        const link = document.createElement('a');
        link.href = imageURL;
    
        link.download = `brat-by-pareh.png`; 
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    if (!textFromUrl) {
         downloadBtn.style.display = 'none';
    }
});
            
