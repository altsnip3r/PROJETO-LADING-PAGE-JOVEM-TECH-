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

        // Função auxiliar que remove hífens e espaços (ex: "back-end" vira "backend")
        const normalizar = (txt) => (txt || '').toLowerCase().replace(/[-\s]/g, '');
        const filtroAtual = normalizar(currentCategory);

        devCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardCategory = normalizar(card.getAttribute('data-category'));

            // Checa se o card bate com a pesquisa e categoria (compara sem hífens)
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
            currentCategory = btn.getAttribute('data-filter');
            devsExpandido = false;
            filtrarDesenvolvedores();
        });
    });

    filtrarDesenvolvedores();

    // ======================================================
    // 2.1 BOLINHA DE "+N" INTELIGENTE (SÓ APARECE SE ULTRAPASSAR 2 LINHAS)
    // Se as habilidades couberem em até 2 linhas, mostra todas diretamente!
    // Se ultrapassar 2 linhas, agrupa o excesso em "+N".
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
        const norm = (txt) => (txt || '').toLowerCase().replace(/[-\s]/g, '');
        const trackAtual = norm(currentProjTrack);

        projCards.forEach(card => {
            const cardTrack = norm(card.getAttribute('data-track'));
            const cardTechs = (card.getAttribute('data-techs') || '').toLowerCase();

            const matchTrack = (trackAtual === 'all') || (cardTrack === trackAtual);
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

    // Ao clicar nos cards de trilha na seção de formação:
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

    // ======================================================
    // 6. POLOS E ESTRUTURA (OPÇÃO 3: ABAS COM TRACINHO NEON & 3D CALIBRADO)
    // ======================================================
    function inicializarPolosMinimalistas() {
        const stage = document.getElementById('polosStage');
        const frame = document.getElementById('poloStageFrame');
        const tabs = document.querySelectorAll('.polo-pill-btn, .minimal-tab-btn');
        const prevBtn = document.getElementById('poloStagePrev');
        const nextBtn = document.getElementById('poloStageNext');
        const dotsContainer = document.getElementById('poloStageDots');
        const captionEl = document.getElementById('poloStageCaption');
        const sheen = frame ? frame.querySelector('.polo-light-sheen') : null;

        if (!frame || tabs.length === 0) return;

        let currentPolo = 'undb';
        let currentIndex = 0;

        function getActiveTrack() {
            return document.getElementById(currentPolo === 'undb' ? 'trackUndb' : 'trackPulse');
        }

        function getActiveSlides() {
            const track = getActiveTrack();
            return track ? Array.from(track.querySelectorAll('.polo-track-slide')) : [];
        }

        function renderDots(slides, activeIdx) {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `polo-stage-dot ${idx === activeIdx ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Ir para a foto ${idx + 1}`);
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const direction = idx > currentIndex ? 1 : -1;
                    goToSlide(idx, direction);
                });
                dotsContainer.appendChild(dot);
            });
        }

        function atualizarLegenda(slide, index) {
            const caption = slide.getAttribute('data-caption') || '';
            if (captionEl) {
                captionEl.style.opacity = '0';
                setTimeout(() => {
                    captionEl.textContent = caption;
                    captionEl.style.opacity = '1';
                }, 120);
            }

            const dots = dotsContainer ? dotsContainer.querySelectorAll('.polo-stage-dot') : [];
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        }

        // Transição 3D em profundidade entre as fotos
        function goToSlide(newIndex, direction = 1) {
            const slides = getActiveSlides();
            if (slides.length <= 1) return;

            const oldIndex = currentIndex;
            currentIndex = (newIndex + slides.length) % slides.length;

            slides.forEach((s, idx) => {
                s.classList.remove('active', 'slide-prev', 'slide-next');
                if (idx === oldIndex) {
                    s.classList.add(direction > 0 ? 'slide-prev' : 'slide-next');
                } else if (idx === currentIndex) {
                    s.classList.add('active');
                }
            });

            atualizarLegenda(slides[currentIndex], currentIndex);
        }

        function alternarPolo(poloId) {
            if (currentPolo === poloId) return;
            currentPolo = poloId;
            currentIndex = 0;

            tabs.forEach(tab => {
                const isActive = tab.getAttribute('data-polo') === poloId;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            document.querySelectorAll('.polo-track').forEach(track => {
                track.classList.remove('active-track');
            });

            const activeTrack = getActiveTrack();
            if (activeTrack) {
                activeTrack.classList.add('active-track');
            }

            const slides = getActiveSlides();
            slides.forEach((s, idx) => {
                s.classList.remove('slide-prev', 'slide-next');
                s.classList.toggle('active', idx === 0);
            });

            renderDots(slides, 0);
            if (slides[0]) {
                atualizarLegenda(slides[0], 0);
            }
        }

        // Setas com transição 3D
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(currentIndex + 1, 1);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(currentIndex - 1, -1);
            });
        }

        // Clique nas Abas
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const polo = tab.getAttribute('data-polo');
                if (polo) alternarPolo(polo);
            });
        });

        // ======================================================
        // EFEITO 3D TILT EQUILIBRADO (SENSIBILIDADE SUAVE & ELEGANTE)
        // ======================================================
        if (stage && frame) {
            let isHovered = false;
            let rafId = null;
            let currentRotateX = 0;
            let currentRotateY = 0;
            let targetRotateX = 0;
            let targetRotateY = 0;

            function updateTilt() {
                if (!isHovered) return;
                // Amortecimento suave (LERP) para eliminar movimentos bruscos ou sensibilidade excessiva
                currentRotateX += (targetRotateX - currentRotateX) * 0.08;
                currentRotateY += (targetRotateY - currentRotateY) * 0.08;

                frame.style.transform = `perspective(1200px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;

                rafId = requestAnimationFrame(updateTilt);
            }

            stage.addEventListener('mouseenter', () => {
                isHovered = true;
                frame.style.transition = 'none';
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(updateTilt);
            });

            stage.addEventListener('mousemove', (e) => {
                if (!isHovered) return;
                const rect = frame.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Ângulo refinado e calibrado: máxima inclinação confortável de ~3.5° a 4°
                targetRotateX = ((y - centerY) / centerY) * -3.6;
                targetRotateY = ((x - centerX) / centerX) * 4.0;

                // Reflexo especular suave e sutil que não ofusca a foto
                if (sheen) {
                    const lightX = ((x / rect.width) * 100).toFixed(1);
                    const lightY = ((y / rect.height) * 100).toFixed(1);
                    sheen.style.background = `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(255, 255, 255, 0.12) 0%, transparent 55%)`;
                }
            });

            stage.addEventListener('mouseleave', () => {
                isHovered = false;
                cancelAnimationFrame(rafId);
                targetRotateX = 0;
                targetRotateY = 0;
                currentRotateX = 0;
                currentRotateY = 0;
                // Retorno suave com física natural
                frame.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                frame.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                if (sheen) {
                    sheen.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, transparent 40%, transparent 65%, rgba(0, 255, 135, 0.08) 100%)';
                }
            });
        }

        // Deslizar o dedo (Swipe) no celular
        let startX = 0;
        frame.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        }, { passive: true });

        frame.addEventListener('touchend', (e) => {
            const diffX = e.changedTouches[0].screenX - startX;
            if (Math.abs(diffX) > 35) {
                if (diffX < 0) goToSlide(currentIndex + 1, 1);
                else goToSlide(currentIndex - 1, -1);
            }
        }, { passive: true });

        // Inicialização
        const initialSlides = getActiveSlides();
        renderDots(initialSlides, 0);
        if (initialSlides[0]) {
            atualizarLegenda(initialSlides[0], 0);
        }
    }

    inicializarPolosMinimalistas();

    // ======================================================
    // 7. HERO COM FOTO ATMOSFÉRICA & PARALLAX SUTIL
    // ======================================================
    function inicializarHeroFotoAtmosferica() {
        const heroSection = document.getElementById('home');
        const heroImg = document.getElementById('heroBgImg');
        const heroPhotoToggle = document.getElementById('heroPhotoToggle');
        const heroPhotoLabel = document.getElementById('heroPhotoLabel');

        if (!heroSection || !heroImg) return;

        // Galeria de fotos reais disponíveis para o fundo
        const fotosHero = [
            {
                src: 'fotos/pulse_2.jpg',
                label: 'Foto Real: Turma Jovem Tech (Pulse)',
                position: 'center 25%'
            },
            {
                src: 'fotos/hub_undb.jpg',
                label: 'Foto Real: Turma Jovem Tech (UNDB)',
                position: 'center 35%'
            }
        ];

        let currentHeroIndex = 0;

        if (heroPhotoToggle && heroPhotoLabel) {
            heroPhotoToggle.addEventListener('click', () => {
                currentHeroIndex = (currentHeroIndex + 1) % fotosHero.length;
                const nextFoto = fotosHero[currentHeroIndex];

                // Efeito suave de fade transition
                heroImg.style.opacity = '0.05';
                heroImg.style.transition = 'opacity 0.35s ease, transform 0.6s ease';

                setTimeout(() => {
                    heroImg.src = nextFoto.src;
                    heroImg.style.objectPosition = nextFoto.position;
                    heroPhotoLabel.textContent = nextFoto.label;
                    
                    const isLight = document.body.classList.contains('light-theme');
                    heroImg.style.opacity = isLight ? '0.35' : '0.62';
                }, 300);
            });
        }

        // Parallax sutil 3D ao movimentar o mouse na seção inicial
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;

            const shiftX = (relX * -14).toFixed(1);
            const shiftY = (relY * -10).toFixed(1);

            heroImg.style.transform = `scale(1.04) translate3d(${shiftX}px, ${shiftY}px, 0)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroImg.style.transform = 'scale(1.03) translate3d(0, 0, 0)';
        });
    }

    inicializarHeroFotoAtmosferica();

});


