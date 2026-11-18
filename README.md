# site da escola de si

o site da escola de si (escoladesi.com.br). o que entra no ramo `main` vai pro ar sozinho, pelo netlify da fefe.

## quem é quem

- **fefe:** dona do site e da conta do netlify.
- **thiago:** faz o site.
- **fábio (faresende):** dono deste repositório no github. pôr ou tirar alguém daqui é com ele.

## como mudar o site

1. crie um ramo a partir do `main` e faça a mudança nele.
2. abra um pull request pro `main`. o netlify monta uma prévia (deploy preview) e põe o link no pull request: é por ela que a fefe vê a mudança antes de ir pro ar.
3. com o sim dela, junte no `main`. em um ou dois minutos está no ar.

## duas regras

- **o repositório é público.** qualquer pessoa pode ler o que está aqui. nada privado entra: backup, planilha, senha, chave, dado de aluna.
- **cada publicação no `main` gasta 15 dos 300 créditos do mês** do plano grátis do netlify. se os créditos acabarem, o site sai do ar até o mês seguinte. junte várias mudanças num pull request só e use as prévias, que são ilimitadas.

## o que tem aqui

- `site/`: a pasta que vai pro ar. a página inicial entra em `site/index.html`.
- `site/foco/`: a página da sessão de foco, feita com o sistema de design da escola. veio pronta de fefe.whoisthisfabio.com/foco/, e daqui pra frente vale esta cópia. se o endereço final dela mudar, troque no `<head>` (canonical, og:url e og:image).
- `netlify.toml`: diz pro netlify publicar a pasta `site/`, sem build. enquanto não existir `site/index.html`, o endereço principal leva pra `/foco/`. quando a página inicial entrar, essa regra para de valer sozinha (o arquivo vence a regra), e dá pra apagar.

## páginas novas

use o sistema de design da escola: fefe.whoisthisfabio.com/sistema/. ele tem o `llms.txt` e o `DESIGN.md` pra ia ler.

## domínio e e-mail

o dns do escoladesi.com.br e do feferesende.com.br fica no registro.br, junto com os registros do e-mail (google workspace). o site entra lá com dois registros: `A` com 75.2.60.5 e `CNAME` do www apontando pro endereço .netlify.app do projeto. ao mexer no dns, nunca apague os registros do e-mail.

## direitos

o texto, as imagens e a marca são da escola de si. o repositório é público pro site funcionar no plano grátis do netlify, e isso não libera o uso por outras pessoas.
