// Accès aux arguments de requête décodés par GET contenus dans l'URL
// Récupération du N° De commande (création ligne 258/"cart.js")
const searchParams = (new URL(document.location)).searchParams;
const orderId = searchParams.get("order-id")

// L'événement DOMContentLoaded de déclenche une fois le document HTML initial entièrement chargé et analysé
// AddEventListener() associe un gestionnaire d'événements à un élément
window.addEventListener("DOMContentLoaded", (event) => {

    // Création et insertion de l'élément orderId
    const idCommande = document.getElementById("orderId");
    idCommande.innerText = orderId;
});
