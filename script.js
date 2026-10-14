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
    // 2. FILTROS E BUSCA NA GALERIA DE DESENVOLVEDORES
    // ======================================================
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const devCards = document.querySelectorAll('.dev-card');
    const devCountMessage = document.getElementById('devCountMessage');

    // Variável para guardar a categoria atualmente selecionada
    let currentCategory = 'all';

    // Função que aplica a busca e o filtro de categoria juntos
    function filtrarDesenvolvedores() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let visiveis = 0;

        devCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardCategory = card.getAttribute('data-category');

            // Checa se o card bate com o texto pesquisado
            const matchesSearch = cardText.includes(query);

            // Checa se o card bate com a categoria selecionada (ou se está em 'all')
            const matchesCategory = (currentCategory === 'all') || (cardCategory === currentCategory);

            // Se bater em ambos, mostra o card. Senão, esconde.
            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
                visiveis++;
            } else {
                card.style.display = 'none';
            }
        });

        // Atualiza a mensagem com a contagem de devs visíveis
        if (devCountMessage) {
            devCountMessage.textContent = `Exibindo ${visiveis} de ${devCards.length} desenvolvedor(es)`;
        }
    }

    // Ouvinte para quando o usuário digita na barra de pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', filtrarDesenvolvedores);
    }

    // Ouvinte para os botões de filtro (Todos, Back-End, Front-End, Dados)
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões e adiciona no clicado
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Atualiza a categoria atual e refiltra os cards
            currentCategory = btn.getAttribute('data-filter');
            filtrarDesenvolvedores();
        });
    });

    // Roda uma vez no início para contar os cards iniciais
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
                // Verifica se este item já está aberto
                const isOpen = item.classList.contains('active');

                // Fecha todos os outros itens para manter o site organizado
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherIcon) otherIcon.textContent = '+';
                });

                // Se não estava aberto, abre este
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
            e.preventDefault(); // Impede o recarregamento da página

            const name = document.getElementById('contactName').value;

            // Mostra mensagem de sucesso
            if (formFeedback) {
                formFeedback.textContent = `Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Nossa coordenação entrará em contato em breve.`;
                formFeedback.className = 'form-feedback success';
                formFeedback.style.display = 'block';
            }

            // Limpa os campos do formulário
            contactForm.reset();

            // Oculta a mensagem após 6 segundos
            setTimeout(() => {
                if (formFeedback) formFeedback.style.display = 'none';
            }, 6000);
        });
    }

});

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