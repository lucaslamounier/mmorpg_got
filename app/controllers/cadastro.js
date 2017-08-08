module.exports.cadastro = function(application, req, res){
      res.render('cadastro', {validacao: {}, dadosForm: {} });
}

module.exports.cadastrar = function(application, req, res){

      var dadosForm = req.body;

      req.assert('nome', 'Nome não pode ser vazio').notEmpty();
      req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
      req.assert('senha', 'Senha não pode ser vazia').notEmpty();
      req.assert('casa', 'casa não pode ser vazio').notEmpty();

      var erros = req.validationErrors();

      if(erros){
          res.render('cadastro', {validacao: erros, dadosForm: dadosForm});
          return;
      }

      // pega a variavel de conexão com o mongoDB
      var connection = application.config.dbConnection;
      // passa a conexao para o model
      var UsuariosDAO  = new application.app.models.UsuariosDAO(connection);
      var JogoDAO  = new application.app.models.JogoDAO(connection);

      UsuariosDAO.inserirUsuario(dadosForm);
      JogoDAO.gerarParametros(dadosForm.usuario);

      // geração dos parametros
      res.send('Cadastro realizado com sucesso. ');


}
