/* ============================================
   ANIMEZONE - script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- ACTIVE NAV LINK ----
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.az-navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- FADE IN OBSERVER ----
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => observer.observe(el));

  // ---- NAVBAR SCROLL EFFECT ----
  const navbar = document.querySelector('.az-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.style.borderBottomColor = 'rgba(232,224,32,0.3)';
      } else {
        navbar.style.borderBottomColor = '';
      }
    });
  }

  // ---- HAMBURGER MENU ----
  const toggler = document.querySelector('.navbar-toggler');
  if (toggler) {
    toggler.addEventListener('click', function () {
      const bars = this.querySelectorAll('.bar');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      if (!isExpanded) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity = '';
        bars[2].style.transform = '';
      }
    });
  }

  // ---- GALLERY FILTER ----
  const filterBtns = document.querySelectorAll('.az-filter-btn');
  const galleryItems = document.querySelectorAll('.az-gallery-item');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- LIGHTBOX ----
  const lightbox = document.querySelector('.az-lightbox');
  const lightboxImg = document.querySelector('.az-lightbox-img');
  const lightboxClose = document.querySelector('.az-lightbox-close');
  if (lightbox) {
    document.querySelectorAll('.az-gallery-item').forEach(item => {
      item.addEventListener('click', function () {
        const src = this.querySelector('img').src;
        lightboxImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === this) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

 // ---- AUDIO PLAYER ----
const audioEl = document.getElementById('az-audio');
if (audioEl) {
  const playPauseBtn = document.getElementById('az-play-pause');
  const progressBar = document.getElementById('az-progress');
  const progressContainer = document.getElementById('az-progress-container');
  const currentTimeEl = document.getElementById('az-current-time');
  const totalTimeEl = document.getElementById('az-total-time');
  const volumeSlider = document.getElementById('az-volume');

  const prevBtn = document.getElementById('az-prev');
  const nextBtn = document.getElementById('az-next');
  const shuffleBtn = document.getElementById('az-shuffle');
  const repeatBtn = document.getElementById('az-repeat');

  const trackItems = document.querySelectorAll('.az-track-item');
  const coverImg = document.getElementById('az-cover');
  const trackTitle = document.getElementById('az-track-title');
  const trackArtist = document.getElementById('az-track-artist');

  let currentTrack = 0;
  let isShuffle = false;
  let isRepeat = false;

  const tracks = [];
  trackItems.forEach(item => {
    tracks.push({
      src: item.dataset.src,
      title: item.dataset.title,
      artist: item.dataset.artist,
      cover: item.dataset.cover,
    });
  });

  function loadTrack(idx) {
    if (idx < 0) idx = tracks.length - 1;
    if (idx >= tracks.length) idx = 0;

    currentTrack = idx;
    const t = tracks[idx];

    audioEl.src = t.src;
    coverImg.src = t.cover;
    trackTitle.textContent = t.title;
    trackArtist.textContent = t.artist;

    trackItems.forEach((item, i) => {
      item.classList.toggle('active', i === idx);
      const num = item.querySelector('.az-track-num');
      if (num) num.textContent = i === idx ? '▶' : String(i + 1).padStart(2, '0');
    });

    audioEl.play().catch(() => {});
    updatePlayBtn(true);
  }

  function updatePlayBtn(playing) {
    const icon = playPauseBtn.querySelector('i');
    icon.className = playing ? 'bi bi-pause-fill' : 'bi bi-play-fill';
  }

  function getNextIndex(direction = 1) {
    if (isShuffle) {
      return Math.floor(Math.random() * tracks.length);
    } else {
      let newIndex = currentTrack + direction;

      if (newIndex >= tracks.length) newIndex = 0;
      if (newIndex < 0) newIndex = tracks.length - 1;

      return newIndex;
    }
  }

  // PLAY / PAUSE
  playPauseBtn.addEventListener('click', () => {
    if (audioEl.paused) {
      audioEl.play();
      updatePlayBtn(true);
    } else {
      audioEl.pause();
      updatePlayBtn(false);
    }
  });

  // SHUFFLE
  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.querySelector('i').className =
      isShuffle ? 'bi bi-shuffle text-warning' : 'bi bi-shuffle';
  });

  // REPEAT
  repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.querySelector('i').className =
      isRepeat ? 'bi bi-repeat-fill' : 'bi bi-repeat';
  });

  // NEXT / PREV
  nextBtn.addEventListener('click', () => {
    loadTrack(getNextIndex(1));
  });

  prevBtn.addEventListener('click', () => {
    loadTrack(getNextIndex(-1));
  });

  // AUTO NEXT / REPEAT
  audioEl.addEventListener('ended', () => {
    if (isRepeat) {
      audioEl.currentTime = 0;
      audioEl.play();
    } else {
      loadTrack(getNextIndex(1));
    }
  });

  // PROGRESS BAR
  audioEl.addEventListener('timeupdate', () => {
    if (!audioEl.duration) return;

    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    progressBar.style.width = pct + '%';
    currentTimeEl.textContent = formatTime(audioEl.currentTime);
  });

  audioEl.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audioEl.duration);
  });

  progressContainer.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioEl.currentTime = ratio * audioEl.duration;
  });

  // VOLUME
  volumeSlider.addEventListener('input', function () {
    audioEl.volume = this.value;
  });

  // CLICK TRACK
  trackItems.forEach((item, i) => {
    item.addEventListener('click', () => loadTrack(i));
  });

  function formatTime(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  // INIT
  if (tracks.length > 0) {
    const t = tracks[0];
    audioEl.src = t.src;
    coverImg.src = t.cover;
    trackTitle.textContent = t.title;
    trackArtist.textContent = t.artist;
    trackItems[0].classList.add('active');
  }
}
  // ---- HERO PARALLAX ----
  const heroBg = document.querySelector('.az-hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.2}px)`;
    }, { passive: true });
  }

  // ---- TYPING EFFECT FOR HERO ----
  const typingEl = document.querySelector('.az-typing');
  if (typingEl) {
    const words = ['ANIME', 'MANGA', 'OTAKU', 'KAWAII'];
    let wordIdx = 0, charIdx = 0, deleting = false;
    function type() {
      const word = words[wordIdx];
      typingEl.textContent = deleting ? word.slice(0, charIdx--) : word.slice(0, charIdx++);
      if (!deleting && charIdx > word.length) {
        deleting = true;
        setTimeout(type, 1500);
        return;
      }
      if (deleting && charIdx < 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
      setTimeout(type, deleting ? 60 : 120);
    }
    type();
  }

  // ---- SMOOTH ANCHOR ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
