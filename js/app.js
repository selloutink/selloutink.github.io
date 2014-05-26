var db = new PouchDB('producten', {adapter : 'websql'});
var remoteCouch = false;
//var time;
//var time2;
toonProducten();

db.info(function(err, info) {
  db.changes({
    since: info.update_seq,
    live: true
  }).on('change', toonProducten);
});

function addProduct(text){
	var product = {
		_id: new Date().toISOString(),
		naam: text,
		hoeveelheid: 1,
		merk: "Unilever",
		boodschappenhoeveelheid: 1,
		prijs: 1.21,
		winkelid: 1
	};
	db.put(product, function callback(err, result) {
    if (!err) {
      console.log('Successful!');
    }
  });
}
function toonProducten(){
	db.allDocs({include_docs: true, descending: true}, function(err, doc) {
    redrawProducts(doc.rows);
  });
}
function redrawProducts(producten){
	var div = document.getElementById('productenlijst');
    var html = "";
    producten.forEach(function(product){
   		html = html + "\
   		<div class='product "+'"'+product.id+'"'+"'>\
              <img src='http://placehold.it/100x100' alt='' /> <a href=''>\
              <div class='productdata  alleproducten'>\
                  <h4 class='title '>" + product.doc.naam + "</h4>\
                  <p class='metadata'>" + product.doc.merk + "</p>\
              </div></a>\
                  <div class='voegtoe alleproducten'>\
                      <div class='plusmin'>\
                          <button onclick='addhoeveelheid("+'"'+product.id+'"'+")' class='btn btn-success'><b>+</b></button>\
                          <button onclick='minhoeveelheid("+'"'+product.id+'"'+")'class='btn btn-danger'>-</button>\
                      </div>\
                      <button class='btn btn-warning'>Wis <br>uit <br>database</button>\
                      <button class='btn btn-info'>Pas aan</button>\
                  </div>\
                  <div class='hoeveelheiddata'>\
                       <h1>" + product.doc.hoeveelheid + "</h1><small>in voorraad</small>\
                  </div>\
            </div> <!-- end product -->";    });
	div.innerHTML = html;
	
	//time = 0;
	//time = new Date().getTime();;
	//console.log("TIME UPDATE: " + time);
	//console.log(time - time2);
}

function createProductItem(product){
	console.log(product);
}

function addhoeveelheid(productid){
	var hoeveelheid = 0;
	db.get(productid, function(err, retrieved) {
	  hoeveelheid = retrieved.hoeveelheid + 1;
	  db.put({
	  	_id: retrieved._id,
	  	_rev: retrieved._rev,
		naam: retrieved.naam,
		hoeveelheid: hoeveelheid,
		merk: retrieved.merk,
		boodschappenhoeveelheid: retrieved.boodschappenhoeveelheid,
		prijs: retrieved.prijs,
		winkelid: retrieved.winkelid
	  }, productid, retrieved._rev, function(err, response) {});
	});
}

function minhoeveelheid(productid){
	var hoeveelheid = 0;
	db.get(productid, function(err, retrieved) {
	  hoeveelheid = retrieved.hoeveelheid - 1;
	  db.put({
	  	_id: retrieved._id,
	  	_rev: retrieved._rev,
		naam: retrieved.naam,
		hoeveelheid: hoeveelheid,
		merk: retrieved.merk,
		boodschappenhoeveelheid: retrieved.boodschappenhoeveelheid,
		prijs: retrieved.prijs,
		winkelid: retrieved.winkelid
	  }, productid, retrieved._rev, function(err, response) {});
	});
	//time2 = 0;
	//time2 = new Date().getTime();
	//console.log("TIME DATABASE: " + time2);
}