#lavanya tripathi is thope
var express			=	require('express');
var port 			=	process.env.PORT||8080;
var app             =   express();
var morgan 			=	require('morgan');
var mongoose 		=	require('mongoose');
var bodyParser 		=	require("body-parser");
var path 			=	require('path');
var userApiRouter   =   require('./app/apis/userApis');


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+'/public/'));
app.use('/userApis',userApiRouter);


mongoose.connect('mongodb://localhost:27017/liveapp',function(err,db){
	if(err){
		console.log("Failed to connect to mongodb");
	}
	else{
		console.log("succesfully connected to mongodb");
	}
});
app.get('*',function(req,res){
	res.sendFile(path.join(__dirname+'/public/views/index.html'));
});

app.listen(port,function(){
	console.log("server running on port "+port);
});
