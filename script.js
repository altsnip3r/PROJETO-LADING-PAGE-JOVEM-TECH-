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
            // Adiciona ou remove a classe 'light-theme' no <body>
            document.body.classList.toggle('light-theme');

            // Verifica se o modo claro está ativo para mudar o texto e ícone
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
    // 2. FILTROS E BUSCA NA GALERIA COM RECURSO "MOSTRAR MAIS"
    // (Funciona diretamente com seus cards escritos no HTML!)
    // ======================================================
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const devCards = document.querySelectorAll('.dev-card');
    const devCountMessage = document.getElementById('devCountMessage');
    const btnToggleDevs = document.getElementById('btnToggleDevs');
    const btnToggleDevsText = document.getElementById('btnToggleDevsText');
    const loadMoreContainer = document.getElementById('loadMoreDevsContainer');

    // Limite inicial de desenvolvedores exibidos (para manter o layout limpo)
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

            // Checa se o card bate com a pesquisa e categoria
            const matchesSearch = cardText.includes(query);
            const matchesCategory = (currentCategory === 'all') || (cardCategory === currentCategory.toLowerCase());

            if (matchesSearch && matchesCategory) {
                totalCorrespondentes++;
                // Se expandido, mostra todos. Se não, mostra apenas até o limite inicial
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

        // Atualiza mensagem com contagem de devs
        if (devCountMessage) {
            devCountMessage.textContent = `Exibindo ${visiveisExibidos} de ${totalCorrespondentes} desenvolvedor(es)`;
        }

        // Controla exibição e texto do botão Mostrar Mais
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

        // Inicializa as bolinhas para os cards que ficaram visíveis
        setTimeout(inicializarBolinhasSkills, 50);
    }

    // Ouvinte para o botão Mostrar Mais / Mostrar Menos
    if (btnToggleDevs) {
        btnToggleDevs.addEventListener('click', () => {
            devsExpandido = !devsExpandido;
            filtrarDesenvolvedores();
            // Ao recolher, rola suavemente para o início da galeria
            if (!devsExpandido) {
                document.getElementById('devs')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Ouvinte da barra de pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            devsExpandido = false;
            filtrarDesenvolvedores();
        });
    }

    // Ouvinte dos botões de filtro da galeria
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
    // 2.1 BOLINHA DE "+N" INTELIGENTE (SÓ APARECE SE ULTRAPASSAR 2 LINHAS)
    // Se as habilidades couberem em até 2 linhas, mostra todas diretamente!
    // Se ultrapassar 2 linhas (mudaria o tamanho do card), agrupa o excesso em "+N".
    // ======================================================
    function inicializarBolinhasSkills() {
        const skillsContainers = document.querySelectorAll('.dev-skills');

        skillsContainers.forEach(container => {
            if (container.querySelector('.skill-more')) return;

            // Se o card estiver oculto no momento, aguarda ele ficar visível
            if (container.offsetParent === null) return;

            const tags = Array.from(container.querySelectorAll('.skill-tag:not(.skill-more)'));
            if (tags.length <= 4) return; // 4 ou menos sempre cabe perfeitamente

            const firstTagTop = tags[0].offsetTop;
            // Identifica tags que caem na 3ª linha (diferença de altura maior que 38px)
            const tagsExcedentes = tags.filter(tag => (tag.offsetTop - firstTagTop) > 38);

            if (tagsExcedentes.length > 0) {
                const primeiroIndiceExcedente = tags.indexOf(tagsExcedentes[0]);
                const tagsOcultas = tags.slice(primeiroIndiceExcedente);

                tagsOcultas.forEach(tag => tag.classList.add('skill-hidden'));

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

    // Executa a medição assim que os cards estiverem renderizados no navegador
    setTimeout(inicializarBolinhasSkills, 100);

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

    // Ao clicar nos cards de trilha na seção de formação (Front-End, Back-End, Dados, Fullstack):
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