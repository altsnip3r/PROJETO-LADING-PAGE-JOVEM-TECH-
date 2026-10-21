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

        // Função que normaliza strings (ex: "Backend", "Back-End", "backend" viram todos "backend")
        const normalizar = (txt) => (txt || '').toLowerCase().replace(/[-\s]/g, '');
        const filtroAtual = normalizar(currentCategory);

        devCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardCategory = normalizar(card.getAttribute('data-category'));

            // Checa se o card bate com a pesquisa e categoria
            const matchesSearch = cardText.includes(query);
            const matchesCategory = (filtroAtual === 'all') || (cardCategory === filtroAtual);

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
            currentCategory = btn.getAttribute('data-filter') || 'all';
            devsExpandido = false;
            filtrarDesenvolvedores();
        });
    });

    filtrarDesenvolvedores();

    // ======================================================
    // 2.1 BOLINHA DE "+N" INTELIGENTE (SÓ APARECE SE ULTRAPASSAR 2 LINHAS)
    // Se as habilidades couberem em até 2 linhas, mostra todas diretamente!
    // Se ultrapassar 2 linhas (mudaria a altura do card), agrupa o excesso em "+N".
    // ======================================================
    function inicializarBolinhasSkills() {
        const skillsContainers = document.querySelectorAll('.dev-skills');

        skillsContainers.forEach(container => {
            // Se já tiver bolinha criada, não recria
            if (container.querySelector('.skill-more')) return;

            // Se o card estiver oculto no momento, aguarda ele ficar visível
            if (container.offsetParent === null) return;

            const tags = Array.from(container.querySelectorAll('.skill-tag:not(.skill-more)'));
            if (tags.length <= 4) return; // 4 ou menos sempre cabe perfeitamente

            const firstTagTop = tags[0].offsetTop;
            // Identifica tags que caem na 3ª linha (diferença de altura maior que 38px)
            const tagsExcedentes = tags.filter(tag => (tag.offsetTop - firstTagTop) > 38);

            if (tagsExcedentes.length > 0) {
                // Cria a bolinha "+N"
                const moreBtn = document.createElement('span');
                moreBtn.className = 'skill-tag skill-more';
                moreBtn.textContent = `+${tagsExcedentes.length}`;
                moreBtn.title = 'Clique para ver todas as habilidades';

                // Oculta as tags que sobraram para não deformar o card
                tagsExcedentes.forEach(tag => tag.style.display = 'none');

                // Ao clicar na bolinha, ela expande revelando todas as tags
                moreBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isExpanded = moreBtn.classList.toggle('expanded');
                    if (isExpanded) {
                        tagsExcedentes.forEach(tag => tag.style.display = 'inline-block');
                        moreBtn.textContent = '−';
                        moreBtn.title = 'Clique para recolher';
                    } else {
                        tagsExcedentes.forEach(tag => tag.style.display = 'none');
                        moreBtn.textContent = `+${tagsExcedentes.length}`;
                        moreBtn.title = 'Clique para ver todas as habilidades';
                    }
                });

                container.appendChild(moreBtn);
            }
        });
    }

    // Recalcula as bolinhas se o usuário redimensionar a janela do navegador
    window.addEventListener('resize', () => {
        document.querySelectorAll('.skill-more').forEach(btn => btn.remove());
        document.querySelectorAll('.dev-skills .skill-tag').forEach(tag => tag.style.display = '');
        inicializarBolinhasSkills();
    });

    // ======================================================
    // 3. FAQ INTERATIVO (ACCORDION / SANFONA)
    // ======================================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Fecha todas as outras perguntas abertas
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                const answer = q.nextElementSibling;
                if (answer) answer.classList.remove('open');
                const icon = q.querySelector('.faq-icon');
                if (icon) icon.textContent = '+';
            });

            // Se não estava aberta, abre a atual
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                const answer = question.nextElementSibling;
                if (answer) answer.classList.add('open');
                const icon = question.querySelector('.faq-icon');
                if (icon) icon.textContent = '−';
            }
        });
    });

    // ======================================================
    // 4. FORMULÁRIO DE CONTATO (SIMULAÇÃO DE ENVIO)
    // ======================================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName')?.value.trim();
            const email = document.getElementById('contactEmail')?.value.trim();

            if (!name || !email) {
                if (formFeedback) {
                    formFeedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
                    formFeedback.className = 'form-feedback error';
                    formFeedback.style.display = 'block';
                }
                return;
            }

            // Simula envio com sucesso
            if (formFeedback) {
                formFeedback.textContent = `Obrigado, ${name}! Sua mensagem foi enviada à coordenação do Jovem Tech.`;
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
    // 5. CARROSSEL DE FOTOS DOS POLOS
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
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));

            slides[index].classList.add('active');
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }
            currentIndex = index;
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                let nextIndex = currentIndex + 1;
                if (nextIndex >= slides.length) {
                    nextIndex = 0;
                }
                updateCarousel(nextIndex);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = slides.length - 1;
                }
                updateCarousel(prevIndex);
            });
        }

        indicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                updateCarousel(i);
            });
        });
    });

});