# Flaskime!
Um projeto pessoal feito para listar todos os animes que assisti ou pretendo assistir, tudo localmente sob licença: <br>
[![Licença](https://www.gnu.org/graphics/gplv3-127x51.png)](https://www.gnu.org/licenses/gpl-3.0.html)

## Interessante, como funciona?
Bom o sistema Flaskime (combinação da palavra Flask e Anime) é dividido em 2 repositórios: 
<br> 
<a href="https://github.com/Atn4s/Flaskime_server">Servidor Flaskime</a> (atual)
<br> 
<a href="https://github.com/Atn4s/Flaskime_web">Pagina web Flaskime</a>
<br>
<p> A lógica de obter a lista de animes é feito apartir da API <a href="https://jikan.moe/"> Jikan </a>
e a lógica de gravar os animes é feito pelo banco de dados SQLite3 criando um database 
listaanime.db que ao executar o servidor ele é criado automaticamente para facilitar 😃 (seu script está disponivel em banco.py)

![image](https://github.com/Atn4s/Flaskime_web/assets/61942303/5be23dfa-0f9d-4e6e-a1fc-dac6abcf15ad)


## Como posso testar?

<b> 1 - Imagino que você seguiu os passos do <a href="https://github.com/Atn4s/Flaskime_server">servidor</a> certo? qualquer coisa de uma olhadinha nele antes de seguir aqui!</b>
<br>
<br>
<b> 2 - A pagina ao carregar vai ter uma interface com alguns inputs em: The Flaskime-Server is running on: 127.0.0.1 e 5000</b>
<br>
<br>
<i> Por que? </i>
<br>
<p> bem eles são o ip e porta que seu servidor está rodando, caso necessite modifique seu ip e porta de acordo com sua configuração</p>
<p> Após isso basta procurar pelos animes desejados e ir salvando como se fosse seu caderno de animes, podendo marcar se já viu ou não além de outras opções</p>
<br>
<b> Aproveite a aplicação Flaskime - Your personal haven for anime: private, secure, and always local.</b>
<br>

---
**Nota:**
Este projeto é licenciado sob os termos da [Licença Pública Geral GNU v3.0](https://www.gnu.org/licenses/gpl-3.0.html). Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
