// ObjectID para remoção dos documentos dentro do mongodb
var ObjectID = require('mongodb').ObjectID;

function JogoDAO(connection){
    this._connection = connection();
};

JogoDAO.prototype.gerarParametros = function(usuario){

  // Abre a conexão com o banco de dados
  this._connection.open(function(err, mongoclient){
      mongoclient.collection("jogo", function(err, collection){
          // Insere os dados do usuário no banco de dados
          collection.insert({
              usuario: usuario,
              moeda: 15,
              suditos: 10,
              temor:  Math.floor(Math.random() * 1000), // Gerar um número aleatório entre 1 e 1000
              sabedoria: Math.floor(Math.random() * 1000),
              comercio:  Math.floor(Math.random() * 1000),
              magia:  Math.floor(Math.random() * 1000)
          });
          // Encerra conexão com o banco de dados
          mongoclient.close();
      });
  });

};

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
  // Abre a conexão com o banco de dados
  this._connection.open(function(err, mongoclient){
        mongoclient.collection("jogo", function(err, collection){
            // consulta os usuário no banco de dados
            collection.find({usuario: usuario}).toArray(function(err, result){

                res.render("jogo",
                    { img_casa: casa, jogo: result[0], msg: msg }
                );
                // Encerra conexão com o banco de dados
                mongoclient.close();
            }); // end find
      }); // end collection
  }); // end open
};

JogoDAO.prototype.acao = function(acao, usuario){

  // Abre a conexão com o banco de dados
  this._connection.open(function(err, mongoclient){
      mongoclient.collection("acao", function(err, collection){
          var date = new Date();
          var tempo = null;

          switch (parseInt(acao.acao)) {
            case 1: tempo = 1 * 60 * 60000; break;
            case 2: tempo = 2 * 60 * 60000; break;
            case 3: tempo = 5 * 60 * 60000; break;
            case 4: tempo = 5 * 60 * 60000; break;
          };

          acao.acao_termina_em = date.getTime() + tempo; // 01/01/1970 até o instante que a função foi executada
          // Insere os dados no banco de dados
          collection.insert(acao);
      });
      mongoclient.collection("jogo", function(err, collection){

          var moedas = null;

          switch (parseInt(acao.acao)) {
            case 1: moedas = -2 * acao.quantidade; break;
            case 2: moedas = -3 * acao.quantidade; break;
            case 3: moedas = -1 * acao.quantidade; break;
            case 4: moedas = -1 * acao.quantidade; break;
          };

          collection.update(
            { usuario: acao.usuario},
            { $inc: {moeda: moedas} }
          );
          // Encerra conexão com o banco de dados
          mongoclient.close();
      });

  });

};

JogoDAO.prototype.getAcoes = function(usuario, res){
      // Abre a conexão com o banco de dados
      this._connection.open(function(err, mongoclient){
            mongoclient.collection("acao", function(err, collection){
                    var date = new Date();
                    var momento_atual = date.getTime();
                    // consulta os usuário no banco de dados
                    collection.find({
                        usuario: usuario,
                        acao_termina_em: {$gt: momento_atual}
                    }).toArray(function(err, result){
                        res.render("pergaminhos", { acoes: result });
                        // Encerra conexão com o banco de dados
                        mongoclient.close();
                    }); // end find
          }); // end collection
      }); // end open
};

JogoDAO.prototype.revogarAcao = function(_id, res){

    // Abre a conexão com o banco de dados
    this._connection.open(function(err, mongoclient){
          mongoclient.collection("acao", function(err, collection){
                // Removendo documentos
                collection.remove(
                    {_id : ObjectID(_id) },
                    function(err, result){
                        res.redirect("jogo?msg=D");
                        mongoclient.close();
                    }
                );
        }); // end collection
    }); // end open
};

module.exports = function(){
    return JogoDAO;
}
