// Adresse API de base
const API_URL = "http://localhost:3000/api";

// Accès aux arguments de requête décodés par GET contenus dans l'URL
// Récupération des Id des produits
const searchParams = (new URL(document.location)).searchParams;
const currentId = searchParams.get("id")

// L'événement DOMContentLoaded de déclenche une fois le document HTML initial entièrement chargé et analysé
// AddEventListener() associe un gestionnaire d'événements à un élément
window.addEventListener("DOMContentLoaded", (event) => {

    // Récupération des données par requête
    fetch(API_URL + "/products/" + currentId)
        .then((resp) => resp.json())
        .then(function (product) {
            createItem(product)
        });

    // Création des éléments
    function createItem(product) {

        // Création et insertion de l'élément "img"
        let productImg = document.createElement("img");
        document.querySelector(".item__img").appendChild(productImg);
        productImg.src = product.imageUrl;
        productImg.alt = product.altTxt;

        // Création et insertion de l'élément "h1"
        let productName = document.getElementById("title");
        productName.innerHTML = product.name;

        // Création et insertion de l'élément "span" pour le prix
        let productPrice = document.getElementById("price");
        productPrice.innerHTML = product.price;

        // Création et insertion de l'élément "p"
        let productDescription = document.getElementById("description");
        productDescription.innerHTML = product.description;

        // Création et insertion des options de couleurs
        for (let color of product.colors) {
            let productColors = document.createElement("option");
            document.querySelector("#colors").appendChild(productColors);
            productColors.value = color;
            productColors.innerHTML = color;
        };
    };
});


// Réalisation de la prise en compte du click sur le button "Ajouter au panier", de sa couleur et de sa quantité
document.querySelector("#addToCart").addEventListener("click", (event) => {
    // Ajouter au local storage
    const cart = JSON.parse(window.localStorage.getItem("cart"));

    // Création d'un tableau vide
    let cartArray = undefined;
    if (cart === undefined || cart === null) {
        cartArray = []
    } else {
        cartArray = cart
    };

    // Variables pour envoyer au tableau les valeurs des propriétés énumérables des objets (ici on a la couleur et la quantité)
    const colors = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;
    let newQuantity = parseInt(quantity);

    // Conditions pour filtrer les produits, si même couleur => même ligne sinon différentes lignes
    if (cartArray.length > 0) {
        let cartCurrentElement = cartArray.filter(function (element) {
            return element.id === currentId && element.color === colors;
        });

        if (cartCurrentElement.length > 0) {
            newQuantity += parseInt(cartCurrentElement[0].quantity);

            cartArray = cartArray.filter(function (element) {
                return (element.id === currentId && element.color === colors) === false;
            });
        }
    }


    // Donner l'Id, la couleur et la quantité du produit ajouté au panier
    if (quantity > 0 && quantity <= 100 && colors) {
        const newCartItem = {
            id: currentId,
            color: colors,
            quantity: newQuantity,
        }

        // Actualise le localStorage pour la prise en compte des modifications
        cartArray.push(newCartItem);

        window.localStorage.setItem("cart", JSON.stringify(cartArray));
    }
});
