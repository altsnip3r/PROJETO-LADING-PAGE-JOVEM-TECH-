// ==========================================================
// PORTAL JOVEM TECH - SCRIPT DE INTERATIVIDADE
// Desenvolvido com JavaScript para aprendizado
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. ALTERNAR TEMA (CLARO / ESCURO)
    // ======================================================
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');

            const isLight = document.body.classList.contains('light-theme');
            if (isLight) {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Modo Escuro';
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Modo Claro';
            }
        });
    }

    // ======================================================
    // 2. FILTROS E BUSCA NA GALERIA COM "MOSTRAR MAIS"
    // ======================================================
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const devCards = document.querySelectorAll('.dev-card');
    const devCountMessage = document.getElementById('devCountMessage');
    const btnToggleDevs = document.getElementById('btnToggleDevs');
    const btnToggleDevsText = document.getElementById('btnToggleDevsText');
    const loadMoreContainer = document.getElementById('loadMoreDevsContainer');

    // Quantidade inicial de cards a serem exibidos
    const LIMITE_INICIAL_DEVS = 6;
    let devsExpandido = false;
    let currentCategory = 'all';

    function filtrarDesenvolvedores() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let totalCorrespondentes = 0;
        let visiveisExibidos = 0;

        devCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();

            const matchesSearch = cardText.includes(query);
            const matchesCategory = (currentCategory === 'all') || (cardCategory === currentCategory.toLowerCase());

            if (matchesSearch && matchesCategory) {
                totalCorrespondentes++;
                // Mostra todos se estiver expandido, ou apenas até o limite inicial
                if (devsExpandido || visiveisExibidos < LIMITE_INICIAL_DEVS) {
                    card.style.display = 'flex';
                    card.classList.remove('dev-hidden');
                    visiveisExibidos++;
                } else {
                    card.style.display = 'none';
                    card.classList.add('dev-hidden');
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('dev-hidden');
            }
        });

        // Atualiza a contagem exibida
        if (devCountMessage) {
            devCountMessage.textContent = `Exibindo ${visiveisExibidos} de ${totalCorrespondentes} desenvolvedor(es)`;
        }

        // Controla exibição do botão Mostrar Mais
        if (loadMoreContainer && btnToggleDevs && btnToggleDevsText) {
            if (totalCorrespondentes <= LIMITE_INICIAL_DEVS) {
                loadMoreContainer.style.display = 'none';
            } else {
                loadMoreContainer.style.display = 'flex';
                btnToggleDevsText.textContent = devsExpandido ? 'Mostrar Menos' : 'Mostrar Mais Desenvolvedores';
                const icon = btnToggleDevs.querySelector('.btn-load-more-icon');
                if (icon) icon.textContent = devsExpandido ? '↑' : '↓';
            }
        }
    }

    // Clique no botão Mostrar Mais / Mostrar Menos
    if (btnToggleDevs) {
        btnToggleDevs.addEventListener('click', () => {
            devsExpandido = !devsExpandido;
            filtrarDesenvolvedores();
            if (!devsExpandido) {
                document.getElementById('devs')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            devsExpandido = false;
            filtrarDesenvolvedores();
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            devsExpandido = false;
            filtrarDesenvolvedores();
        });
    });

    filtrarDesenvolvedores();

    // ======================================================
    // 3. PERGUNTAS FREQUENTES (FAQ ACCORDION)
    // ======================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon');

        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherIcon) otherIcon.textContent = '+';
                });

                if (!isOpen) {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                    if (icon) icon.textContent = '−';
                }
            });
        }
    });

    // ======================================================
    // 4. FORMULÁRIO DE CONTATO (FEEDBACK AMIGÁVEL)
    // ======================================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value;

            if (formFeedback) {
                formFeedback.textContent = `Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Nossa coordenação entrará em contato em breve.`;
                formFeedback.className = 'form-feedback success';
                formFeedback.style.display = 'block';
            }

            contactForm.reset();

            setTimeout(() => {
                if (formFeedback) formFeedback.style.display = 'none';
            }, 6000);
        });
    }

    // ======================================================
    // 5. NAVEGAÇÃO DAS TRILHAS E FILTROS DE PROJETOS POR TECNOLOGIA
    // ======================================================
    const projCards = document.querySelectorAll('.project-card');
    const projTrackButtons = document.querySelectorAll('.proj-filter-btn');
    const projTechChips = document.querySelectorAll('.tech-chip');
    let currentProjTrack = 'all';
    let currentProjTech = 'all';

    function filtrarProjetos() {
        projCards.forEach(card => {
            const cardTrack = (card.getAttribute('data-track') || '').toLowerCase();
            const cardTechs = (card.getAttribute('data-techs') || '').toLowerCase();

            const matchTrack = (currentProjTrack === 'all') || (cardTrack === currentProjTrack.toLowerCase());
            const matchTech = (currentProjTech === 'all') || (cardTechs.includes(currentProjTech.toLowerCase()));

            if (matchTrack && matchTech) {
                card.style.display = 'flex';
                card.classList.remove('proj-hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('proj-hidden');
            }
        });
    }

    projTrackButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            projTrackButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentProjTrack = btn.getAttribute('data-proj-track');
            filtrarProjetos();
        });
    });

    projTechChips.forEach(chip => {
        chip.addEventListener('click', () => {
            projTechChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentProjTech = chip.getAttribute('data-proj-tech');
            filtrarProjetos();
        });
    });

    // Ao clicar em uma trilha na seção de formação:
    // Leva para a seção de projetos com o filtro correspondente ativo
    const clickableTracks = document.querySelectorAll('.clickable-track');
    clickableTracks.forEach(track => {
        track.addEventListener('click', () => {
            const targetTrack = track.getAttribute('data-track-target');
            if (!targetTrack) return;

            currentProjTrack = targetTrack;
            currentProjTech = 'all';

            projTrackButtons.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-proj-track') === targetTrack);
            });
            projTechChips.forEach(chip => {
                chip.classList.toggle('active', chip.getAttribute('data-proj-tech') === 'all');
            });

            filtrarProjetos();
            document.getElementById('projetos')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

});

// ======================================================
// 6. CARROSSEL DE FOTOS DOS POLOS
// ======================================================
const cards = document.querySelectorAll('.polo-card');

cards.forEach(card => {
    const track = card.querySelector('.carousel-track');
    if (!track) return;

    const slides = track.querySelectorAll('.polo-img');
    const nextButton = card.querySelector('.next-btn');
    const prevButton = card.querySelector('.prev-btn');
    const indicators = card.querySelectorAll('.indicator');
    
    let currentIndex = 0;

    function updateCarousel(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            let nextIndex = (currentIndex + 1) % slides.length;
            updateCarousel(nextIndex);
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel(prevIndex);
        });
    }

    indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            updateCarousel(i);
        });
    });
});