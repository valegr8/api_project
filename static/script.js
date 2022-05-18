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
                            <table id='posts' class='table table-hover'> \
                                    <tr> \
                                        <th>#</th> \
                                        <th>Title</th> \
                                    </tr> \
                                </table>";
        const main_div = document.getElementById("main_div");
        main_div.appendChild(div);
    }

    const table = document.getElementById('posts'); // Get the list where we will place our posts
    if(table)
    {    
        fetch('../api/v1/posts')
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify
            // console.log(data);
            var first = 0;
            for (var i = 0; i < table.rows.length-1; i++) {
                table.deleteRow(first);
            }
            
            if (!data.message) 
                console.log('no data');
            if (!Array.isArray(data.message)) 
                console.log('results are not an array');

            counter = 0;
            return data.message.map(function(post) { // Map through the results and for each run the code below
                var row = table.insertRow();
                counter++;
                row.insertCell(0).innerHTML = counter;
                row.insertCell(1).innerHTML = `<a href="${post.self}">${post.title}</a>`;
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

    console.log(postTitle);

    fetch('../api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { title: postTitle } ),
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

            enNavButtons();

            //show username on top of the page
            document.getElementById("user").innerHTML = loggedUser.email;
            showAlert("Accesso come "+ loggedUser.email +"!", "success");
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

    fetch('../api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password }  ),
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

            //disable login button
            document.getElementById("login").hidden = true; 
            //enable logout button
            document.getElementById("logout").hidden = false; 
            //enable create button
            document.getElementById("create").hidden = false; 
            //disable register button
            document.getElementById("register").hidden = true; 
            //show username on top of the page
            document.getElementById("user").innerHTML = loggedUser.email;
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

        // create a div element, used to style the form inputs
        const div_title = document.createElement("div");
        div_title.setAttribute('class', "form-group");
        div_title.setAttribute('id', "newPostDiv");

        div_title.innerHTML = "<label for='inputTitle'>Titolo</label>";
        
        // create an input elemet
        const input = document.createElement("input");
        input.setAttribute('id', "postTitle");
        input.setAttribute('name', "title");
        input.setAttribute('class', "form-control");
        input.setAttribute('placeholder', "Enter title");

        // create a button
        const button = document.createElement("button");
        button.setAttribute('type', "button");
        button.setAttribute('class', "btn btn-primary");
        button.setAttribute('onclick', "insertPost()");
        button.setAttribute('class', "btn btn-primary");
        button.innerText = "Salva";

        div_title.appendChild(input);
        div_title.appendChild(button);

        form.appendChild(div_title);

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



        // create a button
        const button = document.createElement("button");
        button.setAttribute('type', "button");
        button.setAttribute('class', "btn btn-primary");
        button.setAttribute('onclick', "register()");
        button.setAttribute('class', "btn btn-primary");
        button.innerText = "Registrati";

        div_email.appendChild(email);
        div_email.appendChild(email_lbl);
        div_pwd.appendChild(pwd);
        div_pwd.appendChild(pwd_lbl);
        div_pwd_conf.appendChild(pwd_conf);
        div_pwd_conf.appendChild(pwd_conf_lbl);

        form.appendChild(div_email);
        form.appendChild(div_pwd);
        form.appendChild(div_pwd_conf);
        form.appendChild(button);

        const main_div = document.getElementById("main_div");
        main_div.appendChild(form);
    }
}

function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}
