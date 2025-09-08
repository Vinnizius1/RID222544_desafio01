// Adiciona um "ouvinte de evento" que espera todo o conteúdo do HTML da página ser carregado antes de executar o código.
// Isso garante que o script não tentará encontrar um elemento (a imagem) que ainda não existe na página.
document.addEventListener("DOMContentLoaded", () => {
  // Busca no documento HTML o elemento que tem o id "image-content" e o armazena na constante 'lazyImage'.
  // É a nossa imagem que queremos carregar de forma "preguiçosa" (lazy load).
  const lazyImage = document.getElementById("image-content");

  // Uma verificação de segurança: se por algum motivo a imagem não for encontrada na página,
  // o script pára aqui para evitar erros.
  if (!lazyImage) {
    return;
  }

  // Cria uma nova instância do IntersectionObserver.
  // Esta é uma API do navegador que nos permite saber quando um elemento entra ou sai da "janela de visualização" (a tela do usuário).
  // A função que passamos para ele (com 'entries' e 'observer') será executada sempre que a visibilidade do elemento observado mudar.
  const imageObserver = new IntersectionObserver((entries, observer) => {
    // O 'entries' é uma lista de elementos observados que mudaram de estado. Como só estamos observando um,
    // poderíamos acessar 'entries[0]', mas usar um loop 'forEach' é uma prática comum e mais flexível.
    entries.forEach((entry) => {
      // 'entry.isIntersecting' é um valor booleano (true/false).
      // Ele será 'true' se o elemento estiver pelo menos 1 pixel visível na tela.
      if (entry.isIntersecting) {
        // 'entry.target' é o próprio elemento que está sendo observado (a nossa imagem).
        const image = entry.target;

        // AQUI ACONTECE A MÁGICA DO LAZY LOADING:
        // Pegamos a URL da imagem que guardamos no atributo 'data-src' do HTML...
        // ...e a colocamos no atributo 'src'.
        // O navegador, ao ver que o 'src' foi preenchido, começa a baixar e exibir a imagem.
        image.src = image.dataset.src;

        // Adicionamos a classe CSS 'loaded' à imagem.
        // Isso ativa a transição de opacidade que definimos no 'style.css', criando o efeito de fade-in.
        image.classList.add("loaded");

        // DEPOIS QUE A IMAGEM É CARREGADA, NÃO PRECISAMOS MAIS OBSERVÁ-LA.
        // 'unobserve' remove o observador do elemento, o que é bom para a performance do navegador,
        // pois ele não precisa mais se preocupar em verificar a visibilidade deste elemento.
        observer.unobserve(image);
      }
    });
  });

  // Finalmente, dizemos ao nosso observador para começar a "vigiar" o elemento 'lazyImage'.
  imageObserver.observe(lazyImage);
});

/*  */
// LÓGICA DO FORMULÁRIO E TOAST
const contactForm = document.getElementById("contactForm");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const url = contactForm.action;

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          showToast("Formulário enviado com sucesso!");
          nomeInput.value = "";
          emailInput.value = "";
        } else {
          throw new Error("Falha no envio do formulário.");
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        showToast("Ocorreu um erro ao enviar. Tente novamente.", "error");
      });
  });
}

// FUNÇÃO PARA MOSTRAR O TOAST
function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type} show`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  // Remove o toast após 3 segundos
  setTimeout(() => {
    toast.classList.remove("show");
    // Espera a animação de saída terminar para remover o elemento
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}
