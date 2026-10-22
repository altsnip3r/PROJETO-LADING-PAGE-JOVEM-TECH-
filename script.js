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

        // Normaliza texto (ex: "back-end" e "backend" viram iguais)
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
            currentCategory = btn.getAttribute('data-filter');
            devsExpandido = false;
            filtrarDesenvolvedores();
        });
    });

    filtrarDesenvolvedores();

    // ======================================================
    // 2.1 BOLINHA DE "+N" INTELIGENTE (SÓ SE ULTRAPASSAR 2 LINHAS)
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
    // 6. SHOWCASE ESPACIAL AR 3D DOS POLOS (FOTOS SOLTAS NO ESPAÇO)
    // ======================================================
    function inicializarShowcaseEspacialPolos() {
        const stage = document.getElementById('spatialStage');
        const hologram = document.getElementById('spatialHologram');
        const prevBtn = document.getElementById('spatialPrevBtn');
        const nextBtn = document.getElementById('spatialNextBtn');
        const tabs = document.querySelectorAll('.spatial-tab');
        const dotsContainer = document.getElementById('spatialDots');
        const captionTitleEl = document.getElementById('spatialCaptionTitle');

        if (!stage || !hologram) return;

        let currentPolo = 'undb';
        let currentIndex = 0;
        let isAnimating = false;

        function getActiveTrack() {
            return document.getElementById(`track-${currentPolo}`);
        }

        function getActiveSlides() {
            const track = getActiveTrack();
            return track ? Array.from(track.querySelectorAll('.spatial-slide')) : [];
        }

        // Renderiza os pontos minimalistas
        function renderDots(slides, activeIdx) {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = `spatial-dot ${idx === activeIdx ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Ir para a foto ${idx + 1}`);
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isAnimating || idx === currentIndex) return;
                    goToSlide(idx, idx > currentIndex ? 1 : -1);
                });
                dotsContainer.appendChild(dot);
            });
        }

        // Atualiza a legenda suavemente
        function atualizarLegenda(slide, index) {
            const caption = slide.getAttribute('data-caption') || '';

            if (captionTitleEl) {
                captionTitleEl.style.opacity = '0';
                captionTitleEl.style.transform = 'translateY(4px)';
                setTimeout(() => {
                    captionTitleEl.textContent = caption;
                    captionTitleEl.style.opacity = '1';
                    captionTitleEl.style.transform = 'translateY(0)';
                }, 150);
            }

            // Atualiza pontos
            const dots = dotsContainer ? dotsContainer.querySelectorAll('.spatial-dot') : [];
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        }

        // Transição 3D entre fotos
        function goToSlide(newIndex, direction = 1) {
            const slides = getActiveSlides();
            if (slides.length <= 1 || isAnimating) return;
            isAnimating = true;

            const currentSlide = slides[currentIndex];
            const nextSlide = slides[newIndex];

            slides.forEach(s => s.classList.remove('slide-prev', 'slide-next'));

            if (direction === 1) {
                // Próxima: sai para a esquerda em 3D
                currentSlide.classList.remove('active');
                currentSlide.classList.add('slide-prev');

                // Nova entra pela direita
                nextSlide.classList.add('slide-next');
                void nextSlide.offsetWidth;
                nextSlide.classList.remove('slide-next');
                nextSlide.classList.add('active');
            } else {
                // Anterior: sai para a direita em 3D
                currentSlide.classList.remove('active');
                currentSlide.classList.add('slide-next');

                // Nova entra pela esquerda
                nextSlide.classList.add('slide-prev');
                void nextSlide.offsetWidth;
                nextSlide.classList.remove('slide-prev');
                nextSlide.classList.add('active');
            }

            currentIndex = newIndex;
            atualizarLegenda(nextSlide, currentIndex);

            setTimeout(() => {
                slides.forEach((s, idx) => {
                    if (idx !== currentIndex) {
                        s.classList.remove('slide-prev', 'slide-next');
                    }
                });
                isAnimating = false;
            }, 650);
        }

        // Alterna entre Polo HUB UNDB e Anexo PULSE
        function alternarPolo(poloId) {
            if (currentPolo === poloId) return;
            currentPolo = poloId;
            currentIndex = 0;

            // Atualiza tabs
            tabs.forEach(tab => {
                const isActive = tab.getAttribute('data-polo') === poloId;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            // Alterna tracks
            document.querySelectorAll('.spatial-slides-track').forEach(track => {
                track.classList.remove('active-polo');
            });
            const activeTrack = getActiveTrack();
            if (activeTrack) {
                activeTrack.classList.add('active-polo');
            }

            // Reinicia slides do polo selecionado
            const slides = getActiveSlides();
            slides.forEach((slide, idx) => {
                slide.classList.remove('active', 'slide-prev', 'slide-next');
                if (idx === 0) slide.classList.add('active');
            });

            renderDots(slides, 0);
            if (slides[0]) {
                atualizarLegenda(slides[0], 0);
            }
        }

        // Botões de navegação: Setas Verdes Neon
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const slides = getActiveSlides();
                const nextIdx = (currentIndex + 1) % slides.length;
                goToSlide(nextIdx, 1);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const slides = getActiveSlides();
                const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(prevIdx, -1);
            });
        }

        // Clique nas tabs de seleção de Polo
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const polo = tab.getAttribute('data-polo');
                if (polo) alternarPolo(polo);
            });
        });

        // Parallax 3D suave com o movimento do mouse sobre a foto limpa
        hologram.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 880) return;
            const rect = hologram.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6.5;
            const rotateY = ((x - centerX) / centerX) * 6.5;

            if (!isAnimating) {
                hologram.style.transform = `perspective(1400px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;
            }
        });

        hologram.addEventListener('mouseleave', () => {
            hologram.style.transform = '';
        });

        // Touch Swipe para celular
        let touchStartX = 0;
        hologram.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        hologram.addEventListener('touchend', (e) => {
            const diffX = e.changedTouches[0].screenX - touchStartX;
            if (Math.abs(diffX) > 40) {
                const slides = getActiveSlides();
                if (diffX < 0) {
                    const nextIdx = (currentIndex + 1) % slides.length;
                    goToSlide(nextIdx, 1);
                } else {
                    const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
                    goToSlide(prevIdx, -1);
                }
            }
        }, { passive: true });

        // Inicialização
        const initialSlides = getActiveSlides();
        renderDots(initialSlides, 0);
        if (initialSlides[0]) {
            atualizarLegenda(initialSlides[0], 0);
        }
    }

    inicializarShowcaseEspacialPolos();

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