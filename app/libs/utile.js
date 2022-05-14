function rispondiGet(o,res){
	if(o)
		res.status(200).json(o);
	else
		res.status(404).json('Not Found');
}

function exit(m){
	console.log(m);
}

function successo(){
	exit('Bene');
}

function fallimento(){
	exit('male');
}

module.exports = {
	rispondiGet,
	successo,
	fallimento
};