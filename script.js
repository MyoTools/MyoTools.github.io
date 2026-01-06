// 背景Canvas动画
const canvas = document.getElementById('backgroundCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const message = "MyoTools ";
    const fontSize = 20;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let columns = Math.floor(canvas.width / fontSize);
    let rows = Math.floor(canvas.height / fontSize);
    
    // 创建字符网格
    const grid = [];
    for(let y = 0; y < rows; y++) {
        grid[y] = [];
        for(let x = 0; x < columns; x++) {
            const charIndex = (x + y * columns) % message.length;
            grid[y][x] = {
                char: message.charAt(charIndex),
                offsetX: (Math.random() - 0.5) * 2,
                offsetY: (Math.random() - 0.5) * 2,
                baseOpacity: 0.3 + Math.random() * 0.2,
                glowIntensity: 0.5 + Math.random() * 0.3
            };
        }
    }
    
    // 闪烁控制参数
    const showDuration = 2000, hideDuration = 1000, fadeDuration = 300;
    const cycleDuration = showDuration + hideDuration;
    let startTime = Date.now();
    
    // 计算透明度和颜色
    const getOpacity = (elapsed) => {
        if (elapsed < fadeDuration) return elapsed / fadeDuration;
        if (elapsed < showDuration - fadeDuration) return 1;
        if (elapsed < showDuration) return 1 - (elapsed - (showDuration - fadeDuration)) / fadeDuration;
        return 0;
    };
    
    const getColor = (x, y, charOpacity) => {
        const dist = Math.sqrt(Math.pow((x * fontSize - canvas.width / 2) / canvas.width, 2) + Math.pow((y * fontSize - canvas.height / 2) / canvas.height, 2));
        const brightness = Math.max(0.5, 1 - dist * 0.4);
        const greenValue = Math.floor(150 + 105 * brightness);
        const blueValue = Math.floor(200 + 55 * brightness);
        return { fill: `rgba(${Math.floor(greenValue * 0.2)}, ${greenValue}, ${blueValue}, ${charOpacity})`, shadow: `rgba(0, 255, 200, ${charOpacity * 0.8})` };
    };
    
    // 重新生成网格
    const regenerateGrid = () => {
        columns = Math.floor(canvas.width / fontSize);
        rows = Math.floor(canvas.height / fontSize);
        grid.length = 0;
        for(let y = 0; y < rows; y++) {
            grid[y] = [];
            for(let x = 0; x < columns; x++) {
                const charIndex = (x + y * columns) % message.length;
                grid[y][x] = { char: message.charAt(charIndex), offsetX: (Math.random() - 0.5) * 2, offsetY: (Math.random() - 0.5) * 2, baseOpacity: 0.3 + Math.random() * 0.2, glowIntensity: 0.5 + Math.random() * 0.3 };
            }
        }
    };
    
    // 主绘制函数
    const draw = () => {
        const elapsed = (Date.now() - startTime) % cycleDuration;
        ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const opacity = getOpacity(elapsed);
        if (opacity > 0) {
            ctx.font = 'bold ' + fontSize + 'px monospace';
            for(let y = 0; y < rows; y++) {
                for(let x = 0; x < columns; x++) {
                    const cell = grid[y][x];
                    const charOpacity = opacity * cell.baseOpacity;
                    if (charOpacity > 0.05) {
                        const color = getColor(x, y, charOpacity);
                        ctx.fillStyle = color.fill;
                        ctx.shadowBlur = 8 * cell.glowIntensity * opacity;
                        ctx.shadowColor = color.shadow;
                        ctx.fillText(cell.char, x * fontSize + cell.offsetX, (y + 1) * fontSize + cell.offsetY);
                    }
                }
            }
            ctx.shadowBlur = 0;
        }
    };
    
    // 动画循环
    const animate = () => { draw(); requestAnimationFrame(animate); };
    animate();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        regenerateGrid();
    });
}
