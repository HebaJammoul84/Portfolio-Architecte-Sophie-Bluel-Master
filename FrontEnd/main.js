
////////////////// Affichage ////////////////// 

async function Affichage() {
    const works = await appelTravaux()
    affichageTravaux(works)
    filters(works)
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

function filters(works) {
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

            categories.forEach(categorie => {

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

        loginLink.textContent = "logout"
        loginLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        })
    }
}

////////////////// Modal //////////////////

const modalLink = document.querySelector(".modal-link")
const divGallery = document.querySelector(".gallery")
const modal = document.querySelector(".modal")
const modalWrapper = document.querySelector(".modal-wrapper")
const modalWrapperGallery = document.querySelector(".modal-wrapper-gallery")
const galleryModalClose = document.querySelector(".gallery-modal-close")
const modalGallery = document.querySelector(".modal-gallery")
const galleryBtn = document.querySelector(".modal-gallery-btn")
const trashDelete = document.querySelector(".trash")
const deleteGallery = document.querySelector(".delete-gallery")

async function modalGalleryElement() {

    const works = await appelTravaux();
    works.forEach(work => {

        const modalFigure = document.createElement("div");
        modalFigure.classList.add("modal-figure");
        modalGallery.appendChild(modalFigure);

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can", "trash", "modif-icon");
        modalFigure.appendChild(trashIcon);

        const arrowIcon = document.createElement("i");
        arrowIcon.classList.add("fa-solid", "fa-arrows-up-down-left-right", "modif-arrow", "modif-icon");
        modalFigure.appendChild(arrowIcon);

        const modalImg = document.createElement("img")
        modalImg.src = work.imageUrl
        modalImg.classList.add("modal-img")
        modalFigure.appendChild(modalImg)

        const modalfigcaption = document.createElement("figcaption")
        modalfigcaption.innerHTML = "éditer"
        modalFigure.appendChild(modalfigcaption)

        trashIcon.addEventListener("click", async (e) => {
            deleteProject(work.id, modalFigure);
        });

       // deleteGallery.addEventListener("click", async (e) => {
       //     deleteGalleryaAll(work.id, modalGallery);
     //   });

    });
}

modalLink.addEventListener("click", async (e) => {
    e.preventDefault()
    modal.style.display = "flex"
    modalGallery.innerHTML = ""
    await modalGalleryElement();

})

///////////////// delete Project ////////////////

function deleteProject(workId, modalFigure) {
    fetch('http://localhost:5678/api/' + `works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })
        .then(response => {
            if (response.ok) {
                modalFigure.remove();
                divGallery.innerHTML = "";  // Vider la galerie
                
                appelTravaux() // Récupérer les travaux mis à jour depuis l'API
                    .then(updatedWorks => {
                        affichageTravaux(updatedWorks); 
                    })
                    .catch(error => {
                        console.log("Erreur lors de la récupération des travaux :", error);
                    });
                console.log("Suppression réussie");
            } else {
                console.log("Échec de la suppression");
            }
        });
}

///////////////// delete gallery ////////////////

//function deleteGalleryaAll(workId, modalGallery) {
   // fetch('http://localhost:5678/api/' + `works/${workId}`, {
      //  method: "DELETE",
      //  headers: {
       //     "Authorization": `Bearer ${localStorage.getItem("token")}`
     //   },
   // })
     //   .then(response => {
       //     if (response.ok) {

           //   modalGallery.forEach((modalFigure) => {
           //       modalFigure.remove();
              //      modalGallery.innerHTML = "";
            //  });
                
            //    appelTravaux() 
              //      .then(updatedWorks => {
               //         affichageTravaux(updatedWorks); 
              //      })
              //      .catch(error => {
               //         console.log("Erreur lors de la récupération des travaux :", error);
              //      });
             //   console.log("Suppression réussie");
           // } else {
         //       console.log("Échec de la suppression de gallery");
          //  }
       // });
//}

/////////// ferme modal ///////////

async function hideModal() {
    modal.style.display = "none";
    modalWrapperGallery.style.display = "block";

    divGallery.innerHTML = ""
    const works = await appelTravaux()
    affichageTravaux(works);
}

galleryModalClose.addEventListener("click", hideModal)
modal.addEventListener("click", hideModal)

modalWrapperGallery.addEventListener("click", (e) => {
    e.stopPropagation()
});


