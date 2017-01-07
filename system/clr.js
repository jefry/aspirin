function clr(name){
	delete require.cache[require.resolve(name)];
}

module.exports = {
	aaa:'ddd',
	clr
}