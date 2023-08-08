
////////////////// Appel Travaux depuis API //////////////////

const appelTravaux = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const works = await response.json();
        console.log(works);
        return works;
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        throw error;
    }
};



////////////////// Affichage Travaux //////////////////

const affichageTravaux = (works) => {
    const divGallery = document.querySelector(".gallery");

    works.forEach((projet) => { // création balise figure qui represente un projet
        const projetElement = document.createElement("figure");

        // création des éléments des figure (img et le titre)
        const projetImage = document.createElement("img");
        projetImage.src = projet.imageUrl;
        const projetTitle = document.createElement("figcaption");
        projetTitle.innerText = projet.title;

        projetElement.appendChild(projetImage); // rattaché les éléments à leurs parents 
        projetElement.appendChild(projetTitle);
        divGallery.appendChild(projetElement);
    });
};

 //Utilisation de la fonction appelTravaux pour obtenir les données et afficher les travaux
appelTravaux().then((works) => {
   affichageTravaux(works);
});

////////////////// Filters ////////////////// 

const filters = async (works) => {
    try { // Récupération des catégories dynamiquement
        const response = await fetch('http://localhost:5678/api/categories');
        const categories = await response.json();
        console.log(categories);

        const filtersContainer = document.querySelector(".filters-container");

        const createButton = (text) => {
            const button = document.createElement("button");
            button.innerText = text;
            button.classList.add("btn", "active"); // Ajout de classes pour le style CSS
            filtersContainer.appendChild(button);
            return button;
        };

        const allbtn = createButton("Tous"); // Button tous qui affichera tout les projets

        // Création des buttons dans une boucle en fonction des catégorie
        categories.forEach((categorie) => {
            const categorieBtn = createButton(categorie.name);
            categorieBtn.classList.remove("active");
        });

        // partie filtrage lors des selection des buttons
        // On selectionne tout les boutons qui on la classe btn
        const btns = document.querySelectorAll(".btn");

        btns.forEach((btn) => { // on ajoute un event listener sur les boutons
            btn.addEventListener("click", () => {
                const divGallery = document.querySelector(".gallery");
                divGallery.innerHTML = ""; // Vider la galerie avant

                // Test pour que le button reste en font vert une fois click
                btns.forEach((btn) => btn.classList.remove("active"));
                btn.classList.add("active");

                // Récupèrer le nom de la catégorie sélectionnée 
                // à partir du texte du button
                const categorieFilter = btn.innerText;

                // Récupèrer les projets qui correspondent à la catégorie sélectionnée
                console.log(categorieFilter);

                // Réassignée avec tous les travaux si la catégorie sélectionnée est "Tous"
                let filteredWorks = works;
                if (categorieFilter !== "Tous") {
                    filteredWorks = works.filter((work) => work.category.name === categorieFilter);
                }

                affichageTravaux(filteredWorks);
            });
        });
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        throw error;
    }
};

////////////////// Affichage Editeur / Logout //////////////////

async function affichageEditeur() {
    const loginLink = document.querySelector(".login-link");
    const token = localStorage.getItem("token");
    const editorMode = document.querySelector("#editor-mode");
    const filterBtns = document.querySelectorAll(".btn");
    const editorElements = document.querySelectorAll("#editor-element");

    // Masquer les éléments du mode éditeur
    editorMode.style.display = "none";
    editorElements.forEach((editorElement) => {
    editorElement.style.display = "none";
    });

    if (token) {
        // Masquer les boutons de filtre
         filterBtns.forEach((filterBtn) => {
         filterBtn.style.display = "none";
        });


        // Afficher les éléments du mode éditeur en flex
        editorElements.forEach((editorElement) => {
            editorElement.style.display = "flex";
        });

        // Afficher le mode éditeur
        editorMode.style.display = "flex";

        // Gérer le clic sur le lien de connexion/déconnexion
        loginLink.textContent = "logout";
        loginLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        });
    }
}

////////////////// Modal //////////////////

const modalLink = document.querySelector(".modal-link");
const divGallery = document.querySelector(".gallery");
const modal = document.querySelector(".modal");
const modalWrapper = document.querySelector(".modal-wrapper");
const modalWrapperGallery = document.querySelector(".modal-wrapper-gallery");
const galleryModalClose = document.querySelector(".gallery-modal-close");
const modalGallery = document.querySelector(".modal-gallery");
const galleryBtn = document.querySelector(".modal-gallery-btn");
const trashDelete = document.querySelector(".trash");
const deleteGallery = document.querySelector(".delete-gallery");

const addModalClose = document.querySelector(".add-modal-close");
const modalAddPhoto = document.querySelector(".modal-add-project");
const previousArrow = document.getElementById("previous-arrow");
const divAddImage = document.querySelector(".add-project-image");
const addImageButton = document.querySelector(".add-image-btn");
const uploadForm = document.getElementById("upload-form");
const divProjectImage = modal.querySelector(".add-image");
const modalAddBtn = document.querySelector(".modal-add-btn");

// Fonction pour créer les éléments de la modal de galerie
async function modalGalleryElement() {
    const works = await appelTravaux(); // Appeler les travaux
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

        // Intègre le trashicon avec la fonction deleteProject
        trashIcon.addEventListener("click", async (e) => {
            deleteProject(work.id, modalFigure);
        });

        deleteGallery.addEventListener("click", async (e) => {
            deleteGalleryaAll(work.id, modalGallery);
        });

    });
}

// Gestionnaire d'événement pour ouvrir la modal
modalLink.addEventListener("click", async (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    modalGallery.innerHTML = "";
    await modalGalleryElement();
});

///////////////// delete Project ////////////////

// Fonction qui supprime les éléments en récupérant l'id
function deleteProject(workId, modalFigure) {
    fetch('http://localhost:5678/api/' + `works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })
        .then(response => {
            if (response.ok) {
                modalFigure.remove(); // Supprimer l'élément de la modal
                divGallery.innerHTML = "";  // Vider la galerie

                // Récupérer les travaux mis à jour depuis l'API
                appelTravaux()
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

// Fonction qui supprime la galerie
function deleteGalleryaAll(workId, modalGallery) {
    fetch('http://localhost:5678/api/' + `works/${workId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
    })
        .then(response => {
            if (response.ok) {

                modalGallery.forEach((modalFigure) => {
                    modalFigure.remove(); // Supprimer tous les éléments de la modal
                    modalGallery.innerHTML = ""; // Vider la galerie
                });

                // Récupérer les travaux mis à jour depuis l'API
                appelTravaux()
                    .then(updatedWorks => {
                        affichageTravaux(updatedWorks);
                    })
                    .catch(error => {
                        console.log("Erreur lors de la récupération des travaux :", error);
                    });
                console.log("Suppression réussie");
            } else {
                console.log("Échec de la suppression de gallery");
            }
        });
}

/////////// La fermeture de modal ///////////

async function hideModal() { // Fonction pour cacher la modal
    modal.style.display = "none";
    modalWrapperGallery.style.display = "block";

    divGallery.innerHTML = "";
    const works = await appelTravaux();
    affichageTravaux(works);
}

   // Gestionnaires d'événements pour la fermeture de la modal
    galleryModalClose.addEventListener("click", hideModal);
    addModalClose.addEventListener("click", hideModal);
    modal.addEventListener("click", hideModal);

    // Empêcher la propagation des événements lors du clic à l'intérieur de la modal
    modalWrapperGallery.addEventListener("click", (e) => {
    e.stopPropagation();
});

    // Empêcher la propagation des événements lors du clic à l'intérieur de la modal d'ajout de photo
    modalAddPhoto.addEventListener("click", (e) => {
    e.stopPropagation();
});

////////////// Function requête post pour envoyé de nouveau travaux //////////////

function sendPictureToAPI() { // Fonction pour envoyer de nouvelles images à l'API

    // Récupération des valeurs du champ de titre, catégorie et du fichier sélectionné
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const file = document.querySelector(".input-file").files[0];
    console.log(title, category, file);

    // Vérification si le titre est vide ou si la catégorie est la valeur par défaut
    if (title.trim() === "" || category === "default") {
        alert("Veuillez remplir tous les champs et ajouter une image.");
        return;
    }

    // Création d'un objet FormData pour stocker les données à envoyer dans la requête POST
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    // Envoi de la requête POST à l'API
    fetch('http://localhost:5678/api/' + "works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                console.log("Travail envoyé avec succès :");
            }
        });
}

     // Affichage de la modalegallery quand on click sur l'élément' qui a la classe modal-link
    modalLink.addEventListener("click", async (e) => {
    e.preventDefault(); // Empêche le chargement par défaut d'une nouvelle page
    modal.style.display = "flex";

    // Lors de l'ouverture de la modal, récupération des travaux et affichage dans modalGallery
    modalGallery.innerHTML = "";
    await modalGalleryElement();
});

    // Affichage de la modalAddphoto au click sur le galleryBTN
    galleryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modalWrapperGallery.style.display = "none";
    modalAddPhoto.style.display = "block";
});

// Ajout d'une image au click sur le addImageButton
    addImageButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Supprimer tous les input de fichier existants
    const inputFiles = document.querySelectorAll(".input-file");
    inputFiles.forEach((inputFile) => {
        inputFile.remove();
    });

    // Création d'un input pour importer une image
    const input = document.createElement("input");
    input.classList.add("input-file");
    input.style.display = "none";
    input.type = "file";
    input.name = "image";
    input.accept = ".jpg, .png";
    uploadForm.appendChild(input);
    input.click();

    // Evénement (change) est déclenché sur l'input de téléchargement de fichier
    input.addEventListener("change", () => {
        // Récupérer le fichier sélectionné en accédant à input.files[0]
        const file = input.files[0];
        console.log(file);

        if (file) {
            // Créer un élément d'image pour prévisualiser le fichier
            const imageFile = document.createElement("img");
            imageFile.src = URL.createObjectURL(file);
            divAddImage.appendChild(imageFile);
            divAddImage.style.display = "block";
        }

        // les champs d'entrée s'ils sont remplis
        // le bouton modalAddBtn a une nouvelle classe
        const inputTitle = document.getElementById("title");
        const inputCategory = document.getElementById("category");
        const modalAddBtn = document.querySelector(".modal-add-btn");

        // Selectionner les input title
        [inputTitle, inputCategory].forEach((inputchamp) => {
            inputchamp.addEventListener("input", () => {
                // Vérifier si les champs des input sont remplis
                const champsRemplis = inputTitle.value.trim() !== "" && inputCategory.value !== "default";
                if (champsRemplis) {
                    // On ajoute la class modal-add-btn-valide si les champs sont remplis
                    modalAddBtn.classList.add("modal-add-btn-valide");
                } else {
                    modalAddBtn.classList.remove("modal-add-btn-valide");
                }
            });
        });
    });
});

   // Requête post au click sur le modalAddBtn pour envoyé les nouveaux projets
    modalAddBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    sendPictureToAPI();
});

    // Click sur previousarrow en revient sur la modal wrapper gallery
    previousArrow.addEventListener("click", async (e) => {
    e.preventDefault();
    modalAddPhoto.style.display = "none";
    modalWrapperGallery.style.display = "";

    modalGallery.innerHTML = ""; // Vider la modalGallery
    await modalGalleryElement(); // Récupère les travaux mis à jour depuis l'API
    affichageTravaux(modalGalleryElement); // Affiche les travaux mis à jour
});

////////////////// Affichage ////////////////// 

async function Affichage() {
    // Récupérer la liste des works
    const works = await appelTravaux()
    // Afficher la liste des works dans la page
   // affichageTravaux(works)
    filters(works)
    affichageEditeur()
}

Affichage() // Appeler la fonction d'affichage pour initialiser la page
