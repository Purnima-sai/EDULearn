document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const container = document.querySelector('.page-container');
    let currentPageIndex = 0;
    let isScrolling = false; // Flag to prevent multiple scrolls at once
    const scrollThreshold = 5; // Minimum scroll delta to trigger page change
    const scrollTimeout = 1000; // Cooldown period in ms (match CSS transition + buffer)

    function setActivePage(index) {
        pages.forEach((page, i) => {
            if (i === index) {
                page.classList.add('active');
                // Ensure the active page is at Y=0
                page.style.transform = 'translateY(0)';
            } else {
                page.classList.remove('active');
                // Determine if the non-active page should be above or below
                if (i < index) {
                    // Pages before the current one (not typically visible in this setup)
                    // We could move them up: page.style.transform = 'translateY(-100%)';
                    // But for the slide-over effect, we just let them be overridden
                } else {
                    // Pages after the current one are positioned below
                    page.style.transform = 'translateY(100%)';
                }
            }
        });
    }

    function changePage(direction) {
        if (isScrolling) return; // Prevent scrolling if already animating

        const previousPageIndex = currentPageIndex;

        if (direction === 'down' && currentPageIndex < pages.length - 1) {
            currentPageIndex++;
        } else if (direction === 'up' && currentPageIndex > 0) {
            currentPageIndex--;
        } else {
            return; // No change if at boundaries
        }

        // If the index actually changed
        if (previousPageIndex !== currentPageIndex) {
            isScrolling = true; // Set scrolling flag

            // The 'active' class logic primarily controls z-index and initial setup.
            // The transform is directly manipulated for the animation.
            if (direction === 'down') {
                // Bring the new page up from the bottom
                pages[currentPageIndex].style.transform = 'translateY(0)';
                 pages[currentPageIndex].classList.add('active'); // Add active class for z-index
                 // Remove active from previous *after* transition starts for z-index management
                 if (pages[previousPageIndex]) {
                    pages[previousPageIndex].classList.remove('active');
                 }
            } else { // Direction is 'up'
                // Move the *current* (soon to be previous) page down
                pages[previousPageIndex].style.transform = 'translateY(100%)';
                pages[previousPageIndex].classList.remove('active');
                // The new page (which was above) should already be at translateY(0)
                // conceptually, but we ensure its state
                pages[currentPageIndex].style.transform = 'translateY(0)';
                 pages[currentPageIndex].classList.add('active');
            }


            // Reset the scrolling flag after the transition ends
            setTimeout(() => {
                isScrolling = false;
            }, scrollTimeout); // Use the timeout value
        }
    }

    // --- Mouse Wheel Event ---
    container.addEventListener('wheel', (event) => {
        event.preventDefault(); // Prevent default window scrolling

        const delta = event.deltaY;

        if (Math.abs(delta) > scrollThreshold) {
            if (delta > 0) {
                // Scrolling Down
                changePage('down');
            } else {
                // Scrolling Up
                changePage('up');
            }
        }
    }, { passive: false }); // Need passive: false to call preventDefault


    // --- Touch Event Handling (Basic Swipe) ---
    let touchStartY = 0;
    let touchEndY = 0;
    const swipeThreshold = 50; // Minimum pixels swiped to trigger change

    container.addEventListener('touchstart', (event) => {
        touchStartY = event.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (event) => {
        touchEndY = event.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaY) > swipeThreshold) {
            if (deltaY < 0) { // Swiped Up (equivalent to scrolling down)
                changePage('down');
            } else { // Swiped Down (equivalent to scrolling up)
                changePage('up');
            }
        }
        // Reset touch points
        touchStartY = 0;
        touchEndY = 0;
    }

    // --- Keyboard Navigation ---
     document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            changePage('down');
        } else if (event.key === 'ArrowUp') {
             event.preventDefault();
            changePage('up');
        }
     });

    // Initial setup: Ensure only the first page is truly active
    setActivePage(currentPageIndex);

});