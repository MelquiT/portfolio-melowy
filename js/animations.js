// #region Buttons
class Button {
    constructor(buttonElement) {
        this.block = buttonElement;
        this.init();
        this.initEvents();
    }

    init() {
        const el = gsap.utils.selector(this.block);

        this.DOM = {
            button: this.block,
            flair: el('.button__flair')
        };

        this.xSet = gsap.quickSetter(this.DOM.flair, 'xPercent');
        this.ySet = gsap.quickSetter(this.DOM.flair, 'yPercent');
    }

    getXY(e) {
        const { left, top, width, height } =
            this.DOM.button.getBoundingClientRect();



        const xTransformer = gsap.utils.pipe(
            gsap.utils.mapRange(0, width, 0, 100),
            gsap.utils.clamp(0, 100)
        );

        const yTransformer = gsap.utils.pipe(
            gsap.utils.mapRange(0, height, 0, 100),
            gsap.utils.clamp(0, 100)
        );

        return {
            x: xTransformer(e.clientX - left),
            y: yTransformer(e.clientY - top)
        };
    }

    initEvents() {
        this.DOM.button.addEventListener('mouseenter', (e) => {
            const { x, y } = this.getXY(e);

            this.xSet(x);
            this.ySet(y);

            gsap.to(this.DOM.flair, {
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        this.DOM.button.addEventListener('mouseleave', (e) => {
            const { x, y } = this.getXY(e);

            gsap.killTweensOf(this.DOM.flair);

            gsap.to(this.DOM.flair, {
                xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
                yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
                scale: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        this.DOM.button.addEventListener('mousemove', (e) => {
            const { x, y } = this.getXY(e);
            gsap.to(this.DOM.flair, {
                xPercent: x,
                yPercent: y,
                duration: 0.4,
                ease: 'power2'
            });
        });
    }
}

const buttonElements = document.querySelectorAll('[data-block="button"]');
buttonElements.forEach(buttonElement => new Button(buttonElement));
// #endregion

// #region Navbar
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const setupNavAnimation = () => {
    const links = gsap.utils.toArray('.nav_list');
    const highlightSpan = document.querySelector('.nav_menu_list span');

    function updateSpan(item) {
        const rect = item.getBoundingClientRect();
        const navListRect = document.querySelector('.nav_menu_list').getBoundingClientRect();

        const leftPosition = rect.left - navListRect.left;
        const width = rect.width;

        highlightSpan.style.width = `${width}px`;
        highlightSpan.style.left = `${leftPosition}px`;
        highlightSpan.style.opacity = '1';
    }
    
    links.forEach(a => {
        const anchor = a.firstElementChild;
        const element = document.querySelector(anchor.getAttribute("href")),
            linkST = ScrollTrigger.create({
                trigger: element,
                start: 'top top',
                // onRefresh: ({isActive}) => console.log("initial:", isActive)
            }),
            highlightST = ScrollTrigger.create({
                trigger: element,
                start: 'top center',
                end: 'bottom center',
                // onRefresh: ({isActive}) => console.log("during:", isActive),
                // onToggle: (self) => console.log('toggled, isActive:', self.isActive)
                onToggle: (self) => {
                    // console.log('Toggled:', self.isActive);
                    self.isActive && setActive(anchor)
                }
            });

        a.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            gsap.to(window, {duration: 0, scrollTo: linkST.start, overwrite: "auto"});
        });

        a.addEventListener('mouseenter', () => {
            updateSpan(a);
        });
    });

    function setActive(link) {
        links.forEach(a => a.firstElementChild.classList.remove('active-link'));
        link.classList.add('active-link');
        updateSpan(link);
    }

    document.querySelector('.nav_menu_list').addEventListener('mouseleave', () => {
        const currentActiveItem = document.querySelector('.active-link').parentElement;
        if (currentActiveItem) {
            updateSpan(currentActiveItem);
        }
    });
};

const setupWhenResizeNav = () => {
    let counter = 0;
    ScrollTrigger.getAll().forEach(trigger => {
        if (!trigger.vars.id) {
            counter++;
            trigger.kill();
        }
    });
    // console.log(`Removed ${counter} about nav triggers`);
    setupNavAnimation();
}

const navMenu = document.getElementById('navMenu');
const logo = document.querySelector('.nav-logo');
const homeBox = document.querySelector('.home-box');

const sectionOptions = {
    rootMargin: '-145px 0px 0px 0px'
};

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            navMenu.classList.add('nav-menu-translate');
            setTimeout(() => {
                logo.classList.add('nav-logo-visible');
            }, 200);
        } else {
            navMenu.classList.remove('nav-menu-translate');
            setTimeout(() => {
                logo.classList.remove('nav-logo-visible');
            }, 100);
        }
    });
}, sectionOptions);

sectionObserver.observe(homeBox);
// #endregion Navbar

// #region Mobile menu
const menuBtn = document.querySelector('.nav-burger');
const overlayNavbar = document.querySelector('.overlay-navbar');
const navbarMobile = document.querySelector('.navbar-mobile');

function closeMobileMenu() {
    menuBtn.children[1].classList.remove('uil-multiply');
    menuBtn.children[1].classList.add('uil-bars');
    navbarMobile.classList.remove('navbar-mobile-active');
    setTimeout(() => {
        navbarMobile.style.display = 'none';
    }, 400);
    overlayNavbar.style.display = 'none';
}
overlayNavbar.addEventListener('click', closeMobileMenu);

Array.from(navbarMobile.querySelectorAll('a')).forEach(element => {
    element.addEventListener('click', closeMobileMenu);
});

menuBtn.addEventListener('click', () => {
    if(menuBtn.children[1].classList.contains('uil-bars')) {
        menuBtn.children[1].classList.remove('uil-bars');
        menuBtn.children[1].classList.add('uil-multiply');
        
        navbarMobile.style.display = 'block';
        
        setTimeout(() => {
            navbarMobile.classList.add('navbar-mobile-active');
        }, 10);
        
        overlayNavbar.style.display = 'block';
    } else {
        menuBtn.children[1].classList.remove('uil-multiply');
        menuBtn.children[1].classList.add('uil-bars');
        
        navbarMobile.classList.remove('navbar-mobile-active');
        
        setTimeout(() => {
            navbarMobile.style.display = 'none';
        }, 400); 
        
        overlayNavbar.style.display = 'none';
    }
});
// #endregion Mobile menu

// #region Title animation
gsap.registerPlugin(SplitText);

document.fonts.ready.then(() => {
    let split = SplitText.create('.home-title', {type: 'words, chars'});

    gsap.from(split.chars, {
        delay: 0.5,
        yPercent: "random([-100, 100])",
        rotation: "random([-30, 30])",
        ease: "back.out",
        autoAlpha: 0,
        yoyo: true,
        stagger: {
            amount: 0.5,
            from: "random"
        }
    });
});
// #endregion Title animation

// #region About images animation
const getRandomCoordinate = (param) => {
    const result = gsap.utils.random([gsap.utils.random(-60, -50, 3), gsap.utils.random(50, 60, 3)]);
    return param == 1 ? Math.abs(result) : Math.abs(result) * -1;
};

const setupImageAboutAnimation = () => {
    // let counter = 0;
    ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.id && trigger.vars.id.startsWith('about-img')) {
            // counter++;
            trigger.kill();
        }
    });
    // console.log(`Removed ${counter} about images triggers`);

    const aboutImages = document.querySelectorAll('.wrapper-about-image');
    const galleryContainer = document.querySelector('.about-gallery-container');

    aboutImages.forEach(img => {
        const startRotation = gsap.utils.random(-30, 30, 5);
        const endRotation = gsap.utils.random(-10, 10);
        const startX = getRandomCoordinate(img.attributes['data-x'].value);
        const startY = getRandomCoordinate(img.attributes['data-y'].value);

        img.dataset.initialPercentageX = startX;
        img.dataset.initialPercentageY = startY;
        // const increaseFactor = 1.8;
        // console.log(`startX: ${startX}, initialPercentageX: ${img.dataset.initialPercentageX}`);
        // console.log(`startY: ${startY}, initialPercentageY: ${img.dataset.initialPercentageY}`);

        img.addEventListener('click', () => {
            const remainingImages = Array.from(aboutImages).filter(image => image !== img);
            // console.log('Restantes:', remainingImages, 'Actual:', img);
            let tl = gsap.timeline();
            tl.to(img, {
                xPercent: img.dataset.initialPercentageX,
                yPercent: img.dataset.initialPercentageY,
                opacity: 0,
                duration: 0.5,
                ease: 'back.in(1.7)',
            }).to(img, {
                xPercent: 0,
                yPercent: 0,
                duration: 0,
                zIndex: 3,
                rotation: "random([-10, 10, 2])"
            }).to(remainingImages, {
                zIndex: "+=1",
                duration: 0
            }).to(img, {
                opacity: 1,
                duration: 1
            })
        });

        gsap.fromTo(
            img,
            {
                opacity: 0,
                yPercent: startY,
                xPercent: startX,
                scale: 0.3,
                rotation: startRotation,
            },
            {
                scrollTrigger: {
                    id: img.attributes['data-prefix'].value,
                    trigger: galleryContainer,
                    start: '0 90%',
                    end: '90% 10%',
                    toggleActions: 'restart none none none',
                    // toggleActions: 'restart reverse restart reverse',
                    // markers: true
                },
                delay: 0.3,
                opacity: 1,
                yPercent: 0,
                xPercent: 0,
                scale: 1,
                rotation: endRotation,
                duration: 1.3,
                ease: 'power2.out'
            }
        );
    });
};
// #endregion About images animation


document.addEventListener('DOMContentLoaded', () => {
    setupNavAnimation();
});

//window.addEventListener('DOMContentLoaded', setupImageAboutAnimation);
 window.addEventListener('load', () => {
    setupImageAboutAnimation(); //necessary for images loading
    ScrollTrigger.refresh(); //necessary for ScrollTrigger to recalculate positions
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // console.log('Resized finished.');
        setupWhenResizeNav();
        setupImageAboutAnimation();
    }, 250);
});

// #endregion About images animation

// #region Skills overlay effect
const skillsSection = document.querySelector('skills-container');
const skillsContainer = document.querySelector('.skills-wrapper');
const cards = Array.from(document.querySelectorAll('.skill-panel'));
const overlay = document.querySelector('.overlay');

const applyOverlayEffect = (e) => {
    const overlayEl = e.currentTarget;
    const x = e.pageX - skillsContainer.offsetLeft;
    const y = e.pageY - skillsContainer.offsetTop;

    overlayEl.style = `--opacity: 1; --x: ${x}px; --y: ${y}px;`;
}

const createOverlayTitle = (overlayCard, titleEl) => {
    const overlayTitle = document.createElement('h2');
    overlayTitle.classList.add('skill-title');
    overlayTitle.textContent = titleEl.textContent;
    overlayTitle.setAttribute("aria-hidden", true);
    overlayCard.appendChild(overlayTitle);
}

const observer = new ResizeObserver((entries) => {
    entries.forEach(entry => {
        const cardIndex = cards.indexOf(entry.target);
        let width = entry.borderBoxSize[0].inlineSize;
        let height = entry.borderBoxSize[0].blockSize;

        if (cardIndex >= 0) {
            overlay.children[cardIndex].style.width = `${width}px`;
            overlay.children[cardIndex].style.height = `${height}px`;
        }
    });
});

const initOverlayCard = (cardEl) => {
    const overlayCard = document.createElement('div');
    overlayCard.classList.add('skill-panel');
    createOverlayTitle(overlayCard, cardEl.querySelector('h2'));
    overlay.append(overlayCard);
    observer.observe(cardEl);
};

cards.forEach(initOverlayCard);
skillsContainer.addEventListener('mousemove', applyOverlayEffect);
let lastMouseX = 0;
let lastMouseY = 0;

skillsContainer.addEventListener('mousemove', (e) => {
    lastMouseX = e.pageX - skillsContainer.offsetLeft;
    lastMouseY = e.pageY - skillsContainer.offsetTop;
    applyOverlayEffect(e);
});

skillsContainer.addEventListener('mouseleave', (e) => {
    const overlayEl = e.currentTarget;
    // Update the overlay position to the last known mouse position
    overlayEl.style = `--opacity: 0; --x: ${lastMouseX}px; --y: ${lastMouseY}px;`;
});
// #endregion Skills overlay effect