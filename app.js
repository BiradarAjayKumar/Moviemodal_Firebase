const cl = console.log;

const postForm = document.getElementById('postForm');
const movieTitleControl = document.getElementById('movieTitle');
const movieUrlControl = document.getElementById('movieUrl');
const movieDescriptionControl = document.getElementById('movieDescription');
const movieRatingsControl = document.getElementById('movieRatings');
const movieModel = document.getElementById('movieModel');
const backDrop = document.getElementById('backDrop');
const postContainer = document.getElementById('postContainer');
const showbtn = document.getElementById('showbtn');
const modalClose = [...document.querySelectorAll('.modalClose')];
const addbtn = document.getElementById('addbtn');

let BASE_URL = `https://crud-js-moviemodal-default-rtdb.firebaseio.com`;
let POST_URL = `${BASE_URL}/posts.json`;

const makeApiCall = async (apiurl, method, msgBody) => {
    msgBody = msgBody ? JSON.stringify(msgBody) : null;
    let res = await fetch(apiurl, {
        method: method,
        body: msgBody,
        headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
};

const objToArr = (obj) => {
    let arr = [];
    for (const key in obj) {
        arr.push({ ...obj[key], id: key });
    }
    return arr;
};

const fetchAllPosts = async () => {
    let data = await makeApiCall(POST_URL, 'GET', null);
    cl(data);
    if (data) {
        let postArr = objToArr(data);
        createcards(postArr);
    }
};
fetchAllPosts();

const setRatings = (rating) => {
    rating = +rating;
    if (rating > 4) {
        return 'bg-success';
    } else if (rating > 3) {
        return 'bg-warning';
    } else {
        return 'bg-danger';
    }
};

const createcards = (arr) => {
    let result = "";
    arr.forEach(post => {
        result += `
        <div class="col-md-3">
            <figure class="movieCard">
                <img src="${post.movieUrl}" alt="${post.movieTitle}" title="${post.movieTitle}">
                <figcaption class="info">
                    <div class="ratingTitle">
                        <div class="row">
                            <div class="col-10">
                                <h3 class="mb-0">${post.movieTitle}</h3>
                            </div>
                            <div class="col-2">
                                <small class="rating ${setRatings(post.movieRatings)}">${post.movieRatings}</small>
                            </div>
                        </div>
                    </div>
                    <div class="movieInfo">
                        <h2 class="mb-0">${post.movieTitle}</h2>
                        <p class="overview">${post.movieDescription}</p>
                    </div>
                    <div class="action">
                        <button class="btn btn-sm btn-danger btn-nfxbtn-primary">EDIT</button>
                        <button class="btn btn-sm btn-danger btn-nfxbtn-primary">REMOVE</button>
                    </div>
                </figcaption>
            </figure>
        </div>`;
    });
    postContainer.innerHTML = result;
};

const onmovieAdd = async (eve) => {
    eve.preventDefault();
    let postnewObj = {
        movieTitle: movieTitleControl.value,
        movieUrl: movieUrlControl.value,
        movieDescription: movieDescriptionControl.value,
        movieRatings: +movieRatingsControl.value // Ensures it's a number
    };
    cl(postnewObj);
    let data = await makeApiCall(POST_URL, 'POST', postnewObj);

    let card = document.createElement('div');
    card.className = 'col-md-3';
    card.innerHTML = `
        <figure class="movieCard">
            <img src="${postnewObj.movieUrl}" alt="${postnewObj.movieTitle}" title="${postnewObj.movieTitle}">
            <figcaption class="info">
                <div class="ratingTitle">
                    <div class="row">
                        <div class="col-10">
                            <h3 class="mb-0">${postnewObj.movieTitle}</h3>
                        </div>
                        <div class="col-2">
                            <small class="rating ${setRatings(postnewObj.movieRatings)}">${postnewObj.movieRatings}</small>
                        </div>
                    </div>
                </div>
                <div class="movieInfo">
                    <h2 class="mb-0">${postnewObj.movieTitle}</h2>
                    <p class="overview">${postnewObj.movieDescription}</p>
                </div>
                <div class="action">
                    <button class="btn btn-sm btn-danger btn-nfxbtn-primary">EDIT</button>
                    <button class="btn btn-sm btn-danger btn-nfxbtn-primary">REMOVE</button>
                </div>
            </figcaption>
        </figure>
    `;
    postContainer.prepend(card);
    postForm.reset();
    onmodalToggle();
};

const onmodalShow = () => {
    movieModel.classList.add('active');
    backDrop.classList.add('active');
};

const onmodalToggle = () => {
    movieModel.classList.toggle('active');
    backDrop.classList.toggle('active');
};

modalClose.forEach(ele => ele.addEventListener('click', onmodalToggle));
showbtn.addEventListener('click', onmodalToggle);
postForm.addEventListener('submit', onmovieAdd);
