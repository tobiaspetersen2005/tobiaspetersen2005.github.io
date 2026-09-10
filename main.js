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

// Document Modal Preview Configuration (Mapped to exact PDF paths)
const documentMap = {
  'resume': {
    title: 'Curriculum Vitae (Resume)',
    file: 'documents/CV%20Engelsk.pdf',
    downloadName: 'CV_Engelsk_Tobias_Petersen.pdf'
  },
  'graduation-certificate': {
    title: 'ZBC Graduation Certificate & Grades',
    file: 'documents/Karakterer%20ZBC.pdf',
    downloadName: 'Karakterer_ZBC_Tobias_Petersen.pdf'
  },
  'school-recommendation': {
    title: 'School Recommendation',
    file: 'documents/Anbefalinger_removed.pdf',
    downloadName: 'Anbefalinger_Tobias_Petersen.pdf'
  }
};

function openDocumentModal(docKey) {
  const modal = document.getElementById('document-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalViewer = document.getElementById('modal-viewer');
  const downloadBtn = document.getElementById('modal-download-btn');
  const openTabBtn = document.getElementById('modal-open-tab-btn');

  const doc = documentMap[docKey];

  if (!modal || !doc) return;

  modalTitle.textContent = doc.title;
  downloadBtn.href = doc.file;
  downloadBtn.setAttribute('download', doc.downloadName);

  if (openTabBtn) {
    openTabBtn.href = doc.file;
  }

  // Embed PDF cleanly with fallback
  modalViewer.innerHTML = `
    <object data="${doc.file}" type="application/pdf" width="100%" height="480px">
      <embed src="${doc.file}" type="application/pdf" width="100%" height="480px" />
      <div style="text-align: center; padding: 40px 16px;">
        <p style="font-size: 1rem; margin-bottom: 12px;">PDF preview not supported directly in this browser frame.</p>
        <a href="${doc.file}" target="_blank" class="btn btn-primary btn-sm">Open PDF in New Tab &nearr;</a>
      </div>
    </object>
  `;

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
