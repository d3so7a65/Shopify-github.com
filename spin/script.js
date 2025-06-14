document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spin-btn');
    const optionInputs = document.querySelectorAll('.option-input');
    const questionInput = document.getElementById('question');
    const resultDisplay = document.getElementById('result');
    
    let prizes = Array.from(optionInputs).map(input => input.value || input.placeholder);
    let isSpinning = false;
    let currentRotation = 0;
    let segmentColors = [];
    
    // Генерация цветов для сегментов
    function generateColors(count) {
        const colors = [];
        const hueStep = 360 / count;
        
        for (let i = 0; i < count; i++) {
            const hue = Math.floor(hueStep * i);
            colors.push(`hsl(${hue}, 70%, 60%)`);
        }
        
        return colors;
    }
    
    // Отрисовка колеса
    function drawWheel() {
        const activePrizes = prizes.filter(prize => prize.trim() !== '');
        if (activePrizes.length < 2) return;
        
        segmentColors = generateColors(activePrizes.length);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        const arc = (2 * Math.PI) / activePrizes.length;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        activePrizes.forEach((prize, index) => {
            const angle = index * arc;
            ctx.beginPath();
            ctx.fillStyle = segmentColors[index];
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
            ctx.lineTo(centerX, centerY);
            ctx.fill();
            
            // Добавляем текст
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 3;
            
            const maxLength = 10;
            const displayText = prize.length > maxLength 
                ? prize.substring(0, maxLength) + '...' 
                : prize;
                
            ctx.fillText(displayText, radius - 25, 5);
            ctx.restore();
        });
        
        // Центральный круг
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    // Вращение колеса
    function spinWheel() {
        const activePrizes = prizes.filter(prize => prize.trim() !== '');
        if (isSpinning || activePrizes.length < 2) return;
        
        isSpinning = true;
        resultDisplay.textContent = '';
        spinBtn.disabled = true;
        
        const spinAngle = 360 * (5 + Math.floor(Math.random() * 5)) + (360 / activePrizes.length) * Math.floor(Math.random() * activePrizes.length);
        const totalRotation = currentRotation + spinAngle;
        
        let startTime = null;
        const duration = 4000;
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;
            
            if (progress < 1) {
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const rotation = currentRotation + spinAngle * easeProgress;
                canvas.style.transform = `rotate(${rotation}deg)`;
                requestAnimationFrame(animate);
            } else {
                canvas.style.transform = `rotate(${totalRotation}deg)`;
                currentRotation = totalRotation % 360;
                isSpinning = false;
                spinBtn.disabled = false;
                showResult();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Показ результата
    function showResult() {
        const activePrizes = prizes.filter(prize => prize.trim() !== '');
        const normalizedRotation = (360 - (currentRotation % 360)) % 360;
        const arc = 360 / activePrizes.length;
        const winningIndex = Math.floor(normalizedRotation / arc);
        const winner = activePrizes[winningIndex];
        
        const question = questionInput.value.trim();
        resultDisplay.textContent = question 
            ? `${question}\nОтвет: ${winner}!` 
            : `Результат: ${winner}!`;
    }
    
    // Обновление призов
    optionInputs.forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.dataset.index);
            prizes[index] = this.value.trim() || this.placeholder;
            drawWheel();
        });
    });
    
    // Кнопка вращения
    spinBtn.addEventListener('click', spinWheel);
    
    // Инициализация
    drawWheel();
});