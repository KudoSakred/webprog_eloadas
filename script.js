var selectedIndex = null;
// Ebben a tömbben tároljuk helyileg az adatokat [cite: 22, 767]
var moziTomb = [
    { id: 1, nev: "Corvin Mozi", varos: "Budapest", ferohely: 450 },
    { id: 2, nev: "Uránia", varos: "Budapest", ferohely: 300 }
];


printTable();

function printTable() {
    var table = document.getElementById("moziLista").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; 

    moziTomb.forEach((item, index) => {
        var newRow = table.insertRow(table.length);
        newRow.insertCell(0).innerHTML = item.id;
        newRow.insertCell(1).innerHTML = item.nev;
        newRow.insertCell(2).innerHTML = item.varos;
        newRow.insertCell(3).innerHTML = item.ferohely;

        
        var cellAction = newRow.insertCell(4);
        cellAction.innerHTML = `
            <button class="btn btn-sm btn-warning" onClick="onEdit(${index})">Szerkeszt</button>
            <button class="btn btn-sm btn-danger text-dark" onClick="onDelete(${index})">Töröl</button>
        `;
    });
}

function onFormSubmit() {
    if (validate()) {
        
        var formData = {
            id: document.getElementById("moziId").value,
            nev: document.getElementById("moziNev").value,
            varos: document.getElementById("moziVaros").value,
            ferohely: document.getElementById("moziFerohely").value
        };

        if (selectedIndex == null) {
            moziTomb.push(formData); 
        } else {
            moziTomb[selectedIndex] = formData; 
        }
        resetForm();
        printTable();
    }
}

function onEdit(index) {
    
    selectedIndex = index;
    var data = moziTomb[index];
    document.getElementById("moziId").value = data.id;
    document.getElementById("moziNev").value = data.nev;
    document.getElementById("moziVaros").value = data.varos;
    document.getElementById("moziFerohely").value = data.ferohely;
}

function onDelete(index) {
    
    if (confirm('Biztosan törölni akarod?')) {
       
        moziTomb.splice(index, 1);
        printTable();
    }
}

function resetForm() {
    
    document.getElementById("moziId").value = "";
    document.getElementById("moziNev").value = "";
    document.getElementById("moziVaros").value = "";
    document.getElementById("moziFerohely").value = "";
    selectedIndex = null;
}

function validate() {
    
    var isValid = true;
    if (document.getElementById("moziNev").value == "") {
        isValid = false;
        document.getElementById("nameError").classList.remove("hide");
    } else {
        document.getElementById("nameError").classList.add("hide");
    }
    return isValid;
}