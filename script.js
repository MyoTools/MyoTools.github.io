// 初始化Canvas和变量
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');
const message = "MyoTools helps every muscle development expert acquire rich muscle fiber phenotypes...   ";
const fontSize = 28;
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
            offsetX: (Math.random() - 0.5) * 3,
            offsetY: (Math.random() - 0.5) * 3,
            baseOpacity: 0.6 + Math.random() * 0.4,
            glowIntensity: 0.7 + Math.random() * 0.3
        };
    }
}

// 闪烁控制参数
const showDuration = 1500, hideDuration = 500, fadeDuration = 200;
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
    const brightness = Math.max(0.7, 1 - dist * 0.3);
    const hueShift = Math.sin(x * 0.1 + y * 0.1) * 0.1;
    const greenValue = Math.floor(200 + 55 * brightness);
    const blueValue = Math.floor(200 + 55 * brightness * (1 + hueShift));
    return { fill: `rgba(${Math.floor(greenValue * 0.3)}, ${greenValue}, ${blueValue}, ${charOpacity})`, shadow: `rgba(0, 255, 200, ${charOpacity * 1.2})` };
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
            grid[y][x] = {
                char: message.charAt(charIndex),
                offsetX: (Math.random() - 0.5) * 3,
                offsetY: (Math.random() - 0.5) * 3,
                baseOpacity: 0.6 + Math.random() * 0.4,
                glowIntensity: 0.7 + Math.random() * 0.3
            };
        }
    }
};
// 主绘制函数
const draw = () => {
    const elapsed = (Date.now() - startTime) % cycleDuration;
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height));
    gradient.addColorStop(0, 'rgba(10, 14, 39, 0.7)');
    gradient.addColorStop(0.5, 'rgba(15, 21, 37, 0.85)');
    gradient.addColorStop(1, 'rgba(20, 25, 45, 0.95)');
    ctx.fillStyle = gradient;
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
                    ctx.shadowBlur = 12 * cell.glowIntensity * opacity;
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
