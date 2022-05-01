var counter = 0;
/**
 * This function refresh the list of houses
 */
 function loadHouses() {

    const table = document.getElementById('houses'); // Get the list where we will place our houses
    

    fetch('/houses')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        //console.log(data);
        
        return data.map(function(house) { // Map through the results and for each run the code below
            
            // let houseId = house.self.substring(house.self.lastIndexOf('/') + 1);
            var row = table.insertRow();
            counter++;
            row.insertCell(0).innerHTML = counter;
            row.insertCell(1).innerHTML = `<a href="${house.self}">${house.name}</a>`;
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}


/**
 * This function is called by clicking on the "insert house" button.
 * It creates a new house given the specified name,
 * and force the refresh of the whole list of houses.
 */
 function insertHouse()
 {
    //get the house name
    var houseName = document.getElementById("houseName").value;

    console.log(houseName);

    fetch('/house', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { name: houseName } ),
    })
    .then((resp) => {
        console.log(resp);
        loadHouses();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
 
 };