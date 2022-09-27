// Adresse API de base
const API_URL = "http://localhost:3000/api";

// Ajouter au local storage
let cart = JSON.parse(window.localStorage.getItem("cart"));

// Mise à 0 pour le prix et la quantité dans le panier vierge
let globalTotalPrice = 0;
let globalTotalQuantity = 0;

// L'événement DOMContentLoaded de déclenche une fois le document HTML initial entièrement chargé et analysé
// AddEventListener() associe un gestionnaire d'événements à un élément
window.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("totalPrice").innerHTML = globalTotalPrice;
    document.getElementById("totalQuantity").innerHTML = globalTotalQuantity;

    // Récupération de chaque élément
    cart.forEach(element => {
        const currentId = element.id;

        // Requête pour récupération des données
        let product = fetch(API_URL + "/products/" + currentId)
            .then((resp) => resp.json())
            .then(function (product) {
                createItem(product, element)
            });
    })
});


// Création des éléments
function createItem(product, cartElement) {

    // Déclaration d'une variable pour y avoir les prix qui sont dans le panier
    // ParseInt = nombre entier/1 valeur
    globalTotalPrice += parseInt(product.price) * parseInt(cartElement.quantity);
    globalTotalQuantity += parseInt(cartElement.quantity);

    // Afficher le total du prix
    let productTotalPrice = document.getElementById("totalPrice");
    productTotalPrice.innerHTML = globalTotalPrice;

    // Afficher le total de la quantité
    let totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerHTML = globalTotalQuantity;

    // Création et insertion de l'élément "article"
    let productArticle = document.createElement("article");
    document.querySelector("#cart__items").appendChild(productArticle);
    productArticle.className = "cart__item";

    // Création et insertion de l'élément "div"
    let productDivImg = document.createElement("div");
    productArticle.appendChild(productDivImg);
    productDivImg.className = "cart__item__img";

    // Création et insertion de l'image "img"
    let productImg = document.createElement("img");
    productDivImg.appendChild(productImg);
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;

    // Création et insertion de l'élément "div"
    let productItemContent = document.createElement("div");
    productArticle.appendChild(productItemContent);
    productItemContent.className = "cart__item__content";

    // Création et insertion de l'élément "div"
    let productItemContentTitlePrice = document.createElement("div");
    productItemContent.appendChild(productItemContentTitlePrice);
    productItemContentTitlePrice.className = "cart__item__content__titlePrice";

    // Création et insertion du titre "h2"
    let productTitle = document.createElement("h2");
    productItemContentTitlePrice.appendChild(productTitle);
    productTitle.innerHTML = product.name;

    // Création et insertion de la couleur "p"
    let productColor = document.createElement("p");
    productTitle.appendChild(productColor);
    productColor.innerHTML = cartElement.color;

    // Création et insertion du prix "p"
    let productPrice = document.createElement("p");
    productItemContentTitlePrice.appendChild(productPrice);
    productPrice.innerHTML = product.price + "€";

    // Insertion de l'élément "div"
    let productItemContentSettings = document.createElement("div");
    productItemContent.appendChild(productItemContentSettings);
    productItemContentSettings.className = "cart__item__content__settings";

    // Insertion de l'élément "div"
    let productItemContentSettingsQuantity = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsQuantity);
    productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";

    // Création et insertion de l'élément Qté "input"
    let productQuantity = document.createElement("input");
    productItemContentSettingsQuantity.appendChild(productQuantity);
    productQuantity.value = parseInt(cartElement.quantity);
    productQuantity.className = "itemQuantity";
    productQuantity.setAttribute("type", "number");
    productQuantity.setAttribute("min", "1");
    productQuantity.setAttribute("max", "100");

    // Création et insertion de l'élément "div"
    let productItemContentSettingsDelete = document.createElement("div");
    productItemContentSettings.appendChild(productItemContentSettingsDelete);
    productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

    // Création et insertion de l'élément "p" pour supprimer
    let productSupprimer = document.createElement("p");
    productItemContentSettingsDelete.appendChild(productSupprimer);
    productSupprimer.className = "deleteItem";
    productSupprimer.innerHTML = "Supprimer";


    // Variables utilisées pour la modification de quantité & le btn supprimer
    let idUpdate = cartElement.id;
    let colorUpdate = cartElement.color;

    // Modification de la quantité
    productQuantity.addEventListener("focusout", (event) => {

        // Condition pour que le n° d'article soit comprit entre 0 et 100
        if (event.target.value > 0 && event.target.value <= 100) {
            // Mettre l'élément que l'on veut modifer de côté pour le travailler
            let elementToUpdate = cart.filter(function (element) {
                return element.id === idUpdate && element.color === colorUpdate;
            });

            // Edite la quantité de l'élément modifier
            elementToUpdate[0].quantity = parseInt(event.target.value);

            // Garder les éléments du panier de côté
            cart = cart.filter(function (element) {
                return (element.id === idUpdate && element.color === colorUpdate) === false;
            });

            // Merge du tableau et de l'élément modifié avec la nouvelle quantité
            cart.push(elementToUpdate[0]);
            // Actualise le localStorage pour la prise en compte des modifications  
            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload();
        }
    })


    // BTN de suppression
    productSupprimer.addEventListener("click", (event) => {
        // Élément coupé afin d'y mettre ce que je veux après
        event.preventDefault();

        // Sélection de l'élément à supprimer en fonction de son id et de sa couleur
        cart = cart.filter(function (element) {
            return (element.id === idUpdate && element.color === colorUpdate) === false;
        });

        // Prise en compte des changements dans le localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
    });

}


// Récupération du Formulaire
const form = document.querySelector(".cart__order__form");

form.addEventListener("submit", (event) => {
    // Sélection des éléments du formulaire
    let firstName = form.firstName;
    let lastName = form.lastName;
    let address = form.address;
    let city = form.city;
    let email = form.email;

    // Déclaration des RegExp
    let emailRegExp = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;
    let nameRegExp = /^[a-zA-Zéêëèîïâäçù ,'-]{2,20}$/;
    let addressRegExp = /^[0-9]{1,3}[a-zA-Zéêëèîïâäçù ,'-]+$/;

    // Vérification du prénom
    function verificationFirstName() {
        const testFirstName = nameRegExp.test(firstName.value);
        if (testFirstName === false) {
            firstName.nextElementSibling.innerHTML = "Ne peut contenir de chiffres ou caractères spéciaux";
        } else {
            firstName.nextElementSibling.innerHTML = "";
        }
        return testFirstName;
    }

    // Vérification du nom de famille
    function verificationLastName() {
        const testlastName = nameRegExp.test(lastName.value);
        if (testlastName === false) {
            lastName.nextElementSibling.innerHTML = "Ne peut contenir de chiffres ou caractères spéciaux";
        } else {
            lastName.nextElementSibling.innerHTML = "";
        }
        return testlastName;
    }

    // Vérification de l'adresse
    function verificationAddress() {
        let testAddress = addressRegExp.test(address.value);
        if (testAddress === false) {
            address.nextElementSibling.innerHTML = "Veuillez saisir une adresse valide";
        } else {
            address.nextElementSibling.innerHTML = "";
        }
        return testAddress;
    }


    // Vérification de la ville
    function verificationCity() {
        let testCity = nameRegExp.test(city.value);
        if (testCity === false) {
            city.nextElementSibling.innerHTML = "Veuillez saisir un nom de ville valide";
        } else {
            city.nextElementSibling.innerHTML = "";
        }
        return testCity;
    }


    // Vérification de l'email
    function verificationEmail() {
        let testEmail = emailRegExp.test(email.value);
        email.nextElementSibling.innerHTML = (testEmail === true) ? "" : "Veuillez saisir une adresse email valide";
        return testEmail;
    }

    // Événement non annulable
    event.preventDefault();

    // Condition pour que le formulaire soit valide et passe à la page de confirmation
    if (
        (verificationEmail() == true) &&
        (verificationFirstName() == true) &&
        (verificationLastName() == true) &&
        (verificationCity() == true) &&
        (verificationAddress() == true)
    ) {
        // Formate les données que l'on envoie à l'API
        let data = {
            products: cart.map((item) => item.id),
            contact: {
                firstName: firstName.value,
                lastName: lastName.value,
                city: city.value,
                address: address.value,
                email: email.value
            }
        }

        // Requête serveur pour un n° de commande
        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((promise) => {
                let responseServeur = promise;
                // Création de orderId (numéro de commande)
                // Redirection page confirmation avec le paramètre "?" orderId
                document.location.href = "confirmation.html?order-id=" + responseServeur.orderId;
            })
    }
});

