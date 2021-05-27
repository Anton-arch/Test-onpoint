"use strict";

const slider = document.querySelector('.swiper');
const slides = Array.from(document.querySelectorAll('.swiper__slide'));
const slideWidth = document.querySelector('.swiper__slide').clientWidth;
const homePageLink = document.querySelector('.home-page__link');
const whatsNextLink = document.querySelector('.slide-first__link-next');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let currentIndex = 0;
slides.forEach((slide, index) => {
    // Touch events
    slide.addEventListener('touchstart', touchStart(index));
    slide.addEventListener('touchend', touchEnd);
    slide.addEventListener('touchmove', touchMove); // Mouse events

    slide.addEventListener('mousedown', touchStart(index));
    slide.addEventListener('mouseup', touchEnd);
    slide.addEventListener('mouseleave', touchEnd);
    slide.addEventListener('mousemove', touchMove);
}); // prevets context menu

window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

function touchStart(index) {
    return function (event) {
        currentIndex = index;
        startPos = getPositionX(event);
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        slider.classList.add('grabbing');
    };
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < slides.length - 1) {
        currentIndex++;
    }

    if (movedBy > 100 && currentIndex > 0) {
        currentIndex--;
    }

    setPositionByIndex();
    slider.classList.remove('grabbing');
}

function touchMove(event) {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    setSliderPosition();

    if (isDragging) {
        requestAnimationFrame(animation);
    }
}

function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)`;
    slider.style.transition = 'transform 0.3s ease-out';
    document.querySelectorAll('.layer-3-copy').forEach(item => {
        item.classList.add('active');
    });
}

function setPositionByIndex() {
    currentTranslate = currentIndex * -slideWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
}

homePageLink.addEventListener('click', () => {
    currentIndex = 0;
    setPositionByIndex();
});
whatsNextLink.addEventListener('click', () => {
    currentIndex = 1;
    setPositionByIndex();
});
document.querySelector('.slide-third__text-container_more-datails-link').addEventListener('click', () => {
    document.querySelector('.slide-third__modal_overlay').classList.remove('visually-hidden');
});
document.querySelector('.slide-third__modal_close').addEventListener('click', e => {
    document.querySelector('.slide-third__modal_overlay').classList.add('visually-hidden');
});
const listsItems = document.querySelectorAll('.slide-third__modal-swiper_slide-item');
let i = 0;
listsItems.forEach(item => {
    i++;
    let count = document.createElement('div');
    count.style.fontFamily = 'Gilroy';
    count.style.color = '#8cc9e8';
    count.style.fontWeight = '600';
    count.style.marginBottom = '6px';

    if (i < 10) {
        count.textContent = `0${i}`;
        item.prepend(count);
    } else {
        count.textContent = `${i}`;
        item.prepend(count);
    }
});
const modalSwiper = document.querySelector('.slide-third__modal-swiper');
const modalDots = document.querySelectorAll('.dot');
const modalSlides = document.querySelectorAll('.slide-third__modal-swiper_slide');
let modalCurrentIndex = 0;
const prevButton = document.querySelector('.previous');
const nextButton = document.querySelector('.next');

nextButton.onclick = function () {
    nextSlide();
};

prevButton.onclick = function () {
    previousSlide();
};

function nextSlide() {
    goToSlide(modalCurrentIndex + 1);
}

function previousSlide() {
    goToSlide(modalCurrentIndex - 1);
}

function goToSlide(n) {
    modalDots[modalCurrentIndex].className = 'dot';
    modalSlides[modalCurrentIndex].className = 'slide-third__modal-swiper_slide';
    modalCurrentIndex = (n + modalSlides.length) % modalSlides.length;
    modalSlides[modalCurrentIndex].className = 'slide-third__modal-swiper_slide modal-active-slide';
    modalDots[modalCurrentIndex].className = 'dot modal-active-dot';
}

let currentPosition;
const scroll = document.querySelector('.slide-second__scrollblock');
const viewport = document.querySelector('.slide-second__scrollbar_text');
const textBox = document.querySelector('.slide-second__scrollbar_text-container');
const scrollBar = document.querySelector('.slide-second__scrollblock_scrollbar');
const scroller = document.querySelector('.slide-second__scrollblock_scroller'); //Соотношение между размером окна в котором будет крутиться текст и размером самого текста
//нужно для динамического определения размера ползунка

const ratio = viewport.clientHeight / textBox.scrollHeight;
scroller.style.height = ratio * viewport.clientHeight + 'px'; // console.log(scrollBar.clientHeight)

function setCurrentPosition(event) {
    currentPosition = event.changedTouches[0].clientY - event.changedTouches[0].target.clientHeight;
    scroller.style.top = currentPosition + 'px';
    textBox.scrollTop = currentPosition / ratio;
}

scroller.addEventListener('touchstart', setCurrentPosition);
scroller.addEventListener('touchmove', setCurrentPosition);
scroller.addEventListener('touchend', setCurrentPosition);
textBox.addEventListener('scroll', () => {
    scroller.style.top = textBox.scrollTop * ratio + 'px';
});