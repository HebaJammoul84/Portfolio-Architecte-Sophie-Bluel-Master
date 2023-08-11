
async function login() {
    // Sélection de l'élément du formulaire de connexion
    const loginForm = document.querySelector(".loginForm")

    // Sélection de l'élément pour afficher les messages d'erreur
    const error = document.querySelector("#error-message")

    // Ajout d'un gestionnaire d'événement pour le soumission du formulaire de connexion
    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const formData = {
            // Récupération des valeurs de l'email et du mot de passe depuis le formulaire
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        }
        // Encodage des données en JSON pour l'envoi au serveur
        const chargeUtile = JSON.stringify(formData)

        // Envoi d'une requête POST pour la connexion à l'API
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: chargeUtile,
        })
            .then(response => response.json())
            .then(data => {

                if (data.token) {
                    // Stockage du token dans le stockage local
                    localStorage.setItem("token", data.token)
                    // Redirection vers la page d'accueil (index.html)
                    window.location.href = "index.html"
                } else { // Affichage d'un message d'erreur en cas d'authentification incorrecte
                    error.textContent = "Identifiant ou mot de passe incorrect"
                }

            })
    })
}
// Appel de la fonction de connexion pour initialiser le processus
login()