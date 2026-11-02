(function () {
  function markImage(img) {
    const frame = img.closest(".frame, .disc, .thumb, .lightbox-frame, .brand-mark");
    if (!frame) return;

    function showReady() {
      if (img.naturalWidth > 0) frame.classList.add("is-ready");
    }

    if (img.complete && img.naturalWidth > 0) showReady();
    img.addEventListener("load", showReady);
  }

  document.querySelectorAll(".frame img, .disc img, .brand-mark img").forEach(markImage);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const veil = document.createElement("div");
  veil.className = "page-veil";
  veil.setAttribute("aria-hidden", "true");
  document.body.appendChild(veil);

  window.addEventListener("pageshow", function () {
    document.documentElement.classList.remove("page-leave");
  });

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a");
    if (!link || !link.href) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    event.preventDefault();
    if (reduce) {
      location.href = link.href;
      return;
    }
    document.documentElement.classList.add("page-leave");
    window.setTimeout(function () {
      location.href = link.href;
    }, 420);
  });

  const swap = document.querySelector("[data-swap]");
  if (swap && !reduce) {
    const phrases = [
      "FOR THE FUTURE.",
      "FOR CONTINUITY.",
      "FOR CREATIVITY.",
      "FOR EFFICIENCY.",
      "FOR BRILLIANCE."
    ];
    const line = swap.querySelector("span");
    let phrase = 0;

    function typeText(text, step, done) {
      let i = step > 0 ? 0 : text.length;
      const timer = window.setInterval(function () {
        i += step;
        if (step > 0 && i >= text.length) {
          line.textContent = text;
          window.clearInterval(timer);
          window.setTimeout(done, 1400);
          return;
        }
        if (step < 0 && i <= 0) {
          line.textContent = "";
          window.clearInterval(timer);
          done();
          return;
        }
        line.textContent = text.slice(0, i);
      }, step > 0 ? 48 : 26);
    }

    function nextPhrase() {
      typeText(line.textContent, -1, function () {
        phrase = (phrase + 1) % phrases.length;
        typeText(phrases[phrase], 1, nextPhrase);
      });
    }

    window.setTimeout(nextPhrase, 1400);
  }

  const dialog = document.querySelector("[data-lightbox]");
  if (dialog) {
    const titleEl = dialog.querySelector("[data-lightbox-title]");
    const frameEl = dialog.querySelector("[data-lightbox-frame]");
    const thumbsEl = dialog.querySelector("[data-lightbox-thumbs]");
    const countEl = dialog.querySelector("[data-lightbox-count]");
    const hintEl = dialog.querySelector("[data-lightbox-hint]");
    let slides = [];
    let index = 0;
    let lastFocus = null;

    function render() {
      const slide = slides[index];
      frameEl.classList.remove("is-ready");
      frameEl.innerHTML = "";
      const img = slide.cloneNode(true);
      const label = document.createElement("span");
      label.className = "ph";
      label.textContent = "PHOTO " + String(index + 1).padStart(2, "0");
      frameEl.append(img, label);
      markImage(img);
      countEl.textContent = String(index + 1) + " / " + String(slides.length);
      hintEl.textContent = frameEl.classList.contains("is-ready")
        ? ""
        : "Add this photo later at " + img.getAttribute("src");
      thumbsEl.querySelectorAll(".thumb").forEach(function (thumb, thumbIndex) {
        thumb.setAttribute("aria-current", thumbIndex === index ? "true" : "false");
      });
      img.addEventListener("error", function () {
        hintEl.textContent = "Add this photo later at " + img.getAttribute("src");
      });
      img.addEventListener("load", function () {
        hintEl.textContent = "";
      });
    }

    function openGallery(set, startIndex) {
      slides = Array.prototype.slice.call(set.querySelectorAll("img"));
      if (!slides.length) return;
      index = startIndex || 0;
      titleEl.textContent = set.getAttribute("data-title") || "Gallery";
      thumbsEl.innerHTML = "";
      slides.forEach(function (slide, slideIndex) {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "thumb";
        thumb.appendChild(slide.cloneNode(true));
        const label = document.createElement("span");
        label.className = "ph";
        label.textContent = String(slideIndex + 1).padStart(2, "0");
        thumb.appendChild(label);
        markImage(thumb.querySelector("img"));
        thumb.addEventListener("click", function () {
          index = slideIndex;
          render();
        });
        thumbsEl.appendChild(thumb);
      });
      render();
      lastFocus = document.activeElement;
      dialog.showModal();
    }

    document.querySelectorAll("[data-gallery]").forEach(function (set) {
      const opener = set.querySelector("[data-open-gallery]");
      if (!opener) return;
      opener.addEventListener("click", function () {
        const frames = Array.prototype.slice.call(set.querySelectorAll(".frame img, .disc img"));
        const current = frames[0];
        const all = Array.prototype.slice.call(set.querySelectorAll("img"));
        const start = Math.max(0, all.indexOf(current));
        openGallery(set, start);
      });
    });

    dialog.querySelector("[data-prev]").addEventListener("click", function () {
      if (!slides.length) return;
      index = (index - 1 + slides.length) % slides.length;
      render();
    });

    dialog.querySelector("[data-next]").addEventListener("click", function () {
      if (!slides.length) return;
      index = (index + 1) % slides.length;
      render();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", function () {
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });

    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        index = (index + 1) % slides.length;
        render();
      }
      if (event.key === "ArrowLeft") {
        index = (index - 1 + slides.length) % slides.length;
        render();
      }
    });
  }

  const gate = document.querySelector("[data-gate]");
  if (!gate) return;

  if (document.documentElement.classList.contains("grid-open")) {
    gate.remove();
    return;
  }

  const term = gate.querySelector("[data-term]");
  const log = gate.querySelector("[data-log]");
  const form = gate.querySelector("[data-login]");
  const input = gate.querySelector("[data-user]");
  const status = gate.querySelector("[data-status]");
  const load = gate.querySelector("[data-load]");
  const loadLine = gate.querySelector("[data-load-line]");
  const loadBar = gate.querySelector("[data-load-bar]");
  const loadPct = gate.querySelector("[data-load-pct]");
  const story = [
    "pipeline start",
    "boot the grid",
    "sync sector 01, singapore",
    "open the user channel",
    "pipeline standing by"
  ];
  const loadSteps = ["access granted", "syncing sectors", "opening the grid"];

  function tone() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (err) {
      /* audio is optional */
    }
  }

  function openGrid() {
    try {
      sessionStorage.setItem("yohan-grid", "open");
    } catch (err) {
      /* storage can be blocked; the page still opens */
    }

    if (reduce) {
      document.documentElement.classList.add("grid-open", "page-ready");
      gate.remove();
      return;
    }

    window.scrollTo(0, 0);
    gate.classList.add("is-leaving");
    tone();
    window.setTimeout(function () {
      document.documentElement.classList.add("grid-open", "page-ready");
      gate.remove();
    }, 900);
  }

  function typeLine(text, done) {
    const row = document.createElement("p");
    const full = "> " + text;
    log.appendChild(row);
    if (reduce) {
      row.textContent = full;
      done();
      return;
    }
    let i = 0;
    const timer = window.setInterval(function () {
      i += 1;
      row.textContent = full.slice(0, i);
      if (i >= full.length) {
        window.clearInterval(timer);
        window.setTimeout(done, 180);
      }
    }, 22);
  }

  function playStory(index) {
    if (index >= story.length) {
      form.hidden = false;
      input.focus();
      return;
    }
    typeLine(story[index], function () {
      playStory(index + 1);
    });
  }

  function showLoad() {
    input.disabled = true;
    term.hidden = true;
    load.hidden = false;
    if (reduce) {
      openGrid();
      return;
    }
    const start = performance.now();
    const duration = 2200;
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const n = Math.round(t * 100);
      loadBar.style.width = n + "%";
      loadPct.textContent = n + "%";
      loadLine.textContent = loadSteps[Math.min(loadSteps.length - 1, Math.floor(t * loadSteps.length))];
      if (t < 1) {
        window.requestAnimationFrame(frame);
      } else {
        window.setTimeout(openGrid, 280);
      }
    }
    window.requestAnimationFrame(frame);
  }

  playStory(0);

  input.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    form.requestSubmit();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (input.value.trim() === "User 001") {
      showLoad();
      return;
    }
    status.textContent = "access denied";
    status.classList.add("is-denied");
    input.value = "";
    input.focus();
  });
})();

(function () {
  const root = document.querySelector("[data-play]");
  if (!root) return;
  const frame = root.querySelector("[data-play-frame]");
  const canvas = root.querySelector("[data-play-canvas]");
  const nameEl = root.querySelector("[data-play-name]");
  const dotsEl = root.querySelector("[data-play-dots]");
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const names = ["LATTICE", "CORE", "CYCLE"];
  const hintEl = root.querySelector(".play-hint");
  const retryBtn = root.querySelector("[data-play-retry]");
  let scene = 0;
  let fade = 1;
  const pointer = { x: 0.5, y: 0.45, down: false, inside: false };
  let gestureStart = 0;
  let startX = 0;
  let startY = 0;
  let width = 1;
  let height = 1;

  const nodes = Array.from({ length: 42 }, function (_, i) {
    const col = i % 7;
    const row = Math.floor(i / 7);
    return { x: col / 6, y: 0.12 + row / 7, hx: col / 6, hy: 0.12 + row / 7 };
  });

  const earth = [];
  [
    { layer: 0, count: 1, radius: 0 },
    { layer: 1, count: 6, radius: 0.16 },
    { layer: 2, count: 10, radius: 0.34 },
    { layer: 3, count: 16, radius: 0.54 },
    { layer: 4, count: 22, radius: 0.76 }
  ].forEach(function (shell) {
    for (let i = 0; i < shell.count; i += 1) {
      const ang = shell.count === 1 ? 0 : (i / shell.count) * Math.PI * 2 - Math.PI / 2;
      earth.push({
        layer: shell.layer,
        ang: ang,
        hr: shell.radius,
        ox: Math.cos(ang) * shell.radius,
        oy: Math.sin(ang) * shell.radius
      });
    }
  });

  const ride = {
    lane: 1,
    x: 0,
    alive: true,
    dist: 0,
    speed: 0.005,
    score: 0,
    nudged: false,
    obstacles: []
  };
  let steerAt = 0;

  function blockLanes() {
    const patterns = [[0], [1], [2], [0], [1], [2], [0, 1], [1, 2], [0, 2]];
    return patterns[Math.floor(Math.random() * patterns.length)].slice();
  }

  function resetRide() {
    ride.lane = 1;
    ride.x = 0;
    ride.alive = true;
    ride.dist = 0;
    ride.speed = 0.005;
    ride.score = 0;
    ride.nudged = false;
    ride.obstacles = [];
    for (let i = 0; i < 5; i += 1) {
      ride.obstacles.push({ z: 0.9 + i * 0.5, lanes: blockLanes() });
    }
    retryBtn.hidden = true;
  }

  function steer(dir) {
    if (scene !== 2 || !ride.alive) return;
    const now = performance.now();
    if (now - steerAt < 150) return;
    steerAt = now;
    ride.lane = Math.max(0, Math.min(2, ride.lane + dir));
  }

  function resize() {
    const rect = frame.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function show(next) {
    scene = (next + names.length) % names.length;
    fade = 0;
    nameEl.textContent = names[scene];
    hintEl.textContent = scene === 2 ? "ARROWS OR SWIPE TO STEER" : "DRAG TO PLAY · SWIPE TO CHANGE";
    retryBtn.hidden = scene !== 2 || ride.alive;
    dotsEl.querySelectorAll("button").forEach(function (dot, i) {
      dot.classList.toggle("is-on", i === scene);
      dot.setAttribute("aria-pressed", i === scene ? "true" : "false");
    });
  }

  names.forEach(function (label, i) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", label);
    if (i === 0) dot.classList.add("is-on");
    dot.addEventListener("click", function () { show(i); });
    dotsEl.appendChild(dot);
  });
  root.querySelector("[data-play-prev]").addEventListener("click", function () { show(scene - 1); });
  root.querySelector("[data-play-next]").addEventListener("click", function () { show(scene + 1); });
  retryBtn.addEventListener("pointerdown", function (event) { event.stopPropagation(); });
  retryBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    resetRide();
  });

  function point(event) {
    const rect = frame.getBoundingClientRect();
    pointer.x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    pointer.y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
  }

  frame.addEventListener("pointerenter", function (event) {
    pointer.inside = true;
    point(event);
  });

  frame.addEventListener("pointerdown", function (event) {
    frame.setPointerCapture(event.pointerId);
    frame.classList.add("is-drag");
    pointer.down = true;
    pointer.inside = true;
    gestureStart = performance.now();
    startX = event.clientX;
    startY = event.clientY;
    ride.nudged = false;
    point(event);
  });

  frame.addEventListener("pointermove", function (event) {
    pointer.inside = true;
    point(event);
    if (scene === 2 && pointer.down && !ride.nudged) {
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 26) {
        steer(dx > 0 ? 1 : -1);
        ride.nudged = true;
      }
    }
  });

  function release(event) {
    if (!pointer.down) return;
    pointer.down = false;
    frame.classList.remove("is-drag");
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (scene === 2) {
      if (!ride.nudged && ride.alive && Math.abs(dx) < 18 && Math.abs(dy) < 18) {
        if (pointer.x < 0.4) steer(-1);
        else if (pointer.x > 0.6) steer(1);
      }
      return;
    }
    const quick = performance.now() - gestureStart < 280;
    if (quick && Math.abs(dx) > 72 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      show(scene + (dx < 0 ? 1 : -1));
    }
  }

  frame.addEventListener("pointerup", release);
  frame.addEventListener("pointercancel", release);
  frame.addEventListener("pointerleave", function () {
    pointer.inside = false;
    pointer.down = false;
    frame.classList.remove("is-drag");
  });
  frame.addEventListener("keydown", function (event) {
    if (scene === 2) return;
    if (event.key === "ArrowRight") show(scene + 1);
    if (event.key === "ArrowLeft") show(scene - 1);
  });
  window.addEventListener("keydown", function (event) {
    if (scene !== 2) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (document.querySelector("dialog[open]")) return;
    event.preventDefault();
    steer(event.key === "ArrowRight" ? 1 : -1);
  });

  function drawLattice(t) {
    const pull = pointer.inside || pointer.down ? (pointer.down ? 0.22 : 0.1) : 0.04;
    nodes.forEach(function (node) {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      const reach = pointer.down ? 0.42 : 0.28;
      if (dist < reach) {
        node.x += dx * pull * (1 - dist / reach);
        node.y += dy * pull * (1 - dist / reach);
      }
      node.x += (node.hx - node.x) * (reduce ? 0.2 : 0.045);
      node.y += (node.hy - node.y) * (reduce ? 0.2 : 0.045);
      node.x += Math.sin(t + node.hx * 8) * 0.0008;
    });
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > 0.22) continue;
        ctx.strokeStyle = "rgba(110, 240, 255, " + (1 - dist / 0.22) * 0.85 + ")";
        ctx.beginPath();
        ctx.moveTo(a.x * width, a.y * height);
        ctx.lineTo(b.x * width, b.y * height);
        ctx.stroke();
      }
    }
    nodes.forEach(function (node, i) {
      ctx.fillStyle = i % 7 === 0 ? "#e8fbff" : "#6ef0ff";
      ctx.beginPath();
      ctx.arc(node.x * width, node.y * height, i % 7 === 0 ? 3.4 : 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawCore(t) {
    const span = Math.min(width, height) * 0.44;
    const cx = width * 0.5;
    const cy = height * 0.52;
    const spin = reduce ? 0 : t * 0.18;
    const px = (pointer.x * width - cx) / span;
    const py = (pointer.y * height - cy) / span;
    const pull = pointer.down ? 0.22 : 0.1;
    const reach = pointer.down ? 0.55 : 0.36;
    const colors = ["#ffe08a", "#ff8a3d", "#2f78ff", "#6ef0ff", "#e8fbff"];
    earth.forEach(function (node) {
      const homeAng = node.ang + (node.layer === 0 ? 0 : spin);
      const hx = Math.cos(homeAng) * node.hr;
      const hy = Math.sin(homeAng) * node.hr;
      if (pointer.inside) {
        const dx = px - node.ox;
        const dy = py - node.oy;
        const dist = Math.hypot(dx, dy) || 0.001;
        if (dist < reach) {
          const force = pull * (1 - dist / reach);
          node.ox += dx * force;
          node.oy += dy * force;
        }
      }
      const settle = reduce ? 0.2 : 0.05;
      node.ox += (hx - node.ox) * settle;
      node.oy += (hy - node.oy) * settle;
    });

    const glow = ctx.createRadialGradient(cx, cy, span * 0.08, cx, cy, span * 0.82);
    glow.addColorStop(0, "rgba(255, 210, 120, 0.38)");
    glow.addColorStop(0.28, "rgba(255, 120, 48, 0.16)");
    glow.addColorStop(0.62, "rgba(47, 120, 255, 0.14)");
    glow.addColorStop(1, "rgba(110, 240, 255, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, span * 0.82, 0, Math.PI * 2);
    ctx.fill();

    [0.16, 0.34, 0.54, 0.76].forEach(function (radius, index) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(110, 240, 255, " + (0.14 + index * 0.05) + ")";
      ctx.arc(cx, cy, radius * span, 0, Math.PI * 2);
      ctx.stroke();
    });

    function at(node) {
      return { x: cx + node.ox * span, y: cy + node.oy * span };
    }

    ctx.lineWidth = 1;
    for (let layer = 0; layer < 5; layer += 1) {
      const ring = earth.filter(function (node) { return node.layer === layer; });
      const inner = layer === 0 ? [] : earth.filter(function (node) { return node.layer === layer - 1; });
      ring.forEach(function (node, index) {
        const next = ring[(index + 1) % ring.length];
        if (ring.length > 1) {
          const a = at(node);
          const b = at(next);
          ctx.strokeStyle = colors[layer];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        if (!inner.length) return;
        let best = inner[0];
        let bestGap = 99;
        inner.forEach(function (other) {
          const gap = Math.abs(Math.atan2(Math.sin(other.ang - node.ang), Math.cos(other.ang - node.ang)));
          if (gap < bestGap) {
            bestGap = gap;
            best = other;
          }
        });
        const a = at(node);
        const b = at(best);
        ctx.strokeStyle = colors[layer];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
    }
    earth.forEach(function (node) {
      const spot = at(node);
      ctx.fillStyle = colors[node.layer];
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, node.layer === 0 ? 5 : node.layer === 4 ? 2 : 2.8, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function project(offset, z, horizon) {
    const camera = 0.22;
    const far = 1 + camera;
    const depth = Math.max(0.08, z + camera);
    const t = (far / depth - 1) / (far / camera - 1);
    const y = horizon + t * (height * 0.92 - horizon);
    const half = 18 + t * (width * 0.44);
    return {
      x: width * 0.5 + offset * half,
      y: y,
      scale: Math.max(0.12, 0.12 + t * 0.9)
    };
  }

  function advanceRide() {
    if (!ride.alive) return;
    ride.speed = Math.min(0.011, (reduce ? 0.0032 : 0.0046) + ride.dist * 0.00022);
    ride.dist += ride.speed;
    ride.score = Math.floor(ride.dist * 48);
    ride.x += ((ride.lane - 1) - ride.x) * (reduce ? 1 : 0.18);
    let far = 0.8;
    ride.obstacles.forEach(function (ob) {
      ob.z -= ride.speed;
      if (ob.z > far) far = ob.z;
    });
    const horizon = height * 0.3;
    const bike = project(ride.x * 0.62, 0.05, horizon);
    const bikeTop = bike.y - 14;
    const bikeBottom = bike.y + 20;
    ride.obstacles.forEach(function (ob) {
      if (ob.z < -0.16) {
        far += 0.48;
        ob.z = far;
        ob.lanes = blockLanes();
        return;
      }
      for (let i = 0; i < ob.lanes.length; i += 1) {
        if (Math.abs(ride.x - (ob.lanes[i] - 1)) > 0.5) continue;
        const spot = project((ob.lanes[i] - 1) * 0.62, ob.z, horizon);
        const ry = Math.max(12, 32 * spot.scale);
        const ringTop = spot.y - ry * 2;
        const ringBottom = spot.y;
        if (ringBottom >= bikeTop && ringTop <= bikeBottom) ride.alive = false;
      }
    });
    if (!ride.alive) retryBtn.hidden = false;
  }

  function drawCycle() {
    advanceRide();
    const horizon = height * 0.3;
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, "rgba(47, 120, 255, 0)");
    sky.addColorStop(1, "rgba(110, 240, 255, 0.16)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, horizon + 8);

    ctx.beginPath();
    ctx.moveTo(width * 0.5 - 26, horizon);
    ctx.lineTo(width * 0.5 + 26, horizon);
    ctx.lineTo(width * 0.94, height * 0.96);
    ctx.lineTo(width * 0.06, height * 0.96);
    ctx.closePath();
    ctx.fillStyle = "rgba(4, 18, 40, 0.72)";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(110, 240, 255, 0.45)";
    ctx.stroke();

    const phase = (ride.dist * 4) % 1;
    ctx.strokeStyle = "rgba(110, 240, 255, 0.28)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i += 1) {
      const z0 = (i + 1 - phase) / 10;
      const z1 = Math.min(1, z0 + 0.035);
      if (z0 <= 0) continue;
      [-1, 1].forEach(function (edge) {
        const a = project(edge, z0, horizon);
        const b = project(edge, z1, horizon);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
      const left = project(-1, z0, horizon);
      const right = project(1, z0, horizon);
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.stroke();
    }
    [-0.33, 0.33].forEach(function (lane) {
      ctx.strokeStyle = "rgba(232, 251, 255, 0.35)";
      ctx.setLineDash([7, 12]);
      ctx.beginPath();
      const far = project(lane, 1, horizon);
      const near = project(lane, 0, horizon);
      ctx.moveTo(far.x, far.y);
      ctx.lineTo(near.x, near.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    function drawRings(near) {
      const ordered = ride.obstacles.slice().sort(function (a, b) { return b.z - a.z; });
      ordered.forEach(function (ob) {
        const close = ob.z < 0.08;
        if (close !== near) return;
        if (ob.z > 1.05 || ob.z < -0.18) return;
        ob.lanes.forEach(function (lane) {
          const spot = project((lane - 1) * 0.62, ob.z, horizon);
          const rx = Math.max(7, 16 * spot.scale);
          const ry = Math.max(12, 32 * spot.scale);
          if (spot.y - ry > height + 24) return;
          ctx.beginPath();
          ctx.lineWidth = Math.max(1.4, 3 * spot.scale);
          ctx.strokeStyle = "#6ef0ff";
          ctx.ellipse(spot.x, spot.y - ry, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.strokeStyle = "rgba(47, 120, 255, 0.85)";
          ctx.ellipse(spot.x, spot.y - ry, rx * 0.5, ry * 0.55, 0, 0, Math.PI * 2);
          ctx.stroke();
        });
      });
    }

    drawRings(false);

    const bike = project(ride.x * 0.62, 0.05, horizon);
    ctx.save();
    ctx.translate(bike.x, bike.y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = ride.alive ? "#6ef0ff" : "#ff8a8a";
    ctx.fillStyle = ride.alive ? "rgba(47, 120, 255, 0.45)" : "rgba(90, 16, 24, 0.75)";
    ctx.beginPath();
    ctx.moveTo(-12, -6);
    ctx.lineTo(12, -6);
    ctx.lineTo(8, 16);
    ctx.lineTo(-8, 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-18, -8);
    ctx.lineTo(18, -8);
    ctx.moveTo(-14, 4);
    ctx.lineTo(14, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(-14, 10, 5, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(14, 10, 5, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = ride.alive ? "#e8fbff" : "#ffb4b4";
    ctx.fillRect(-8, -12, 16, 3);
    ctx.restore();
    drawRings(true);

    let score = String(ride.score);
    while (score.length < 4) score = "0" + score;
    ctx.fillStyle = "#6ef0ff";
    ctx.font = "12px Share Tech Mono, monospace";
    ctx.textAlign = "right";
    ctx.fillText("SCORE " + score, width - 14, 36);
    if (!ride.alive) {
      ctx.fillStyle = "rgba(1, 6, 15, 0.45)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#e8fbff";
      ctx.font = "20px Orbitron, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CRASH", width * 0.5, height * 0.46);
    }
    ctx.textAlign = "left";
  }

  const drawers = [drawLattice, drawCore, drawCycle];

  function frameTick(now) {
    const t = reduce ? 1 : now / 1000;
    if (width < 2 || height < 2) resize();
    fade = Math.min(1, fade + 0.06);
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 0.35 + fade * 0.65;
    drawers[scene](t);
    ctx.globalAlpha = 1;
    window.requestAnimationFrame(frameTick);
  }

  resetRide();
  show(0);
  resize();
  window.addEventListener("resize", resize);
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(frame);
  window.requestAnimationFrame(frameTick);
})();
