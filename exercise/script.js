// =============================================================
// LUNAR TRACKER — script.js
// New concepts in this file vs the Star Chart:
//   - new Date() and date arithmetic
//   - The modulo operator %
//   - Array of objects as a lookup table
//   - ctx.save() / ctx.clip() / ctx.restore()
//   - ctx.ellipse() for the moon terminator
//   - Ternary operator condition ? a : b
//   - toFixed() and toLocaleDateString()
// =============================================================


// -------------------------------------------------------------
// TODO 1 — Canvas setup
// Same as the star chart. Get the canvas, get ctx, set dimensions.
// -------------------------------------------------------------
// your code here
const canvas = document.getElementById('moon-canvas');
const ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

// -------------------------------------------------------------
// TODO 2 — Grab the UI elements
// Get these six elements by id:
//   'phase-icon', 'phase-name', 'illumination',
//   'cycle-day',  'next-full',  'current-date'
// -------------------------------------------------------------
// your code here
const phaseIcon = document.getElementById('phase-icon');
const phaseName = document.getElementById('phase-name');
const illumination = document.getElementById('illumination');
const cycleDay = document.getElementById('cycle-day');
const nextFull = document.getElementById('next-full');
const currentDate = document.getElementById('current-date');

// -------------------------------------------------------------
// TODO 3 — Declare the constants
//
// WHAT:  Two constants that never change:
//   CYCLE → the length of one lunar cycle: 29.53058867 (days)
//   PHASES → an array of objects, one per moon phase
//
// HOW:
//   const CYCLE = 29.53058867;
//
//   const PHASES = [
//       { name: 'New Moon',        icon: '🌑', max: 1.85  },
//       { name: 'Waxing Crescent', icon: '🌒', max: 7.38  },
//       { name: 'First Quarter',   icon: '🌓', max: 11.08 },
//       { name: 'Waxing Gibbous',  icon: '🌔', max: 14.77 },
//       { name: 'Full Moon',       icon: '🌕', max: 16.61 },
//       { name: 'Waning Gibbous',  icon: '🌖', max: 22.15 },
//       { name: 'Last Quarter',    icon: '🌗', max: 25.84 },
//       { name: 'Waning Crescent', icon: '🌘', max: 29.53 },
//   ];
//
// WHY an array for phases:
//   Each phase has a boundary (max). When we know what day (0-29.53)
//   we are in the cycle, we find the first phase where days <= max.
//   That's our current phase. Array.find() does this in one line.
// -------------------------------------------------------------
// your code here
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

// -------------------------------------------------------------
// TODO 4 — Calculate the moon phase from a date
//
// WHAT:  Given a Date object, return an object describing the
//        current moon phase.
//
// HOW:
//   function getMoonPhase(date) {
//       const knownNewMoon = new Date(2000, 0, 6)  // Jan 6, 2000
//       const msPerDay     = 1000 * 60 * 60 * 24
//
//       const daysSince = (date - knownNewMoon) / msPerDay
//       const days      = ((daysSince % CYCLE) + CYCLE) % CYCLE
//       const norm      = days / CYCLE
//
//       const illuminationPct = Math.round((1 - Math.cos(norm * Math.PI * 2)) / 2 * 100)
//       const phase           = PHASES.find(p => days <= p.max)
//       const daysToFull      = days <= 14.77
//           ? Math.ceil(14.77 - days)
//           : Math.ceil(CYCLE - days + 14.77)
//
//       return { days, norm, illuminationPct, name: phase.name, icon: phase.icon, daysToFull }
//   }
//
// BREAKDOWN — new Date():
//   new Date()          → current date and time right now
//   new Date(2000, 0, 6) → Jan 6, 2000 (months are 0-indexed! Jan=0)
//   date1 - date2       → gives difference in MILLISECONDS
//
// BREAKDOWN — modulo %:
//   daysSince % CYCLE   → remainder after dividing by 29.53
//                          e.g. 100 days → 100 % 29.53 = 11.91 (day 11.91 in cycle)
//   The extra ((x % n) + n) % n handles negative numbers.
//   Without it, dates before Jan 2000 give negative values.
//
// BREAKDOWN — illumination formula:
//   (1 - Math.cos(norm * π * 2)) / 2
//   norm=0 (new moon) → cos(0) = 1   → (1-1)/2 = 0   (0% lit)
//   norm=0.5 (full)   → cos(π) = -1  → (1+1)/2 = 1   (100% lit)
//   Math.round(...* 100) converts 0-1 to 0-100 percent
//
// BREAKDOWN — ternary operator:
//   condition ? valueIfTrue : valueIfFalse
//   Same as: if (condition) { ... } else { ... } but in one line.
//   Used here to pick whether full moon is coming or past.
// -------------------------------------------------------------

function getMoonPhase(date) {
    const knownNewMoon = new Date(200, 0, 6);
    const msPerDay = 1000 * 60 * 60 * 24;

    const daysSince = (date - knowNewMoon0) / msPerDay;
    const days = ((daysSince % CYCLE) + CYCLE) % CYCLE;
    const norm = days / CYCLE;

    const illuminationPct = Math.round((1 - Math.cos(norm * Math.PI * 2)) / 2 * 100);
    const phase = PHASES.find(p => days <= p.max);
    const daysToFull = days <= 14.77
          ? Math.cell(14.77 - days)
          : Math.cell(CYCLE - days + 14.77);

    return {days, norm, illuminationPct, name: phase.name, icon: phase.icon, daysToFull }
}


// -------------------------------------------------------------
// TODO 5 — Draw the background
// WHAT:  Fill the whole canvas with a flat dark color.
//        ctx.fillStyle = '#070b14'
//        ctx.fillRect(0, 0, canvas.width, canvas.height)
// -------------------------------------------------------------

function drawBackground() {
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// -------------------------------------------------------------
// TODO 6 — Draw the moon's outer glow
//
// WHAT:  A soft radial gradient around the moon that grows and
//        shrinks with the illumination (full moon glows more).
//
// HOW:
//   function drawMoonGlow(cx, cy, r, intensity) {
//       const grad = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 2.5)
//       grad.addColorStop(0, `rgba(230, 215, 180, ${0.18 * intensity})`)
//       grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
//       ctx.fillStyle = grad
//       ctx.beginPath()
//       ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2)
//       ctx.fill()
//   }
//
// The inner radius (r * 0.9) starts just inside the moon edge.
// The outer radius (r * 2.5) fades out well beyond the moon.
// intensity is a 0-1 value multiplied by the base opacity (0.18).
// -------------------------------------------------------------

function drawMoonGlow(cx, cy, r, intensity) {
    const grad = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 2.5);
    grad.addColorStop(0, 'rgba(230, 215, 180, ${0.18 * intesity})');
    gread.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
}


// -------------------------------------------------------------
// TODO 7 — Draw the moon phase shape
//
// WHAT:  Draw the moon as a circle, then use clip() to restrict
//        drawing to inside it. Fill it dark, then draw the lit
//        portion using a half-circle + terminator ellipse.
//
// NEW CONCEPT — save / clip / restore:
//   ctx.save()     → takes a snapshot of the current canvas state
//   ctx.clip()     → future drawing is clipped to the current path
//   ctx.restore()  → reverts to the saved state (removes the clip)
//   This is how you draw shapes that are cut off at a boundary.
//
// NEW CONCEPT — ctx.ellipse():
//   ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
//   Like arc() but with separate x and y radii (an oval, not a circle).
//   The terminator (shadow edge) is an ellipse — wide at new/full moon,
//   flat (width=0) at quarter moon.
//
// HOW:
//   function drawMoon(cx, cy, r, norm) {
//       const tX     = Math.cos(norm * Math.PI * 2)
//       const waxing = norm < 0.5
//
//       ctx.save()
//       ctx.beginPath()
//       ctx.arc(cx, cy, r, 0, Math.PI * 2)
//       ctx.clip()
//
//       // Fill entire disc dark
//       ctx.fillStyle = '#11152a'
//       ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
//
//       // Draw lit semicircle
//       ctx.fillStyle = '#f0e6c8'
//       if (waxing) {
//           ctx.beginPath()
//           ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false)
//           ctx.closePath()
//           ctx.fill()
//       } else {
//           ctx.beginPath()
//           ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2, false)
//           ctx.closePath()
//           ctx.fill()
//       }
//
//       // Draw terminator ellipse
//       const ex = r * Math.abs(tX)
//       if (waxing) {
//           ctx.fillStyle = tX > 0 ? '#11152a' : '#f0e6c8'
//           ctx.beginPath()
//           ctx.ellipse(cx, cy, ex, r, 0, -Math.PI / 2, Math.PI / 2, false)
//           ctx.closePath()
//           ctx.fill()
//       } else {
//           ctx.fillStyle = tX < 0 ? '#f0e6c8' : '#11152a'
//           ctx.beginPath()
//           ctx.ellipse(cx, cy, ex, r, 0, Math.PI / 2, -Math.PI / 2, false)
//           ctx.closePath()
//           ctx.fill()
//       }
//
//       ctx.restore()
//   }
//
// QUESTION: What happens if you forget ctx.restore() at the end?
// -------------------------------------------------------------

function drawMoon(cx, cy, r, norm) {
    const tX = Math.cos(norm * Math.PI * 2);
    const waxing = norm < 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#11152a';
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.fillStyle = '#f0e6c8';
    if(waxing) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
        ctx.clostPath();
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
    }

    const ex = r * Math.abs(tX);
    if(waxing) {
        ctx.fillStyle = tx > 0 ? '#11152a' : '#f0e6c8';
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, r, 0, -Math.PI / 2, Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
    } else {
        ctx.fillStlye = tX < 0 ? '#f0e6c8' : '#11152a';
        ctx.beginPath();
        ctx.ellipse(cx, cy, ex, r, 0, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();
}


// -------------------------------------------------------------
// TODO 8 — Draw craters
//
// WHAT:  Hardcode a few crater positions as fractions of r,
//        then clip to the moon and draw each as a dark circle
//        with a subtle bright rim.
//
// HOW:
//   function drawCraters(cx, cy, r) {
//       const craters = [
//           { dx:  0.25, dy: -0.15, size: 0.09 },
//           { dx: -0.35, dy:  0.10, size: 0.07 },
//           { dx:  0.10, dy:  0.38, size: 0.11 },
//           { dx: -0.20, dy: -0.38, size: 0.06 },
//           { dx:  0.42, dy:  0.28, size: 0.08 },
//           { dx: -0.10, dy:  0.12, size: 0.05 },
//       ]
//
//       ctx.save()
//       ctx.beginPath()
//       ctx.arc(cx, cy, r, 0, Math.PI * 2)
//       ctx.clip()
//
//       craters.forEach(c => {
//           const px = cx + c.dx * r   // pixel x of crater center
//           const py = cy + c.dy * r   // pixel y of crater center
//           const cr = c.size * r      // crater radius in pixels
//
//           ctx.beginPath()
//           ctx.arc(px, py, cr, 0, Math.PI * 2)
//           ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'
//           ctx.fill()
//
//           ctx.beginPath()
//           ctx.arc(px, py, cr, 0, Math.PI * 2)
//           ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)'
//           ctx.lineWidth = 1
//           ctx.stroke()
//       })
//
//       ctx.restore()
//   }
// -------------------------------------------------------------

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


// -------------------------------------------------------------
// TODO 9 — Update the info panel
//
// WHAT:  Push the phase data into the DOM elements.
//
// HOW:
//   function updateInfo(phase) {
//       phaseIcon.innerText    = phase.icon
//       phaseName.innerText    = phase.name
//       illumination.innerText = `${phase.illuminationPct}%`
//       cycleDay.innerText     = `Day ${phase.days.toFixed(1)}`
//       nextFull.innerText     = phase.daysToFull === 0
//           ? 'Tonight!'
//           : `${phase.daysToFull} day${phase.daysToFull === 1 ? '' : 's'}`
//       currentDate.innerText  = new Date().toLocaleDateString('en-US', {
//           weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
//       })
//   }
//
// NEW — toFixed(1):
//   Rounds a number to 1 decimal place and returns a string.
//   (14.765).toFixed(1) → '14.8'
//
// NEW — toLocaleDateString():
//   Formats a Date into a readable string based on locale.
//   'en-US' with those options → "Saturday, May 17, 2025"
//
// QUESTION: The nextFull line has a ternary inside a ternary.
//   Can you read it and explain what each part does?
// -------------------------------------------------------------

function updateInfo(phase) {
    phaseIcon.innerText = phase.icon;
    phaseName.innerText = phase.name;
    illumination.innerText = `${phase.illuminationPct}%`;
    cycleDay.innerText = `Day ${phase.days.toFixed(1)}`;
    nextFull.innerText = phase.daysToFull === 0
        ? 'Tonight!'
        : `${phase.daysToFull} day${phase.daysToFull === 1 ? '' : 's'}`;
    currentDate.innerText = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}


// -------------------------------------------------------------
// TODO 10 — The render function
//
// WHAT:  Calculates everything, then calls all draw + update
//        functions in the right order. Also sets up the glow pulse.
//
// HOW:
//   function render() {
//       const phase = getMoonPhase(new Date())
//       const cx    = canvas.width / 2
//       const cy    = canvas.height / 2
//       const r     = Math.min(canvas.width, canvas.height) * 0.27
//       const pulse = Math.sin(Date.now() / 1200) * 0.3 + 0.7
//
//       drawBackground()
//       drawMoonGlow(cx, cy, r, (phase.illuminationPct / 100) * pulse)
//       drawMoon(cx, cy, r, phase.norm)
//       drawCraters(cx, cy, r)
//       updateInfo(phase)
//
//       requestAnimationFrame(render)
//   }
//
// WHY Math.min(canvas.width, canvas.height) * 0.27:
//   Makes the moon radius relative to the SMALLER side of the screen.
//   Keeps the moon from being cut off on narrow windows.
//
// WHY pulse = Math.sin(...) * 0.3 + 0.7:
//   Math.sin produces -1 to 1.
//   * 0.3 shrinks it to -0.3 to 0.3.
//   + 0.7 shifts it up to 0.4 to 1.0.
//   This gives a gentle brightness oscillation for the glow.
// -------------------------------------------------------------

function render() {
    // your code here
}


// -------------------------------------------------------------
// TODO 11 — Resize handler
// Same as the star chart. Update canvas dimensions on resize.
// -------------------------------------------------------------
// your code here


// -------------------------------------------------------------
// TODO 12 — Start
// Call render() once. It loops itself with requestAnimationFrame.
// No fetch() needed this time — everything is calculated from Date.
// -------------------------------------------------------------
// your code here
