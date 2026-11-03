// ==========================================================
// PORTAL JOVEM TECH - SCRIPT DE INTERATIVIDADE
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. MENU MOBILE (ABRIR / FECHAR)
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fecha o menu ao clicar num link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. ALTERNAR TEMA (CLARO / ESCURO)
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            if (themeIcon) themeIcon.textContent = isLight ? '☀️' : '🌙';
            if (themeText) themeText.textContent = isLight ? 'Modo Escuro' : 'Modo Claro';
        });
    }

    // 3. FILTROS E BUSCA NA GALERIA COM "MOSTRAR MAIS"
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const devCards = document.querySelectorAll('.dev-card');
    const devCountMessage = document.getElementById('devCountMessage');
    const btnToggleDevs = document.getElementById('btnToggleDevs');
    const btnToggleDevsText = document.getElementById('btnToggleDevsText');
    const loadMoreContainer = document.getElementById('loadMoreDevsContainer');

    const LIMITE_INICIAL_DEVS = 6;
    let devsExpandido = false;
    let currentCategory = 'all';

    function filtrarDesenvolvedores() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let totalCorrespondentes = 0;
        let visiveisExibidos = 0;

        devCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardCategory = (card.getAttribute('data-category') || '').toLowerCase().trim();

            const matchesSearch = cardText.includes(query);
            const matchesCategory = (currentCategory === 'all') || (cardCategory === currentCategory);

            if (matchesSearch && matchesCategory) {
                totalCorrespondentes++;

                if (devsExpandido || visiveisExibidos < LIMITE_INICIAL_DEVS) {
                    card.style.display = 'flex';
                    visiveisExibidos++;
                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'none';
            }
        });

        if (devCountMessage) {
            devCountMessage.textContent = `Exibindo ${visiveisExibidos} de ${totalCorrespondentes} desenvolvedor(es)`;
        }

        if (loadMoreContainer && btnToggleDevsText) {
            if (totalCorrespondentes <= LIMITE_INICIAL_DEVS) {
                loadMoreContainer.style.display = 'none';
            } else {
                loadMoreContainer.style.display = 'flex';
                btnToggleDevsText.textContent = devsExpandido ? 'Mostrar Menos' : 'Mostrar Mais Desenvolvedores';
            }
        }

        // Atualiza as tags recolhidas
        inicializarBolinhasSkills();
    }

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
            currentCategory = (btn.getAttribute('data-filter') || 'all').toLowerCase();
            devsExpandido = false;
            filtrarDesenvolvedores();
        });
    });

    // 4. BOTÃO DE "+N" NAS HABILIDADES (SOFTSKILLS / HARDSKILLS)
    function inicializarBolinhasSkills() {
        const skillsContainers = document.querySelectorAll('.dev-skills');
        const LIMITE_TAGS = 4; // Exibe 4 tags por padrão

        skillsContainers.forEach(container => {
            // Remove botão anterior se já existir
            const botaoExistente = container.querySelector('.skill-more');
            if (botaoExistente) botaoExistente.remove();

            const tags = Array.from(container.querySelectorAll('.skill-tag'));
            
            if (tags.length > LIMITE_TAGS) {
                const tagsOcultas = tags.slice(LIMITE_TAGS);
                
                // Esconde as tags que passam de 4
                tagsOcultas.forEach(tag => tag.classList.add('skill-hidden'));

                // Cria o botão com a contagem exata (+N)
                const badgeMore = document.createElement('span');
                badgeMore.className = 'skill-tag skill-more';
                badgeMore.title = 'Clique para ver todas as habilidades';
                badgeMore.textContent = `+${tagsOcultas.length}`;

                let expandido = false;
                badgeMore.addEventListener('click', (e) => {
                    e.stopPropagation();
                    expandido = !expandido;

                    tagsOcultas.forEach(tag => {
                        tag.classList.toggle('skill-hidden', !expandido);
                    });

                    badgeMore.textContent = expandido ? '−' : `+${tagsOcultas.length}`;
                    badgeMore.title = expandido ? 'Clique para recolher' : 'Clique para ver todas as habilidades';
                });

                container.appendChild(badgeMore);
            }
        });
    }

    filtrarDesenvolvedores();

    // 5. PERGUNTAS FREQUENTES (FAQ ACCORDION)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const estaAberto = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
                const icone = faq.querySelector('.faq-icon');
                if (icone) icone.textContent = '+';
            });

            if (!estaAberto) {
                item.classList.add('active');
                const icone = item.querySelector('.faq-icon');
                if (icone) icone.textContent = '−';
            }
        });
    });

    // 6. CARROSSEL DOS POLOS
    const tabsPolos = document.querySelectorAll('.minimal-tab-btn');
    const trackUndb = document.getElementById('trackUndb');
    const trackPulse = document.getElementById('trackPulse');
    const prevBtn = document.getElementById('poloStagePrev');
    const nextBtn = document.getElementById('poloStageNext');
    const dotsContainer = document.getElementById('poloStageDots');
    const captionEl = document.getElementById('poloStageCaption');

    let poloAtual = 'undb';
    let slideIndex = 0;

    function getSlidesAtivos() {
        const track = poloAtual === 'undb' ? trackUndb : trackPulse;
        return track ? Array.from(track.querySelectorAll('.polo-track-slide')) : [];
    }

    function atualizarCarrossel() {
        const slides = getSlidesAtivos();
        if (slides.length === 0) return;

        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === slideIndex);
        });

        if (captionEl && slides[slideIndex]) {
            captionEl.textContent = slides[slideIndex].getAttribute('data-caption') || '';
        }

        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `polo-stage-dot ${idx === slideIndex ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Foto ${idx + 1}`);
                dot.addEventListener('click', () => {
                    slideIndex = idx;
                    atualizarCarrossel();
                });
                dotsContainer.appendChild(dot);
            });
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const slides = getSlidesAtivos();
            slideIndex = (slideIndex + 1) % slides.length;
            atualizarCarrossel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const slides = getSlidesAtivos();
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            atualizarCarrossel();
        });
    }

    tabsPolos.forEach(tab => {
        tab.addEventListener('click', () => {
            tabsPolos.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            poloAtual = tab.getAttribute('data-polo');
            slideIndex = 0;

            if (trackUndb && trackPulse) {
                trackUndb.classList.toggle('active-track', poloAtual === 'undb');
                trackPulse.classList.toggle('active-track', poloAtual === 'pulse');
            }

            atualizarCarrossel();
        });
    });

    atualizarCarrossel();

    // 7. FORMULÁRIO DE CONTATO
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('contactName')?.value || 'Visitante';

            if (formFeedback) {
                formFeedback.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`;
                formFeedback.className = 'form-feedback success';
                formFeedback.style.display = 'block';

                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 5000);
            }

            contactForm.reset();
        });
    }
});