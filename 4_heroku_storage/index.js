
require('dotenv').load();
const express    = require('express')
const bodyParser = require('body-parser')
const request    = require('request')
const rp         = require('request-promise');
const app        = express()
const mongoose   = require('mongoose');

// ### Dados  Importantes Configurar para producao
const PORT 		= process.env.PORT;
const MONGO_ACCESS     = process.env.MONGO_ACCESS;
// ### Dados  Importantes Configurar para producao
app.use('/', express.static('public'));
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(app.get('port'), function() {
	console.log("logado olha o log !! aquiiiiiiiiiiiiii  huhuhuuhu  TO ONLINEEEE " + PORT)
})

console.log(MONGO_ACCESS)
mongoose.connect(MONGO_ACCESS).then(
  ()=>{
    console.log("connected to mongoDB")},
 (err)=>{
     console.log("err",err);
}
);
var Schema = mongoose.Schema;  
var listauPizzaDataSchema = new Schema({
  input: String,
  output:String,
  messages: String,
  context: {} ,  // para poder aceitar um array com informacoes dentro dele 
  _id : {},
  name : String,
  valor : String,
  ingredientes : String,
}, {collection: 'infopizza'});


app.post('/pizzaconsulta', (req, res) =>{

	// console.log(req.body)
  var consulta = {
	context: req.body
  }
 console.log(consulta)
var usersConsultaPizzaDb = mongoose.model('usersConsultaPizzaDb', listauPizzaDataSchema);
var usersConsultaObj ={}
	usersConsultaPizzaDb.find({ "context.senderID": consulta.context.senderID })
		.then(function(usersConsultaObj) { 
		  
		  console.log("#### Lista de pizzas que existem  #####")
			   console.log(usersConsultaObj)
			
			res.send(usersConsultaObj) 
		  console.log('#### Lista de pizzas que existem  #####')
		 
		
  });
});

/// ## Modelo de estrutura da colecao Pedidos ####///

  var cadastroDbSchema = new Schema({
  senderId: String,
  profile:  {},
  cadastro:  {},
	messages: [{}],
	pedidos:  [{}]
}, {collection: 'infoPedidos'});

/// ## Modelo de estrutura da colecao Pedidos ####///


// Chamada de api Post para cadastrar o pedido enviado
app.post('/cadastro', (req, res) =>{
	let infoRaw= req.body.data
  console.log(infoRaw)

	let dados ={
		info:infoRaw  // Montando estrutura que sera salva
	}
		var cadastroDb = mongoose.model('cadastroDb',  cadastroDbSchema);
		var usersObj ={}
		cadastroDb
				.findOneAndUpdate({ "senderId": infoRaw.senderId },
					{  $set: {
											'cadastro': {
													email:"email@email.com",
													cpf  :dados.info.cpf
											},
											profile:  dados.info.profile,
											messages: dados.info.messages,
											pedidos:  dados.info.pedidos
									 
						}
					},
					{ upsert: true },
					function(err, result) {
						if (err) res.send(err);  /// Em caso de erro enviar o erro na api para Verificar
					     console.log(err) 
							
							console.log("#### cadastrado #####" )
							console.log(result)
							res.send(" cadastrado efetuado com sucesso") // Se tudo certo devolver esse cara
					});
});

// Chamada de api Post para cadastrar o pedido enviado

// ROUTES
app.get('/teste', function(req, res) {
	console.log("huhuhuuhu Deu certo  o teste");
	res.send({
 				"messages": [
   								 {"text": "Servidor storage"}
									
 							]
			})
});

