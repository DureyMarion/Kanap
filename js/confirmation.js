// Adresse API de base
const API_URL = "http://localhost:3000/api";

// Accès aux arguments de requête décodés par GET contenus dans l'URL
// N° De commande (voir ligne 255/"cart.js")
const searchParams = (new URL(document.location)).searchParams;
const orderId = searchParams.get("order-id")

// Se déclenche une fois le document HTML initial entièrement chargé et analysé
window.addEventListener("DOMContentLoaded", (event) => {

    // Création et insertion de l'élément orderId
    const idCommande = document.getElementById("orderId");
    idCommande.innerText = orderId;
});
