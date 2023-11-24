"use strict";

//  Elements
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollto = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const navLinksEl = document.querySelector(".nav__links");
const btnTabs = document.querySelectorAll(".operations__tab");
const btnTabContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const operationsContainer = document.querySelector(".operations");
const nav = document.querySelector(".nav");
const navLogo = document.querySelector(".nav__logo");
const header = document.querySelector(".header");
const sliderBtnLeft = document.querySelector(".slider__btn--left");
const sliderBtnRight = document.querySelector(".slider__btn--right");
const dotsContainer = document.querySelector(".dots");
const allSlides = document.querySelectorAll(".slide");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btnModal) => {
  btnModal.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
// button smooth scrolling
btnScrollto.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
//page navigation

// most efficient using event delegation
navLinksEl.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains("nav__link") &&
    e.target.classList.length === 1
  ) {
    document
      .querySelector(e.target.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  }
});

// document.querySelectorAll(".nav__link").forEach(function (link) {
//   link.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = link.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

///////////////////////////////////////
//Tabbed Component
btnTabContainer.addEventListener("click", function (e) {
  if (e.target !== e.currentTarget) {
    const clicked = e.target.closest(".operations__tab");
    btnTabs.forEach(function (btnTab) {
      btnTab.classList.remove("operations__tab--active");
    });
    clicked.classList.add("operations__tab--active");

    //activate and display selected operation box
    tabsContent.forEach(function (tabcontent) {
      tabcontent.classList.remove("operations__content--active");
    });
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add("operations__content--active");
  }
});

///////////////////////////////////////
//Menu Fade Animate
const handlerHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    nav.querySelectorAll(".nav__link").forEach((link) => {
      if (link !== e.target) {
        link.style.opacity = this;
      }
      navLogo.style.opacity = this;
    });
  }
};

nav.addEventListener("mouseover", handlerHover.bind(0.5));

nav.addEventListener("mouseout", handlerHover.bind(1));

///////////////////////////////////////
//Sticky Navigation

//bad practice way
// const section1Coords = section1.getBoundingClientRect();

// window.addEventListener("scroll", () => {
//   if (window.scrollY > section1Coords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });

//Good practice
// using intersection observer API
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting === false) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  });
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerobserver = new IntersectionObserver(stickyNav, obsOptions);
headerobserver.observe(header);

///////////////////////////////////////
//Reveal elements on scrolling
const allSections = document.querySelectorAll(".section");

const revealSections = function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting === true) {
      entry.target.classList.remove("section--hidden");
      observer.unobserve(entry.target);
    }
  });
};

const sectionsObsOptions = {
  root: null,
  threshold: 0.1,
};

const sectionsObserver = new IntersectionObserver(
  revealSections,
  sectionsObsOptions
);

allSections.forEach((section) => {
  sectionsObserver.observe(section);
  section.classList.add("section--hidden");
});

///////////////////////////////////////
//Lazy Loading Images
const allLazyImages = document.querySelectorAll(".features__img");

const lazyLoading = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting === true) {
    entry.target.setAttribute("src", `${entry.target.dataset.src}`);
    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });
    observer.unobserve(entry.target);
  }
};

const lazyObserver = new IntersectionObserver(lazyLoading, {
  root: null,
  threshold: 0.7,
});

allLazyImages.forEach((lazyImage) => {
  lazyObserver.observe(lazyImage);
});

///////////////////////////////////////
//Slider componenet
const sliderComponent = function () {
  let clickCounter = 0;
  const maxslides = allSlides.length - 1;

  //functions
  const intialSlider = function () {
    allSlides.forEach(function (slide, i) {
      slide.style.transform = `translateX(${i * 100}%)`;
    });
  };

  const leftSliderInitial = function () {
    allSlides.forEach(function (slide, i) {
      slide.style.transform = `translateX(${(i - maxslides) * 100}%)`;
    });
  };

  const activateDot = function (slideNumber) {
    document.querySelectorAll(".dots__dot").forEach(function (dot) {
      dot.classList.remove("dots__dot--active");
    });
    document
      .querySelector(`.dots__dot[data-slide="${slideNumber}"]`)
      .classList.add("dots__dot--active");

    clickCounter = slideNumber;
  };

  const createDots = function () {
    allSlides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const init = function () {
    createDots();
    intialSlider();
    activateDot(0);
  };

  //start intial conditions
  init();

  //slider main functions
  const nextSlider = function () {
    clickCounter++;
    if (clickCounter > maxslides) {
      intialSlider();
      clickCounter = 0;
    } else {
      allSlides.forEach((slide, i) => {
        const translateVal =
          Number.parseInt(`${slide.style.transform.slice(11)}`, 10) - 100;
        slide.style.transform = `translateX(${translateVal}%)`;
      });
    }
    activateDot(clickCounter);
  };

  const previousSlider = function () {
    clickCounter--;
    if (clickCounter < 0) {
      leftSliderInitial();
      clickCounter = maxslides;
    } else {
      allSlides.forEach((slide) => {
        const translateVal =
          Number.parseInt(`${slide.style.transform.slice(11)}`, 10) + 100;
        slide.style.transform = `translateX(${translateVal}%)`;
      });
    }
    activateDot(clickCounter);
  };

  //Event handlers

  sliderBtnRight.addEventListener("click", nextSlider);
  sliderBtnLeft.addEventListener("click", previousSlider);

  //keyboard left&right arrows
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      previousSlider();
    }
    if (e.key === "ArrowRight") {
      nextSlider();
    }
  });

  //dots
  const allDots = document.querySelectorAll(".dots__dot");
  allDots.forEach((dot) => {
    //listen to click event to all dots
    dot.addEventListener("click", function (e) {
      allSlides.forEach((slide, i) => {
        slide.style.transform = `translateX(${
          i * 100 - e.target.dataset.slide * 100
        }%)`;
      });
      activateDot(e.target.dataset.slide);
    });
  });
};

sliderComponent();

//////////////////mobile nav////////////////
// const navMobile = document.querySelector(".nav__icon");
const navMobileOpen = document.querySelector(".nav__icon--open");
const navMobileClose = document.querySelector(".nav__icon--close");

navMobileClose.classList.add("hidden");

navMobileOpen.addEventListener("click", function () {
  navLinksEl.classList.add("nav--open");
  navMobileOpen.classList.add("hidden");
  navMobileClose.classList.remove("hidden");
});

navMobileClose.addEventListener("click", function () {
  navLinksEl.classList.remove("nav--open");
  navMobileClose.classList.add("hidden");
  navMobileOpen.classList.remove("hidden");
});

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

//////LECTURES//////////

///////////////////////////////////////

///////////////selecting, creating and Deleting Elements/////////////

//selecting
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// console.log(document.querySelector(".section"));
// console.log(document.querySelectorAll(".section"));

// console.log(document.getElementById("section--1"));

// const allButtons = document.getElementsByTagName("button");
// console.log(allButtons);

// console.log(document.getElementsByClassName("btn"));

// //creating elements
// const header = document.querySelector(".header");
// const message = document.createElement("div");
// message.classList.add("cookie-message");
// message.innerHTML = `we use cookied for improved functionality <button class="btn btn--close-cookie">Get it</button>`;
// // header.prepend(message);
// // header.append(message.cloneNode(true));
// header.append(message);

// // header.before(message);
// // header.after(message);

// //Delete Elements
// document
//   .querySelector(".btn--close-cookie")
//   .addEventListener("click", function () {
//     message.remove();
//     // message.parentElement.removeChild(message);    //old way
//   });

///////////////styles, Attributes and classes/////////////

//Styles
// message.style.backgroundColor = "#37383d";
// message.style.width = "120%";

// // console.log(message.style.height);
// console.log(message.style.backgroundColor);

// // console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height = `${
//   parseFloat(getComputedStyle(message).height, 10) + 30
// }px`;
// console.log(getComputedStyle(message).height);

// //custom styles
// // document.documentElement.style.setProperty("--color-primary", "orangered");

// //Attributes
// const logo = document.querySelector(".nav__logo");
// console.log(logo.alt);
// console.log(logo.src);

// //non-standard attribute
// console.log(logo.getAttribute("designer"));

// //set attributes
// logo.alt = "beautiful bankist";
// logo.setAttribute("company", "bankist");

// //data attributes
// console.log(logo.dataset.versionNumber);

///////////////Implementing smooth scrolling/////////////

// const btnScrollto = document.querySelector(".btn--scroll-to");
// const section1 = document.querySelector("#section--1");

// btnScrollto.addEventListener("click", function (e) {
//   // const section1Coords = section1.getBoundingClientRect();
//   // console.log(section1Coords);

//   // console.log(e.target.getBoundingClientRect());

//   // console.log(
//   //   "scroll postiions(x / y)",
//   //   window.pageXOffset,
//   //   window.pageYOffset
//   // );

//   // console.log(
//   //   "height/width viewport",
//   //   document.documentElement.clientHeight,
//   //   document.documentElement.clientWidth
//   // );

//   //scrolling old way
//   // window.scrollTo({
//   //   left: section1Coords.left + window.pageXOffset,
//   //   top: section1Coords.top + window.pageYOffset,
//   //   behavior: "smooth",
//   // });

//   // //scrolling modern way
//   section1.scrollIntoView({ behavior: "smooth" });
// });

///////////////Types of events and handlers/////////////
// const h1 = document.querySelector("h1");

// const alertH1 = function (e) {
//   alert("add Event listner worked!!!");
//   // h1.removeEventListener("mouseenter", alertH1);
// };

// h1.addEventListener("mouseenter", alertH1);
// setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 2000);

// // h1.onmouseenter = function () {
// //   alert("onmouseenter listner worked!!!");
// // };

///////////////Event propagation in practice/////////////
// const randomNumber = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomNumber(0, 255)},${randomNumber(0, 255)},${randomNumber(
//     0,
//     255
//   )})`;

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("link", e.target);
//   console.log(e.currentTarget);

//   //stop propagation
//   // e.stopPropagation();
// });

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("container", e.target);
//   console.log(e.currentTarget);
// });

// document.querySelector(".nav").addEventListener("click", function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("nav", e.target);
//   console.log(e.currentTarget);
// });

///////////////DOM Traversing/////////////

// // going Downwards: child
// const h1 = document.querySelector("h1");

// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// console.log(h1.children);

// h1.firstElementChild.style.color = "white";
// h1.lastElementChild.style.color = "red";

// // going Upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest(".header").style.background = "var(--gradient-secondary)";
// h1.closest(".header__title").style.background = "var(--color-tertiary)";
// h1.closest("h1").style.background = "pink";

// // goingSidewards: siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) {
//     el.style.transform = "scale(.5)";
//   }
// });

////////////DOM lifecycle events/////////////

// document.addEventListener("DOMContentLoaded", function (e) {
//   console.log("html parsed", e);
// });

// window.addEventListener("load", function (e) {
//   console.log("page finished loading", e);
// });

// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = "";
// });
