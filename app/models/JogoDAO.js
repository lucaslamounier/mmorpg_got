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

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa){
  // Abre a conexão com o banco de dados
  this._connection.open(function(err, mongoclient){
        mongoclient.collection("jogo", function(err, collection){
            // consulta os usuário no banco de dados
            collection.find({usuario: usuario}).toArray(function(err, result){
                console.log(result[0]);
                res.render("jogo",
                    { img_casa: casa, jogo: result[0] }
                );
                // Encerra conexão com o banco de dados
                mongoclient.close();
            }); // end find
      }); // end collection
  }); // end open
};

module.exports = function(){
    return JogoDAO;
}
