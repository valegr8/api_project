/**
 * This variable stores the logged in user
 */
var loggedUser = {};
var counter = 0;
const inMod = new bootstrap.Modal('#modalInput', {keyboard: false});
const modInp = document.getElementById("modIn"); 
const postDetailMod = new bootstrap.Modal('#postDetailModal', {});
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
window.onload = loadPosts();

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
function addStar(fav,id){ return fav ? `<a href="#" id="Fav${id}" onclick="remFavorite('${id}')" class="text-decoration-none text-warning">${fullStar}</a>` : `<a href="#" id="notFav${id}" onclick="setFavorite('${id}')" class="text-decoration-none text-warning">${empStar}</a>`}


function createCardPost(id, title){
    return `    <div class='card mb-3 float-center' style='width: 40rem;'> <div class="card-header clearfix">
    <div class="hstack gap-3"><h5>${title}</h5><span class="ms-auto h4 fav" id="starAtt${id}"></span></div></div>
  <div class='card-body grid'>
    <a href="#" onclick='loadDetails("${id}")' class="text-decoration-none text-dark">
    <div class="g-col-6"><img src="https://www.agenziazaramella.it/wp-content/uploads/2019/05/14-Larredo-per-un-mini-appartamento-di-50-mq.jpg" class="rounded float-start w-50" ></div>
    <div class='g-col-6 card-text' >
      <dl class="row"><dt class="col-sm-6 text-start">Numero Camere</dt><dd class="col-sm-6 text-start">3</dd>
        <dt class="col-sm-6 text-start">Tipologia Contratto</dt><dd class="col-sm-6 text-start">Annuale</dd><dt class="col-sm-6 text-start">Tipologia Locale</dt>
        <dd class="col-sm-6 text-start">Monolocale</dd></dl>
      <p><i class="bi bi-geo-alt-fill"> Via Gino,32 - Trento(TN)</i></p> <h2>320€</h2></div></a></div></div>`;
}

function createDetailPost(id,title, descr,createdBy){
    return `
    <div class='card mb-3 float-center'> 
    <div class="card-header clearfix"><div class="hstack gap-3"><h5>${title}</h5><span class="ms-auto h4" id="starAtt${id}"></span></div></div>
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
            <dd class="col-sm-6 text-start">3</dd>
            <dt class="col-sm-6 text-start">Tipologia Contratto</dt>
            <dd class="col-sm-6 text-start">Annuale</dd>
            <dt class="col-sm-6 text-start">Tipologia Locale</dt>
            <dd class="col-sm-6 text-start">Monolocale</dd></dl>
          </dl></div></div><hr>
      <p><i class="bi bi-geo-alt-fill"> Via Gino, 32 - Trento(TN)</i></p><hr>
      <div class="text-start"><dl class="row">
          <dt class="col-sm-6 text-start">Telefono</dt>
          <dd class="col-sm-6 text-start">321 1234567</dd>
          <dt class="col-sm-6 text-start">Email</dt>
          <dd class="col-sm-6 text-start">${createdBy}</dd></dl>
      </div><hr><div class="text-start">${descr}</div><hr><div class="mt-3">
        <h5>Camere disponibili:</h5>
        <div class="row row-cols-1 row-cols-md-2 g-4">
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Singola 1</h5>
                <h2 class="card-text">320€</h2>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Singola 2</h5>
                <h2 class="card-text">320€</h2>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Doppia</h5>
                <h2 class="card-text">280 €</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
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

        fetch('../api/v1/posts/' + id)
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
            
            post_div.innerHTML+= createDetailPost(id,post.title, post.description, post.createdBy);
            var postIn = document.getElementById("starAtt"+id);
            postIn.innerHTML=addStar(star, id);
            post_div.innerHTML+= "<a href='#' class='text-muted text-decoration-none mb-3' data-bs-dismiss='modal'><i class='bi bi-arrow-left-short'></i> indietro</a>";
            postDetailMod.show();
        })
        .catch( error => console.error(error) );// If there is any error you will catch them here
        
}

/**
 * This function refresh the list of posts
 */
function loadPosts() {
    //remove form login
    inMod.hide();

    const main_div = document.getElementById("main_div");
    main_div.innerHTML = "";


    main_div.innerHTML = "<h2>Annunci:</h2>";



    fetch('../api/v1/posts')
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
            main_div.innerHTML+= createCardPost(post._id, post.title, star);
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
    var postDesc = document.getElementById("postDesc").value;
    
    // console.log(postTitle);

    fetch('../api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { title: postTitle , description: postDesc , email: loggedUser.email} ),
    })
    .then((resp) => {
        // console.log(resp);
        // console.log(resp.status);
        if(resp.status != 201){
            showAlert("Errore nella creazione dell'annuncio, riprova! Devi aver fatto il login e inserito un titolo", "danger")
        }
        else {
            showToast('Post creato con successo!',"Successo", "success");
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
            showAlert("Benvenuto "+ loggedUser.username +"!", "success");
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

    fetch('../api/v1/users/updateUsername', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: loggedUser.email, username: nusername }  ),
    })
    .then((resp) => resp.json() ) // Transform the data into json
    .then(function(data){
        if(data.email == undefined){
            console.log("Errore cambiamento username");
        }else{
            loggedUser.username = data.username;
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
    fetch('../api/v1/users/setFavorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: loggedUser.email, id: id }  ),
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
    fetch('../api/v1/users/remFavorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: loggedUser.email, id: id }  ),
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
    if(loggedUser.email == null){
        const modal = new bootstrap.Modal('#modalLoginNeed', {keyboard: false});
        modal.show();
        return;
    }
    //check if the create form already exists
    if(!document.getElementById("createform")) 
    {
        var form= `<form id="createform" method="post" action="api/v1/post"><h2>Crea nuovo annuncio:</h2><div class="form-floating mb-3" id="usrDiv"><input id="postTitle" name="title" maxlength="30" class="form-control" placeholder="Titolo"><label for="postTitle">Titolo</label><div class="form-text">Lunghezza massima: 30 caratteri</div></div><div class="input-group mb-3" id="usrDiv"><span class="input-group-text">Descrizione</span><textarea id="postDesc" name="postDesc" class="form-control" maxlength="500" placeholder="Descrizione"></textarea></div><button type="button" class="btn btn-primary" onclick="insertPost()">Salva</button></form>`;
        const main_div = document.getElementById("main_div");
        main_div.innerHTML=form;
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
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="loadPosts()"></button>
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
        var form = `<form method="post" action="api/v1/users" name="registerform" id="registerform"><h2>Registra un nuovo account:</h2><div class="form-floating mb-3" id="usrDiv"><input id="registerUsr" name="username" class="form-control" placeholder="Username"><label for="registerUsr">Username</label></div><div class="form-floating mb-3" id="emailDiv"><input id="registerEmail" name="email" class="form-control" placeholder="Email"><label for="registerEmail">Email</label></div><div class="form-floating mb-3" id="pwdDiv"><input id="registerPassword" name="password" class="form-control" placeholder="Password" type="password"><label for="registerPassword">Password</label></div><div class="form-floating mb-3" id="pwdDiv"><input id="registerPasswordVer" name="password" class="form-control" placeholder="Password" type="password"><label for="registerPasswordVer">Confirm Password</label></div><button type="button" class="btn btn-primary" onclick="register()">Registrati</button></form>`;

        const main_div = document.getElementById("main_div");
        main_div.innerHTML = form;
    }
}

/**
 * @returns a card with some post info
 */
function smallFavPost(id,title, price, position){
    return `<div class="col"><a href="#" class="text-decoration-none text-dark" onclick='loadDetails("${id}")'><div class="card"><div class="card-body">
            <h5 class="card-title">${title}</h5><small class="card-text text-muted"><i class="bi bi-geo-alt-fill"></i>${position}</small>
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
    const main_div = document.getElementById("main_div");
    main_div.innerHTML = page;

    const smallFav = document.getElementById("smallFav");
    const sFt = document.getElementById("sFt");
    if(loggedUser.favorite.length == 0) {smallFav.innerHTML+= "<h5>Nessun annuncio preferito</h5>"; return;}
    sFt.innerHTML+= "<h5>Annunci preferiti</h5>"; 
    loggedUser.favorite.forEach(lid => {
        fetch('../api/v1/posts/' + lid)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify
            if (!data.message) 
                console.log('no data');
            if (Array.isArray(data.message)) 
                console.log('result is an array');
            post = data.message;
            smallFav.innerHTML+= smallFavPost(lid,post.title, "350", "Via Gino, 32 - Trento(TN)");
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
    const main_div = document.getElementById("main_div");
    if(loggedUser.favorite.length == 0) {main_div.innerHTML= "<h3>Nessun annuncio preferito</h3>"; return;}
    main_div.innerHTML = "<h2>Annunci preferiti:</h2>";
    loggedUser.favorite.forEach(lid => {
        fetch('../api/v1/posts/' + lid)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify
            if (!data.message) 
                console.log('no data');
            if (Array.isArray(data.message)) 
                console.log('result is an array');
            post = data.message;
            var star = false;
            if(loggedUser.favorite != null){loggedUser.favorite.forEach(fav => {if(lid == fav) star = true;});}
            main_div.innerHTML+= createCardPost(lid,post.title, post.description, post.createdBy);
            let postIn = document.getElementById("starAtt"+lid);
            postIn.innerHTML=addStar(star, lid);
        })
        .catch( error => console.error(error) );// If there is any error you will catch them here
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
