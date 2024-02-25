var currentYear = new Date().getFullYear();

window.onload = function(){
    document.getElementById('localadress').value = '127.0.0.1';
    document.getElementById('port').value = '5000';
    document.getElementById('currentYear').innerHTML = currentYear;
}

function buscarAnime() {
    var localadress = document.getElementById('localadress').value;
    var port = document.getElementById('port').value;
    // Captura o valor do campo de busca
    var searchTerm = $('#search').val();

    // Captura o estado do checkbox NSFW
    var nsfwEnabled = $('#nsfw').prop('checked');

    // Define a URL da API
    var apiUrl = `http://${localadress}:${port}/buscar/`+ encodeURIComponent(searchTerm);

    // Adiciona parâmetros à URL com base no estado do checkbox NSFW
    if (!nsfwEnabled) {
        apiUrl += '&genres_exclude=12';
    }

    // Faz a requisição Ajax usando jQuery
    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function(data) {
            exibirResultados(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Erro na requisição:', textStatus, errorThrown);
        }
    });

    function exibirResultados(response) {
        // Limpa qualquer resultado anterior
        $('#resultados').empty();
    
        var animes = response.data;
    
        if (animes.length > 0) {
            // Cria a tabela
            var table = $('<table>').attr('id', 'tableAnimes');
            var thead = $('<thead>').appendTo(table);
            var tbody = $('<tbody>').appendTo(table);
    
            // Cria a linha de cabeçalho
            var headerRow = $('<tr>').appendTo(thead);
            $('<th>').text('Capa').appendTo(headerRow);
            $('<th>').text('Título').appendTo(headerRow);
            $('<th>').text('Descrição').appendTo(headerRow);
            $('<th>').text('Ações').appendTo(headerRow); // Apenas uma coluna para "Ações"
    
            // Itera sobre os animes e cria as linhas da tabela
            for (var i = 0; i < animes.length; i++) {
                var anime = animes[i];
    
                // Cria uma linha para cada anime
                var row = $('<tr>').appendTo(tbody);
    
                // Adiciona a imagem do anime (capa) com tamanho maior
                var capaCell = $('<td>').addClass('capaCell').appendTo(row);
                $('<img>').attr('src', anime.images.jpg.large_image_url).appendTo(capaCell);
    
                // Adiciona o título do anime
                $('<td>').text(anime.title).appendTo(row);
    
                // Adiciona a descrição do anime
                $('<td>').text(anime.synopsis).appendTo(row);
    
                // Cria uma célula para "Ações" contendo os botões e o checkbox
                var actionsCell = $('<td>').appendTo(row);
    
                // Adiciona o checkbox para indicar se o anime está completo ou não
                var completoCheckbox = $('<input>').attr({
                    type: 'checkbox',
                    id: 'completoCheckbox' + i, // Adicione um identificador único para cada checkbox
                }).appendTo(actionsCell);
    
                // Cria um botão para detalhes
                var btnDetalhes = $('<button>').html('&#9432;').click((function (anime, index) {
                    return function () {
                        // Cria uma janela de diálogo com os detalhes do anime
                        var detalhesHTML = '<p><strong>Título:</strong> ' + anime.title + '</p>' +
                            '<p><strong>Sinopse:</strong> ' + anime.synopsis + '</p>' +
                            '<p><strong>Aired:</strong> ' + anime.aired.string + '</p>' +
                            '<p><strong>Episódios:</strong> ' + anime.episodes + '</p>' +
                            '<p><strong>Duração:</strong> ' + anime.duration + '</p>' +
                            '<p><strong>Rating:</strong> ' + anime.rating + '</p>' +
                            '<p><strong>Popularity:</strong> ' + anime.popularity + '</p>' +
                            '<p><strong>Score:</strong> ' + anime.score + '</p>';
    
                        $('<div>').html(detalhesHTML).dialog({
                            title: 'Detalhes do Anime',
                            modal: true,
                            width: 500,
                            buttons: {
                                Ok: function () {
                                    $(this).dialog('close');
                                }
                            }
                        });
                    };
                })(anime, i));
    
                // Cria um botão para adicionar aos favoritos
                var btnAdicionar = $('<button>').html('&#10084;').click((function (anime, index) {
                    return function () {
                        // Chama a função para adicionar o anime ao banco de dados
                        adicionarAnimeAoBanco(anime, index);
                    };
                })(anime, i));
    
                // Adiciona os botões e o checkbox à célula de "Ações"
                actionsCell.append(completoCheckbox).append(btnAdicionar).append(btnDetalhes);
            }
    
            // Adiciona a tabela ao elemento #resultados
            $('#resultados').append(table);
        } else {
            // Caso não haja animes, exibe uma mensagem
            $('#resultados').text('Nenhum anime encontrado.');
        }
    }

    function adicionarAnimeAoBanco(anime, index) {
        // Define a URL do endpoint para adicionar o anime ao banco
        var localadress = document.getElementById('localadress').value;
        var port = document.getElementById('port').value;

        var insertUrl = `http://${localadress}:${port}/buscar`;
      
        var completoCheckboxId = 'completoCheckbox' + index; // Use o identificador único do checkbox
        var completo = $('#' + completoCheckboxId).prop('checked') ? true : false; // Verifica se o checkbox está marcado
        anime.is_watched = completo;


        // Serializa o objeto anime para uma string JSON
        var animeData = JSON.stringify(anime);
            
        // Configura os headers para a requisição POST
        var headers = {
            'Content-Type': 'application/json',
        };

        $.ajax({
            url: insertUrl,
            method: 'POST',
            contentType: 'application/json', 
            headers: headers,
            data: animeData,
            success: function (response) {
                console.log(response);
                alert(JSON.stringify(response));
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Trata erros durante a requisição
                console.error('Erro ao adicionar o anime ao banco:', textStatus, errorThrown);
            },
        });
    }
}

function listarAnime(){
    var localadress = document.getElementById('localadress').value;
    var port = document.getElementById('port').value;

    $.ajax({
            url: `http://${localadress}:${port}/editar`,
            type: 'GET',
            contentType: 'application/json',
            success: function (response) {
                console.log(response);
                listarBanco(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Erro ao listar animes do banco:', textStatus, errorThrown);
            },
    });
}

function listarBanco(response) {
    // Limpa qualquer resultado anterior
    $('#resultados').empty();

    var animes = response.data;

    if (animes.length > 0) {
        // Cria a tabela
        var table = $('<table>').attr('id', 'tableAnimes');
        var thead = $('<thead>').appendTo(table);
        var tbody = $('<tbody>').appendTo(table);

        // Cria a linha de cabeçalho
        var headerRow = $('<tr>').appendTo(thead);
        $('<th>').text('Capa').appendTo(headerRow);
        $('<th>').text('Título').appendTo(headerRow);
        $('<th>').text('Descrição').appendTo(headerRow);
        $('<th>').text('Assistiu?').appendTo(headerRow);
        $('<th>').text('Ações').appendTo(headerRow);

        // Itera sobre os animes e cria as linhas da tabela
        for (var i = 0; i < animes.length; i++) {
            var anime = animes[i];

            // Cria uma linha para cada anime
            var row = $('<tr>').appendTo(tbody);

            // Adiciona a imagem do anime (capa) com tamanho maior
            var capaCell = $('<td>').addClass('capaCell').appendTo(row);

            var jsonString = anime[16].replace(/'/g, '"');
            var imagensObj = JSON.parse(jsonString);

            if (imagensObj['jpg'] && imagensObj['jpg']['large_image_url']) {
                $('<img>').attr('src', imagensObj['jpg']['large_image_url']).appendTo(capaCell);
            } else if (imagensObj['webp'] && imagensObj['webp']['large_image_url']) {
                $('<img>').attr('src', imagensObj['webp']['large_image_url']).appendTo(capaCell);
            } else {
                capaCell.text('Erro ao carregar imagem');
            }

            // Adiciona o título do anime
            $('<td>').text(anime[1]).appendTo(row);

            // Adiciona a descrição do anime
            $('<td>').text(anime[33]).appendTo(row);

            // Adiciona o checkbox para indicar se o anime está completo ou não
            var completoCheckbox = $('<input>').attr({
                type: 'checkbox',
                id: 'completoCheckbox' + i,
            });

            // Adiciona um evento para o checkbox usando uma função separada
            completoCheckbox.change(createCheckboxChangeEvent(anime, i));

            // Marca o checkbox se is_watched for 1
            if (parseInt(anime[anime.length - 1], 10) === 1) {
                completoCheckbox.prop('checked', true);
            }

            $('<td>').append(completoCheckbox).appendTo(row);

            // Cria um botão para cada linha (agora, o botão é para apagar do banco)
            var btnDelete = $('<button>').html('Apagar do Banco').click(createDeleteButtonClickEvent(anime));

            // Adiciona a célula de ações
            $('<td>').append(btnDelete).appendTo(row);
        }
        // Adiciona a tabela ao elemento #resultados
        $('#resultados').append(table);
    } else {
        $('#resultados').text('Nenhum anime encontrado.');
    }
}

// Função para criar o evento de mudança para o checkbox
function createCheckboxChangeEvent(anime) {
    return function () {
        if ($(this).prop('checked')) {
            if (confirm('Você assistiu ' + anime[1] + ' ?')) {
                updateAnimeStatus(anime[1], true);
            } else {
                $(this).prop('checked', false);
            }
        } else {
            updateAnimeStatus(anime[1], false);
        }
    };
}

// Função para criar o evento de clique para o botão de deletar
function createDeleteButtonClickEvent(anime) {
    return function () {
        var animeId = anime[1]; // Use anime[1] como fallback
        // Confirmação antes de excluir
        if (confirm('Tem certeza que quer excluir o anime ' + anime[1] + ' do seu banco de dados?')) {
            deleteAnime(animeId);
        } else {
            console.log('Operação de exclusão cancelada.');
        }
    };
}

// Função para realizar a requisição AJAX de atualização de status
function updateAnimeStatus(animeId, watched) {
    var localadress = document.getElementById('localadress').value;
    var port = document.getElementById('port').value;
    $.ajax({
        url: `http://${localadress}:${port}/editar`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            id: animeId,
            watched: watched
        }),
        success: function (response) {
            alert(JSON.stringify(response));
            listarAnime();
        },
        error: function (error) {
            console.error(error);
        }
    });
}

// Função para realizar a requisição AJAX de exclusão
function deleteAnime(animeId) {
    var localadress = document.getElementById('localadress').value;
    var port = document.getElementById('port').value;
    $.ajax({
        url: `http://${localadress}:${port}/editar`,
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({
            id: animeId
        }),
        success: function (response) {
            alert(JSON.stringify(response));
            listarAnime();
        },
        error: function (error) {
            console.error(error);
        }
    });
}