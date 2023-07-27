
////////////////// Affichage ////////////////// 

async function Affichage() {
    const works = await appelTravaux()
    affichageTravaux(works)
    filters (works)
    affichageEditeur()
  }
  
  Affichage()
  
////////////////// Appel Travaux //////////////////

async function appelTravaux() {
  const response = await fetch('http://localhost:5678/api/works')
  const works = await response.json()
  console.log(works)
  return works
}
appelTravaux()

////////////////// Affichage Travaux //////////////////

function affichageTravaux(works) {
  for (let i = 0; i < works.length; i++) {
      const projet = works[i];
      const divGallery = document.querySelector(".gallery")

      const projetElement = document.createElement("figure")

      const projetImage = document.createElement("img")
      projetImage.src = projet.imageUrl

      const projetTitle = document.createElement("figcaption")
      projetTitle.innerText = projet.title
 
      divGallery.appendChild(projetElement)
      projetElement.appendChild(projetImage)
      projetElement.appendChild(projetTitle)
  }
}

////////////////// Filters ////////////////// 

function filters (works) { 
  fetch('http://localhost:5678/api/categories')
  .then(response => response.json())
  .then(categories => {
      console.log(categories)
   
      const filtersContainer = document.querySelector(".filters-container")
      const allbtn = document.createElement("button")

      allbtn.innerText = "Tous"
      allbtn.classList.add("btn")
      allbtn.classList.add("active")
      filtersContainer.appendChild(allbtn)

      categories.forEach(categorie =>  {

          let categorieBtn = document.createElement("button")
          categorieBtn.innerText = categorie.name
          categorieBtn.classList.add("btn")
          filtersContainer.appendChild(categorieBtn)
      })

      const btns = document.querySelectorAll(".btn")

      btns.forEach(btn => {
          btn.addEventListener("click", () => {
        
              const divGallery = document.querySelector(".gallery")
              divGallery.innerHTML = "";

              btns.forEach(btn => btn.classList.remove("active"))
              btn.classList.add("active")
            
              let categorieFilter = btn.innerText
              console.log(categorieFilter)

              let filteredWorks = works.filter(works => works.category.name === categorieFilter)
              console.log(filteredWorks)

              if (categorieFilter === "Tous") {
                  filteredWorks = works;
              }
           
              affichageTravaux(filteredWorks)
          })
      })
  })
}

////////////////// Affichage Editeur / Logout //////////////////

async function affichageEditeur() {
  const loginLink = document.querySelector(".login-link");
  const token = localStorage.getItem("token");
  const editorMode = document.querySelector("#editor-mode");
  const filterBtns = document.querySelectorAll(".btn");
  const editorElements = document.querySelectorAll("#editor-element");


  editorMode.style.display = "none";
  editorElements.forEach((editorElement) => {
      editorElement.style.display = "none";
  });

  if (token) {
 
      filterBtns.forEach((filterBtn) => {
          filterBtn.style.display = "none";
          
      });

      editorElements.forEach((editorElement) => {
          editorElement.style.display = "flex";
      });

      editorMode.style.display = "flex";

      loginLink.textContent ="logout"
      loginLink.addEventListener("click", () => {
          localStorage.removeItem("token");
          window.location.reload();
      })
  }
}

