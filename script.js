document.addEventListener("DOMContentLoaded", () => {
    // Gallery and Lightbox Selectors
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeBtn = document.querySelector(".close-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    
    // Filter Selectors
    const filterButtons = document.querySelectorAll(".filter-buttons .btn");

    let activeItems = [...galleryItems]; // Tracks items currently visible based on active filter
    let currentIndex = 0;

    // --- Lightbox Functionality ---
    function showLightbox(index) {
        currentIndex = index;
        const targetItem = activeItems[currentIndex];
        const imgTarget = targetItem.querySelector(".gallery-img");
        const captionTarget = targetItem.querySelector(".caption");

        lightboxImg.src = imgTarget.src;
        lightboxImg.alt = imgTarget.alt;
        lightboxCaption.textContent = captionTarget.textContent;

        lightbox.classList.add("active");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
    }

    function navigateLightbox(direction) {
        if (activeItems.length === 0) return;
        
        if (direction === "next") {
            currentIndex = (currentIndex + 1) % activeItems.length;
        } else if (direction === "prev") {
            currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
        }
        
        showLightbox(currentIndex);
    }

    // Bind click event to each item for opening the lightbox
    galleryItems.forEach((item) => {
        item.addEventListener("click", () => {
            // Find the index relative to currently visible filtered items
            const visibleIndex = activeItems.indexOf(item);
            if (visibleIndex !== -1) {
                showLightbox(visibleIndex);
            }
        });
    });

    // Lightbox Controls Events
    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", () => navigateLightbox("next"));
    prevBtn.addEventListener("click", () => navigateLightbox("prev"));

    // Close lightbox if clicked outside the content area
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard Navigation support
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") navigateLightbox("next");
        if (e.key === "ArrowLeft") navigateLightbox("prev");
    });


    // --- Category Filter Functionality (Bonus Feature) ---
    filterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            // Update active button styling
            filterButtons.forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");

            const filterValue = e.target.getAttribute("data-filter");

            // Filter the items display smooth transition logic
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute("data-category");
                
                if (filterValue === "all" || itemCategory === filterValue) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });

            // Update activeItems array to ensure next/prev buttons only slide through filtered views
            activeItems = galleryItems.filter(item => {
                const cat = item.getAttribute("data-category");
                return filterValue === "all" || cat === filterValue;
            });
        });
    });
});