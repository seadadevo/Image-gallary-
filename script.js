const imagesWrapper = document.querySelector(".images"); 
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightbox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");
const downloadImgBtn = lightbox.querySelector(".uil-import");


const filterButtons = document.querySelectorAll('.filter-btn');

// API key, paginations, searchTerm variables
const apiKey = "nAfKhso4SnUjxMbmockln3J7sWwFqQFhJxGMJilkWYnIvS4UGa4VCTW0";
const perPage = 15;
let currentPage = 1
let searchTerm = null;

const downloadImg = (imgUrl) => {
   fetch(imgUrl).then((res) => res.blob()).then(file =>{
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
   }).catch(() => alert("Failed to download image!"))
} 

const showLightbox = (name, img ) => {
    lightbox.querySelector('img').src = img; 
    lightbox.querySelector('span').innerText = name;
    downloadImgBtn.setAttribute('data-img', img) 
    lightbox.classList.add('show')
    document.body.style.overflow = 'hidden'
}

const hideLightbox = () => {
    lightbox.classList.remove('show')
    document.body.style.overflow = 'auto'
}

/** 
 * ! photographer": "Joey Farina",
 * ! src: src.large2x 
 * !  alt: alt
 * ! id: id
 * ! url on pexels: url
 */ 
const generateHtml = (images)  => {
    imagesWrapper.innerHTML += images.map(img => {
        const { photographer, src } = img;
        return (
          `<li class="card" onclick= "showLightbox('${photographer}', '${src.large2x}')">
            <img src="${src.large2x}" alt="img" />
            <div class="details">
              <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${photographer}</span>
              </div>
              <button onclick ="downloadImg('${src.large2x}')">
                  <i class="uil uil-import"></i>
              </button>
            </div>
          </li>`
        )
    }).join("")
}
const getImages = (apiURL) => {
    loadMoreBtn.innerHTML = "Loading..."
    loadMoreBtn.classList.add('disabled')
    fetch(apiURL, { 
        headers: {Authorization: apiKey}
    }).then(res => res.json()).then(data => {
        generateHtml(data.photos)
        loadMoreBtn.innerHTML = "Load More"
        loadMoreBtn.classList.remove('disabled')
    }).catch(()  => alert("Failed to load images!") )
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        
        loadImagesByCategory(category);
    });
});


const loadImagesByCategory = (category) => {
    currentPage = 1; 
    imagesWrapper.innerHTML = ""; 

   
    const apiURL = `https://api.pexels.com/v1/search?query=${category}&page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
};


loadImagesByCategory("palestine"); 
const loadMoreImages = () => { 
    currentPage++; 
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL
    getImages(apiURL)   
}

const loadSearchImages = (e) => {
    // If the search input is empty, set the search term to null and return from here
    if(e.target.value === "") return searchTerm = null;
    if(e.key === "Enter") { 
        // If pressed key is Enter, update the current page, search term & call the get Images
        currentPage = 1
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
} 
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)
loadMoreBtn.addEventListener( "click" ,  loadMoreImages)
searchInput.addEventListener( "keyup" ,  loadSearchImages)
closeBtn.addEventListener( "click" ,  hideLightbox)
downloadImgBtn.addEventListener( "click" , (e) =>downloadImg(e.target.dataset.img)) 