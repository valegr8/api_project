/**
 * This variable stores the logged in user
 */
var loggedUser = {};
var counter = 0;
const logMod = new bootstrap.Modal('#modalLogin', {keyboard: false});
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
    <div class='card mb-3 float-center' style='width: 40rem;'> 
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
        const posts_div = document.getElementById("posts_div");
        if(posts_div) 
        {
            posts_div.remove();
            // console.log("removing posts");
        }
        //remove form login
        const login_form = document.getElementById("loginform");
        if(login_form) 
        {
            login_form.remove();
            // console.log("removing login form");
        }
        //remove form register
        const form_register = document.getElementById("registerform");
        if(form_register) 
        {
            form_register.remove();
            // console.log("removing register form");
        }
        //remove form create
        const create_form = document.getElementById("createform");
        if(create_form) 
        {
            create_form.remove();
            // console.log("removing create form");
        }
        //check if the create form already exists
        if(!document.getElementById("posts_div")) 
        {       
            const div = document.createElement("div");
            div.setAttribute('class', "form-group");
            div.setAttribute('id', "posts_div");
    
            div.innerHTML = "<div id='posts'></div>";
            const main_div = document.getElementById("main_div");
            main_div.appendChild(div);
        }
    
        const postDiv = document.getElementById('posts'); // Get the list where we will place our posts
        if(postDiv)
        {   
            fetch('../api/v1/posts/' + id)
            .then((resp) => resp.json()) // Transform the data into json
            .then(function(data) { // Here you get the data to modify
                // console.log(data);
                var first = 0;
                postDiv.innerHTML = "";
                
                if (!data.message) 
                    console.log('no data');
                if (Array.isArray(data.message)) 
                    console.log('result is an array');

                post = data.message;

                var star = false;
                if(loggedUser.favorite != null){loggedUser.favorite.forEach(fav => {if(post._id == fav) star = true;});}
                postDiv.innerHTML+= "<a href='#' onclick='loadPosts()' class='text-muted text-decoration-none float-start mb-3'><i class='bi bi-arrow-left-short'></i> indietro</a>";
                postDiv.innerHTML+= createDetailPost(id,post.title, post.description, post.createdBy);
                let postIn = document.getElementById("starAtt"+post._id);
                postIn.innerHTML=addStar(star, post._id);
            })
            .catch( error => console.error(error) );// If there is any error you will catch them here
        }
}

/**
 * This function refresh the list of posts
 */
function loadPosts() {
    //remove form login
    logMod.hide();

    //remove form register
    const form_register = document.getElementById("registerform");
    if(form_register) 
    {
        form_register.remove();
        // console.log("removing register form");
    }
    //remove form create
    const create_form = document.getElementById("createform");
    if(create_form) 
    {
        create_form.remove();
        // console.log("removing create form");
    }
    const posts_div = document.getElementById("posts_div");
    if(posts_div) 
    {
        posts_div.remove();
        // console.log("removing create form");
    }

    //check if the create form already exists
    if(!document.getElementById("posts_div")) 
    {       
        const div = document.createElement("div");
        div.setAttribute('class', "form-group");
        div.setAttribute('id', "posts_div");

        div.innerHTML = "<h2>Annunci:</h2> \
                            <div id='posts'></div>";
        const main_div = document.getElementById("main_div");
        main_div.appendChild(div);
    }

        
    const postDiv = document.getElementById('posts'); // Get the list where we will place our posts
    if(postDiv)
    {    
        fetch('../api/v1/posts')
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify
            if (!data.message){
                postDiv.innerHTML += "<h3>Nessun annuncio...</h3><br><h4>Sii il primo a pubblicare qualcosa!</h4>";
                console.log('no data');
            }
            if (!Array.isArray(data.message)) 
                showAlert("Errore nel caricare gli annunci", "danger");

            counter = 0;
            return data.message.map(function(post) { // Map through the results and for each run the code below
                counter++;
                var star = false;
                if(loggedUser.favorite != null){loggedUser.favorite.forEach(fav => {if(post._id == fav) star = true;});}
                postDiv.innerHTML+= createCardPost(post._id, post.title, star);
                let postIn = document.getElementById("starAtt"+post._id);
                postIn.innerHTML=addStar(star, post._id);
            });
        })
        .catch( error => console.error(error) );// If there is any error you will catch them here
    }
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
            logMod.hide();

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

    fetch('../api/v1/users', {
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


/**
 *
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

    //remove form register
    const form_register = document.getElementById("registerform");
    if(form_register) 
    {
        form_register.remove();
        // console.log("removing register form");
    }
    //remove posts
    const posts_div = document.getElementById("posts_div");
    if(posts_div) 
    {
        posts_div.remove();
        // console.log("removing posts");
    }
    //remove form login
    const form_ = document.getElementById("loginform");
    if(form_) 
    {
        form_.remove();
        // console.log("removing login form");
    }
    //check if the create form already exists
    if(!document.getElementById("createform")) 
    {
        var form= `<form id="createform" method="post" action="api/v1/posts"><h2>Crea nuovo annuncio:</h2><div class="form-floating mb-3" id="usrDiv"><input id="postTitle" name="title" maxlength="30" class="form-control" placeholder="Titolo"><label for="postTitle">Titolo</label><div class="form-text">Lunghezza massima: 30 caratteri</div></div><div class="input-group mb-3" id="usrDiv"><span class="input-group-text">Descrizione</span><textarea id="postDesc" name="postDesc" class="form-control" maxlength="500" placeholder="Descrizione"></textarea></div><button type="button" class="btn btn-primary" onclick="insertPost()">Salva</button></form>`;

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
    //remove form register
    const form_register = document.getElementById("registerform");
    if(form_register) 
    {
        form_register.remove();
        // console.log("removing register form");
    }
    //remove form create
    const form_ = document.getElementById("createform");
    if(form_) 
    {
        form_.remove();
        // console.log("removing create form");
    }


    logMod.show();
}

/**
 * This function is called by clicking on the "Registrati" button.
 * It dinamically creates a form to register a new user in the website.
 */
function registerPage()
{
    //remove form login
    const form_login = document.getElementById("loginform");
    if(form_login) 
    {
        form_login.remove();
        // console.log("removing login form");
    }
    //remove form create
    const form_ = document.getElementById("createform");
    if(form_) 
    {
        form_.remove();
        // console.log("removing create form");
    }
    //remove posts
    const posts_div = document.getElementById("posts_div");
    if(posts_div) 
    {
        posts_div.remove();
        // console.log("removing posts");
    }
    //check if the register form already exists
    if(!document.getElementById("registerform")) 
    {
        // console.log("creating register form");      
        //create form
        const form = document.createElement("form");
        form.setAttribute('method', "post");
        form.setAttribute('action', "api/v1/users"); //metodo da rivedere
        form.setAttribute('name', 'registerform');
        form.setAttribute('id', 'registerform');
        form.innerHTML = "<h2>Registra un nuovo account:</h2>";

        //USERNAME INPUT------------------------------------
        const div_usr = document.createElement("div");
        div_usr.setAttribute('class', "form-floating mb-3");
        div_usr.setAttribute('id', "usrDiv");
        
        // create an input elemet for the username
        const usr = document.createElement("input");
        usr.setAttribute('id', "registerUsr");
        usr.setAttribute('name', "username");
        usr.setAttribute('class', "form-control");
        usr.setAttribute('placeholder', "Username");

        const usr_lbl = document.createElement("label");
        usr_lbl.setAttribute("for", "registerUsr");
        usr_lbl.innerHTML = "Username";
        //USERNAME INPUT------------------------------------

        //EMAIL INPUT------------------------------------------
        const div_email = document.createElement("div");
        div_email.setAttribute('class', "form-floating mb-3");
        div_email.setAttribute('id', "emailDiv");

        // create an input elemet for the email
        const email = document.createElement("input");
        email.setAttribute('id', "registerEmail");
        email.setAttribute('name', "email");
        email.setAttribute('class', "form-control");
        email.setAttribute('placeholder', "Email");

        const email_lbl = document.createElement("label");
        email_lbl.setAttribute("for", "registerEmail");
        email_lbl.innerHTML = "Email";
        //EMAIL INPUT------------------------------------------

        //PASSWORD INPUT---------------------------------------
        const div_pwd = document.createElement("div");
        div_pwd.setAttribute('class', "form-floating mb-3");
        div_pwd.setAttribute('id', "pwdDiv");


        // create an input elemet for the password
        const pwd = document.createElement("input");
        pwd.setAttribute('id', "registerPassword");
        pwd.setAttribute('name', "password");
        pwd.setAttribute('class', "form-control");
        pwd.setAttribute('placeholder', "Password");
        pwd.setAttribute('type', 'password');

        const pwd_lbl = document.createElement("label");
        pwd_lbl.setAttribute("for", "registerPassword");
        pwd_lbl.innerHTML = "Password";
        //PASSWORD INPUT---------------------------------------

        //CONF PASSWORD INPUT------------------------------------     
        const div_pwd_conf = document.createElement("div");
        div_pwd_conf.setAttribute('class', "form-floating mb-3");
        div_pwd_conf.setAttribute('id', "pwdDiv");

        // create an input elemet for the password confirmation
        const pwd_conf = document.createElement("input");
        pwd_conf.setAttribute('id', "registerPasswordVer");
        pwd_conf.setAttribute('name', "password");
        pwd_conf.setAttribute('class', "form-control");
        pwd_conf.setAttribute('placeholder', "Password");
        pwd_conf.setAttribute('type', 'password');

        const pwd_conf_lbl = document.createElement("label");
        pwd_conf_lbl.setAttribute("for", "registerPasswordVer");
        pwd_conf_lbl.innerHTML = "Confirm Password";
        //CONF PASSWORD INPUT------------------------------------     

        // create a button
        const button = document.createElement("button");
        button.setAttribute('type', "button");
        button.setAttribute('class', "btn btn-primary");
        button.setAttribute('onclick', "register()");
        button.setAttribute('class', "btn btn-primary");
        button.innerText = "Registrati";
        div_usr.appendChild(usr);
        div_usr.appendChild(usr_lbl);
        div_email.appendChild(email);
        div_email.appendChild(email_lbl);
        div_pwd.appendChild(pwd);
        div_pwd.appendChild(pwd_lbl);
        div_pwd_conf.appendChild(pwd_conf);
        div_pwd_conf.appendChild(pwd_conf_lbl);
        form.appendChild(div_usr);
        form.appendChild(div_email);
        form.appendChild(div_pwd);
        form.appendChild(div_pwd_conf);
        form.appendChild(button);

        const main_div = document.getElementById("main_div");
        main_div.appendChild(form);
    }
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
