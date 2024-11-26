// Options de formatage pour la date
let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};

// Déclaration des listes pour les livres, auteurs et catégories
let booksList = new Array();
let authorsList = new Array();
let categoriesList = new Array();

// Récupération des éléments DOM pour les listes déroulantes et l'affichage des livres
let listAuthors = document.getElementById("listAuthors");
let listCategories = document.getElementById("listCategories");
let listBooks = document.getElementById("booksList");

// Ajout d'écouteurs d'événements pour les changements dans les listes déroulantes
listAuthors.addEventListener("change", chargeByAuthor);
listCategories.addEventListener("change", chargeBycategory);

// Création d'un écouteur d'événement pour le chargement de la page
window.addEventListener("DOMContentLoaded", jsonOnLoad);

// Fonction qui appelle le chargement du JSON
function jsonOnLoad() {
    fetch("data/books.json")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // Appel de la fonction pour créer et afficher les livres
            createBooks(data);
        });
}

// Fonction qui crée et affiche les livres, ainsi que les listes déroulantes
function createBooks(_books) {
    // Boucle sur l'ensemble des livres
    for (let book of _books) {
        booksList.push(book);

        // Boucle sur les catégories de chaque livre
        for (let y = 0; y < book.categories.length; y++) {
            let category = book.categories[y];

            // Vérifie si la catégorie est déjà dans la liste des catégories
            if (categoriesList.indexOf(category) == -1) {
                categoriesList.push(category);
            }
        }

        // Boucle sur les auteurs de chaque livre
        for (let x = 0; x < book.authors.length; x++) {
            let author = book.authors[x];

            // Vérifie si l'auteur est déjà dans la liste des auteurs
            if (authorsList.indexOf(author) == -1) {
                authorsList.push(author);
            }
        }
    }
    // Trie les listes des catégories, livres et auteurs
    categoriesList.sort();
    booksList.sort();
    authorsList.sort();

    // Ajoute les options dans la liste déroulante des auteurs
    for (let i = 0; i < authorsList.length; i++) {
        let option = document.createElement('option');
        option.value = authorsList[i];
        option.innerText = authorsList[i];
        listAuthors.appendChild(option);
    }

    // Ajoute les options dans la liste déroulante des catégories
    for (let h = 0; h < categoriesList.length; h++) {
        let option = document.createElement('option');
        option.value = categoriesList[h];
        option.innerText = categoriesList[h];
        listCategories.appendChild(option);
    }

    // Affiche les livres
    showBooks(booksList);
}

// Fonction qui affiche les livres
function showBooks(_books) {
    // Vide la liste des livres
    listBooks.innerHTML = "";

    // Boucle sur les livres et crée des éléments DOM pour chacun d'eux
    for (let y = 0; y < _books.length; y++) {
        let book = document.createElement("div");
        book.setAttribute("class", "card");

        // Vérifie si l'URL de la miniature est valide, sinon utilise une image par défaut
        if (_books[y].thumbnailUrl == undefined || _books[y].thumbnailUrl == null) {
            _books[y].thumbnailUrl = "https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png";
        }

        // Raccourci le titre si nécessaire
        let titre;
        if (_books[y].title.length > 20) {
            titre = _books[y].title.substring(0, 20) + " (...)";
        }
        else {
            titre = _books[y].title;
        }

        // Détermine les descriptions courtes et longues
        let description;
        let shortDescription;

        if (_books[y].shortDescription == undefined || _books[y].shortDescription == null) {
            if (_books[y].longDescription == undefined || _books[y].longDescription == null) {
                shortDescription = "Pas de description";
            }
            else {
                shortDescription = _books[y].longDescription.substring(0, 100);
            }
        }
        else {
            shortDescription = _books[y].shortDescription;
        }

        if (_books[y].longDescription == undefined || _books[y].longDescription == null) {
            description = "Pas de description";
        }
        else {
            description = _books[y].longDescription;
        }

        if (_books[y].longDescription > 100) {
            shortDescription = shortDescription.substring(0, 100) + " (...)";
        }

        // Gère la date de publication
        let datePubli;
        try {
            datePubli = new Date(_books[y].publishedDate.dt_txt).toLocaleDateString("fr-FR", options);
        } catch (error) {
            datePubli = "Pas de date de publication";
        }
        // On récupère l'isbn
        let nbIsbn = _books[y].isbn;
        
        // Ici on viendra afficher le nombre de page du livre.
        let nbPage = _books[y].pageCount;
        let nbPageA;

        if (nbPage === 0 || nbPage === undefined || nbPage === null) {
             nbPageA="";
        } 
        else {
             nbPageA= "Nombre de pages : " + nbPage;
        }



        // Crée l'élément HTML pour le livre
        book.innerHTML = '<img src="' + _books[y].thumbnailUrl + '"/>' +
                         '<h1 class="booktitle"><span class="infobulle" title="' + _books[y].title + '">' + titre + '</span></h1>' +
                         '<h6>'+"ISBN : " +  nbIsbn + '</h6>' +  
                         '<h6>'+"Date de publication : " + datePubli + '</h6>' +
                         '<h6>'+ nbPageA +'</h6>'+ 
                         '<p><span class="infobulle" title="' + description + '">' + shortDescription + '</span></p>';

        // Ajoute le livre à la liste des livres
        listBooks.appendChild(book);
    }
}

// Fonction appelée lors du changement d'auteur dans la liste déroulante
function chargeByAuthor() {
    // Récupère l'auteur sélectionné
    let strAuthor = listAuthors.options[listAuthors.selectedIndex].text;
    console.log(strAuthor);

    // Crée une nouvelle liste pour les livres filtrés par auteur
    let bookByAuthor = new Array();

    // Vérifie si aucun auteur n'est sélectionné
    if (strAuthor == undefined || strAuthor == null || strAuthor === "") {
        return showBooks(booksList);
    }
    else {
        // Réinitialise la valeur précédement entrée de la selection categorie
        listCategories.value ="";

        // Boucle sur les livres pour filtrer par auteur
        for (let x = 0; x < booksList.length; x++) {
            let book = booksList[x];

            // Ajoute le livre à la liste si l'auteur correspond
            if (book.authors.indexOf(strAuthor) != -1) {
                bookByAuthor.push(book);
            }
        }
    }

    // Trie la liste des livres filtrés et les affiche
    bookByAuthor.sort();
    showBooks(bookByAuthor);
}

// Fonction appelée lors du changement de catégorie dans la liste déroulante  
function chargeBycategory() {
    // Récupère la catégorie sélectionnée
    let strCategory = listCategories.options[listCategories.selectedIndex].text;
    console.log(strCategory);

    // Crée une nouvelle liste pour les livres filtrés par catégorie
    let bookByCategory = new Array();

    // Vérifie si aucune catégorie n'est sélectionnée
    if (strCategory == undefined || strCategory == null || strCategory==="") {
        return showBooks(booksList);
    }
    else {
        // Réinitialise la valeur précédement entrée de la selection auteur
        listAuthors.value="";

        // Boucle sur les livres pour filtrer par catégorie
        for (let x = 0; x < booksList.length; x++) {
            let book = booksList[x];

            // Ajoute le livre à la liste si la catégorie correspond
            if (book.categories.indexOf(strCategory) != -1) {
                bookByCategory.push(book);
            }
        }
    }

    // Trie la liste des livres filtrés et les affiche
    bookByCategory.sort();
    showBooks(bookByCategory);
}
