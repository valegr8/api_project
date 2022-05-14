var counter = 0;
/**
 * This function refresh the list of listings
 */
 function loadListings() {

    const table = document.getElementById('listings'); // Get the list where we will place our listings
    

    fetch('../api/v1/listings')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        //console.log(data);
        
        var tableHeaderRowCount = 0;
        var rowCount = table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
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
 
 };