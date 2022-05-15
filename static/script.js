/**
 * This variable stores the logged in user
 */
 var loggedUser = {};


 var counter = 0;
 /**
  * This function refresh the list of listings
  */
 function loadListings() {
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
     if(!document.getElementById("listings_div")) 
     {       
         const div = document.createElement("div");
         div.setAttribute('class', "form-group");
         div.setAttribute('id', "listings_div");
 
         div.innerHTML = "<h2>Annunci:</h2> \
                                <table id='listings' class='table table-hover'> \
                                     <tr> \
                                         <th>#</th> \
                                         <th>Title</th> \
                                     </tr> \
                                 </table>";
         const main_div = document.getElementById("main_div");
         main_div.appendChild(div);
     }
 
     const table = document.getElementById('listings'); // Get the list where we will place our listings
     if(table)
     {    
         fetch('../api/v1/listings')
         .then((resp) => resp.json()) // Transform the data into json
         .then(function(data) { // Here you get the data to modify as you please
             
             //console.log(data);
             
             var tableHeaderRowCount = 0;
             var rowCount = table.rows.length;
             for (var i = tableHeaderRowCount; i < rowCount-1; i++) {
                 table.deleteRow(tableHeaderRowCount);
             }
             
             counter = 0;
             
             return data.map(function(listing) { // Map through the results and for each run the code below
                 
                 // let listingId = listing.self.substring(listing.self.lastIndexOf('/') + 1);
                 var row = table.insertRow();
                 counter++;
                 row.insertCell(0).innerHTML = counter;
                 row.insertCell(1).innerHTML = `<a href="${listing.self}">${listing.title}</a>`;
             })
         })
         .catch( error => console.error(error) );// If there is any error you will catch them here
     }
 }
 
 /**
  * This function is called by clicking on the "insert listing" button.
  * It creates a new listing given the specified title,
  * and force the refresh of the whole list of listings.
  */
 function insertListing()
 {
     //get the listing title
     var listingTitle = document.getElementById("listingTitle").value;
 
     console.log(listingTitle);
 
     fetch('../api/v1/listings', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify( { title: listingTitle } ),
     })
     .then((resp) => {
         console.log(resp);
         loadListings();
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
            const alert = document.createElement("div");
            alert.setAttribute('class', 'alert alert-danger alert-dismissible fade show');
            alert.setAttribute('role', 'alert');
            alert.innerHTML = "Nome utente o password errati. \
                                                      <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
            const main_div = document.getElementById("main_div");
            main_div.appendChild(alert);
        } else 
        {
            loggedUser.token = data.token;
            loggedUser.email = data.email;
            loggedUser.id = data.id;
            loggedUser.self = data.self;

            //disable login button
            document.getElementById("login").disabled = true; 
            //enable logout button
            document.getElementById("logout").disabled = false; 
        }
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
 
 }
 
  /**
  * This function is called by clicking on the "add new listing" button.
  * It dinamically creates a form to insert a new listings.
  */
 function newListingPage()
 {
     //remove form register
     const form_register = document.getElementById("registerform");
     if(form_register) 
     {
         form_register.remove();
         console.log("removing register form");
     }
     //remove listings
     const listings_div = document.getElementById("listings_div");
     if(listings_div) 
     {
         listings_div.remove();
         console.log("removing listings");
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
         form.setAttribute('action', "api/v1/listings");
         form.innerHTML = "<h2>Crea nuovo annuncio:</h2>";
 
         // create a div element, used to style the form inputs
         const div_title = document.createElement("div");
         div_title.setAttribute('class', "form-group");
         div_title.setAttribute('id', "newListingDiv");
 
         div_title.innerHTML = "<label for='inputTitle'>Titolo</label>";
         
         // create an input elemet
         const input = document.createElement("input");
         input.setAttribute('id', "listingTitle");
         input.setAttribute('name', "title");
         input.setAttribute('class', "form-control");
         input.setAttribute('placeholder', "Enter title");
 
         // create a button
         const button = document.createElement("button");
         button.setAttribute('type', "button");
         button.setAttribute('class', "btn btn-primary");
         button.setAttribute('onclick', "insertListing()");
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
     //remove listings
     const listings_div = document.getElementById("listings_div");
     if(listings_div) 
     {
         listings_div.remove();
         console.log("removing listings");
     }
     //check if the login form already exists
     if(!document.getElementById("loginform")) 
     {
         console.log("creating login form");      
         //create form
         const form = document.createElement("form");
         form.setAttribute('method', "post");
         form.setAttribute('action', "api/v1/students");
         form.setAttribute('name', 'loginform');
         form.setAttribute('id', 'loginform');
         form.innerHTML = "<h2>Log in:</h2>";
 
         const div_email = document.createElement("div");
         div_email.setAttribute('class', "form-group");
         div_email.setAttribute('id', "loginDiv");
 
         div_email.innerHTML = "<label for='inputEmail'>Email</label>";
         
         // create an input elemet for the email
         const email = document.createElement("input");
         email.setAttribute('id', "loginEmail");
         email.setAttribute('name', "email");
         email.setAttribute('class', "form-control");
         email.setAttribute('placeholder', "Email");
 
         const div_pwd = document.createElement("div");
         div_pwd.setAttribute('class', "form-group");
         div_pwd.setAttribute('id', "loginDiv");
 
         div_pwd.innerHTML = "<label for='inputPassword'>Password</label>";
 
         // create an input elemet for the password
         const pwd = document.createElement("input");
         pwd.setAttribute('id', "loginPassword");
         pwd.setAttribute('name', "password");
         pwd.setAttribute('class', "form-control");
         pwd.setAttribute('placeholder', "Password");
         pwd.setAttribute('type', 'password');
 
         // create a button
         const button = document.createElement("button");
         button.setAttribute('type', "button");
         button.setAttribute('class', "btn btn-primary");
         button.setAttribute('onclick', "login()");
         button.setAttribute('class', "btn btn-primary");
         button.innerText = "Log in";
 
         div_email.appendChild(email);
         div_pwd.appendChild(pwd);
 
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
      //remove listings
      const listings_div = document.getElementById("listings_div");
      if(listings_div) 
      {
          listings_div.remove();
          console.log("removing listings");
      }
      //check if the register form already exists
      if(!document.getElementById("registerform")) 
      {
          console.log("creating register form");      
          //create form
          const form = document.createElement("form");
          form.setAttribute('method', "post");
          form.setAttribute('action', "api/v1/student"); //metodo da rivedere
          form.setAttribute('name', 'registerform');
          form.setAttribute('id', 'registerform');
          form.innerHTML = "<h2>Registra un nuovo account:</h2>";
  
          const div_email = document.createElement("div");
          div_email.setAttribute('class', "form-group");
          div_email.setAttribute('id', "registerDiv");
  
          div_email.innerHTML = "<label for='inputEmail'>Email</label>";
          
          // create an input elemet for the email
          const email = document.createElement("input");
          email.setAttribute('id', "registerEmail");
          email.setAttribute('name', "email");
          email.setAttribute('class', "form-control");
          email.setAttribute('placeholder', "Email");
  
          const div_pwd = document.createElement("div");
          div_pwd.setAttribute('class', "form-group");
          div_pwd.setAttribute('id', "registerDiv");
  
          div_pwd.innerHTML = "<label for='inputPassword'>Password</label>";
  
          // create an input elemet for the password
          const pwd = document.createElement("input");
          pwd.setAttribute('id', "registerPassword");
          pwd.setAttribute('name', "password");
          pwd.setAttribute('class', "form-control");
          pwd.setAttribute('placeholder', "Password");
          pwd.setAttribute('type', 'password');
  
          // create a button
          const button = document.createElement("button");
          button.setAttribute('type', "button");
          button.setAttribute('class', "btn btn-primary");
          button.setAttribute('onclick', "register()");
          button.setAttribute('class', "btn btn-primary");
          button.innerText = "Registrati";
  
          div_email.appendChild(email);
          div_pwd.appendChild(pwd);
  
          form.appendChild(div_email);
          form.appendChild(div_pwd);
          form.appendChild(button);
  
          const main_div = document.getElementById("main_div");
          main_div.appendChild(form);
      }
  }
 