/* Importar o modulo do crypto */
var crypto = require("crypto");

// Definição da classe
function UsuariosDAO(connection){
    // variavel so dentro do contexto da função
    this._connection = connection();
};
// Defiinição do metodo da classe
UsuariosDAO.prototype.inserirUsuario = function(usuario){
    // Abre a conexão com o banco de dados
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            // criptografa a senha do usuário.
            var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
            // sobreescreve a senha do usuário
            usuario.senha = senha_criptografada;
            // Insere os dados do usuário no banco de dados
            collection.insert(usuario);
            // Encerra conexão com o banco de dados
            mongoclient.close();
        });
    });
};
// metodo de autenticação de usuários
UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    // Abre a conexão com o banco de dados
    this._connection.open(function(err, mongoclient){
        mongoclient.collection("usuarios", function(err, collection){
            // criptografa a senha do usuário.
            var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
            // sobreescreve a senha do usuário
            usuario.senha = senha_criptografada;
            // consulta os usuário no banco de dados
            collection.find({
                usuario: usuario.usuario,
                senha:  usuario.senha
            }).toArray(function(err, result){

                if(result[0] != undefined){
                  // cria uma variável de sessão
                  req.session.autorizado = true;
                  req.session.usuario = result[0].usuario;
                  req.session.casa = result[0].casa;
                }

                if(req.session.autorizado){
                  res.redirect("jogo");
                }else{
                  res.render("index", {validacao: {}, dadosForm: {} });
                };

            });
            // Encerra conexão com o banco de dados
            mongoclient.close();
        });
    });
};
// Para exportação do consign
module.exports = function(){
    return UsuariosDAO;
};
