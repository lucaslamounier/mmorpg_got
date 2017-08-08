module.exports.jogo = function(application, req, res){
      if(req.session.autorizado !== true){
          res.send('Usuário precisa fazer login');
          return;
      };

      var usuario = req.session.usuario;
      var casa = req.session.casa;
      // pega a variavel de conexão com o mongoDB
      var connection = application.config.dbConnection;
      var JogoDAO  = new application.app.models.JogoDAO(connection);

      JogoDAO.iniciaJogo(res, usuario, casa);
      //res.render('jogo', {img_casa: req.session.casa});
};

module.exports.sair = function(application, req, res){
      req.session.destroy(function(err, result){
            res.render('index', {validacao: {}, dadosForm: {} });
      });
};
