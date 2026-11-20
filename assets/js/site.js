(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  // パーティクルの色: R・G・B それぞれ 0.8〜1.0（204〜255）の範囲でランダム
  const randomColor = () => [0, 0, 0].map(() => 204 + ((Math.random() * 52) | 0)).join(',');

  /* ============================================================
     背景パーティクル
     - フローフィールドでゆっくり漂う
     - マウスの周りで押しのけられ、少し渦を巻く
     - クリックで周囲の粒子が弾ける
     ============================================================ */
  const bg = document.getElementById('particles');
  if (bg) {
    const ctx = bg.getContext('2d');
    const RADIUS = 170;   // マウスの影響範囲
    const LINK = 130;     // マウスと線で結ぶ距離
    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
    let W = 0, H = 0, parts = [];

    const spawn = () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0, vy: 0,
      r: 0.7 + Math.random() ** 2 * 2.2,
      z: 0.35 + Math.random() * 0.65,           // 奥行き（速度と明るさに影響）
      a: 0.25 + Math.random() * 0.55,
      c: randomColor()
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      bg.width = W * dpr;
      bg.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.max(240, Math.min(980, Math.round((W * H) / 2130)));
      while (parts.length < target) parts.push(spawn());
      parts.length = target;
    };

    const step = (t) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';

      // カーソル周りのうっすらした光
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, RADIUS * 1.4);
        g.addColorStop(0, 'rgba(255,255,255,0.06)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(mouse.x - RADIUS * 1.4, mouse.y - RADIUS * 1.4, RADIUS * 2.8, RADIUS * 2.8);
      }

      for (const p of parts) {
        // フローフィールド
        const ang = Math.sin(p.x * 0.0021 + t * 0.00012) * Math.cos(p.y * 0.0025 - t * 0.0001) * TAU;
        const fx = Math.cos(ang) * 0.32 * p.z;
        const fy = Math.sin(ang) * 0.32 * p.z - 0.06 * p.z;
        p.vx += (fx - p.vx) * 0.03;
        p.vy += (fy - p.vy) * 0.03;

        // マウスの影響
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < RADIUS * RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2);
            let f = 1 - d / RADIUS;
            f *= f;
            const nx = dx / d, ny = dy / d;
            p.vx += (nx * 1.1 - ny * 0.45) * f + mouse.vx * f * 0.04;
            p.vy += (ny * 1.1 + nx * 0.45) * f + mouse.vy * f * 0.04;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;

        const speed = Math.hypot(p.vx, p.vy);
        const alpha = Math.min(1, p.a * (0.6 + p.z * 0.6) + speed * 0.12);
        ctx.fillStyle = `rgba(${p.c},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.fill();

        // 速く動いている粒子は尾を引く
        if (speed > 0.9) {
          ctx.strokeStyle = `rgba(${p.c},${alpha * 0.5})`;
          ctx.lineWidth = p.r * 1.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx.stroke();
        }

        // マウスと近い粒子を細い線で結ぶ
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            ctx.strokeStyle = `rgba(${p.c},${(1 - Math.sqrt(d2) / LINK) * 0.22})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      mouse.vx *= 0.85;
      mouse.vy *= 0.85;
    };

    const loop = (t) => {
      step(t);
      requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', (e) => {
      if (mouse.active) {
        mouse.vx = e.clientX - mouse.x;
        mouse.vy = e.clientY - mouse.y;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });
    const leave = () => { mouse.active = false; mouse.x = mouse.y = -9999; };
    document.addEventListener('pointerleave', leave);
    window.addEventListener('blur', leave);
    window.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') leave(); });
    window.addEventListener('pointerdown', (e) => {
      // クリックした場所から粒子が弾ける
      for (const p of parts) {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const d = Math.hypot(dx, dy);
        if (d < 240 && d > 0.01) {
          const f = (1 - d / 240) * 7;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }
    });

    resize();
    if (reduceMotion) step(0);
    else requestAnimationFrame(loop);
  }

  /* ============================================================
     Engine セクションの小さな粒子銀河
     （画面に見えている間だけ動かす）
     ============================================================ */
  const ec = document.getElementById('engine-canvas');
  if (ec) {
    const ctx = ec.getContext('2d');
    const N = 2200;
    const stars = Array.from({ length: N }, () => {
      const arm = (Math.random() * 3) | 0;
      const r = Math.random() ** 1.6;
      return {
        r,
        a: arm * (TAU / 3) + r * 5.2 + (Math.random() - 0.5) * (0.9 - r * 0.5),
        s: 0.6 + Math.random() * 0.8,
        c: randomColor(),
        ox: 0, oy: 0
      };
    });
    const m = { x: -9999, y: -9999 };
    let W = 0, H = 0, running = false;

    const resize = () => {
      const rect = ec.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      ec.width = W * dpr;
      ec.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      const cx = W / 2, cy = H / 2;
      const R = Math.min(W, H * 1.9) * 0.46;
      for (const s of stars) {
        s.a += (0.0016 * s.s) / (0.25 + s.r);
        let x = cx + Math.cos(s.a) * s.r * R;
        let y = cy + Math.sin(s.a) * s.r * R * 0.48;
        // マウスで押しのける（ずれは徐々に戻る）
        const dx = x + s.ox - m.x;
        const dy = y + s.oy - m.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 6400 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / 80) * 2.4;
          s.ox += (dx / d) * f;
          s.oy += (dy / d) * f;
        }
        s.ox *= 0.94;
        s.oy *= 0.94;
        x += s.ox;
        y += s.oy;
        const inner = 1 - s.r;
        ctx.fillStyle = `rgba(${s.c},${0.4 + inner * 0.55})`;
        const size = 0.8 + inner * 1.1;
        ctx.fillRect(x, y, size, size);
      }
      if (running) requestAnimationFrame(draw);
    };

    ec.parentElement.addEventListener('pointermove', (e) => {
      const rect = ec.getBoundingClientRect();
      m.x = e.clientX - rect.left;
      m.y = e.clientY - rect.top;
    });
    ec.parentElement.addEventListener('pointerleave', () => { m.x = m.y = -9999; });
    window.addEventListener('resize', resize);
    resize();

    if (reduceMotion) {
      draw(0);
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        const wasRunning = running;
        running = entry.isIntersecting;
        if (running && !wasRunning) requestAnimationFrame(draw);
      }).observe(ec);
    } else {
      running = true;
      requestAnimationFrame(draw);
    }
  }

  /* ============================================================
     一番上に戻るボタン
     ============================================================ */
  document.getElementById('to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ============================================================
     作品一覧: 件数・絞り込み・並び替え
     ============================================================ */
  const cards = [...document.querySelectorAll('.work-card')];
  const grid = document.getElementById('work-grid');
  const count = document.getElementById('work-count');
  const segBtns = [...document.querySelectorAll('.seg-btn[data-filter]')];
  const favOnly = document.getElementById('fav-only');
  const sortBtn = document.getElementById('sort-order');
  let category = 'all';

  const updateCount = () => {
    if (count) count.textContent = String(cards.filter((c) => !c.hidden).length).padStart(2, '0');
  };
  // 種類の絞り込みと Favorite のチェックを組み合わせて表示を切り替える
  const applyFilter = () => {
    const fav = favOnly?.checked;
    cards.forEach((c) => {
      const okCategory = category === 'all' || c.dataset.category === category;
      const okFav = !fav || c.dataset.favorite === 'true';
      c.hidden = !(okCategory && okFav);
    });
    updateCount();
  };
  segBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      category = btn.dataset.filter;
      segBtns.forEach((b) => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      applyFilter();
    });
  });
  favOnly?.addEventListener('change', applyFilter);

  // 並び替え: 左 = 新しい順 / 右 = 古い順。ボタンのどこを押しても反対側へ切り替わる
  const sortCards = () => {
    if (!grid || !sortBtn) return;
    const dir = sortBtn.dataset.order === 'asc' ? 1 : -1;
    [...cards]
      .sort((a, b) => (Number(a.dataset.number) - Number(b.dataset.number)) * dir)
      .forEach((c) => grid.append(c));
  };
  sortBtn?.addEventListener('click', () => {
    const next = sortBtn.dataset.order === 'desc' ? 'asc' : 'desc';
    sortBtn.dataset.order = next;
    sortBtn.setAttribute('aria-label', next === 'desc'
      ? '並び順: 新しい順。押すと古い順に切り替え'
      : '並び順: 古い順。押すと新しい順に切り替え');
    sortCards();
  });
  sortCards();
  applyFilter();

  /* ============================================================
     作品詳細ダイアログ
     ============================================================ */
  const ICONS = {
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15.1V8.9L15.2 12l-5.5 3.1Z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.59 1.2 3.22.92.1-.71.39-1.2.7-1.48-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.77 1.15 2.99 0 4.3-2.62 5.24-5.11 5.52.4.35.75 1.03.75 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v9.59l3.3-3.3a1 1 0 1 1 1.4 1.42l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.42l3.3 3.3V4a1 1 0 0 1 1-1ZM5 19a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"/></svg>'
  };

  // YouTube の URL（youtu.be / watch?v= / embed / shorts）から動画 ID を取り出す
  const youtubeId = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const m = u.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/);
      return m ? m[2] : '';
    } catch { return ''; }
  };

  // 動画がある作品のカードには再生マークを付ける
  cards.forEach((card) => {
    if (!youtubeId(card.dataset.video)) return;
    const mark = document.createElement('span');
    mark.className = 'work-play';
    mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>';
    card.querySelector('.work-image')?.append(mark);
  });

  const dialog = document.getElementById('project-dialog');
  if (dialog) {
    const title = dialog.querySelector('#dialog-title');
    const media = dialog.querySelector('.dialog-media');
    const meta = dialog.querySelector('.dialog-meta');
    const desc = dialog.querySelector('.dialog-description');
    const awards = dialog.querySelector('.dialog-awards');
    const tags = dialog.querySelector('.dialog-tags');
    const links = dialog.querySelector('.dialog-links');
    const closeBtn = dialog.querySelector('.dialog-close');

    const open = (card) => {
      const name = card.dataset.title || card.querySelector('h3')?.textContent || '';
      title.textContent = name;
      const when = card.dataset.date ? card.dataset.date.replace(/\//g, '.') : card.dataset.period;
      meta.textContent = `${(card.dataset.category || '').toUpperCase()}${when ? ` / ${when}` : ''}`;
      desc.textContent = card.dataset.description || card.querySelector('.work-body p')?.textContent || '';
      // 受賞・ランキング（" / " 区切り）
      const list = (card.dataset.awards || '').split(' / ').map((t) => t.trim()).filter(Boolean);
      if (awards) {
        awards.replaceChildren(...list.map((t) => {
          const li = document.createElement('li');
          li.textContent = t;
          return li;
        }));
        awards.hidden = !list.length;
      }
      tags.replaceChildren(...[...card.querySelectorAll('.work-tags span')].map((t) => {
        const s = document.createElement('span');
        s.textContent = t.textContent;
        return s;
      }));

      // 左上の大きな枠: 動画があれば YouTube を埋め込み、なければ画像を表示
      const id = youtubeId(card.dataset.video);
      if (id) {
        const frame = document.createElement('iframe');
        frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&playsinline=1`;
        frame.title = `${name} の紹介動画`;
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        frame.allowFullscreen = true;
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        media.replaceChildren(frame);
      } else {
        const img = document.createElement('img');
        img.src = card.dataset.image || '';
        img.alt = `${name} の画像`;
        media.replaceChildren(img);
      }

      // リンクボタン（URL が空のものは表示しない）
      links.replaceChildren();
      [
        ['video', 'YouTube で見る', 'youtube'],
        ['github', 'GitHub', 'github'],
        ['download', 'ダウンロード', 'download']
      ].forEach(([key, label, icon]) => {
        const url = card.dataset[key];
        if (!url) return;
        const a = document.createElement('a');
        a.className = `link-btn link-${icon}`;
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.innerHTML = `${ICONS[icon]}<span>${label}</span>`;
        links.append(a);
      });
      links.hidden = !links.children.length;

      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('dialog-open');
      closeBtn.focus();
    };

    cards.forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${card.dataset.title || '作品'} の詳細を表示`);
      card.addEventListener('click', () => open(card));
      card.addEventListener('keydown', (e) => {
        if (e.target === card && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          open(card);
        }
      });
    });
    closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      media.replaceChildren(); // 閉じたら動画を止める
      document.body.classList.remove('dialog-open');
    });
  }
})();
