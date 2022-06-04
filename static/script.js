/**
 * This variable stores the logged in user
 */
var loggedUser = {};
var counter = 0;
const inMod = new bootstrap.Modal('#modalInput', {keyboard: false});
const addRoomMod = new bootstrap.Modal('#modalAddRoom', {keyboard: false});
const modalAdd = document.getElementById("modalAdd"); 
const modInp = document.getElementById("modIn"); 
const postDetailMod = new bootstrap.Modal('#postDetailModal', {});
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
var roomsToAdd = [];


function showToast(message,title, type){
    const toast = new bootstrap.Toast(document.getElementById('liveToast'));
    document.getElementById("toastMsg").innerHTML = `<span class="text-${type}">${message}</span>`;
    document.getElementById("toastTit").innerHTML = `<span class="text-${type}">${title}</span>`;
    toast.show();
}

function showAlert(message, type, id = "mainAlertDiv"){
    var alertPlaceholder = document.getElementById(id);
    var alert = (message, type) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')
        alertPlaceholder.append(wrapper)
    }
    alert(message, type);
}

/**
 * Log out function
 */
function logout(){
    const uNLoggedEl = document.getElementsByClassName("uNLogged");  
    for (let i = 0; i < uNLoggedEl.length; i++) {
        uNLoggedEl[i].hidden = false;
    } 
    const uLoggedEl = document.getElementsByClassName("uLogged");  
    for (let i = 0; i < uLoggedEl.length; i++) {
        uLoggedEl[i].hidden = true;
    } 
    loggedUser = {}
    loadPosts();
    document.getElementById("user").innerText ="Utente";
    showAlert("Disconnesso!", "success");
}

/**
 * Function that enables and disables buttons
 */
function enNavButtons(){
    const uLoggedEl = document.getElementsByClassName("uLogged");  
    for (let i = 0; i < uLoggedEl.length; i++) {
        uLoggedEl[i].hidden = false;
    } 
    const uNLoggedEl = document.getElementsByClassName("uNLogged");  
    for (let i = 0; i < uNLoggedEl.length; i++) {
        uNLoggedEl[i].hidden = true;
    } 

}


const empStar = '<i class="bi bi-star"></i>';
const fullStar = '<i class="bi bi-star-fill"></i>';
/**
 * Create a post with a card user interface (bootstap)
 */
function addStar(fav,id){ return  fav ? `<button id="Fav${id}" onclick="remFavorite('${id}')" class="btn btn-link text-warning">${fullStar}</button>` : `<button id="notFav${id}" onclick="setFavorite('${id}')" class="btn btn-link text-warning">${empStar}</button>`;}


function createCardPost(id, title, showPrice, where, typect, nRoom, buttons = false){
    return `    <div class='card mb-3 float-center' style='width: 40rem;'> <div class="card-header text-bg-dark clearfix">
    <div class="hstack gap-3"><h5>${title}</h5><span class="ms-auto h4 fav" id="starAtt${id}"></span></div></div>
  <div class='card-body grid'>
    <a onclick='loadDetails("${id}")' class="text-decoration-none text-dark">
    <div class="g-col-6"><img src="https://www.agenziazaramella.it/wp-content/uploads/2019/05/14-Larredo-per-un-mini-appartamento-di-50-mq.jpg" class="rounded float-start w-50" ></div>
    <div class='g-col-6 card-text' >
      <dl class="row"><dt class="col-sm-6 text-start">Numero Camere</dt><dd class="col-sm-6 text-start">${nRoom}</dd>
        <dt class="col-sm-6 text-start">Contratto</dt><dd class="col-sm-6 text-start">${(typect == "") ? "<small class='text-muted'>Non definito</small>" :typect}</dd></dl>
      <p><i class="bi bi-geo-alt-fill"> ${where}</i></p> <h2>${showPrice}€</h2></div></a></div>${(buttons) ? `<div class="card-footer bg-transparent justify-content-center d-flex">
      <div class="d-flex justify-content-between ">
          <div class="btn-group">
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="editPostPage('${id}')">Modifica <i class="bi bi-pencil-square"></i></button>
          <button type="button" class="btn btn-sm btn-outline-danger" onclick="deletePost('${id}')">Elimina <i class="bi bi-trash-fill"></i></button>
          </div></div>
      </div>` : ""}</div>`;


}

function createDetailPost(id,title, descr, typect, phone, email, where, nRoom, roomDiv){
    return `
    <div class='card mb-3 float-center'> 
    <div class="card-header"><div class="hstack gap-3"><h5>${title}</h5><span class="ms-auto h4" id="starAtt${id}"></span></div></div>
    <div class='card-body '><div class="grid"><div class="g-col-6">
          <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel"><div class="carousel-inner">
            <div class="carousel-item active"><img src="https://www.agenziazaramella.it/wp-content/uploads/2019/05/14-Larredo-per-un-mini-appartamento-di-50-mq.jpg" class="d-block w-100"></div>
            <div class="carousel-item"><img src="https://www.hotelpiazzabellini.com/images/background/appartamenti-04.jpg" class="d-block w-100"></div></div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Precedente</span></button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Successiva</span></button></div>
      </div><hr><div class='g-col-6 card-text' ><dl class="row">
            <dt class="col-sm-6 text-start">Numero Camere</dt>
            <dd class="col-sm-6 text-start">${nRoom}</dd>
            <dt class="col-sm-6 text-start">Tipologia Contratto</dt>
            <dd class="col-sm-6 text-start">${(typect == "") ? "<small class='text-muted'>Non definito</small>" :typect}</dd>
          </dl></div></div><hr>
      <p><i class="bi bi-geo-alt-fill">${where} </i></p><hr>
      <div class="text-start"><dl class="row">
          <dt class="col-sm-6 text-start">Telefono</dt>
          <dd class="col-sm-6 text-start">${(phone == "") ? "<small class='text-muted'>Non definito</small>" :phone}</dd>
          <dt class="col-sm-6 text-start">Email</dt>
          <dd class="col-sm-6 text-start">${email}</dd></dl>
      </div><hr><div class="text-start">${descr}</div><hr><div class="mt-3">
        <h5>Camere disponibili:</h5>
        <div class="row row-cols-1 row-cols-md-2 g-4">
          ${roomDiv}
        </div>
      </div>
    </div>
  </div>`;
}

function createSmallRoomDiv(rooms, buttons = false){
    var div = '';
    rooms.forEach((room,index )=> {
        div+= `
        <div class="col">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${room.name}</h5>
                    <h2 class="card-text">${room.price}€</h2>
                    ${(buttons) ? `
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="showEditRoom(${index})"><i class="bi bi-pencil-square"></i></button>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeRoom(${index})"><i class="bi bi-trash-fill"></i></button>
                        </div>
                    </div>` : ""}
                </div>
            </div>
        </div>`;
    });
    return div;
}

function createFilterSection(){
    return `<div class="card mb-3 mt-3" style="width: 40rem;">
    <div class="card-body">
      <h5 class="card-title">Filtra la ricerca</h5>
      <input type="text" class="form-control mb-3" placeholder="Cerca..." aria-label="search" id="sSearch">
      <p class="card-text"><a class="text-decoration-none text-secondary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Ricerca avanzata <i class="bi bi-chevron-down"></i></a></p>
      <div class="collapse mb-3" id="collapseExample">
          <div class="row">
            <div class="col-sm">
              <select class="form-select mb-3" aria-label="Default select example" id="sContr">
                <option class="text-secondary" value="" selected>Seleziona il tipo di contratto...</option>
                <option value="Mensile">Mensile</option>
                <option value="Annuale">Annuale</option>
                <option value="Altro">Altro...</option>
              </select>
            </div>
            <div class="col-sm">
              <input type="number" id="sNRoom" class="form-control mb-3" placeholder="Numero camere" min="0">
            </div>
            <div class="col-sm">
              <input type="text" id="sWhere" class="form-control mb-3" placeholder="Comune[Provincia]">
            </div>
          </div>
          <div class="row">
            <div class="col-sm">
              <input type="number" id="sMinPrice" class="form-control mb-3" placeholder="Prezzo minimo" min="0">
            </div>
            <div class="col-sm">
              <input type="number" id="sMaxPrice" class="form-control mb-3" placeholder="Prezzo massimo" min="0">
            </div>
          </div>
      </div>
      <div id="filterAlert" class="container mt-3"></div>
      <a href="#" class="btn btn-danger" onclick="loadPosts()" hidden>Annulla <i class="bi bi-x-lg"></i></i></a>
      <a href="#" class="btn btn-primary" onclick="loadFilteredPost()">Cerca <i class='bi bi-search'></i></a>
    </div>
  </div>`;
}




/**
 * This function creates a page that shows the details of a post
 */
function loadDetails(id) {
    //remove posts
    const main_div = document.getElementById("main_div");
    //main_div.innerHTML = "";


    const div = document.createElement("div");
    div.setAttribute('class', "form-group");
    div.setAttribute('id', "posts_div");

    div.innerHTML = "<div id='posts'></div>";
    main_div.appendChild(div);

    fetch('../api/v2/posts/' + id)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify
        // console.log(data);
        
        if (!data.message) 
            console.log('no data');
        if (Array.isArray(data.message)) 
            console.log('result is an array');

        post = data.message;
        const post_div = document.getElementById("detailModal");
        post_div.innerHTML = "";

        var star = false;
        if(loggedUser.favorite != null){loggedUser.favorite.forEach(fav => {if(id == fav) star = true;});}

        post_div.innerHTML+= createDetailPost(id,post.title, post.description, post.contract, post.phone,post.email,post.where,post.rooms, createSmallRoomDiv(post.available));
        var postIn = document.getElementById("starAtt"+id);
        postIn.innerHTML=addStar(star, id);
        post_div.innerHTML+= "<a href='#' class='text-muted text-decoration-none mb-3' data-bs-dismiss='modal'><i class='bi bi-arrow-left-short'></i> indietro</a>";
        postDetailMod.show();
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
        
}
/**
 * This function load a selection of filtered posts
 */
function loadFilteredPost(){

}



function showAddRoom(title = "Aggiugni Stanza", button = "Aggiungi", oncl = "addRoom()", nome = "", prezzo = ""){
    modalAdd.innerHTML = 
    `<div class="modal-header p-5 pb-4 border-bottom-0">
        <h2 class="fw-bold mb-0">${title}</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body p-5 pt-0">
        <form class="">
            <div class="mb-3">
                <input type="text" class="form-control mb-3" id="roomName" placeholder="Nome" value="${nome}">
                <div class="input-group mb-3">
                <input type="number" class="form-control" id="price" min="0" max="100000" placeholder="Prezzo" value="${prezzo}">
                <div class="input-group-text"><i class="bi bi-currency-euro"></i></div>
                </div>
                <hr>
                <div class="btn-group mb-3" role="group">
                    <button class="btn btn-lg btn-primary" type="button" onclick="${oncl}">${button}</button>
                    <button class="btn btn-lg btn-danger" type="button" data-bs-dismiss="modal" aria-label="Close">Annulla</button>
                </div>
                <div id="addRoomAlertDiv" class="container"></div>
            </div>
        </form>
    </div>`;
    addRoomMod.show();
}

function showEditRoom(ind){
    showAddRoom("Modifica Stanza", "Modifica", `editRoom(${ind})`, roomsToAdd[ind].name, roomsToAdd[ind].price);
}



function addRoom(){
    var nome = document.getElementById("roomName").value;
    var prezzo = document.getElementById("price").value;
    if(nome == ""){
        showAlert("Inserisci un nome!" , "danger", "addRoomAlertDiv");
        return;
    }
    if(prezzo == ""){
        showAlert("Inserisci un prezzo!" , "danger", "addRoomAlertDiv");
        return;
    }
    if(prezzo < 0){
        showAlert("Inserisci un prezzo valido!" , "danger", "addRoomAlertDiv");
        return;
    }
    if(prezzo > 100000){
        showAlert("Inserisci un prezzo ragionevole!" , "danger", "addRoomAlertDiv");
        return;
    }
    addRoomMod.hide();
    roomsToAdd.push({name: nome, price: prezzo, description: ""});
    showAlert("Stanza aggiunta" , "success");
    var roms = document.getElementById("newRooms");
    roms.innerHTML = createSmallRoomDiv(roomsToAdd, true);
}

function removeRoom(ind){
    roomsToAdd.splice(ind, 1);
    var roms = document.getElementById("newRooms");
    roms.innerHTML = createSmallRoomDiv(roomsToAdd, true);
    showAlert("Stanza rimossa" , "success");
}

function editRoom(ind){
    var nome = document.getElementById("roomName").value;
    var prezzo = document.getElementById("price").value;
    if(nome == ""){
        showAlert("Inserisci un nome!" , "danger", "addRoomAlertDiv");
        return;
    }
    if(prezzo == ""){
        showAlert("Inserisci un prezzo!" , "danger", "addRoomAlertDiv");
        return;
    }
    if(prezzo < 0){
        showAlert("Inserisci un prezzo valido!" , "danger", "addRoomAlertDiv");
        return;
    }
    if(prezzo > 100000){
        showAlert("Inserisci un prezzo ragionevole!" , "danger", "addRoomAlertDiv");
        return;
    }
    addRoomMod.hide();
    roomsToAdd[ind] = {name: nome, price: prezzo, description: ""};
    var roms = document.getElementById("newRooms");
    roms.innerHTML = createSmallRoomDiv(roomsToAdd, true);
}




/**
 * This function refresh the list of posts
 */
function loadPosts() {
    //remove form login
    inMod.hide();

    const main_div = document.getElementById("main_div");
    const home_div = document.getElementById("home_div");
    home_div.hidden = true;

    main_div.innerHTML = createFilterSection();


    fetch('../api/v2/posts')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify
        if (!data.message){
            main_div.innerHTML += "<h3>Nessun annuncio...</h3><br><h4>Sii il primo a pubblicare qualcosa!</h4>";
            console.log('no data');
        }
        if (!Array.isArray(data.message)) 
            showAlert("Errore nel caricare gli annunci", "danger");
        counter = 0;
        return data.message.map(function(post) { // Map through the results and for each run the code below
            counter++;
            var star = false;
            if(loggedUser.favorite != null){loggedUser.favorite.forEach(fav => {if(post._id == fav) star = true;});}
            main_div.innerHTML+= createCardPost(post._id, post.title, post.showPrice, post.where, post.contract,post.rooms);
            let postIn = document.getElementById("starAtt"+post._id);
            postIn.innerHTML=addStar(star, post._id);
        });
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
}
 
/**
 * This function is called by clicking on the "insert post" button.
 * It creates a new post given the specified title,
 * and force the refresh of the whole list of posts.
 */
function insertPost()
{
    //get the post title
    var postTitle = document.getElementById("postTitle").value;
    if(postTitle == "") {showAlert("Inserisci un titolo!", "danger"); return;};
    var postDesc = document.getElementById("postDesc").value;
    if(postDesc == "") {showAlert("Inserisci una descrizione!", "danger"); return;};
    var phone = document.getElementById("phone").value;
    var via = document.getElementById("addrOne").value;
    var comu = document.getElementById("addrTwo").value;
    if(comu == "") {showAlert("Inserisci il comune!", "danger"); return;};
    var prov = document.getElementById("addrThree").value;
    if(prov == "") {showAlert("Inserisci il comune!", "danger"); return;};
    var contr = document.getElementById("tyContr").value;
    if(roomsToAdd.length == 0) {showAlert("Inserisci almeno una stanza!", "danger"); return;};
    var min = roomsToAdd[0].price;
    var max = roomsToAdd[0].price;
    roomsToAdd.forEach(room => {
        if(room.price < min) min = room.price;
        if(room.price > max) max = room.price;
    });
    var showPrice;
    if(min == max) showPrice = min;
    else showPrice = `${min} - ${max}`;
    
    // console.log(postTitle);

    fetch('../api/v2/users/'+ loggedUser.id +'/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            title: postTitle , 
            description: postDesc,
            email: loggedUser.email,
            contract: contr,
            phone: phone,
            rooms: roomsToAdd.length + 1,
            available: roomsToAdd,
            where: `${(via == "") ? "" : via + ' - '}${comu}[${prov}]`,
            showPrice: showPrice,
            createdBy: loggedUser.id
        }),
    })
    .then((resp) => {
        // console.log(resp);
        // console.log(resp.status);
        if(resp.status != 201){
            showAlert("Errore nella creazione dell'annuncio, riprova! Devi aver fatto il login e inserito un titolo", "danger")
        }
        else {
            showToast('Post creato con successo!',"Successo", "success");
            roomsToAdd = [];
            modalAdd.innerHTML = "";
            loadPosts();
        }
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}
 
/**
 * This function is called when login button is pressed.
 * Note that this does not perform an actual authentication of the user.
 * A user is loaded given the specified email,
 * if it exists, the userId is used in future calls.
 */
function login()
{
    //get the form object
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    if(email == ""){
        showAlert("Inserisci Email", "danger","loginAlertDiv");
        return;
    }
    if(password == ""){
        showAlert("Inserisci password", "danger","loginAlertDiv");
        return;
    }

    fetch('../api/v1/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {       // Here you get the data to modify as you please
        //check if the login is correct
        if (data.email == undefined) 
        {
            showAlert("Email o password non validi", "danger","loginAlertDiv");

        } else{
            loggedUser.token = data.token;
            loggedUser.email = data.email;
            loggedUser.id = data.id;
            loggedUser.username = data.username;
            loggedUser.favorite = data.favorite;

            document.getElementById("loginEmail").value = '';
            document.getElementById("loginPassword").value = '';
            inMod.hide();

            enNavButtons();
            

            //show username on top of the page
            document.getElementById("user").innerText = loggedUser.username;
            showToast("Benvenuto "+ loggedUser.username +"!","Benvenuto!", "success");
            const home_div = document.getElementById("home_div");
            home_div.hidden = true;
            loadPosts(); //shows posts page
        }
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

/**
 * Function called when the register button is pressed
 */
function register(){
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPassword").value;
    var username = document.getElementById("registerUsr").value;

    if (username == "") {
        showAlert("Inserisci username", "danger");
        return;
    }
    
    if(email == ""){
        showAlert("Inserisci Email", "danger");
        return;
    }
    if(password == ""){
        showAlert("Inserisci password", "danger");
        return;
    }

    if(!checkIfEmailInString(email)){
        showAlert("Email non valida", "danger");
        return;
    }


    if(password.localeCompare(document.getElementById("registerPasswordVer").value) != 0){
        showAlert("Le password non coincidono", "danger");
        return;
    }

    fetch('../api/v2/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password, username: username }  ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data){
        // console.log(data);
        if(data.email == undefined){
            showAlert("Email gia' in uso", "danger");
        }else{
            loggedUser.token = data.token;
            loggedUser.email = data.email;
            loggedUser.id = data.id;
            loggedUser.username = data.username;
            loggedUser.favorite = data.favorite;

            enNavButtons();
            //show username on top of the page
            document.getElementById("user").innerHTML = loggedUser.username;
            const home_div = document.getElementById("home_div");
            home_div.hidden = true;
            loadPosts();

            showAlert("Registrato con successo!", "success");
        }
        return;
        
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
    
}
function chgUsrPage(){
    modInp.innerHTML = `<div class="modal-header p-5 pb-4 border-bottom-0">
            <h2 class="fw-bold mb-0">Cambiamento username</h2>
        </div>
        <div class="modal-body p-5 pt-0">
            <form class="">
            <div class="form-floating mb-3">
                <input type="username" class="form-control rounded-3" id="newUsername" placeholder="username">
                <label for="floatingInput">Nuovo Username</label>
            </div>
            <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" onclick="changeUsername()">Conferma</button>
            </form>
        </div>`;
    inMod.show();
}


function changeUsername(){
    if(loggedUser.email == null){
        const modal = new bootstrap.Modal('#modalLoginNeed', {keyboard: false});
        modal.show();
        return;
    }
    const nusername = document.getElementById("newUsername").value;
    inMod.hide();

    fetch('../api/v2/users/'+ loggedUser.id+'/updateUsername', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { username: nusername }  ),
    })
    .then((resp) => resp.json() ) // Transform the data into json
    .then(function(data){
        if(data.email == undefined){
            console.log("Errore cambiamento username");
        }else{
            loggedUser.username = data.username;
            document.getElementById("user").innerText = data.username;
        }
        userPage();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
    
}



/**
 *this function set a particular post as favorite
 */
function setFavorite(id){
    if(loggedUser.email == null){
        const modal = new bootstrap.Modal('#modalLoginNeed', {keyboard: false});
        modal.show();
        return;
    }
    fetch('../api/v2/users/'+ loggedUser.id+'/setFavorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {id: id }  ),
    })
    .then((resp) => resp.json() ) // Transform the data into json
    .then(function(data){
        // console.log(data);
        if(data.id == undefined){
            console.log("Errore nell'aggiunta ai preferiti");
        }else{
            loggedUser.favorite = data.favorite;
            document.getElementById("starAtt"+data.id).innerHTML=addStar(true, data.id);
        }
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

function remFavorite(id){
    if(loggedUser.email == null){
        const modal = new bootstrap.Modal('#modalLoginNeed', {keyboard: false});
        modal.show();
        return;
    }
    fetch('../api/v2/users/'+ loggedUser.id+'/remFavorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {id: id }  ),
    })
    .then((resp) => resp.json() ) // Transform the data into json
    .then(function(data){
        // console.log(data);
        if(data.id == undefined){
            console.log("Errore rimozione preferiti");
        }else{
            loggedUser.favorite = data.favorite;
            document.getElementById("starAtt"+data.id).innerHTML=addStar(false, data.id);
            
        }
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

 
/**
 * This function is called by clicking on the "add new post" button.
 * It dinamically creates a form to insert a new posts.
 */
function newPostPage()
{
    roomsToAdd = [];
    if(loggedUser.email == null){
        const modal = new bootstrap.Modal('#modalLoginNeed', {keyboard: false});
        modal.show();
        return;
    }
    //check if the create form already exists
    if(!document.getElementById("createform")) 
    {
        var form= `    <form id="createform" method="post" action="api/v1/post">
        <h2>Crea nuovo annuncio:</h2>
        <input id="postTitle" name="title" maxlength="50" class="form-control" placeholder="Titolo">
        <div class="invalid-feedback">
            Inserisci un titolo.
        </div>
        <hr>
        <div class="input-group mb-3 " id="usrDiv">
          <span class="input-group-text">Descrizione</span>
          <textarea id="postDesc" name="postDesc" class="form-control" maxlength="800" placeholder="Descrizione" rows="5"></textarea>
        </div>
        <hr>
        <div class="input-group mt-3 mb-3">
        <div class="input-group-text"><i class="bi bi-telephone"></i></div>
        <input type="text" class="form-control" id="phone" placeholder="Numero di telefono" type="number">
        </div>
        <div class="row g-3">
          <hr>
          <div class="input-group mb-3 col-12">
            <label class="input-group-text" for="tyContr">Tipologia contratto</label>
            <select class="form-select" id="tyContr">
              <option selected disabled value="">Scegli...</option>
              <option value="Annuale">Annuale</option>
              <option value="Mensile">Mensile</option>
              <option value="Altro">Altro</option>
            </select>
            <div class="invalid-feedback">
                Scegli il tipo di contratto.
            </div>
          </div>
          <hr>
          <div class="mb-3 col-6">
            <div class="input-group">
              <div class="input-group-text"><i class="bi bi-geo-alt"></i></div>
              <input type="text" class="form-control" id="addrOne" placeholder="Indirizzo">
              <div class="invalid-feedback">
                Inserisci un indirizzo.
                </div>
            </div>
          </div>
          <div class="mb-3 col-3">
            <input id="addrTwo" name="provincia" class="form-control" placeholder="Comune" list="comu" type="text">
            <div class="invalid-feedback">
                Inserisci un Comune.
            </div>
          </div>
          <div class="mb-3 col-3">
            <input id="addrThree" name="provincia" class="form-control" placeholder="Provincia" list="prov" type="text">
            <div class="invalid-feedback">
                Inserisci una Provincia.
            </div>
          </div>
          <hr>
        </div>
        <div class="card mb-3">
          <div class="card-header"><h5 class="card-title">Stanze</h5></div>
          <div class="card-body" >
          <div class="row row-cols-1 row-cols-md-2 g-4" id="newRooms">
            </div>
            </div>
          <button type="button" class="btn btn-secondary" onclick="showAddRoom()">Aggiungi Stanza</button>
        </div>
        <button type="button" class="btn btn-primary" onclick="insertPost()">Crea annuncio</button>
      </form>`;
        
        const home_div = document.getElementById("home_div");
        home_div.hidden = true;
        const main_div = document.getElementById("main_div");
        main_div.innerHTML=form;
        var prov = document.getElementById("prov");
        for(let i = 0; i< province.length; i++){
            let provi = province[i].split(",");
            prov.appendChild(new Option(provi[0]));
        }
        var comun = document.getElementById("comu");
        for(let i = 0; i< comuni.length; i++){
            let comune = comuni[i].split(",");
            comun.appendChild(new Option(comune[0]));
        }
    }
}

 /**
  * This function is called by clicking on the "login" button.
  * It dinamically creates a form to perform a "login" in the website.
  */
function loginPage()
{
    modInp.innerHTML = `<div class="modal-header p-5 pb-4 border-bottom-0">
        <h2 class="fw-bold mb-0">Login</h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body p-5 pt-0">
        <form class="">
        <div class="form-floating mb-3">
            <input type="email" class="form-control rounded-3" id="loginEmail" placeholder="name@example.com">
            <label for="floatingInput">Email</label>
        </div>
        <div class="form-floating mb-3">
            <input type="password" class="form-control rounded-3" id="loginPassword" placeholder="Password">
            <label for="floatingPassword">Password</label>
        </div>
        <button class="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" onclick="login()">Login</button>
        <small class="text-muted">Non ancora registrato? <a  href="#" class="link-dark" onclick="registerPage()" data-bs-dismiss="modal">Registrati</a></small>
        <div id="loginAlertDiv" class="container"></div>
        </form>
    </div>`;
    inMod.show();
}

/**
 * This function is called by clicking on the "Registrati" button.
 * It dinamically creates a form to register a new user in the website.
 */
function registerPage()
{
    
    //check if the register form already exists
    if(!document.getElementById("registerform")) 
    {
        var form = `<form method="post" action="api/v1/users" name="registerform" id="registerform"><h2>Registra un nuovo account:</h2><div class="form-floating mb-3" id="usrDiv"><input id="registerUsr" name="username" class="form-control" placeholder="Username"><label for="registerUsr">Username</label></div><div class="form-floating mb-3" id="emailDiv"><input id="registerEmail" name="email" class="form-control" placeholder="Email"><label for="registerEmail">Email</label></div><div class="form-floating mb-3" id="pwdDiv"><input id="registerPassword" name="password" class="form-control" placeholder="Password" type="password"><label for="registerPassword">Password</label></div><div class="form-floating mb-3" id="pwdDiv"><input id="registerPasswordVer" name="password" class="form-control" placeholder="Password" type="password"><label for="registerPasswordVer">Confirm Password</label></div><button type="button" class="btn btn-success" onclick="register()">Registrati</button></form>`;
        
        const home_div = document.getElementById("home_div");
        home_div.hidden = true;
        const main_div = document.getElementById("main_div");
        main_div.innerHTML = form;
    }
}

function homePage(){
        const main_div = document.getElementById("main_div");
        main_div.innerHTML = "";
        const home_div = document.getElementById("home_div");
        home_div.hidden = false;
        
}


/**
 * @returns a card with some post info
 */
function smallPost(id,title, price, position){
    return `<div class="col"><a href="#" class="text-decoration-none text-dark" onclick='loadDetails("${id}")'><div class="card"><div class="card-body">
            <h5 class="card-title text-truncate">${title}</h5><small class="card-text text-muted"><i class="bi bi-geo-alt-fill"></i>${position}</small>
            <h2 class="card-text">${price}€</h2></div></div></a></div>`;
}

function userPage(){
    if(loggedUser.email == null){
        const modal = new bootstrap.Modal('#modalLoginNeed', {keyboard: false});
        modal.show();
        return;
    }

    var page = `    <div class='card mb-3 float-center' style='width: 40rem;'> 
    <div class="card-header">
        <h4>Utente</h4>
    </div>
    <div class='card-body'>
        <dl class="row">
        <dt class="col-sm-6 text-start">Username</dt>
        <dd class="col-sm-6 text-start"><a href="#" class="text-dark" onclick="chgUsrPage()">${loggedUser.username} <i class="bi bi-pencil-square"></i></a></dd>
        <dt class="col-sm-6 text-start">Email</dt>
        <dd class="col-sm-6 text-start">${loggedUser.email}</dd>
        </dl>
        <hr>
        <span id="sFt"></span>
        <div class="mt-3">
        <div class="row row-cols-1 row-cols-md-2 g-4" id="smallFav">
        </div>
        </div>
    </div>
    </div>`;
    const home_div = document.getElementById("home_div");
    home_div.hidden = true;
    const main_div = document.getElementById("main_div");
    main_div.innerHTML = page;

    const smallFav = document.getElementById("smallFav");
    const sFt = document.getElementById("sFt");
    if(loggedUser.favorite.length == 0) {smallFav.innerHTML+= "<h5>Nessun annuncio preferito</h5>"; return;}
    sFt.innerHTML+= "<h5>Annunci preferiti</h5>"; 
    loggedUser.favorite.forEach(lid => {
        fetch('../api/v2/posts/' + lid)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify
            if (!data.message) 
                console.log('no data');
            if (Array.isArray(data.message)) 
                console.log('result is an array');
            post = data.message;
            smallFav.innerHTML+= smallPost(lid,post.title, post.showPrice, post.where);
        })
        .catch( error => console.error(error) );// If there is any error you will catch them here
    });

}


function favPage(){
    if(loggedUser.email == null){
        const modal = new bootstrap.Modal('#modalLoginNeed', {keyboard: false});
        modal.show();
        return;
    }
    const home_div = document.getElementById("home_div");
    home_div.hidden = true;
    const main_div = document.getElementById("main_div");
    if(loggedUser.favorite.length == 0) {main_div.innerHTML= "<h3>Nessun annuncio preferito</h3>"; return;}
    main_div.innerHTML = "<h2>Annunci preferiti:</h2>";
    loggedUser.favorite.forEach(lid => {
        fetch('../api/v2/posts/' + lid)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify
            if (!data.message) 
                console.log('no data');
            if (Array.isArray(data.message)) 
                console.log('result is an array');
            post = data.message;
            var star = false;
            if(loggedUser.favorite != null){loggedUser.favorite.forEach(fav => {if(lid == fav) star = true;});}
            main_div.innerHTML+= createCardPost(lid, post.title, post.showPrice, post.where, post.contract,post.rooms);
            let postIn = document.getElementById("starAtt"+lid);
            postIn.innerHTML=addStar(star, lid);
        })
        .catch( error => console.error(error) );// If there is any error you will catch them here
    });
    

}

function postCreatedPage(){
    if(loggedUser.email == null){
        const modal = new bootstrap.Modal('#modalLoginNeed', {keyboard: false});
        modal.show();
        return;
    }
    const home_div = document.getElementById("home_div");
    home_div.hidden = true;
    const main_div = document.getElementById("main_div");
    main_div.innerHTML = "<h2>Annunci creati:</h2>";
    fetch('../api/v2/users/'+ loggedUser.id +'/posts', {method: "GET"})
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify
        if (!data.message) 
            console.log('no data');
        if (!Array.isArray(data.message)) {return;}
        if(data.message.length == 0) main_div.innerHTML = "<h3>Nessun annuncio creato</h3><button type='button' class='btn btn-success' onclick='newPostPage()'>Crea il tuo primo annuncio</button>";
        return data.message.map(function(post) { // Map through the results and for each run the code below
            counter++;
            main_div.innerHTML+= createCardPost(post._id, post.title, post.showPrice, post.where, post.contract,post.rooms, true);
        });
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
}

function editPostPage(id){
    ///:uid/posts/:id
    if(loggedUser.email == null){
        const modal = new bootstrap.Modal('#modalLoginNeed', {keyboard: false});
        modal.show();
        return;
    }
    fetch('../api/v2/posts/' + id)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify
        // console.log(data);
        var post = data.message;
        if (!data.message) 
            console.log('no data');
        if (Array.isArray(data.message)) 
            console.log('result is an array');

            var form= `    <form id="createform" method="post" action="api/v1/post">
        <h2>Modifica Annuncio</h2>
        <input id="postTitle" name="title" maxlength="50" class="form-control" placeholder="Titolo" value="${post.title}">
        <hr>
        <div class="input-group mb-3" id="usrDiv">
          <span class="input-group-text">Descrizione</span>
          <textarea id="postDesc" name="postDesc" class="form-control" maxlength="800" placeholder="Descrizione" rows="5">${post.description}</textarea>
        </div>
        <hr>
        <div class="input-group mt-3 mb-3">
            <div class="input-group-text"><i class="bi bi-telephone"></i></div>
            <input type="text" class="form-control" id="phone" placeholder="Numero di telefono" value="${post.phone}" type="number">
        </div>
        <div class="row g-3">
          <hr>
          <div class="input-group mb-3 col-12">
            <label class="input-group-text" for="tyContr">Tipologia contratto</label>
            <select class="form-select" id="tyContr" value="${post.contract}">
              <option value="Annuale">Annuale</option>
              <option value="Mensile">Mensile</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
          <hr>
            <div class="input-group">
              <div class="input-group-text"><i class="bi bi-geo-alt"></i></div>
              <input type="text" class="form-control" id="addr" placeholder="Indirizzo" value="${post.where}">
            </div>
          <hr>
        </div>
        <div class="card mb-3">
          <div class="card-header"><h5 class="card-title">Stanze</h5></div>
          <div class="card-body" >
          <div class="row row-cols-1 row-cols-md-2 g-4" id="newRooms">
            </div>
            </div>
          <button type="button" class="btn btn-secondary" onclick="showAddRoom()">Aggiungi Stanza</button>
        </div>
        <button type="button" class="btn btn-primary" onclick="editPost('${id}')">Conferma le modifiche</button>
        <button type="button" class="btn btn-danger" onclick="postCreatedPage()">Annulla</button>
      </form>`;
        
        const home_div = document.getElementById("home_div");
        home_div.hidden = true;
        const main_div = document.getElementById("main_div");
        main_div.innerHTML=form;
        var prov = document.getElementById("prov");
        for(let i = 0; i< province.length; i++){
            let provi = province[i].split(",");
            prov.appendChild(new Option(provi[0]));
        }
        var comun = document.getElementById("comu");
        for(let i = 0; i< comuni.length; i++){
            let comune = comuni[i].split(",");
            comun.appendChild(new Option(comune[0]));
        }

        roomsToAdd = post.available;
        var roms = document.getElementById("newRooms");
        roms.innerHTML = createSmallRoomDiv(roomsToAdd, true);

        
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
}
function editPost(id){
    ///:uid/posts/:id
    var postTitle = document.getElementById("postTitle").value;
    if(postTitle == "") {showAlert("Inserisci un titolo!", "danger"); return;};
    var postDesc = document.getElementById("postDesc").value;
    if(postDesc == "") {showAlert("Inserisci una descrizione!", "danger"); return;};
    var phone = document.getElementById("phone").value;
    var addr = document.getElementById("addr").value;
    if(addr == "") {showAlert("Inserisci il comune!", "danger"); return;};
    if(prov == "") {showAlert("Inserisci il comune!", "danger"); return;};
    var contr = document.getElementById("tyContr").value;
    if(roomsToAdd.length == 0) {showAlert("Inserisci almeno una stanza!", "danger"); return;};
    var min = roomsToAdd[0].price;
    var max = roomsToAdd[0].price;
    roomsToAdd.forEach(room => {
        if(room.price < min) min = room.price;
        if(room.price > max) max = room.price;
    });
    var showPrice;
    if(min == max) showPrice = min;
    else showPrice = `${min} - ${max}`;
    
    // console.log(postTitle);

    fetch('../api/v2/published/'+ loggedUser.id +'/posts/' + id+'?token='+loggedUser.token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { 
            title: postTitle , 
            description: postDesc,
            email: loggedUser.email,
            contract: contr,
            phone: phone,
            rooms: roomsToAdd.length + 1,
            available: roomsToAdd,
            where: addr,
            showPrice: showPrice,
            createdBy: loggedUser.id
        }),
    })
    .then((resp) => {
        if(resp.status == 400){
            showAlert("Errore modifica annuncio", "danger")
        }
        else {
            showToast('Post modificato con successo',"Successo", "success");
            roomsToAdd = [];
            modalAdd.innerHTML = "";
            postCreatedPage();
        }
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}



function deletePost(pid){
    //
    fetch('../api/v2/published/'+ loggedUser.id+'/posts/'+pid+'?token='+loggedUser.token , {method: 'DELETE',})
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) {
        showToast(data.message, "Eliminazione Post", "dark");
        postCreatedPage();
    });
}


/**
 * This function check if the pattern of an email is correct
 * https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
 */
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var res = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(text);
}
