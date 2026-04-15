const api = "api.php";
let isEditMode = false; 


document.getElementById("moziForm").addEventListener("submit", saveMozi);

window.onload = function () {
    fetchMozik(); 
};

function fetchMozik() {
    document.getElementById("addedit").innerHTML = "Új mozi hozzáadása";
    isEditMode = false;
    document.getElementById("id").readOnly = false; 

    fetch(api)
        .then(res => res.json())
        .then(data => {
            
            document.getElementById("message").innerText = data.status;
            let rows = "";

           
            if (data.data) {
                data.data.forEach(mozi => {
                    rows += `
                    <tr>
                        <td>${mozi.id}</td>
                        <td>${mozi.nev}</td>
                        <td>${mozi.varos}</td>
                        <td>${mozi.ferohely}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick='editMozi(${JSON.stringify(mozi)})'>Szerkeszt</button>
                            <button class="btn btn-danger btn-sm" onclick='deleteMozi(${mozi.id})'>Töröl</button>
                        </td>
                    </tr>`;
                });
            }
            
            document.getElementById("moziTable").innerHTML = rows;
        });
}

function saveMozi(e) {
    e.preventDefault(); 

    
    const data = {
        id: document.getElementById("id").value,
        nev: document.getElementById("nev").value,
        varos: document.getElementById("varos").value,
        ferohely: document.getElementById("ferohely").value
    };

   
    const $method = isEditMode ? "PUT" : "POST";

    
    fetch(api, {
        method: $method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(response => {
            e.target.reset(); 
            document.getElementById("message").innerText = response.status;
            fetchMozik(); 
        });
}

function editMozi(mozi) {
    document.getElementById("message").innerText = "";
    document.getElementById("addedit").innerHTML = "Mozi szerkesztése";
    isEditMode = true;


    document.getElementById("id").value = mozi.id;
    document.getElementById("id").readOnly = true; 
    document.getElementById("nev").value = mozi.nev;
    document.getElementById("varos").value = mozi.varos;
    document.getElementById("ferohely").value = mozi.ferohely;
}

function deleteMozi(id) {
    if (!confirm("Biztosan törölni akarod ezt a mozit?")) return;


    fetch(api, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    })
        .then(res => res.json())
        .then(response => {
            document.getElementById("message").innerText = response.status;
            fetchMozik(); 
        });
}