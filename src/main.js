import "./style.css";

const baseUrl = "http://127.0.0.1:8090/api/collections/appunti/records";


async function loadData() {
  const res = await fetch(baseUrl);
  const data = await res.json();


  document.querySelectorAll("ul").forEach(lista => lista.innerHTML = "");

  data.items.forEach(item => {
    addItemToDom(item);
  });
}



function addItemToDom(item) {
  const li = document.createElement("li");

  const text = document.createElement("span");
  text.textContent = item.titolo;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Cancella";

  deleteBtn.onclick = async () => {
    const ok = confirm("Vuoi davvero eliminarlo?");
    if (!ok) return;

    await fetch(`${baseUrl}/${item.id}`, { method: "DELETE" });
    loadData(); 
  };

  li.appendChild(text);
  li.appendChild(deleteBtn);

  let listaId = item.lista;
  if (typeof listaId === "object" && listaId !== null) {
    listaId = listaId.name || listaId.value;
  }

  const correctList = document.getElementById(`lista-${listaId}`);
  if (correctList) correctList.appendChild(li);
}



document.getElementById("postTest").onclick = async () => {

  const titolo = document.getElementById("titoloInput").value.trim();
  const lista = document.getElementById("listaSelect").value;

  if (!titolo) {
    alert("Scrivi un titolo prima!");
    return;
  }

  const formData = new FormData();
  formData.append("titolo", titolo);
  formData.append("lista", lista);

  await fetch(baseUrl, {
    method: "POST",
    body: formData
  });

  document.getElementById("titoloInput").value = "";
  loadData(); // aggiorna la pagina
};

loadData();
