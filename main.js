// Theme Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Scrollspy Active Section Observer
  setupScrollspy();
});

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function setupScrollspy() {
  const scrollspyItems = document.querySelectorAll('.scrollspy-item');
  const sections = document.querySelectorAll('main section[id]');

  if (!sections.length || !scrollspyItems.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        scrollspyItems.forEach(item => {
          if (item.getAttribute('data-section') === id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// Document Modal Preview Configuration
const documentMap = {
  'resume': {
    title: 'Curriculum Vitae (Resume)',
    file: 'documents/resume.pdf',
    downloadName: 'Tobias_Petersen_Resume.pdf'
  },
  'graduation-certificate': {
    title: 'ZBC Graduation Certificate & Grades',
    file: 'documents/graduation-certificate.pdf',
    downloadName: 'ZBC_Graduation_Certificate.pdf'
  },
  'school-recommendation': {
    title: 'School Recommendation',
    file: 'documents/recommendation.pdf',
    downloadName: 'School_Recommendation.pdf'
  }
};

function openDocumentModal(docKey) {
  const modal = document.getElementById('document-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalViewer = document.getElementById('modal-viewer');
  const downloadBtn = document.getElementById('modal-download-btn');

  const doc = documentMap[docKey];

  if (!modal || !doc) return;

  modalTitle.textContent = doc.title;
  downloadBtn.href = doc.file;
  downloadBtn.setAttribute('download', doc.downloadName);

  modalViewer.innerHTML = `
    <div style="text-align: center; padding: 32px 16px;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.6;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <h4 style="font-size: 1.1rem; margin-bottom: 8px;">${doc.title}</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 16px auto;">
        To preview or download your official document, place the file in your <code>documents/</code> directory as <code>${doc.file}</code>.
      </p>
      <a href="${doc.file}" download="${doc.downloadName}" class="btn btn-primary btn-sm">Direct File Link</a>
    </div>
  `;

  fetch(doc.file, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        modalViewer.innerHTML = `<iframe src="${doc.file}" title="${doc.title}"></iframe>`;
      }
    })
    .catch(() => {});

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDocumentModal() {
  const modal = document.getElementById('document-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDocumentModal();
  }
});
