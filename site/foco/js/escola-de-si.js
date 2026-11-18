/* gerado por ferramentas/gerar.py · não edite aqui · a fonte é js/partes/ */
/* escola de si 2.0.0 · o JS inteiro: uma função só que se chama sozinha, pra <script defer> */
(function () {

/* parte: js/partes/00-nucleo.js */
/* núcleo · o window.escola (ligar, iniciar, avisar, portal e textos), a classe js no html, o clique barrado em aria-disabled, o cabeçalho grudado e a sanfona do endereço */

/*
O CONTRATO DO window.escola

Quem escreve uma parte de JS lê só isto aqui. O código de baixo pode mudar, o contrato não.

COMO O JS É MONTADO
  O gerador junta as partes de js/partes/ numa função só, que se chama sozinha: o núcleo
  na frente, as outras em ordem de nome. Por isso:
  · tudo roda em modo estrito: o "use strict" daqui de baixo vale pra todas as partes;
  · as partes dividem o mesmo espaço de nomes. Nome solto no topo da parte (const, let,
    function) bate com o de outra e derruba o JS inteiro. Ponha tudo dentro da função do
    escola.ligar ou dentro de um bloco { };
  · o núcleo declara um nome só: escola, que é o próprio window.escola. Não declare outro
    escola na sua parte;
  · nada de import nem export, e a parte não começa com "(", "[" nem crase;
  · o script vai no head com defer: quando ele roda, o HTML da página já foi todo lido.

O QUE O NÚCLEO DÁ

  escola.ligar(nome, seletor, liga)
    registra o que a sua parte faz.
    nome     texto curto e único, o mesmo da parte: "menu", "abas", "revelar"
    seletor  o seletor CSS do que a parte liga: "[data-abas]". Com null, a função roda
             uma vez só na página e recebe o document (é aí que entra ouvinte no document
             ou na window, e o que nasce no portal quando a página carrega)
    liga     function (el) { ... }: recebe o elemento achado. Roda uma vez só por
             elemento, por mais que o escola.iniciar rode de novo, então não precisa
             marcar nada no HTML pra lembrar
    devolve  true quando registrou. false quando o nome já existia (o script veio duas
             vezes na página, ou a liga não é função): aí não liga nada em dobro
    · se a página já começou, o ligar liga na hora o que já está no documento;
    · se a sua liga quebrar, o erro vai pro console com o nome da parte e as outras partes
      seguem ligando.

  escola.iniciar(raiz)
    liga tudo que ainda não foi ligado dentro da raiz, e a própria raiz se ela casar com
    algum seletor.
    raiz     um elemento, ou nada (aí é o documento inteiro)
    devolve  quantas coisas ligou agora. Rodar de novo sem conteúdo novo devolve 0
    · roda sozinho uma vez, quando a página termina de carregar, depois que todas as
      partes registraram o que fazem. A sua parte nunca chama;
    · é pra página: conteúdo que chegou depois (pop-up, lista carregada, trecho trocado)
      se liga com escola.iniciar(oTrechoNovo).

  escola.avisar(el, nome, detalhe)
    solta o evento "escola:" + nome no el, subindo até o document, pra medição e
    integração ouvirem.
    el       o elemento que mudou (a sanfona, a gaveta, o diálogo)
    nome     "abrir", "fechar", "toast" ou "consentimento" (os quatro da direção; precisou
             de outro, pede no relatório)
    detalhe  um objeto, que chega em event.detail. Leva sempre { parte: "<nome do ligar>" }
             e o que mais servir
    devolve  nada
    · ouvir é com document.addEventListener("escola:abrir", function (e) { e.target ... }).

  escola.portal()
    devolve o <div class="eds" id="eds-portal"> do fim do body, e cria na primeira vez.
    · tudo que o JS cria fora do lugar dele (o toast e a região viva, um fundo, uma
      camada) nasce aqui dentro, senão sai sem roupa na versão com escopo;
    · chame de dentro da sua liga, nunca solto no topo da parte.

  escola.textos
    um objeto com as frases que o JS escreve na tela. Começa vazio, ou com o que a página
    pôs antes do script (window.escola = { textos: { ... } }).
    · a parte põe a frase padrão dela sem apagar a que a página trocou:
      escola.textos.faltouEmail = escola.textos.faltouEmail || "faltou seu email";
    · e lê na hora de usar (escola.textos.faltouEmail), nunca guarda cópia, pra troca
      feita depois também valer;
    · chave curta, em português, sem acento.

  O que as outras partes penduram aqui, pela direção: escola.toast(texto, opcoes) e o
  window.escolaToast(texto) do v1, os dois do 20-toast.js. Nome novo no escola é pedido no
  relatório, pra não bater com o de outra parte.

O QUE O NÚCLEO FAZ SOZINHO
  · põe a classe js no <html> assim que roda. O CSS que só vale com JS escreve .js na
    frente, na parte da peça (é contexto, igual superfície);
  · barra o clique, o clique do meio e o Enter em [aria-disabled="true"] e em tudo que
    está dentro dele: nada acontece e o evento não chega em ninguém (o Enter num
    textarea continua quebrando a linha). Peça desligada não precisa conferir isso;
  · põe data-state="stuck" no .site-header depois que a página rola, e tira quando ela
    volta pro topo (só se o valor ainda for stuck);
  · quando a página abre, e quando o endereço muda, abre a <details> que tem o id do
    endereço (#...) ou que tem ele dentro, com as de fora dela, rola até ele e avisa
    escola:abrir com { parte: "sanfona" }.

AS REGRAS DE TODA PARTE (03, seção 8)
  · só troca atributo e classe: quem desenha é o CSS. Nunca escreve style, nunca cria
    <style>;
  · texto vai com textContent, nunca innerHTML;
  · estado fala a língua do ARIA (aria-expanded, data-state="open"); gancho e função
    falam português (data-revelar, escola.toast);
  · o que o v1 fazia continua: o jeito antigo e o novo ligados ao mesmo tempo;
  · sem biblioteca, sem rede, sem cookie.

UM EXEMPLO DE PARTE QUE SE LIGA SOZINHA (js/partes/90-exemplo.js, que não existe: é só
pra mostrar o contrato. A primeira linha da parte é um comentário que diz o que tem ali)

  // exemplo · abre e fecha um painel pelo botão de dentro
  escola.ligar("exemplo", "[data-exemplo]", function (caixa) {
    const botao = caixa.querySelector("button");
    if (!botao) return;
    botao.setAttribute("aria-expanded", "false");
    botao.addEventListener("click", function () {
      const abrir = botao.getAttribute("aria-expanded") !== "true";
      botao.setAttribute("aria-expanded", String(abrir));
      caixa.setAttribute("data-state", abrir ? "open" : "closed");
      escola.avisar(caixa, abrir ? "abrir" : "fechar", { parte: "exemplo" });
    });
  });
*/

"use strict";

const escola = (window.escola = window.escola || {});

if (typeof escola.ligar !== "function") {
  const partes = [];
  const cabecalhos = new Set();
  let comecou = false;
  let quadro = 0;

  escola.textos = escola.textos || {};

  escola.ligar = function (nome, seletor, liga) {
    if (typeof liga !== "function" || partes.some(function (parte) { return parte.nome === nome; })) return false;
    const parte = { nome: String(nome), seletor: seletor || "", liga: liga, ligados: new WeakSet(), feita: false };
    partes.push(parte);
    if (comecou) rodar(parte, document);
    return true;
  };

  escola.iniciar = function (raiz) {
    const onde = raiz && typeof raiz.querySelectorAll === "function" ? raiz : document;
    comecou = true;
    let ligou = 0;
    partes.forEach(function (parte) { ligou += rodar(parte, onde); });
    return ligou;
  };

  escola.avisar = function (el, nome, detalhe) {
    (el || document).dispatchEvent(new CustomEvent("escola:" + nome, { bubbles: true, detail: detalhe || {} }));
  };

  escola.portal = function () {
    let portal = document.getElementById("eds-portal");
    if (!portal && document.body) {
      portal = document.createElement("div");
      portal.className = "eds";
      portal.id = "eds-portal";
      document.body.appendChild(portal);
    }
    return portal;
  };

  /* roda uma parte numa raiz · devolve quantas coisas ligou */
  function rodar(parte, raiz) {
    if (!parte.seletor) {
      if (parte.feita) return 0;
      parte.feita = true;
      return chamar(parte, document);
    }
    let achados = [];
    try {
      achados = Array.from(raiz.querySelectorAll(parte.seletor));
      if (raiz.matches && raiz.matches(parte.seletor)) achados.unshift(raiz);
    } catch (erro) {
      console.error("escola de si · o seletor da parte \"" + parte.nome + "\" não vale: " + parte.seletor, erro);
      return 0;
    }
    let ligou = 0;
    achados.forEach(function (el) {
      if (parte.ligados.has(el)) return;
      parte.ligados.add(el);
      ligou += chamar(parte, el);
    });
    return ligou;
  }

  function chamar(parte, el) {
    try {
      parte.liga(el);
      return 1;
    } catch (erro) {
      console.error("escola de si · a parte \"" + parte.nome + "\" quebrou ao ligar", el, erro);
      return 0;
    }
  }

  /* o clique barrado: aria-disabled="true" deixa chegar no elemento (pra dica abrir) e o núcleo segura a ação */
  function barrar(evento) {
    const alvo = evento.target;
    if (!alvo || !alvo.closest || !alvo.closest("[aria-disabled=\"true\"]")) return;
    evento.preventDefault();
    evento.stopPropagation();
  }

  function barrarEnter(evento) {
    const alvo = evento.target;
    if (evento.key !== "Enter" || !alvo || alvo.tagName === "TEXTAREA" || alvo.isContentEditable) return;
    barrar(evento);
  }

  /* o cabeçalho grudado */
  function marcarCabecalhos() {
    quadro = 0;
    const rolou = window.scrollY > 0;
    cabecalhos.forEach(function (cabecalho) {
      if (!cabecalho.isConnected) {
        cabecalhos.delete(cabecalho);
      } else if (rolou) {
        cabecalho.setAttribute("data-state", "stuck");
      } else if (cabecalho.getAttribute("data-state") === "stuck") {
        cabecalho.removeAttribute("data-state");
      }
    });
  }

  function aoRolar() {
    if (!quadro && cabecalhos.size) quadro = window.requestAnimationFrame(marcarCabecalhos);
  }

  /* a sanfona do endereço */
  function abrirDoEndereco() {
    let id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch (erro) { /* endereço com % torto: usa como veio */ }
    const alvo = id ? document.getElementById(id) : null;
    if (!alvo) return;
    let abriu = false;
    for (let sanfona = alvo.closest("details"); sanfona; sanfona = sanfona.parentElement ? sanfona.parentElement.closest("details") : null) {
      if (sanfona.open) continue;
      sanfona.open = true;
      abriu = true;
      escola.avisar(sanfona, "abrir", { parte: "sanfona" });
    }
    if (abriu) alvo.scrollIntoView();
  }

  function comecar() {
    escola.iniciar(document);
  }

  document.documentElement.classList.add("js");

  escola.ligar("clique-barrado", null, function () {
    window.addEventListener("click", barrar, true);
    window.addEventListener("auxclick", barrar, true);
    window.addEventListener("keydown", barrarEnter, true);
  });

  escola.ligar("cabecalho", ".site-header", function (cabecalho) {
    if (!cabecalhos.size) window.addEventListener("scroll", aoRolar, { passive: true });
    cabecalhos.add(cabecalho);
    marcarCabecalhos();
  });

  escola.ligar("sanfona", null, function () {
    abrirDoEndereco();
    window.addEventListener("hashchange", abrirDoEndereco);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", comecar, { once: true });
  } else {
    Promise.resolve().then(comecar);
  }
}

/* parte: js/partes/10-menu.js */
// menu · a gaveta do menu no celular: abre e fecha por todo .nav-toggle, prende o foco, e fecha com Esc, com clique fora, com clique num link e quando a tela passa de lg

/* o comportamento está no docs/pecas/menu.md (05, 4.3). Avisa escola:abrir e escola:fechar no nav, com
   { parte: "menu" } e, no fechar, o motivo: "botao", "esc", "fora", "link" ou "tela" */
{
  const TELA_LARGA = "(min-width: 64em)";
  const FOCAVEIS = "a[href], button:not([disabled]), input:not([disabled]):not([type=\"hidden\"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex=\"-1\"])";
  const gavetas = new Map();
  let ouvindo = false;

  escola.textos.menuFechar = escola.textos.menuFechar || "fechar";
  escola.textos.menuFecharLeitor = escola.textos.menuFecharLeitor || "fechar o menu";
  escola.textos.menuAbrirLeitor = escola.textos.menuAbrirLeitor || "abrir o menu";

  const larga = function () {
    return window.matchMedia(TELA_LARGA).matches;
  };

  const visivel = function (el) {
    return el.getClientRects().length > 0;
  };

  /* o estado de cada nav: aberto ou não, os botões que mandam nele, quem abriu e o que ficou inert */
  const estadoDe = function (nav) {
    let estado = gavetas.get(nav);
    if (!estado) {
      estado = { nav: nav, aberta: false, botoes: [], quemAbriu: null, inertes: [] };
      gavetas.set(nav, estado);
      nav.classList.remove("open");
      nav.setAttribute("data-state", "closed");
    }
    return estado;
  };

  const aberta = function () {
    for (const estado of gavetas.values()) {
      if (estado.aberta) return estado;
    }
    return null;
  };

  /* o botão conta o estado: aria-expanded, a palavra ao lado do ícone e, no do v1, o aria-label */
  const marcar = function (dele, aberto) {
    dele.botao.setAttribute("aria-expanded", String(aberto));
    if (dele.rotulo) dele.rotulo.textContent = aberto ? escola.textos.menuFechar : dele.palavra;
    if (dele.nome !== null) dele.botao.setAttribute("aria-label", aberto ? escola.textos.menuFecharLeitor : dele.nome);
  };

  /* tudo que não é a gaveta nem o botão, e não está no caminho até eles, fica inert */
  const prender = function (estado, botao) {
    const caminho = new Set();
    [estado.nav, botao].forEach(function (el) {
      for (let pai = el; pai && pai !== document.body; pai = pai.parentElement) caminho.add(pai);
    });
    estado.inertes = [];
    const descer = function (pai) {
      Array.from(pai.children).forEach(function (filho) {
        if (filho === estado.nav || filho === botao) return;
        if (caminho.has(filho)) return descer(filho);
        if (filho.hasAttribute("inert") || filho.tagName === "SCRIPT" || filho.tagName === "STYLE") return;
        filho.setAttribute("inert", "");
        estado.inertes.push(filho);
      });
    };
    if (document.body) descer(document.body);
  };

  /* só tira o inert que a gaveta pôs */
  const soltar = function (estado) {
    estado.inertes.forEach(function (el) { el.removeAttribute("inert"); });
    estado.inertes = [];
  };

  /* a gaveta começa no topo da tela, com a altura do cabeçalho de respiro, e o botão de fechar fica
     ali, por cima. Se tem coisa em cima do cabeçalho (uma faixa de recado) e a página não rolou, a
     página rola até o cabeçalho encostar no topo (ou na barra do WordPress), antes de travar */
  const encostar = function (botao) {
    const cabecalho = botao.closest(".site-header");
    if (!cabecalho) return;
    const sobra = cabecalho.getBoundingClientRect().top - (parseFloat(getComputedStyle(cabecalho).top) || 0);
    if (sobra < 1) return;
    try {
      window.scrollBy({ top: sobra, behavior: "instant" });
    } catch (erro) {
      window.scrollBy(0, sobra);
    }
  };

  const abrir = function (estado, botao) {
    if (estado.aberta || larga()) return;
    encostar(botao);
    estado.aberta = true;
    estado.quemAbriu = botao;
    estado.nav.classList.add("open");
    estado.nav.setAttribute("data-state", "open");
    estado.botoes.forEach(function (dele) { marcar(dele, true); });
    prender(estado, botao);
    if (document.activeElement !== botao) botao.focus();
    escola.avisar(estado.nav, "abrir", { parte: "menu" });
  };

  const fechar = function (estado, motivo, devolverFoco) {
    if (!estado.aberta) return;
    const botao = estado.quemAbriu;
    estado.aberta = false;
    estado.quemAbriu = null;
    estado.nav.classList.remove("open");
    estado.nav.setAttribute("data-state", "closed");
    estado.botoes.forEach(function (dele) { marcar(dele, false); });
    soltar(estado);
    if (devolverFoco && botao && botao.isConnected) botao.focus();
    escola.avisar(estado.nav, "fechar", { parte: "menu", motivo: motivo });
  };

  const fecharTodas = function (motivo) {
    gavetas.forEach(function (estado, nav) {
      if (!nav.isConnected) {
        soltar(estado);
        gavetas.delete(nav);
        return;
      }
      fechar(estado, motivo, false);
    });
  };

  /* o laço do Tab: o botão que abriu, depois os links da gaveta, e de novo o botão */
  const laco = function (estado, evento) {
    const lista = [estado.quemAbriu].concat(Array.from(estado.nav.querySelectorAll(FOCAVEIS))).filter(function (el) {
      return el && visivel(el);
    });
    if (!lista.length) return;
    const agora = lista.indexOf(document.activeElement);
    let proximo = agora === -1 ? 0 : agora + (evento.shiftKey ? -1 : 1);
    if (agora === -1 && evento.shiftKey) proximo = lista.length - 1;
    if (proximo < 0) proximo = lista.length - 1;
    if (proximo >= lista.length) proximo = 0;
    evento.preventDefault();
    lista[proximo].focus();
  };

  const aoTeclar = function (evento) {
    const estado = aberta();
    if (!estado) return;
    if (evento.key === "Escape" || evento.key === "Esc") {
      fechar(estado, "esc", true);
    } else if (evento.key === "Tab") {
      laco(estado, evento);
    }
  };

  /* na captura, antes de todo mundo: clique num link da gaveta fecha e deixa o link seguir; clique fora
     (no véu) fecha e não chega no que está atrás */
  const aoClicar = function (evento) {
    const estado = aberta();
    const alvo = evento.target;
    if (!estado || !alvo || !alvo.closest) return;
    if (estado.nav.contains(alvo)) {
      if (alvo.closest("a[href]")) fechar(estado, "link", false);
      return;
    }
    if (estado.botoes.some(function (dele) { return dele.botao.contains(alvo); })) return;
    evento.preventDefault();
    evento.stopPropagation();
    fechar(estado, "fora", true);
  };

  const ouvir = function () {
    if (ouvindo) return;
    ouvindo = true;
    document.addEventListener("keydown", aoTeclar);
    document.addEventListener("click", aoClicar, true);
    const tela = window.matchMedia(TELA_LARGA);
    const aoMudar = function () {
      if (tela.matches) fecharTodas("tela");
    };
    if (tela.addEventListener) tela.addEventListener("change", aoMudar);
    else if (tela.addListener) tela.addListener(aoMudar);
  };

  escola.ligar("menu", ".nav-toggle", function (botao) {
    const id = botao.getAttribute("aria-controls") || "site-nav";
    const nav = document.getElementById(id);
    if (!nav) return;
    if (!botao.hasAttribute("aria-controls")) botao.setAttribute("aria-controls", id);
    const rotulo = botao.querySelector(".nav-toggle-label");
    if (!rotulo && !botao.getAttribute("aria-label") && !botao.textContent.trim()) {
      botao.setAttribute("aria-label", escola.textos.menuAbrirLeitor);
    }
    const estado = estadoDe(nav);
    const dele = {
      botao: botao,
      rotulo: rotulo,
      palavra: rotulo ? rotulo.textContent : "",
      nome: botao.getAttribute("aria-label")
    };
    estado.botoes.push(dele);
    marcar(dele, estado.aberta);
    botao.addEventListener("click", function () {
      if (estado.aberta) fechar(estado, "botao", true);
      else abrir(estado, botao);
    });
    ouvir();
  });
}

/* parte: js/partes/15-agenda.js */
// agenda · esconde a atividade que já passou, corta no data-limit, marca a próxima com data-proxima e mostra o .empty de dentro quando não sobra data

/*
O que lê no HTML (os atributos são os do v1):
  [data-agenda]   a lista (o .evs). data-limit="4" diz quantos cartões aparecem
  [data-date]     cada atividade, com o dia escrito aaaa-mm-dd. data-end é o último dia, quando são vários

O que escreve:
  hidden          na atividade que já passou e na que passa do limite. O v1 tirava o cartão da
                  página; aqui ele só se esconde
  data-proxima    na primeira atividade que sobrou: a borda dela vira a moldura da marca (65-blocos.css)
  hidden, tirado  do .empty de dentro da lista, quando não sobra nenhuma data

A conta do dia é a do v1, pelo relógio de quem visita: a atividade vale até 23:59:59 do último dia
(data-end, ou data-date quando é um dia só). Data que não se entende (o aaaa-mm-dd do exemplo) não
some. O HTML já vem da data mais perto pra mais longe: o JS não reordena.

Sem JS, todas aparecem, na ordem do HTML, e nenhuma ganha a moldura.
*/

escola.ligar("agenda", "[data-agenda]", function (lista) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const limite = parseInt(lista.getAttribute("data-limit") || "0", 10);
  const sobram = [];

  lista.querySelectorAll("[data-date]").forEach(function (item) {
    const dia = item.getAttribute("data-end") || item.getAttribute("data-date");
    if (new Date(dia + "T23:59:59") < hoje) {
      item.hidden = true;
      item.removeAttribute("data-proxima");
    } else {
      sobram.push(item);
    }
  });

  sobram.forEach(function (item, i) {
    item.hidden = limite > 0 && i >= limite;
    if (i === 0) {
      item.setAttribute("data-proxima", "");
    } else {
      item.removeAttribute("data-proxima");
    }
  });

  if (!sobram.length) {
    lista.querySelectorAll(".empty").forEach(function (vazio) {
      vazio.hidden = false;
    });
  }
});

/* parte: js/partes/20-toast.js */
// toast · a confirmação pequena embaixo da tela: um por vez, em fila, com a região viva criada na carga. escola.toast() e o window.escolaToast() do v1
{
  const fila = [];
  let toast = null;

  /* monta o toast e a região viva no portal, quando a página carrega */
  function montar() {
    const portal = escola.portal();
    if (!portal) return null;
    escola.textos.fecharToast = escola.textos.fecharToast || "fechar";

    const viva = document.createElement("div");
    viva.className = "sr-only";
    viva.setAttribute("role", "status");

    const caixa = document.createElement("div");
    caixa.className = "toast";
    caixa.hidden = true;
    const texto = document.createElement("p");
    texto.setAttribute("aria-hidden", "true"); // quem fala o texto é a região viva: aqui ele é só o que se vê
    const acao = document.createElement("button");
    acao.type = "button";
    acao.className = "toast-action";
    acao.hidden = true;
    const fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "toast-close";
    const icone = document.createElement("span");
    icone.className = "icon icon--fechar";
    icone.setAttribute("aria-hidden", "true");
    fechar.appendChild(icone);
    caixa.append(texto, acao, fechar);
    portal.append(viva, caixa);

    let atual = null;
    let relogio = 0;
    let sobra = 0;
    let comecou = 0;
    let emCima = false;
    let focoDentro = false;
    let voltar = null;

    function armar() {
      clearTimeout(relogio);
      if (!atual || sobra === Infinity || emCima || focoDentro) return;
      comecou = Date.now();
      relogio = setTimeout(esconder, sobra);
    }

    function pausar() {
      if (!atual || sobra === Infinity) return;
      clearTimeout(relogio);
      if (comecou) sobra = Math.max(0, sobra - (Date.now() - comecou));
      comecou = 0;
    }

    function mostrar(item) {
      atual = item;
      texto.textContent = item.texto;
      fechar.setAttribute("aria-label", escola.textos.fecharToast);
      acao.hidden = !item.acao;
      acao.textContent = item.acao ? item.acao.texto : "";
      caixa.hidden = false;
      void caixa.offsetWidth; // a caixa aparece transparente antes, pra a opacidade ter de onde andar
      caixa.classList.add("show");
      viva.textContent = "";
      setTimeout(function () { viva.textContent = item.texto; }, 60);
      sobra = item.tempo;
      armar();
      escola.avisar(caixa, "toast", { parte: "toast", texto: item.texto, tipo: item.tipo });
    }

    function esconder() {
      clearTimeout(relogio);
      if (!atual) return;
      const tinhaFoco = caixa.contains(document.activeElement);
      atual = null;
      caixa.classList.remove("show");
      if (tinhaFoco && voltar && voltar.isConnected) voltar.focus();
      let feito = false;
      const fim = function () {
        if (feito) return;
        feito = true;
        caixa.removeEventListener("transitionend", fim);
        if (!caixa.classList.contains("show")) caixa.hidden = true;
        proximo();
      };
      caixa.addEventListener("transitionend", fim);
      setTimeout(fim, 400);
    }

    function proximo() {
      if (!atual && caixa.hidden && fila.length) mostrar(fila.shift());
    }

    fechar.addEventListener("click", esconder);
    acao.addEventListener("click", function () {
      const item = atual;
      esconder();
      if (item && item.acao && typeof item.acao.ao === "function") item.acao.ao();
    });
    caixa.addEventListener("mouseenter", function () { emCima = true; pausar(); });
    caixa.addEventListener("mouseleave", function () { emCima = false; armar(); });
    caixa.addEventListener("focusin", function (evento) {
      if (!focoDentro && evento.relatedTarget && !caixa.contains(evento.relatedTarget)) voltar = evento.relatedTarget;
      focoDentro = true;
      pausar();
    });
    caixa.addEventListener("focusout", function (evento) {
      if (caixa.contains(evento.relatedTarget)) return;
      focoDentro = false;
      armar();
    });
    caixa.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") esconder();
    });

    return { proximo: proximo };
  }

  if (escola.ligar("toast", null, function () { toast = montar(); if (toast) toast.proximo(); })) {
    /* escola.toast("link copiado") ou escola.toast(texto, { tipo: "erro", acao: { texto: "tentar de novo", ao: fn } }).
       Fica 5 segundos mais um tanto por letra; o de erro não some sozinho */
    escola.toast = function (texto, opcoes) {
      const o = opcoes || {};
      const item = { texto: String(texto == null ? "" : texto).trim(), tipo: o.tipo === "erro" ? "erro" : "info" };
      if (!item.texto) return;
      item.acao = o.acao && o.acao.texto ? { texto: String(o.acao.texto), ao: o.acao.ao } : null;
      item.tempo = item.tipo === "erro" ? Infinity : 5000 + item.texto.length * 50;
      fila.push(item);
      if (toast) toast.proximo();
    };

    /* o jeito do v1 continua */
    window.escolaToast = function (texto) {
      escola.toast(texto);
    };
  }
}

/* parte: js/partes/25-avisos.js */
// avisos · o fechar do aviso e da faixa de recado (data-fechar fora de dialog), e a faixa fechada lembrada até o fim da sessão
{
  const CHAVE = "eds-faixas-fechadas";

  function fechadas() {
    try {
      return JSON.parse(sessionStorage.getItem(CHAVE) || "[]");
    } catch (erro) {
      return [];
    }
  }

  function lembrar(nome) {
    try {
      const lista = fechadas();
      if (lista.indexOf(nome) < 0) lista.push(nome);
      sessionStorage.setItem(CHAVE, JSON.stringify(lista));
    } catch (erro) { /* sem sessionStorage (aba anônima, bloqueio): a faixa só volta na próxima página */ }
  }

  /* o próximo lugar que recebe foco depois da caixa, pra quem fechou pelo teclado não cair no topo da página */
  function depoisDe(caixa) {
    const alvos = document.querySelectorAll("a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex='-1'])");
    for (let i = 0; i < alvos.length; i++) {
      const alvo = alvos[i];
      if (caixa.compareDocumentPosition(alvo) & Node.DOCUMENT_POSITION_FOLLOWING && !caixa.contains(alvo) &&
          !alvo.disabled && alvo.offsetParent !== null) return alvo;
    }
    return null;
  }

  escola.ligar("avisos", "[data-fechar]", function (botao) {
    if (botao.closest("dialog")) return; // dentro de dialog, quem atende é o 30-modal.js
    const caixa = botao.closest(".alert, .banner");
    if (!caixa) return;
    const nome = caixa.classList.contains("banner") ? (caixa.id || caixa.textContent.replace(/\s+/g, " ").trim().slice(0, 120)) : "";
    if (nome && fechadas().indexOf(nome) > -1) {
      caixa.hidden = true;
      return;
    }
    botao.hidden = false;
    botao.addEventListener("click", function () {
      if (caixa.contains(document.activeElement)) {
        const proximo = depoisDe(caixa);
        if (proximo) proximo.focus();
      }
      caixa.hidden = true;
      if (nome) lembrar(nome);
      escola.avisar(caixa, "fechar", { parte: "avisos" });
    });
  });
}

/* parte: js/partes/30-modal.js */
// modal · abre e fecha o <dialog class="modal"> (o foco no título, o Esc, o clique no fundo, o foco de volta pro gatilho) e a galeria de fotos na .modal--media
{
  const voltas = new WeakMap();
  const prontos = new WeakSet();
  let galeria = null;

  function abrir(dialogo, quem) {
    preparar(dialogo);
    if (dialogo.open) return;
    voltas.set(dialogo, quem || document.activeElement);
    dialogo.removeAttribute("data-state");
    dialogo.showModal();
    const titulo = dialogo.querySelector(".modal-title");
    if (titulo) {
      if (!titulo.hasAttribute("tabindex")) titulo.setAttribute("tabindex", "-1");
      titulo.focus();
    }
    escola.avisar(dialogo, "abrir", { parte: "modal" });
  }

  /* fecha com a animação de saída, quando tem (com menos movimento ela não existe e fecha na hora) */
  function fechar(dialogo) {
    if (!dialogo.open || dialogo.getAttribute("data-state") === "closing") return;
    dialogo.setAttribute("data-state", "closing");
    const nome = getComputedStyle(dialogo).animationName || "none";
    let feito = false;
    const fim = function () {
      if (feito) return;
      feito = true;
      dialogo.removeAttribute("data-state");
      if (dialogo.open) dialogo.close();
    };
    if (nome === "none") return fim();
    dialogo.addEventListener("animationend", fim, { once: true });
    setTimeout(fim, 400);
  }

  function preparar(dialogo) {
    if (prontos.has(dialogo)) return;
    prontos.add(dialogo);
    let apertouFora = false;
    dialogo.addEventListener("cancel", function (evento) {
      evento.preventDefault(); // o Esc fecha pela mesma porta, com a animação
      fechar(dialogo);
    });
    dialogo.addEventListener("close", function () {
      dialogo.removeAttribute("data-state");
      const volta = voltas.get(dialogo);
      voltas.delete(dialogo);
      if (volta && volta.isConnected && typeof volta.focus === "function") volta.focus();
      escola.avisar(dialogo, "fechar", { parte: "modal" });
    });
    /* clique no fundo (o véu) fecha, menos com data-fechar-fora="nao" (janela com formulário) */
    const fora = function (evento) {
      if (evento.target !== dialogo) return false;
      const r = dialogo.getBoundingClientRect();
      return evento.clientX < r.left || evento.clientX > r.right || evento.clientY < r.top || evento.clientY > r.bottom;
    };
    dialogo.addEventListener("pointerdown", function (evento) { apertouFora = fora(evento); });
    dialogo.addEventListener("click", function (evento) {
      const botao = evento.target.closest("[data-fechar]");
      if (botao && dialogo.contains(botao)) {
        evento.preventDefault();
        return fechar(dialogo);
      }
      if (apertouFora && fora(evento) && dialogo.getAttribute("data-fechar-fora") !== "nao") fechar(dialogo);
      apertouFora = false;
    });
  }

  /* o gatilho é um link de verdade: sem JS (ou sem <dialog>) ele leva pra página do conteúdo */
  escola.ligar("modal", "[data-modal]", function (gatilho) {
    gatilho.addEventListener("click", function (evento) {
      const dialogo = document.getElementById(gatilho.getAttribute("data-modal"));
      if (!dialogo || typeof dialogo.showModal !== "function") return;
      evento.preventDefault();
      abrir(dialogo, gatilho);
    });
  });

  escola.ligar("modal-janela", ".modal", function (dialogo) {
    if (typeof dialogo.showModal === "function") preparar(dialogo);
  });

  /* a galeria: cada link com data-galeria abre a foto grande na .modal--media, com anterior e próxima
     (e as setas do teclado), o contador e a legenda, que vem do alt da foto pequena */
  function montarGaleria() {
    const portal = escola.portal();
    if (!portal || typeof document.createElement("dialog").showModal !== "function") return null;
    const t = function (chave) { return escola.textos[chave]; };
    escola.textos.fechar = escola.textos.fechar || "fechar";
    escola.textos.fotoAnterior = escola.textos.fotoAnterior || "foto anterior";
    escola.textos.fotoProxima = escola.textos.fotoProxima || "próxima foto";
    escola.textos.contadorFotos = escola.textos.contadorFotos || "{n} de {total}";

    const criar = function (tag, classe, pai) {
      const el = document.createElement(tag);
      if (classe) el.className = classe;
      if (pai) pai.appendChild(el);
      return el;
    };
    const comIcone = function (classe, icone, pai) {
      const botao = criar("button", classe, pai);
      botao.type = "button";
      criar("span", "icon " + icone, botao).setAttribute("aria-hidden", "true");
      return botao;
    };

    const dialogo = criar("dialog", "modal modal--media", portal);
    dialogo.setAttribute("aria-labelledby", "eds-galeria-titulo");
    const cabeca = criar("div", "modal-head", dialogo);
    const contador = criar("p", "modal-title meta tnum", cabeca);
    contador.id = "eds-galeria-titulo";
    contador.tabIndex = -1;
    const fecharBotao = comIcone("modal-close btn btn--icon btn--small", "icon--fechar", cabeca);
    fecharBotao.setAttribute("data-fechar", "");
    const corpo = criar("figure", "modal-body", dialogo);
    const foto = criar("img", "", corpo);
    const legenda = criar("figcaption", "", corpo);
    legenda.setAttribute("aria-hidden", "true");
    const acoes = criar("div", "modal-actions", dialogo);
    const antes = comIcone("btn btn--icon", "icon--seta-esquerda", acoes);
    const depois = comIcone("btn btn--icon", "icon--seta-direita", acoes);
    const viva = criar("p", "sr-only", dialogo);
    viva.setAttribute("aria-live", "polite");

    let lista = [];
    let agora = 0;

    function mostrar(i, falar) {
      agora = (i + lista.length) % lista.length;
      const link = lista[agora];
      const pequena = link.querySelector("img");
      const alt = pequena ? pequena.getAttribute("alt") || "" : "";
      foto.src = link.href;
      foto.alt = alt;
      legenda.textContent = alt;
      legenda.hidden = !alt;
      const conta = t("contadorFotos").replace("{n}", agora + 1).replace("{total}", lista.length);
      contador.textContent = conta;
      fecharBotao.setAttribute("aria-label", t("fechar"));
      antes.setAttribute("aria-label", t("fotoAnterior"));
      depois.setAttribute("aria-label", t("fotoProxima"));
      antes.hidden = depois.hidden = lista.length < 2;
      if (falar) viva.textContent = conta + (alt ? ": " + alt : "");
    }

    antes.addEventListener("click", function () { mostrar(agora - 1, true); });
    depois.addEventListener("click", function () { mostrar(agora + 1, true); });
    dialogo.addEventListener("keydown", function (evento) {
      if (lista.length < 2 || evento.altKey || evento.ctrlKey || evento.metaKey) return;
      if (evento.key === "ArrowLeft") mostrar(agora - 1, true);
      else if (evento.key === "ArrowRight") mostrar(agora + 1, true);
      else return;
      evento.preventDefault();
    });

    return {
      abrir: function (link) {
        const nome = link.getAttribute("data-galeria");
        lista = Array.prototype.filter.call(document.querySelectorAll("[data-galeria]"), function (outro) {
          return outro.getAttribute("data-galeria") === nome && outro.href;
        });
        viva.textContent = "";
        mostrar(Math.max(0, lista.indexOf(link)), false);
        abrir(dialogo, link);
      }
    };
  }

  escola.ligar("galeria", "[data-galeria]", function (link) {
    link.addEventListener("click", function (evento) {
      if (evento.button || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey || !link.href) return;
      if (!galeria) galeria = montarGaleria();
      if (!galeria) return; // navegador sem <dialog>: o link abre a foto
      evento.preventDefault();
      galeria.abrir(link);
    });
  });
}

/* parte: js/partes/35-abas.js */
// abas · monta a fileira de abas a partir dos painéis do [data-abas], troca com clique, com as setas, Home e End, e abre a aba do endereço (#id-do-painel)

/* o comportamento está no docs/pecas/abas.md (05, 4.7). Avisa escola:abrir no painel que apareceu, com
   { parte: "abas", painel: "<id>", por: "clique", "teclado" ou "endereco" }; a escolha da carga não avisa */
{
  const idLivre = function (desejado) {
    let id = desejado;
    for (let n = 2; document.getElementById(id); n += 1) id = desejado + "-" + n;
    return id;
  };

  escola.ligar("abas", "[data-abas]", function (caixa) {
    const paineis = Array.from(caixa.children).filter(function (el) {
      return el.classList.contains("tab-panel") && el.id;
    });
    if (paineis.length < 2) return;

    /* a fileira de uma cópia salva da página sai, pra não ficar dobrada */
    Array.from(caixa.children).forEach(function (el) {
      if (el.classList.contains("tab-list")) el.remove();
    });

    const fileira = document.createElement("div");
    fileira.className = "tab-list";
    fileira.setAttribute("role", "tablist");
    if (caixa.hasAttribute("aria-label")) fileira.setAttribute("aria-label", caixa.getAttribute("aria-label"));

    const abas = paineis.map(function (painel) {
      const titulo = painel.querySelector(".tab-title");
      const aba = document.createElement("button");
      aba.type = "button";
      aba.className = "tab";
      aba.id = idLivre(painel.id + "-aba");
      aba.setAttribute("role", "tab");
      aba.setAttribute("aria-controls", painel.id);
      aba.textContent = titulo ? titulo.textContent.trim() : painel.id;
      painel.setAttribute("role", "tabpanel");
      painel.setAttribute("tabindex", "0");
      if (titulo) {
        if (!titulo.id) titulo.id = idLivre(painel.id + "-titulo");
        painel.setAttribute("aria-labelledby", titulo.id);
      } else {
        painel.setAttribute("aria-labelledby", aba.id);
      }
      fileira.appendChild(aba);
      return aba;
    });
    caixa.insertBefore(fileira, paineis[0]);

    /* a aba escolhida rola pra dentro da fileira (só a fileira: a página não mexe) */
    const praVista = function (aba) {
      const f = fileira.getBoundingClientRect();
      const a = aba.getBoundingClientRect();
      if (a.left < f.left) fileira.scrollLeft -= f.left - a.left;
      else if (a.right > f.right) fileira.scrollLeft += a.right - f.right;
    };

    const escolher = function (i, por) {
      const antes = abas.findIndex(function (aba) { return aba.getAttribute("aria-selected") === "true"; });
      if (por === "clique" && antes !== -1 && antes !== i) {
        fileira.setAttribute("data-direcao", i > antes ? "direita" : "esquerda");
      } else {
        fileira.removeAttribute("data-direcao");
      }
      abas.forEach(function (aba, j) {
        const esta = j === i;
        aba.setAttribute("aria-selected", String(esta));
        aba.setAttribute("tabindex", esta ? "0" : "-1");
        paineis[j].hidden = !esta;
      });
      praVista(abas[i]);
      if (antes !== i && por !== "inicio") {
        escola.avisar(paineis[i], "abrir", { parte: "abas", painel: paineis[i].id, por: por });
      }
    };

    /* o painel do endereço: o próprio, ou o que tem o alvo dentro. -1 quando não é daqui */
    const doEndereco = function () {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch (erro) { /* endereço com % torto: usa como veio */ }
      const alvo = id ? document.getElementById(id) : null;
      if (!alvo) return { i: -1, alvo: null };
      return {
        i: paineis.findIndex(function (painel) { return painel === alvo || painel.contains(alvo); }),
        alvo: alvo
      };
    };

    abas.forEach(function (aba, i) {
      aba.addEventListener("click", function () { escolher(i, "clique"); });
    });

    fileira.addEventListener("keydown", function (evento) {
      const i = abas.indexOf(evento.target);
      if (i === -1) return;
      let j = -1;
      if (evento.key === "ArrowRight" || evento.key === "Right") j = (i + 1) % abas.length;
      else if (evento.key === "ArrowLeft" || evento.key === "Left") j = (i - 1 + abas.length) % abas.length;
      else if (evento.key === "Home") j = 0;
      else if (evento.key === "End") j = abas.length - 1;
      if (j === -1) return;
      evento.preventDefault();
      escolher(j, "teclado");
      abas[j].focus();
    });

    window.addEventListener("hashchange", function () {
      const daqui = doEndereco();
      if (daqui.i === -1) return;
      escolher(daqui.i, "endereco");
      daqui.alvo.scrollIntoView();
    });

    const inicio = doEndereco();
    escolher(inicio.i === -1 ? 0 : inicio.i, "inicio");
    if (inicio.i !== -1) inicio.alvo.scrollIntoView();
  });
}

/* parte: js/partes/40-suspenso.js */
// suspenso · o menu suspenso (<details data-suspenso>): fecha com Esc devolvendo o foco, com clique fora e quando outro abre. E o Esc da dica (.tip-anchor)
{
  const menus = new Set();

  function fecharMenu(menu, focar) {
    if (!menu.open) return;
    menu.open = false;
    const gatilho = menu.querySelector("summary");
    if (focar && gatilho) gatilho.focus();
  }

  escola.ligar("suspenso", "[data-suspenso]", function (menu) {
    if (menu.tagName !== "DETAILS") return;
    menus.add(menu);
    menu.addEventListener("toggle", function () {
      if (menu.open) {
        menus.forEach(function (outro) {
          if (outro !== menu && outro.isConnected && !outro.contains(menu)) fecharMenu(outro, false);
        });
      }
      escola.avisar(menu, menu.open ? "abrir" : "fechar", { parte: "suspenso" });
    });
    menu.addEventListener("keydown", function (evento) {
      if (evento.key !== "Escape" || !menu.open) return;
      evento.preventDefault(); // dentro de uma janela, o Esc fecha só o menu
      evento.stopPropagation();
      fecharMenu(menu, true);
    });
    /* escolher um item que é botão (ordenar, filtrar) fecha o menu e devolve o foco */
    menu.addEventListener("click", function (evento) {
      const item = evento.target.closest(".dropdown-item");
      if (item && item.tagName === "BUTTON" && !item.disabled && menu.contains(item)) fecharMenu(menu, true);
    });
  });

  /* o que vale pra página inteira: clique fora fecha o menu; Esc esconde a dica que estiver à mostra */
  escola.ligar("suspenso-fora", null, function () {
    document.addEventListener("click", function (evento) {
      menus.forEach(function (menu) {
        if (!menu.isConnected) return menus.delete(menu);
        if (menu.open && !menu.contains(evento.target)) fecharMenu(menu, false);
      });
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key !== "Escape") return;
      let escondeu = false;
      document.querySelectorAll(".tip-anchor").forEach(function (ancora) {
        const balao = ancora.querySelector(".tip");
        if (!balao || ancora.getAttribute("data-state") === "closed" || getComputedStyle(balao).opacity === "0") return;
        ancora.setAttribute("data-state", "closed");
        escondeu = true;
      });
      if (escondeu) evento.preventDefault(); // dentro de uma janela, o Esc fecha só a dica
    }, true);
  });

  /* a dica fechada pelo Esc volta a valer quando o mouse e o foco saem da âncora */
  escola.ligar("dica", ".tip-anchor", function (ancora) {
    const soltar = function () {
      if (ancora.getAttribute("data-state") !== "closed") return;
      if (ancora.matches(":hover") || ancora.contains(document.activeElement)) return;
      ancora.removeAttribute("data-state");
    };
    ancora.addEventListener("mouseleave", function () { setTimeout(soltar, 0); });
    ancora.addEventListener("focusout", function () { setTimeout(soltar, 0); });
  });
}

/* parte: js/partes/45-formularios.js */
// formulários · o erro na hora certa, o resumo de erros, o contador, o não enviar duas vezes (com o texto do botão enquanto envia), a área de soltar arquivo e o mostrar a senha
{
  escola.textos = escola.textos || {};
  const padrao = {
    faltouNome: "faltou seu nome",
    faltouEmail: "faltou seu email",
    emailSemArroba: "esse email tá sem o @",
    emailIncompleto: "confere o email: falta o final, tipo @gmail.com",
    faltouAceite: "faltou marcar o aceite",
    faltouEscolher: "faltou escolher uma opção",
    faltouArquivo: "faltou escolher o arquivo",
    faltouCampo: "faltou preencher aqui",
    passouDoTamanho: "passou do tamanho: corta um pouquinho",
    tamanhoCurto: "tá curtinho: escreve mais um pouco",
    confereFormato: "confere o que você escreveu aqui",
    resumoErros: "faltou um detalhe em {n} campos",
    contador: "{n} de {max}",
    faltamPoucas: "faltam {n} letras",
    chegouNoLimite: "chegou no limite de {max} letras"
  };
  Object.keys(padrao).forEach(function (chave) { escola.textos[chave] = escola.textos[chave] || padrao[chave]; });

  /* lê a frase na hora de usar: a troca que a página fizer depois também vale */
  function texto(chave) {
    return (escola.textos && escola.textos[chave]) || padrao[chave];
  }

  const erros = new WeakMap();   // campo → { caixa, escrito } da mensagem dele
  const errou = new WeakSet();   // campo que já mostrou erro: daí em diante confere a cada letra
  const mexeu = new WeakSet();   // campo que a pessoa já editou
  const resumos = new WeakMap(); // formulário → o resumo de erros que o JS criou
  const botoes = new WeakMap();  // formulário → o botão que está enviando
  let conta = 0;
  let viva = null;               // a região viva dos formulários, criada no portal quando a página carrega

  function falar(frase) {
    if (!viva || !frase) return;
    viva.textContent = "";
    setTimeout(function () { viva.textContent = frase; }, 60);
  }

  function campos(form) {
    return Array.prototype.filter.call(form.elements, function (el) {
      return el.willValidate && !el.disabled && el.type !== "submit" && el.type !== "button" && el.type !== "reset";
    });
  }

  function idDe(el) {
    if (!el.id) el.id = "eds-campo-" + (++conta);
    return el.id;
  }

  function nomeDoCampo(el) {
    const auto = (el.getAttribute("autocomplete") || "").toLowerCase();
    return /(^|\s)(name|given-name|family-name|nickname)$/.test(auto) || /^(nome|name|sobrenome)$/i.test(el.name || "");
  }

  /* a frase do erro: a do próprio campo (data-erro-vazio, data-erro-formato) ou a padrão de escola.textos */
  function frase(el) {
    const v = el.validity;
    if (v.valueMissing) {
      const doCampo = el.getAttribute("data-erro-vazio");
      if (doCampo) return doCampo;
      if (el.type === "checkbox") return texto("faltouAceite");
      if (el.type === "radio" || el.tagName === "SELECT") return texto("faltouEscolher");
      if (el.type === "email") return texto("faltouEmail");
      if (el.type === "file") return texto("faltouArquivo");
      return nomeDoCampo(el) ? texto("faltouNome") : texto("faltouCampo");
    }
    const formato = el.getAttribute("data-erro-formato");
    if (formato) return formato;
    if (v.typeMismatch && el.type === "email") return el.value.indexOf("@") < 0 ? texto("emailSemArroba") : texto("emailIncompleto");
    if (v.tooLong) return texto("passouDoTamanho");
    if (v.tooShort) return texto("tamanhoCurto");
    return texto("confereFormato");
  }

  /* o rádio é um grupo: o erro dele mora no fim do grupo, e vale pra todas as opções */
  function grupo(el) {
    if (el.type !== "radio" || !el.name || !el.form) return [el];
    return Array.prototype.filter.call(el.form.elements, function (outro) { return outro.type === "radio" && outro.name === el.name; });
  }

  function lugarDoErro(el) {
    if (el.type === "radio") {
      const lista = grupo(el);
      const conjunto = el.closest(".fieldset, fieldset");
      return conjunto && conjunto.contains(lista[lista.length - 1]) ? conjunto.lastElementChild : lista[lista.length - 1].closest(".radio") || el;
    }
    return el.closest(".input-row, .select, .file, .check, .switch") || el;
  }

  function caixaDeErro(el) {
    if (erros.has(el)) return erros.get(el);
    const ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    let caixa = null;
    ids.forEach(function (id) {
      const achado = document.getElementById(id);
      if (!caixa && achado && achado.classList.contains("error")) caixa = achado;
    });
    if (!caixa) {
      caixa = document.createElement("p");
      caixa.className = "error";
      caixa.id = idDe(el) + "-erro";
      caixa.hidden = true;
      const icone = document.createElement("span");
      icone.className = "icon icon--erro icon--sm";
      icone.setAttribute("aria-hidden", "true");
      caixa.appendChild(icone);
      lugarDoErro(el).after(caixa);
    }
    let escrito = null;
    caixa.childNodes.forEach(function (no) { if (no.nodeType === 3 && no.nodeValue.trim()) escrito = no; });
    if (!escrito) escrito = caixa.appendChild(document.createTextNode(""));
    const achado = { caixa: caixa, escrito: escrito };
    grupo(el).forEach(function (membro) {
      erros.set(membro, achado);
      const lista = (membro.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      if (lista.indexOf(caixa.id) < 0) membro.setAttribute("aria-describedby", lista.concat(caixa.id).join(" "));
    });
    return achado;
  }

  /* confere um campo e mostra ou apaga o erro dele. Devolve true quando está certo */
  function conferir(el) {
    const certo = el.checkValidity();
    const membros = grupo(el);
    if (certo) {
      membros.forEach(function (membro) { membro.removeAttribute("aria-invalid"); });
      if (erros.has(el)) erros.get(el).caixa.hidden = true;
      return true;
    }
    const achado = caixaDeErro(el);
    achado.escrito.nodeValue = " " + frase(el);
    achado.caixa.hidden = false;
    membros.forEach(function (membro) { membro.setAttribute("aria-invalid", "true"); errou.add(membro); });
    return false;
  }

  function resumo(form, errados) {
    let caixa = resumos.get(form);
    if (!errados.length) {
      if (caixa) caixa.hidden = true;
      return null;
    }
    if (!caixa) {
      caixa = document.createElement("div");
      caixa.className = "form-errors alert alert--error";
      caixa.setAttribute("role", "alert");
      caixa.tabIndex = -1;
      const icone = document.createElement("span");
      icone.className = "icon icon--erro";
      icone.setAttribute("aria-hidden", "true");
      const corpo = document.createElement("div");
      corpo.className = "alert-body";
      corpo.append(document.createElement("p"), document.createElement("ul"));
      corpo.lastChild.className = "list";
      caixa.append(icone, corpo);
      form.insertBefore(caixa, form.firstChild);
      resumos.set(form, caixa);
      caixa.addEventListener("click", function (evento) {
        const link = evento.target.closest("a[href^='#']");
        const alvo = link && document.getElementById(decodeURIComponent(link.getAttribute("href").slice(1)));
        if (!alvo) return;
        evento.preventDefault();
        alvo.focus();
      });
    }
    const corpo = caixa.querySelector(".alert-body");
    corpo.firstChild.textContent = texto("resumoErros").replace("{n}", errados.length);
    const lista = corpo.lastChild;
    lista.textContent = "";
    errados.forEach(function (el) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#" + idDe(el);
      link.textContent = frase(el);
      item.appendChild(link);
      lista.appendChild(item);
    });
    caixa.hidden = false;
    return caixa;
  }

  /* enviando: o botão em aria-busy. Quem troca a palavra na tela (a do data-carregando, com o _
     piscando) sem mudar a largura é o CSS do botão (30-acoes.css, dono A); daqui sai o aviso pro
     leitor de tela. Volta quando a página muda o data-state */
  function enviando(form, botao) {
    form.setAttribute("data-state", "enviando");
    if (!botao) return;
    botoes.set(form, botao);
    botao.setAttribute("aria-busy", "true");
    falar(botao.getAttribute("data-carregando"));
  }

  function soltarBotao(form) {
    const botao = botoes.get(form);
    if (!botao) return;
    botoes.delete(form);
    botao.removeAttribute("aria-busy");
  }

  function focar(el) {
    if (!el) return;
    if (!el.hasAttribute("tabindex") && !el.matches("a[href], button, input, select, textarea")) el.tabIndex = -1;
    el.focus();
  }

  escola.ligar("formulario", "form[data-validar]", function (form) {
    form.noValidate = true; // as mensagens são as nossas, não o balão do navegador
    if (!viva && escola.portal()) {
      viva = document.createElement("div");
      viva.className = "sr-only";
      viva.setAttribute("role", "status");
      escola.portal().appendChild(viva);
    }

    form.addEventListener("input", function (evento) {
      const el = evento.target;
      mexeu.add(el);
      if (errou.has(el)) conferir(el);
    });
    form.addEventListener("change", function (evento) {
      const el = evento.target;
      mexeu.add(el);
      if (errou.has(el)) conferir(el);
    });
    form.addEventListener("focusout", function (evento) {
      const el = evento.target;
      if (el.willValidate && (mexeu.has(el) || errou.has(el))) conferir(el);
    });

    /* em captura: corre antes do ouvinte da página, que fica sem o envio quando falta alguma coisa */
    form.addEventListener("submit", function (evento) {
      if (form.getAttribute("data-state") === "enviando") {
        evento.preventDefault();
        evento.stopImmediatePropagation();
        return;
      }
      const vistos = new Set();
      const errados = campos(form).filter(function (el) {
        if (el.type === "radio") {
          if (vistos.has(el.name)) return false;
          vistos.add(el.name);
        }
        return !conferir(el);
      });
      if (errados.length) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
        const caixa = resumo(form, errados.length > 1 ? errados : []);
        if (caixa) caixa.focus();
        else errados[0].focus();
        return;
      }
      resumo(form, []);
      form.querySelectorAll("[data-mostrar-senha]").forEach(function (botao) {
        const campo = document.getElementById(botao.getAttribute("aria-controls"));
        if (campo && campo.type === "text") botao.click();
      });
      enviando(form, evento.submitter || form.querySelector("button[type='submit'], button:not([type]), input[type='submit']"));
    }, true);

    /* a página é que diz enviado ou falhou (o JS do sistema não fala com servidor nenhum): aqui só se reage */
    new MutationObserver(function () {
      const estado = form.getAttribute("data-state");
      if (estado === "enviando") return;
      soltarBotao(form);
      if (estado === "enviado") focar(form.querySelector(".form-done"));
      else if (estado === "falhou") {
        const aviso = Array.prototype.find.call(form.querySelectorAll(".form-errors, .alert--error"), function (el) {
          return !el.hidden && el !== resumos.get(form);
        });
        focar(aviso);
      }
    }).observe(form, { attributes: true, attributeFilter: ["data-state"] });
  });

  /* a página que volta pelo botão de voltar do navegador (o cache de ida e volta) não fica presa em enviando */
  escola.ligar("formulario-volta", null, function () {
    window.addEventListener("pageshow", function (evento) {
      if (!evento.persisted) return;
      document.querySelectorAll("form[data-validar][data-state='enviando']").forEach(function (form) {
        form.removeAttribute("data-state");
      });
    });
  });

  /* o contador: embaixo do campo com maxlength, à direita. O leitor de tela só ouve quando faltam 20 e quando acaba */
  escola.ligar("contador", "[data-contar]", function (campo) {
    const max = parseInt(campo.getAttribute("maxlength"), 10);
    if (!max) return;
    const linha = document.createElement("p");
    linha.className = "meta tnum";
    const visto = document.createElement("span");
    visto.setAttribute("aria-hidden", "true");
    const viva = document.createElement("span");
    viva.className = "sr-only";
    viva.setAttribute("aria-live", "polite");
    linha.append(visto, viva);
    lugarDoErro(campo).after(linha);
    let antes = null;
    const contar = function () {
      const n = campo.value.length;
      visto.textContent = texto("contador").replace("{n}", n).replace("{max}", max);
      const faixa = n >= max ? "fim" : max - n <= 20 ? "perto" : "";
      if (faixa !== antes && antes !== null) {
        viva.textContent = faixa === "fim" ? texto("chegouNoLimite").replace("{max}", max) : faixa === "perto" ? texto("faltamPoucas").replace("{n}", max - n) : "";
      }
      antes = faixa;
    };
    campo.addEventListener("input", contar);
    contar();
  });

  /* mostrar a senha: o botão nasce hidden (sem JS ele não faria nada) */
  escola.ligar("mostrar-senha", "[data-mostrar-senha]", function (botao) {
    const campo = document.getElementById(botao.getAttribute("aria-controls"));
    if (!campo) return;
    botao.hidden = false;
    botao.addEventListener("click", function () {
      const mostrar = campo.type === "password";
      campo.type = mostrar ? "text" : "password";
      botao.setAttribute("aria-pressed", String(mostrar));
      const icone = botao.querySelector(".icon");
      if (icone) {
        icone.classList.toggle("icon--olho", !mostrar);
        icone.classList.toggle("icon--olho-fechado", mostrar);
      }
    });
  });

  /* a área de soltar arquivo: arrastando por cima ganha data-state="dragover"; o que cai vai pro input de
     dentro (o mesmo que funciona sem JS e no teclado), e a linha passa a mostrar o nome do arquivo */
  escola.ligar("soltar-arquivo", ".file--drop", function (area) {
    const campo = area.querySelector("input[type='file']");
    if (!campo) return;
    const linha = area.querySelector("p");
    const original = linha ? linha.textContent : "";
    let dentro = 0;
    const marcar = function (sim) {
      if (sim) area.setAttribute("data-state", "dragover");
      else if (area.getAttribute("data-state") === "dragover") area.removeAttribute("data-state");
    };
    area.addEventListener("dragenter", function (evento) { evento.preventDefault(); dentro++; marcar(true); });
    area.addEventListener("dragover", function (evento) { evento.preventDefault(); });
    area.addEventListener("dragleave", function () { if (--dentro <= 0) { dentro = 0; marcar(false); } });
    area.addEventListener("drop", function (evento) {
      evento.preventDefault();
      dentro = 0;
      marcar(false);
      const arquivos = evento.dataTransfer && evento.dataTransfer.files;
      if (!arquivos || !arquivos.length || campo.disabled) return;
      try {
        if (!campo.multiple && arquivos.length > 1) {
          const um = new DataTransfer();
          um.items.add(arquivos[0]);
          campo.files = um.files;
        } else {
          campo.files = arquivos;
        }
      } catch (erro) {
        return; // navegador que não deixa trocar os arquivos do input: fica o botão dele
      }
      campo.dispatchEvent(new Event("change", { bubbles: true }));
    });
    campo.addEventListener("change", function () {
      if (!linha) return;
      linha.textContent = campo.files && campo.files.length ?
        Array.prototype.map.call(campo.files, function (arquivo) { return arquivo.name; }).join(", ") : original;
    });
  });
}

/* parte: js/partes/50-trilho.js */
// trilho · a fileira que rola de lado (a da escolaflix): os botões anteriores e próximas, só pra quem tem mouse, as setas do teclado e o botão que some na ponta

/*
O que lê no HTML:
  [data-trilho]   a fileira que rola de lado (a ul.posters)

O que escreve:
  logo depois da fileira, um div.row com data-trilho-botoes e dois botões
  (button.btn.btn--icon.btn--small, com a seta e o aria-label "anteriores" e "próximas").
  A fileira de botões só aparece pra quem tem mouse: é a mesma pergunta de mídia do hover,
  (hover: hover) and (pointer: fine). Quando muda (tablet que ganha ou perde o mouse), ela ganha ou
  perde o hidden. Quando tudo cabe e não tem pra onde rolar, também fica hidden
  disabled         no botão da ponta (no começo, o anteriores; no fim, o próximas). O CSS esconde o
                   botão desligado sem tirar o lugar dele, e o outro não sai do lugar. Se o foco estava
                   no botão que desligou, ele passa pro outro

Cada clique anda o tanto de cartazes que cabem inteiros na tela, e o encaixe do scroll-snap acerta a
borda. A rolagem é suave só pra quem não pediu menos movimento.

O teclado: com o foco num cartaz, as setas pra direita e pra esquerda levam o foco pro vizinho, e o
Home e o End pro primeiro e pro último. O foco que vem do teclado puxa a fileira até o cartaz aparecer
inteiro, sem animar: o navegador sozinho nem sempre rola quando o cartaz já aparece um pedaço na borda, e o anel
de foco (que é por dentro) ficaria cortado. O foco do clique não rola, pra o cartaz não fugir do mouse.

Os textos dos botões moram em escola.textos: trilhoAnteriores e trilhoProximas.

Sem JS, a fileira rola com o dedo, com o trackpad e com o Tab (o foco puxa a fileira).
*/

escola.ligar("trilho", "[data-trilho]", function (trilho) {
  const comMouse = window.matchMedia("(hover: hover) and (pointer: fine)");
  const calmo = window.matchMedia("(prefers-reduced-motion: reduce)");
  escola.textos.trilhoAnteriores = escola.textos.trilhoAnteriores || "anteriores";
  escola.textos.trilhoProximas = escola.textos.trilhoProximas || "próximas";

  function botao(icone, nome) {
    const novo = document.createElement("button");
    const desenho = document.createElement("span");
    novo.type = "button";
    novo.className = "btn btn--icon btn--small";
    novo.setAttribute("aria-label", nome);
    if (trilho.id) novo.setAttribute("aria-controls", trilho.id);
    desenho.className = "icon icon--" + icone;
    desenho.setAttribute("aria-hidden", "true");
    novo.appendChild(desenho);
    return novo;
  }

  // a fileira de botões que veio junto quando alguém copiou o trecho (pop-up que clona o HTML) sai,
  // e nasce uma nova, ligada a esta fileira
  const velha = trilho.nextElementSibling;
  if (velha && velha.hasAttribute("data-trilho-botoes")) velha.remove();

  const fila = document.createElement("div");
  const antes = botao("seta-esquerda", escola.textos.trilhoAnteriores);
  const depois = botao("seta-direita", escola.textos.trilhoProximas);
  fila.className = "row";
  fila.setAttribute("data-trilho-botoes", "");
  fila.hidden = true;
  fila.append(antes, depois);
  trilho.after(fila);

  function itens() {
    return Array.prototype.filter.call(trilho.children, function (item) {
      return !item.hidden;
    });
  }

  // quanto anda um clique: os cartazes que cabem inteiros (no mínimo um), com o vão entre eles
  function passo() {
    const primeiro = itens()[0];
    if (!primeiro) return trilho.clientWidth;
    const estilo = window.getComputedStyle(trilho);
    const vao = parseFloat(estilo.columnGap) || 0;
    const util = trilho.clientWidth - (parseFloat(estilo.paddingLeft) || 0) - (parseFloat(estilo.paddingRight) || 0);
    const largura = primeiro.getBoundingClientRect().width + vao;
    return Math.max(1, Math.floor((util + vao) / largura)) * largura;
  }

  function rolar(lado) {
    trilho.scrollBy({ left: lado * passo(), behavior: calmo.matches ? "auto" : "smooth" });
  }

  function desligar(qual, ponta) {
    if (qual.disabled === ponta) return;
    if (ponta && document.activeElement === qual) {
      const outro = qual === antes ? depois : antes;
      if (!outro.disabled) outro.focus();
    }
    qual.disabled = ponta;
  }

  function pontas() {
    const fim = trilho.scrollWidth - trilho.clientWidth;
    fila.hidden = !comMouse.matches || fim <= 1;
    desligar(antes, trilho.scrollLeft <= 1);
    desligar(depois, trilho.scrollLeft >= fim - 1);
  }

  let quadro = 0;
  function depoisDeRolar() {
    if (!quadro) {
      quadro = window.requestAnimationFrame(function () {
        quadro = 0;
        pontas();
      });
    }
  }

  antes.addEventListener("click", function () {
    rolar(-1);
  });
  depois.addEventListener("click", function () {
    rolar(1);
  });

  trilho.addEventListener("keydown", function (evento) {
    if (evento.altKey || evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
    const lista = itens();
    const atual = lista.findIndex(function (item) {
      return item.contains(evento.target);
    });
    if (atual < 0) return;
    let alvo = -1;
    if (evento.key === "ArrowRight") alvo = Math.min(atual + 1, lista.length - 1);
    else if (evento.key === "ArrowLeft") alvo = Math.max(atual - 1, 0);
    else if (evento.key === "Home") alvo = 0;
    else if (evento.key === "End") alvo = lista.length - 1;
    if (alvo < 0) return;
    const foco = lista[alvo].querySelector("a[href], button, [tabindex]:not([tabindex='-1'])");
    if (!foco) return;
    evento.preventDefault();
    foco.focus();
  });

  trilho.addEventListener("focusin", function (evento) {
    let doTeclado = true;
    try {
      doTeclado = evento.target.matches(":focus-visible");
    } catch (erro) {
      doTeclado = true;
    }
    if (!doTeclado) return;
    const item = Array.prototype.find.call(trilho.children, function (filho) {
      return filho.contains(evento.target);
    });
    if (item) item.scrollIntoView({ block: "nearest", inline: "nearest" });
  });

  trilho.addEventListener("scroll", depoisDeRolar, { passive: true });
  comMouse.addEventListener("change", pontas);
  if (typeof window.ResizeObserver === "function") {
    new window.ResizeObserver(depoisDeRolar).observe(trilho);
  } else {
    window.addEventListener("resize", depoisDeRolar);
  }
  pontas();
});

/* parte: js/partes/55-compra.js */
// compra · a barra de compra do celular: aparece enquanto a caixa de compra está fora da tela, some quando o rodapé chega e enquanto o aviso de cookies está aberto, escreve --eds-buybar-h no html e acompanha o data-oferta da caixa

/*
O que lê no HTML:
  [data-compra="#matricula"]   a barra (.buybar, que nasce hidden), apontando pra caixa de compra da página
  data-oferta                  na caixa: com "encerrada", a barra não abre (10.2). Se mudar, ela acompanha
  .site-footer                 o rodapé (ou o [role="contentinfo"]): quando ele chega na tela, a barra some
  .consent                     o aviso de cookies: enquanto ele está na tela, a barra espera

O que escreve:
  hidden, tirado    da barra, uma vez, quando a caixa existe. Sem caixa na página, a barra fica hidden
  data-state        na barra, "open" ou "closed". Só abre abaixo de md (max-width: 47.99em), com a caixa
                    fora da tela, sem o rodapé na tela e sem o aviso de cookies aberto
  --eds-buybar-h    no html: a altura da barra aberta, em px, e 0px fechada. É o único style que um JS do
                    sistema escreve, porque é um número que só a página sabe. O toast sobe com ele
                    (calc(24px + var(--eds-buybar-h, 0px))) e o scroll-padding-block-end do html, no
                    05-base.css, não deixa o foco do teclado parar escondido atrás da barra

O que avisa: escola:abrir e escola:fechar, na barra, com { parte: "compra" }.

Sem JS (ou num navegador sem IntersectionObserver), a barra não aparece: a página segue inteira, com
a caixa e os botões que apontam pra #matricula.
*/

escola.ligar("compra", "[data-compra]", function (barra) {
  if (typeof window.IntersectionObserver !== "function") return;
  let caixa = null;
  try {
    caixa = document.querySelector(barra.getAttribute("data-compra"));
  } catch (erro) {
    caixa = null;
  }
  if (!caixa) return;

  const raiz = document.documentElement;
  const celular = window.matchMedia("(max-width: 47.99em)");
  const rodape = document.querySelector(".site-footer, [role='contentinfo']");
  // até o primeiro recado do observador, conta como se a caixa estivesse na tela (barra fechada)
  let caixaNaTela = true;
  let rodapeNaTela = false;
  let aberta = false;

  function avisoNaTela() {
    return Array.prototype.some.call(document.querySelectorAll(".consent"), function (aviso) {
      return !aviso.hidden && aviso.getClientRects().length > 0;
    });
  }

  function medir() {
    raiz.style.setProperty("--eds-buybar-h", aberta ? barra.offsetHeight + "px" : "0px");
  }

  function decidir() {
    const abrir = celular.matches && !caixaNaTela && !rodapeNaTela && !avisoNaTela() &&
      caixa.getAttribute("data-oferta") !== "encerrada";
    if (abrir !== aberta) {
      aberta = abrir;
      barra.setAttribute("data-state", abrir ? "open" : "closed");
      escola.avisar(barra, abrir ? "abrir" : "fechar", { parte: "compra" });
    }
    medir();
  }

  barra.setAttribute("data-state", "closed");
  barra.hidden = false;

  const olho = new window.IntersectionObserver(function (vistos) {
    vistos.forEach(function (visto) {
      if (visto.target === caixa) caixaNaTela = visto.isIntersecting;
      else rodapeNaTela = visto.isIntersecting;
    });
    decidir();
  });
  olho.observe(caixa);
  if (rodape) olho.observe(rodape);

  // o estado da oferta que muda e o aviso de cookies que abre e fecha
  const mudou = new window.MutationObserver(decidir);
  mudou.observe(caixa, { attributes: true, attributeFilter: ["data-oferta"] });
  document.querySelectorAll(".consent").forEach(function (aviso) {
    mudou.observe(aviso, { attributes: true, attributeFilter: ["hidden", "class", "data-state"] });
  });
  document.addEventListener("escola:consentimento", decidir);
  celular.addEventListener("change", decidir);
  if (typeof window.ResizeObserver === "function") new window.ResizeObserver(medir).observe(barra);
  decidir();
});

/* parte: js/partes/60-revelar.js */
/* revelar · o bloco editorial com data-revelar aparece de leve quando chega na tela, uma vez só */

/*
Quem esconde é este JS, não o CSS: sem JS (ou sem IntersectionObserver) nada se esconde.
  · o que já está na tela quando a parte liga (ou já passou dela) não se esconde nunca:
    ganha data-state="shown" na hora, sem piscar;
  · o que está mais embaixo ganha data-state="hidden" e, quando o primeiro pedaço dele entra na
    tela, "shown" (sem margem: o último bloco da página, que não sobe até o meio, também aparece).
    Depois disso a parte esquece o elemento;
  · elemento que já tem data-state (de outra peça) fica como está.
O desenho mora no 95-movimento.css, só pra quem não pediu menos movimento: com menos movimento o
"hidden" não esconde nada. Na impressão, tudo aparece (99). Nunca em formulário, preço, aviso ou
em qualquer coisa que a pessoa precise ver pra decidir (02, 4.3).
*/
{
  let observador = null;

  const mostrar = function (el) {
    el.setAttribute("data-state", "shown");
  };

  const aoEntrar = function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      observador.unobserve(entrada.target);
      mostrar(entrada.target);
    });
  };

  escola.ligar("revelar", "[data-revelar]", function (el) {
    if (!("IntersectionObserver" in window) || el.hasAttribute("data-state")) return;
    if (el.getBoundingClientRect().top < window.innerHeight) {
      mostrar(el);
      return;
    }
    if (!observador) observador = new IntersectionObserver(aoEntrar);
    el.setAttribute("data-state", "hidden");
    observador.observe(el);
  });
}

/* parte: js/partes/70-consentimento.js */
// consentimento · o aviso de cookies: guarda a escolha, avisa a página (escola:consentimento), reabre pelo link do rodapé e solta a moldura e o script que esperam o sim
{
  const CHAVE = "eds-consentimento";
  const VERSAO = 1;
  const esperando = new Set();
  const carregar = new WeakMap(); // moldura → o botão carregar aqui dela
  let faixa = null;
  let voltar = null;

  function lida() {
    try {
      const escolha = JSON.parse(localStorage.getItem(CHAVE) || "null");
      return escolha && escolha.versao === VERSAO ? escolha : null;
    } catch (erro) {
      return null;
    }
  }

  function guardar(sim) {
    const escolha = { versao: VERSAO, medicao: sim, terceiros: sim, data: new Date().toISOString().slice(0, 10) };
    try {
      localStorage.setItem(CHAVE, JSON.stringify(escolha));
    } catch (erro) { /* sem localStorage: a escolha vale só nesta página */ }
    return escolha;
  }

  /* carrega uma moldura ou um script que esperava: o src mora no data-src até o sim */
  function soltar(el) {
    if (!esperando.has(el)) return;
    esperando.delete(el);
    if (el.tagName === "SCRIPT") {
      const novo = document.createElement("script");
      const fonte = el.getAttribute("data-src");
      if (fonte) novo.src = fonte;
      else novo.text = el.text;
      el.after(novo);
      return;
    }
    const molduras = el.tagName === "IFRAME" ? [el] : Array.prototype.slice.call(el.querySelectorAll("iframe[data-src]"));
    molduras.forEach(function (moldura) {
      if (moldura.getAttribute("data-src")) moldura.src = moldura.getAttribute("data-src");
      moldura.hidden = false;
    });
    if (el.tagName !== "IFRAME") {
      el.querySelectorAll(":scope > .photo").forEach(function (capa) { capa.hidden = true; });
      if (carregar.has(el)) carregar.get(el).hidden = true;
    }
  }

  function aplicar(escolha) {
    esperando.forEach(function (el) {
      if (escolha[el.getAttribute("data-consentimento")] === true) soltar(el);
    });
  }

  function escolher(sim) {
    const escolha = guardar(sim);
    if (faixa) {
      const tinhaFoco = faixa.contains(document.activeElement);
      faixa.hidden = true;
      if (tinhaFoco && voltar && voltar.isConnected) voltar.focus();
    }
    voltar = null;
    aplicar(escolha);
    escola.avisar(faixa || document, "consentimento", { parte: "consentimento", medicao: escolha.medicao, terceiros: escolha.terceiros });
  }

  /* a faixa: aparece se ainda não tem escolha guardada. Os dois botões, do mesmo peso, levam
     data-consentimento="recusar" e data-consentimento="aceitar" */
  escola.ligar("consentimento", ".consent", function (caixa) {
    if (faixa) return; // uma faixa por página
    faixa = caixa;
    caixa.addEventListener("click", function (evento) {
      const botao = evento.target.closest("[data-consentimento]");
      if (!botao || !caixa.contains(botao)) return;
      const qual = botao.getAttribute("data-consentimento");
      if (qual === "aceitar" || qual === "recusar") escolher(qual === "aceitar");
    });
    if (!lida()) caixa.hidden = false;
  });

  /* o link cookies do rodapé reabre a faixa */
  escola.ligar("consentimento-abrir", "[data-consentimento-abrir]", function (link) {
    link.addEventListener("click", function (evento) {
      if (!faixa) return;
      evento.preventDefault();
      voltar = link;
      faixa.hidden = false;
      const primeiro = faixa.querySelector("button");
      if (primeiro) primeiro.focus();
    });
  });

  /* o que espera o sim: moldura (o .embed ou o iframe com data-src) e script (type="text/plain") marcados
     com data-consentimento="terceiros" ou "medicao". Moldura de terceiros ganha o botão carregar aqui,
     que solta só ela */
  escola.ligar("consentimento-espera", "[data-consentimento='terceiros'], [data-consentimento='medicao']", function (el) {
    if (el.closest(".consent")) return;
    esperando.add(el);
    const escolha = lida();
    if (escolha && escolha[el.getAttribute("data-consentimento")] === true) return soltar(el);
    if (el.tagName === "SCRIPT" || el.tagName === "IFRAME" || el.getAttribute("data-consentimento") !== "terceiros") return;
    el.querySelectorAll("iframe[data-src]").forEach(function (moldura) { moldura.hidden = true; });
    escola.textos.carregarAqui = escola.textos.carregarAqui || "carregar aqui";
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn btn--small";
    botao.textContent = escola.textos.carregarAqui;
    botao.addEventListener("click", function () {
      const moldura = el.querySelector("iframe[data-src]");
      soltar(el);
      if (moldura) moldura.focus();
    });
    carregar.set(el, botao);
    el.appendChild(botao);
  });
}

/* parte: js/partes/80-copiar.js */
/* copiar · o botão que copia um texto (data-copiar) e o que abre a folha de compartilhar do aparelho (data-compartilhar) */

/*
Os dois nascem com hidden no HTML: sem JS não aparecem (são confirmação, nunca a única resposta,
03 seção 9), e quem decide se aparecem é esta parte.
  · data-compartilhar: aparece onde o aparelho tem a folha de compartilhar (navigator.share, quase
    todo celular). O clique abre a folha com o título da página e o endereço limpo (o do
    <link rel="canonical">, ou o da barra sem utm_ e os outros códigos de rastreio). Com um valor
    (data-compartilhar="https://..."), compartilha esse endereço.
  · data-copiar: aparece onde dá pra copiar (navigator.clipboard), menos quando mora junto de um
    data-compartilhar que apareceu: no compartilhar da página (.share), sobra um botão só. O clique
    copia o valor do atributo, ou, vazio, o endereço limpo da página, e confirma com o toast
    ("link copiado", ou "copiado" quando não é endereço). Não deu: toast de erro, que não some
    sozinho.
O toast é do 20-toast.js: só é chamado se existir. As frases moram no escola.textos (linkCopiado,
copiado, naoCopiou), e a página pode trocar.
*/
{
  escola.textos.linkCopiado = escola.textos.linkCopiado || "link copiado";
  escola.textos.copiado = escola.textos.copiado || "copiado";
  escola.textos.naoCopiou = escola.textos.naoCopiou || "não deu pra copiar";

  const RASTREIO = /^(utm_.+|fbclid|gclid|dclid|gbraid|wbraid|msclkid|mc_cid|mc_eid|igshid|_hsenc|_hsmi)$/i;

  const enderecoLimpo = function () {
    const canonico = document.querySelector('link[rel="canonical"][href]');
    const url = new URL(canonico ? canonico.href : window.location.href);
    Array.from(url.searchParams.keys()).forEach(function (chave) {
      if (RASTREIO.test(chave)) url.searchParams.delete(chave);
    });
    return url.href;
  };

  const avisar = function (texto, tipo) {
    if (typeof escola.toast === "function") escola.toast(texto, tipo ? { tipo: tipo } : undefined);
  };

  const copiar = function (texto) {
    const endereco = /^https?:\/\//i.test(texto);
    return navigator.clipboard.writeText(texto).then(function () {
      avisar(endereco ? escola.textos.linkCopiado : escola.textos.copiado);
    }, function () {
      avisar(escola.textos.naoCopiou, "erro");
    });
  };

  const podeCompartilhar = function () {
    return typeof navigator.share === "function";
  };

  const podeCopiar = function () {
    return !!(navigator.clipboard && typeof navigator.clipboard.writeText === "function");
  };

  escola.ligar("copiar", "[data-copiar], [data-compartilhar]", function (botao) {
    if (botao.hasAttribute("data-compartilhar")) {
      if (!podeCompartilhar()) return;
      botao.hidden = false;
      botao.addEventListener("click", function () {
        const url = botao.getAttribute("data-compartilhar") || enderecoLimpo();
        navigator.share({ title: document.title, url: url }).catch(function (erro) {
          // fechar a folha sem escolher nada não é erro. O resto (o aparelho recusou) cai no copiar
          if (erro && erro.name === "AbortError") return;
          if (podeCopiar()) copiar(url);
        });
      });
      return;
    }
    if (!podeCopiar()) return;
    const vizinho = botao.parentElement && botao.parentElement.querySelector("[data-compartilhar]");
    if (vizinho && podeCompartilhar()) return;
    botao.hidden = false;
    botao.addEventListener("click", function () {
      copiar(botao.getAttribute("data-copiar") || enderecoLimpo());
    });
  });
}

})();
