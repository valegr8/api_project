/**
 * This variable stores the logged in user
 */
var loggedUser = {};
var counter = 0;
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
window.onload = loadPosts();

function showAlert(message, type){
    var alertPlaceholder = document.getElementById('liveAlertPlaceholder')
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
    document.getElementById("login").hidden = false; 
    document.getElementById("logout").hidden = true; 
    document.getElementById("create").disabled = true; 
    document.getElementById("register").hidden = false;
    loggedUser = {}
    loadPosts();
    document.getElementById("user").innerText ="";
    showAlert("Disconnesso!", "success");
}

/**
 * Function that enables and disables buttons
 */
function enNavButtons(){
        //disable login button
        document.getElementById("login").hidden = true; 
        //enable logout button
        document.getElementById("logout").hidden = false; 
        //enable create button
        document.getElementById("create").disabled = false; 
        //disable register button
        document.getElementById("register").hidden = true; 
}

/**
 * Create a post with a card user interface (bootstap)
 */
function createCardPost(id, title, descr,createdBy){
    return `<div class='card  mb-3' style='width: 36rem;'> \
                <p class='card-text'>Utente: ${createdBy}</p>
                <img src="https://www.lago.it/wp-content/uploads/2018/05/1_Lanfranchi_Lago-Milano-9.jpg" class="card-img-top rounded"> \
                <div class='card-body' > \
                    <h5 class='card-title'>${title}</h5> \
                    <p class='card-text'>${descr}</p> \
                    <button id='detail_btn' onclick='loadDetails(${id})' class='btn btn-primary'>Vai all'annuncio</button> \
                </div> \
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
            console.log("removing posts");
        }
        //remove form login
        const login_form = document.getElementById("loginform");
        if(login_form) 
        {
            login_form.remove();
            console.log("removing login form");
        }
        //remove form register
        const form_register = document.getElementById("registerform");
        if(form_register) 
        {
            form_register.remove();
            console.log("removing register form");
        }
        //remove form create
        const create_form = document.getElementById("createform");
        if(create_form) 
        {
            create_form.remove();
            console.log("removing create form");
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
                console.log(data);
                var first = 0;
                postDiv.innerHTML = "";
                
                if (!data.message) 
                    console.log('no data');
                if (!Array.isArray(data.message)) 
                    console.log('result is not an array');

                post = data.message;
                postDiv.innerHTML+= "<h2>" +post.title+"</h2>"
                postDiv.innerHTML+= createCardPost(post.post_id, post.title, post.description, post.createdBy);

                //remove button at the end of the post
                const detail_btn = document.getElementById('detail_btn');
                if(detail_btn) //check if exists
                    detail_btn.remove();
            })
            .catch( error => console.error(error) );// If there is any error you will catch them here
        }
}

/**
 * This function refresh the list of posts
 */
function loadPosts() {
    //remove form login
    const login_form = document.getElementById("loginform");
    if(login_form) 
    {
        login_form.remove();
        console.log("removing login form");
    }
    //remove form register
    const form_register = document.getElementById("registerform");
    if(form_register) 
    {
        form_register.remove();
        console.log("removing register form");
    }
    //remove form create
    const create_form = document.getElementById("createform");
    if(create_form) 
    {
        create_form.remove();
        console.log("removing create form");
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
            // console.log(data);
            var first = 0;
            postDiv.innerHTML = "";
            
            if (!data.message) 
                console.log('no data');
            if (!Array.isArray(data.message)) 
                console.log('result is not an array');

            counter = 0;
            return data.message.map(function(post) { // Map through the results and for each run the code below
                counter++;
                postDiv.innerHTML+= createCardPost(post.post_id, post.title, post.description, post.createdBy);
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
    
    console.log(postTitle);

    fetch('../api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { title: postTitle , description: postDesc , email: loggedUser.email} ),
    })
    .then((resp) => {
        console.log(resp);
        loadPosts();
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
        showAlert("Inserisci Email", "danger");
        return;
    }
    if(password == ""){
        showAlert("Inserisci password", "danger");
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
            showAlert("Email o password non validi", "danger");

        } else{
            loggedUser.token = data.token;
            loggedUser.email = data.email;
            loggedUser.id = data.id;
            loggedUser.self = data.self;
            loggedUser.username = data.username;

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
        console.log(data);
        if(data.email == undefined){
            showAlert("Email gia' in uso", "danger");
        }else{
            loggedUser.token = data.token;
            loggedUser.email = data.email;
            loggedUser.id = data.id;
            loggedUser.self = data.self;
            loggedUser.username = data.username;

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
 * This function is called by clicking on the "add new post" button.
 * It dinamically creates a form to insert a new posts.
 */
function newPostPage()
{
    //remove form register
    const form_register = document.getElementById("registerform");
    if(form_register) 
    {
        form_register.remove();
        console.log("removing register form");
    }
    //remove posts
    const posts_div = document.getElementById("posts_div");
    if(posts_div) 
    {
        posts_div.remove();
        console.log("removing posts");
    }
    //remove form login
    const form_ = document.getElementById("loginform");
    if(form_) 
    {
        form_.remove();
        console.log("removing login form");
    }
    //check if the create form already exists
    if(!document.getElementById("createform")) 
    {       
        // create the form
        const form = document.createElement("form");
        form.setAttribute('id', 'createform')
        form.setAttribute('method', "post");
        form.setAttribute('action', "api/v1/posts");
        form.innerHTML = "<h2>Crea nuovo annuncio:</h2>";

        //TITLE INPUT------------------------------------
        const div_title = document.createElement("div");
        div_title.setAttribute('class', "form-floating mb-3");
        div_title.setAttribute('id', "usrDiv");
        
        // create an input elemet for the title
        const ttl = document.createElement("input");
        ttl.setAttribute('id', "postTitle");
        ttl.setAttribute('name', "title");
        ttl.setAttribute('maxlength', "30");
        ttl.setAttribute('class', "form-control");
        ttl.setAttribute('placeholder', "Titolo");

        const ttl_info = document.createElement("div");
        ttl_info.setAttribute("class", "form-text");
        ttl_info.innerHTML = "Lunghezza massima: 30 caratteri";

        const ttl_lbl = document.createElement("label");
        ttl_lbl.setAttribute("for", "postTitle");
        ttl_lbl.innerHTML = "Titolo";
        //TITLE INPUT------------------------------------

        //DESC INPUT------------------------------------
        const div_desc = document.createElement("div");
        div_desc.setAttribute('class', "input-group mb-3");
        div_desc.setAttribute('id', "usrDiv");

        // create an input elemet for the description
        const desc = document.createElement("textarea");
        desc.setAttribute('id', "postDesc");
        desc.setAttribute('name', "postDesc");
        desc.setAttribute('class', "form-control");
        desc.setAttribute('maxlength', "500");
        desc.setAttribute('placeholder', "Descrizione");

        const desc_lbl = document.createElement("span");
        desc_lbl.setAttribute("class", "input-group-text");
        desc_lbl.innerHTML = "Descrizione";
        //DESC INPUT------------------------------------

        // create a button
        const button = document.createElement("button");
        button.setAttribute('type', "button");
        button.setAttribute('class', "btn btn-primary");
        button.setAttribute('onclick', "insertPost()");
        button.setAttribute('class', "btn btn-primary");
        button.innerText = "Salva";

        div_title.appendChild(ttl);
        div_title.appendChild(ttl_lbl);
        div_title.appendChild(ttl_info);
        
        div_desc.appendChild(desc_lbl);
        div_desc.appendChild(desc);

        form.appendChild(div_title);
        form.appendChild(div_desc);
        form.appendChild(button);

        const main_div = document.getElementById("main_div");
        main_div.appendChild(form);
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
        console.log("removing register form");
    }
    //remove form create
    const form_ = document.getElementById("createform");
    if(form_) 
    {
        form_.remove();
        console.log("removing create form");
    }
    //remove posts
    const posts_div = document.getElementById("posts_div");
    if(posts_div) 
    {
        posts_div.remove();
        console.log("removing posts");
    }
    //check if the login form already exists
    if(!document.getElementById("loginform")) 
    {
        console.log("creating login form");      
        //create form
        const form = document.createElement("form");
        form.setAttribute('method', "post");
        form.setAttribute('action', "api/v1/users");
        form.setAttribute('name', 'loginform');
        form.setAttribute('id', 'loginform');
        form.innerHTML = "<h2>Login:</h2>";

        const div_email = document.createElement("div");
        div_email.setAttribute('class', "form-floating mb-3");
        div_email.setAttribute('id', "emailDiv");

        
        // create an input elemet for the email
        const email = document.createElement("input");
        email.setAttribute('id', "loginEmail");
        email.setAttribute('name', "email");
        email.setAttribute('class', "form-control");
        email.setAttribute('placeholder', "Email");

        const email_lbl = document.createElement("label");
        email_lbl.setAttribute("for", "loginEmail");
        email_lbl.innerHTML = "Email";

        const div_pwd = document.createElement("div");
        div_pwd.setAttribute('class', "form-floating mb-3");
        div_pwd.setAttribute('id', "pwdDiv");

        // create an input elemet for the password
        const pwd = document.createElement("input");
        pwd.setAttribute('id', "loginPassword");
        pwd.setAttribute('name', "password");
        pwd.setAttribute('class', "form-control");
        pwd.setAttribute('placeholder', "Password");
        pwd.setAttribute('type', 'password');

        const pwd_lbl = document.createElement("label");
        pwd_lbl.setAttribute("for", "loginPassword");
        pwd_lbl.innerHTML = "Password";

        // create a button
        const button = document.createElement("button");
        button.setAttribute('type', "button");
        button.setAttribute('class', "btn btn-primary");
        button.setAttribute('onclick', "login()");
        button.setAttribute('class', "btn btn-primary");
        button.innerText = "Log in";

        div_email.appendChild(email);
        div_email.appendChild(email_lbl);
        div_pwd.appendChild(pwd);
        div_pwd.appendChild(pwd_lbl);

        form.appendChild(div_email);
        form.appendChild(div_pwd);
        form.appendChild(button);


        const main_div = document.getElementById("main_div");
        main_div.appendChild(form);
    }
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
        console.log("removing login form");
    }
    //remove form create
    const form_ = document.getElementById("createform");
    if(form_) 
    {
        form_.remove();
        console.log("removing create form");
    }
    //remove posts
    const posts_div = document.getElementById("posts_div");
    if(posts_div) 
    {
        posts_div.remove();
        console.log("removing posts");
    }
    //check if the register form already exists
    if(!document.getElementById("registerform")) 
    {
        console.log("creating register form");      
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
 */
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}
