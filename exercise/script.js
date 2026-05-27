const canvas = document.getElementById('moon-canvas');
const ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;


const phaseIcon = document.getElementById('phase-icon');
const phaseName = document.getElementById('phase-name');
const illumination = document.getElementById('illumination');
const cycleDay = document.getElementById('cycle-day');
const nextFull = document.getElementById('next-full');
const currentDate = document.getElementById('current-date');
const cycleBar = document.getElementById('cycle-bar');
const dateInput = document.getElementById('phase-date');
const todayBtn = document.getElementById('today-btn');
let selectedDate = null;

if(dateInput) {
    dateInput.addEventListener('change', (e) => {
        const val = e.target.value;
        if(val) {
            const [y, m, d] = val.split('-');
            selectedDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        } else {
            selectedDate = null;
        }
    });
}
if(todayBtn) {
    todayBtn.addEventListener('click', () => {
        selectedDate = null;
        if(dateInput) dateInput.value = '';
    })
}


const CYCLE = 29.53058867;

const PHASES = [
    { name: 'New Moon',        icon: '🌑', max: 1.85  },
    { name: 'Waxing Crescent', icon: '🌒', max: 7.38  },
    { name: 'First Quarter',   icon: '🌓', max: 11.08 },
    { name: 'Waxing Gibbous',  icon: '🌔', max: 14.77 },
    { name: 'Full Moon',       icon: '🌕', max: 16.61 },
    { name: 'Waning Gibbous',  icon: '🌖', max: 22.15 },
    { name: 'Last Quarter',    icon: '🌗', max: 25.84 },
    { name: 'Waning Crescent', icon: '🌘', max: 29.53 },
]

// Calculate the moon phase from a date
function getMoonPhase(date) {
    const knownNewMoon = new Date(2000, 0, 6);
    const msPerDay = 1000 * 60 * 60 * 24;

    const daysSince = (date - knownNewMoon) / msPerDay;
    const days = ((daysSince % CYCLE) + CYCLE) % CYCLE;
    const norm = days / CYCLE;

    const illuminationPct = Math.round((1 - Math.cos(norm * Math.PI * 2)) / 2 * 100);
    const phaseIndex = PHASES.findIndex(p => days <= p.max);
    const phase = PHASES[phaseIndex]
    const daysToFull = days <= 14.77
          ? Math.ceil(14.77 - days)
          : Math.ceil(CYCLE - days + 14.77);

    return {days, norm, illuminationPct, name: phase.name, icon: phase.icon, daysToFull, index: phaseIndex }
}


// Draw the background


function drawBackground() {
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// Draw the moon's outer glow


function drawMoonGlow(cx, cy, r, intensity) {
    const grad = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 2.5);
    grad.addColorStop(0, `rgba(208, 232, 255, ${0.18 * intensity})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
}


// Draw moon phase shape


function drawMoon(cx, cy, r, norm, isFull) {
    const tX = Math.cos(norm * Math.PI * 2);
    const waxing = norm < 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#11152a';
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.fillStyle = '#d0e8ff';
    if(waxing) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
    }

    const ex = r * Math.abs(tX);
    if(waxing) {
        ctx.fillStyle = tX > 0 ? '#11152a' : '#d0e8ff';
        ctx.beginPath();
        ctx.ellipse(cx, cy, ex, r, 0, -Math.PI / 2, Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.fillStyle = tX < 0 ? '#d0e8ff' : '#11152a';
        ctx.beginPath();
        ctx.ellipse(cx, cy, ex, r, 0, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
    if(isFull) {
        ctx.beginPath();
        const rightWidth = Math.max(3, r * 0.02);
        ctx.lineWidth = rightWidth;
        ctx.strokeStyle = 'rgba(200, 232, 255, 0.22)';
        ctx.arc(cx, cy, r + rightWidth * 0.8, 0, Math.PI * 2);
        ctx.stroke();
    }
}


// Draw craters


function drawCraters(cx, cy, r) {
    const craters = [
        { dx:  0.25, dy: -0.15, size: 0.09 },
        { dx: -0.35, dy:  0.10, size: 0.07 },
        { dx:  0.10, dy:  0.38, size: 0.11 },
        { dx: -0.20, dy: -0.38, size: 0.06 },
        { dx:  0.42, dy:  0.28, size: 0.08 },
        { dx: -0.10, dy:  0.12, size: 0.05 },
    ]

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    craters.forEach(c => {
        const px = cx + c.dx * r;
        const py = cy + c.dy * r;
        const cr = c.size * r;

        ctx.beginPath();
        ctx.arc(px, py, cr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, cr, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        ctx.stroke();
    })

    ctx.restore();
}


// Update the info panel


function updateInfo(phase, date = new Date()) {
    phaseIcon.innerText = phase.icon;
    phaseName.innerText = phase.name;
    illumination.innerText = `${phase.illuminationPct}%`;
    cycleDay.innerText = `Day ${phase.days.toFixed(1)}`;
    nextFull.innerText = phase.daysToFull === 0
        ? 'Tonight!'
        : `${phase.daysToFull} day${phase.daysToFull === 1 ? '' : 's'}`;
    currentDate.innerText = date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
    const cyclePct = Math.round(phase.norm * 100);
    const cycleBar = document.getElementById('cycle-bar');
    if(cycleBar) cycleBar.style.width = `${cyclePct}%`;

    document.querySelectorAll('.phase-item').forEach((el, i) => {
        el.classList.toggle('active', i === phase.index);
    })
}

function render() {
    const now = selectedDate || new Date();
    const phase = getMoonPhase(now);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(canvas.width, canvas.height) * 0.27;
    const pulse = Math.sin(Date.now() / 1200) * 0.3 + 0.7;

    drawBackground();
    drawMoonGlow(cx, cy, r, (phase.illuminationPct / 100) * pulse);
    drawMoon(cx, cy, r, phase.norm, phase.name === 'Full Moon');
    drawCraters(cx, cy, r);
    updateInfo(phase, now);

    requestAnimationFrame(render);
}

// Resize handler
window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
});

render()