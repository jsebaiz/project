// ---------- Mobile nav ----------
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');
hamburger.addEventListener('click', () => mainNav.classList.toggle('open'));
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => mainNav.classList.remove('open')));

// ---------- Header shadow on scroll ----------
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,0.35)' : 'none';
});

// ---------- Animated stat counters ----------
const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;
function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  statNums.forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1300;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}
const heroStatsBlock = document.querySelector('.hero-stats-block');
if (heroStatsBlock) {
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) animateStats(); });
  }, { threshold: 0.4 }).observe(heroStatsBlock);
}

// ---------- Generic tab groups (scoped per .tabs container) ----------
document.querySelectorAll('.tabs').forEach((tabGroup) => {
  const section = tabGroup.closest('section');
  const buttons = tabGroup.querySelectorAll('.tab-btn');
  const panels = section.querySelectorAll(':scope > .container > .tab-panel, :scope > .container > .table-wrap > .tab-panel');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === target));
    });
  });
});

// ---------- FAQ / playbook accordions ----------
document.querySelectorAll('.acc-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.parentElement;
    const panel = item.querySelector('.acc-panel');
    const isOpen = item.classList.contains('open');
    const group = item.parentElement;

    group.querySelectorAll('.acc-item.open').forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.acc-panel').style.maxHeight = null;
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      panel.style.maxHeight = null;
    } else {
      item.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});
// Pre-open panels marked .open on load
document.querySelectorAll('.acc-item.open .acc-panel').forEach((panel) => {
  panel.style.maxHeight = panel.scrollHeight + 'px';
});

// ---------- Content library filter ----------
const filterChips = document.querySelectorAll('#content-filters .chip');
const contentCards = document.querySelectorAll('#content-grid .content-card');
filterChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    filterChips.forEach((c) => c.classList.toggle('active', c === chip));
    const filter = chip.dataset.filter;
    contentCards.forEach((card) => {
      card.style.display = (filter === 'everything' || card.dataset.cat === filter) ? '' : 'none';
    });
  });
});

// ---------- Copy referral link ----------
const copyBtn = document.getElementById('copy-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const text = document.getElementById('ref-link').textContent;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'copied';
      setTimeout(() => (copyBtn.textContent = 'copy'), 1500);
    } catch (e) {
      copyBtn.textContent = 'copy';
    }
  });
}

// ---------- Application form ----------
const form = document.getElementById('apply-form');
const success = document.getElementById('form-success');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  form.style.display = 'none';
  success.hidden = false;
  success.classList.add('show');
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ---------- Bounty ladder (computed, not hardcoded — totals always add up) ----------
const LADDER = [
  {
    name: 'starting out',
    items: [
      { name: 'plant the flag', amt: 15, desc: 'Claim your campus handle on TikTok, Reels and X, and post an intro video announcing the channel. Same name on all three so people can actually find you.', tags: ['EASY', 'SETUP', '~1 HOUR'], start: true },
      { name: 'the first five', amt: 20, desc: 'Get five friends to download fomo, create an account and make one trade each. This is where almost everybody starts.', tags: ['EASY', 'REFERRALS', '~2 DAYS'] },
      { name: 'open the room', amt: 25, desc: 'Start your campus group chat and get it to 50 real students. Discord, GroupMe — whatever your school already uses.', tags: ['EASY', 'COMMUNITY', '~4 DAYS'] },
      { name: 'first fifteen', amt: 60, desc: 'Fifteen verified signups from your campus. The point where it stops being friends doing you a favor and starts being distribution.', tags: ['REFERRALS', '~1 WEEK'] },
    ],
  },
  {
    name: 'finding traction',
    items: [
      { name: 'the 25k', amt: 100, desc: "Get a single post past 25,000 views on any platform. The hook library has 200 tested openers if you're staring at a blank screen.", tags: ['CONTENT', '~1 WEEK'] },
      { name: 'the interview', amt: 120, desc: 'Get a professor, finance club president or local fund manager on camera for at least ten minutes. This is the piece that makes it look like a publication.', tags: ['THE SHOW', '~1 WEEK'] },
      { name: 'fifty deep', amt: 180, desc: 'Fifty verified signups. Around here you stop being a student with an account and start being a channel your school recognizes.', tags: ['REFERRALS', '~2 WEEKS'] },
      { name: 'fill the room', amt: 250, desc: "Host an in-person event with 40+ verified attendees. We ship the kit, fund the prizes and cover the pizza — you pick the date and the room.", tags: ['IRL', 'FUNDED', 'ONE EVENT'] },
      { name: 'rival week', amt: 300, desc: 'Out-sign your rival school across one week, usually timed to a big game. The result gets posted on the national board.', tags: ['RARE', 'HEAD TO HEAD', '7 DAYS'], rare: true },
    ],
  },
  {
    name: 'a real channel',
    items: [
      { name: 'build the team', amt: 400, desc: 'Bring on two teammates from your campus who each ship four posts. You start earning 10% of what they drive, on top of your own.', tags: ['TEAM', '~3 WEEKS'] },
      { name: 'the 100k week', amt: 500, desc: 'A hundred thousand total views across your channel in one calendar week. Batching your filming is the only realistic way to get there.', tags: ['CONTENT', 'RARE', '7 DAYS'], rare: true },
      { name: 'the hundred', amt: 600, desc: "One hundred verified signups. Nearly every campus in the national top 20 has someone who's cleared this. It also moves you to level 03.", tags: ['REFERRALS', '~1 MONTH'] },
      { name: 'sold out', amt: 900, desc: 'Run a 150+ person campus event with real production — bigger budget, bigger prize pool, your name on the banner.', tags: ['IRL', 'RARE', 'ONE EVENT'], rare: true },
    ],
  },
  {
    name: 'the big ones',
    items: [
      { name: 'top of the board', amt: 1500, desc: "Finish a week as the number one campus in the country. You'd have to get past UT Austin, which is not a small ask. Repeatable every week you hold it.", tags: ['RARE', 'COMPETITIVE', 'ONE WEEK'], rare: true },
      { name: 'open a new campus', amt: 1800, desc: 'Recruit and onboard ambassadors at two nearby schools and get both campuses to fifty signups. Moves you to level 04, and you earn on their territory ongoing.', tags: ['TEAM', '~2 MONTHS'] },
      { name: 'the 250 month', amt: 2000, desc: 'Two hundred and fifty verified signups inside a single calendar month. Fewer than ten ambassadors have ever done it, and it usually puts a campus in the national top five.', tags: ['RARE', 'REFERRALS', 'ONE MONTH'], rare: true },
      { name: 'one million', amt: 2500, desc: 'A million cumulative views on your campus channel. Roughly the point where recruiters and brands start finding you rather than the other way around.', tags: ['CONTENT', 'RARE', 'CUMULATIVE'], rare: true },
    ],
  },
];

function fmt(n) { return '$' + n.toLocaleString('en-US'); }

function renderLadder() {
  const root = document.getElementById('ladder');
  if (!root) return;
  let runningTotal = 0;
  let counter = 0;
  let prevName = null;
  let html = '';

  LADDER.forEach((group) => {
    const groupTotal = group.items.reduce((sum, it) => sum + it.amt, 0);
    html += `<div class="ladder-group">
      <div class="ladder-group-head"><span>Group ${String(LADDER.indexOf(group) + 1).padStart(2, '0')} &middot; <strong>${group.name}</strong></span><span class="group-total">${fmt(groupTotal)} in this group</span></div>`;

    group.items.forEach((item) => {
      counter += 1;
      runningTotal += item.amt;
      const num = String(counter).padStart(2, '0');
      const tagsHtml = item.tags.map((t) => `<span class="${t === 'RARE' ? 'rare-tag' : ''}">${t}</span>`).join('');
      const unlockHtml = item.start
        ? `<span class="start">◆ start here — unlocked on day one</span>`
        : `<span class="lock">🔒 unlocks after "${prevName}"</span>`;

      html += `<div class="ladder-item${item.rare ? ' rare' : ''}">
        <div class="ladder-num">${num}</div>
        <div class="ladder-body">
          <div class="ladder-top"><h4>${item.name}</h4><span class="amt">${fmt(item.amt)}</span></div>
          <p>${item.desc}</p>
          <div class="ladder-tags">${tagsHtml}</div>
          <div class="ladder-unlock">${unlockHtml}<span class="running">running total to here &middot; <strong>${fmt(runningTotal)}</strong></span></div>
        </div>
      </div>`;
      prevName = item.name;
    });

    html += `</div>`;
  });

  root.innerHTML = html;
}
renderLadder();
