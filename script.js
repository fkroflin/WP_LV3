document.addEventListener("DOMContentLoaded", function() {
    let allMovies = [];
    let cart = [];
    const tbody = document.querySelector('table tbody');
    const genreFilterContainer = document.getElementById('genre-filter');
    const countryFilter = document.getElementById('country-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const ratingValue = document.getElementById('rating-value');
    const filterButton = document.getElementById('filter-button');

    const genres = ['Animation', 'Drama', 'Comedy', 'Crime', 'Spy', 'Adventure', 'Romantic'];

    const cartSection = document.createElement('div');
    cartSection.className = 'cart-section';
    cartSection.innerHTML = `
        <button id="view-cart-button">Pregled košarice (<span id="cart-count">0</span>)</button>
    `;
    document.querySelector('.filter-container').insertAdjacentElement('afterend', cartSection);

    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Košarica</h2>
            <table id="cart-table">
                <thead>
                    <tr>
                        <th>Naslov</th>
                        <th>Godina</th>
                        <th>Žanr</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div class="modal-buttons">
                <button id="confirm-cart">Potvrdi posudbu</button>
                <button id="close-modal">Zatvori</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const cartCount = document.getElementById('cart-count');
    const viewCartButton = document.getElementById('view-cart-button');
    const cartTableBody = document.querySelector('#cart-table tbody');
    const closeModal = document.getElementById('close-modal');
    const confirmCart = document.getElementById('confirm-cart');

    function prikaziTablicu(filmovi) {
        tbody.innerHTML = '';
        filmovi.slice(0, 12).forEach(film => {
            const red = document.createElement('tr');
            red.innerHTML = `
                <td>${film.filmtv_id || ''}</td>
                <td>${film.title || ''}</td>
                <td>${film.year || ''}</td>
                <td>${film.genre || ''}</td>
                <td>${film.duration || ''}</td>
                <td>${film.country || ''}</td>
                <td>${film.avg_vote || ''}</td>
                <td><button class="add-to-cart" data-id="${film.filmtv_id}">Dodaj u košaricu</button></td>
            `;
            tbody.appendChild(red);
        });

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const movieId = button.getAttribute('data-id');
                const movie = allMovies.find(m => m.filmtv_id === movieId);
                if (movie && !cart.some(m => m.filmtv_id === movieId)) {
                    cart.push(movie);
                    updateCart();
                    alert(`${movie.title} dodan u košaricu!`);
                } else if (cart.some(m => m.filmtv_id === movieId)) {
                    alert(`${movie.title} je već u košarici!`);
                }
            });
        });
    }

    function updateCart() {
        cartCount.textContent = cart.length;
        cartTableBody.innerHTML = '';
        cart.forEach(movie => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movie.title || ''}</td>
                <td>${movie.year || ''}</td>
                <td>${movie.genre || ''}</td>
                <td><button class="remove-from-cart" data-id="${movie.filmtv_id}">Ukloni</button></td>
            `;
            cartTableBody.appendChild(row);
        });

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', () => {
                const movieId = button.getAttribute('data-id');
                cart = cart.filter(m => m.filmtv_id !== movieId);
                updateCart();
                alert('Film uklonjen iz košarice!');
            });
        });
    }

    viewCartButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    confirmCart.addEventListener('click', () => {
        console.log('Confirm cart clicked, cart length:', cart.length); // Debugging
        if (cart.length === 0) {
            alert('Košarica je prazna!');
        } else {
            const message = `Uspješno ste dodali ${cart.length} filma u svoju košaricu za vikend maraton!`;
            alert(message);
            console.log('Confirmation message:', message); // Debugging
            cart = [];
            updateCart();
            modal.style.display = 'none';
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    ratingFilter.addEventListener('input', () => {
        ratingValue.textContent = ratingFilter.value;
    });

    genres.forEach(genre => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="radio" name="genre" value="${genre}"> ${genre}`;
        genreFilterContainer.appendChild(label);
    });

    fetch('/public/filmtv_movies.csv')
        .then(res => res.text())
        .then(csv => {
            Papa.parse(csv, {
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    allMovies = results.data;
                    prikaziTablicu(allMovies);

                    filterButton.addEventListener('click', () => {
                        const selectedGenre = document.querySelector('input[name="genre"]:checked')?.value || '';
                        const country = countryFilter.value.trim().toLowerCase();
                        const minRating = parseFloat(ratingFilter.value);

                        const filteredMovies = allMovies.filter(movie => {
                            const matchesGenre = !selectedGenre || movie.genre === selectedGenre;
                            const matchesCountry = !country || movie.country.toLowerCase().includes(country);
                            const matchesRating = movie.avg_vote && !isNaN(parseFloat(movie.avg_vote)) ? parseFloat(movie.avg_vote) >= minRating : true;
                            return matchesGenre && matchesCountry && matchesRating;
                        });

                        prikaziTablicu(filteredMovies);
                    });
                },
                error: function(error) {
                    console.error('Greška kod parsiranja CSV datoteke:', error);
                }
            });
        })
        .catch(error => console.error('Greška kod dohvaćanja CSV datoteke:', error));
});