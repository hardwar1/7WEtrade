"use strict";

document.addEventListener("DOMContentLoaded", function () {
  function qOne(selector) {
    return document.querySelector(selector);
  }

  function qAll(selector) {
    return document.querySelectorAll(selector);
  }

  window.addEventListener("keydown", (e) => {
    if (e.key == "Escape") closePopaps();
  });

  function closePopaps() {
    for (let i of jsHide) i.classList.remove("active");
    overlay.classList.remove("overlay--active");
  }

  //burger mobile menu
  const burger = qOne(".burger"),
    menu = qOne(".menu"),
    overlay = qOne(".overlay"),
    jsHide = qAll(".js-hide");

  overlay.addEventListener("click", () => closePopaps());

  burger.addEventListener("click", function () {
    this.classList.toggle("burger--close");
    menu.classList.toggle("header__menu--show");
  });

  menu.addEventListener("click", function () {
    this.classList.remove("header__menu--show");
    burger.classList.remove("burger--close");
  });

  // скроллы якорных ссылок
  const header = qOne(".header"),
    toTop = qOne(".to-top");

  let scrollTop,
    top = 0;

  window.addEventListener("scroll", function () {
    scrollTop = window.scrollY;

    if (scrollTop > 100) {
      header.classList.add("header--scroll");
    } else {
      header.classList.remove("header--scroll");
    }

    if (top < scrollTop && top > 500 && !qOne(".header__menu--show")) {
      header.classList.add("header--hide");
      top = scrollTop;
    } else {
      header.classList.remove("header--hide");
      top = scrollTop;
    }

    if (scrollTop > 1000) {
      toTop.classList.add("to-top--show");
    } else {
      toTop.classList.remove("to-top--show");
    }
  });

  // скроллы якорных ссылок
  const anchors = [].slice.call(document.querySelectorAll('a[href*="#"]')),
    animationTime = 1000,
    framesCount = 200;

  anchors.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      let coordY =
        document
          .querySelector(item.getAttribute("href"))
          .getBoundingClientRect().top + window.pageYOffset;

      let scroller = setInterval(function () {
        // скорость прокрутки
        let scrollBy = 12;
        if (Math.abs(window.pageYOffset - coordY) < scrollBy) {
          window.scrollTo(0, coordY);
          clearInterval(scroller);
        } else if (scrollBy < window.pageYOffset - coordY) {
          window.scrollBy(0, -scrollBy);
        } else if (scrollBy > window.pageYOffset - coordY) {
          window.scrollBy(0, scrollBy);
        }
      }, animationTime / framesCount);
    });
  });

  // слайдеры
  if (qOne(".swiper")) {
    const swiper = new Swiper(".swiper", {
      slidesPerView: 1,

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return '<li class="' + className + '"> </li>';
        },
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    //перемещение на центр контрольных кнопок и дотсов
    const swiperControlsWrapper = qAll(".swiper-controls-wrapper");

    for (let item of swiperControlsWrapper) {
      item.closest("section").insertAdjacentHTML(
        "beforeend",
        `
        <div class="swiper-controls-wrapper js-fake-dots">
          <button class="swiper-controls-wrapper__arrow js-left" type="button"></button>
          ${item.innerHTML}
          <button class="swiper-controls-wrapper__arrow js-right" data-change="1" type="button"></button>
        </div>
        `
      );
    }

    // кнопки и дотсы слайдера
    let clickDots = [];
    let clickDotsArrays = qAll(".js-fake-dots");

    for (let dots of clickDotsArrays) {
      clickDots = clickDots.concat(
        dots.querySelectorAll(".swiper-pagination-bullet")
      );
    }

    const btnArrows = qAll(".swiper-controls-wrapper__arrow");

    function changeSlide(btnArr) {
      for (let item of btnArr) {
        const dots = item
          .closest(".swiper-controls-wrapper")
          .querySelectorAll(".swiper-pagination-bullet");
        let currentSlide = 0;
        const originalDots = item
            .closest("section")
            .querySelector(".swiper")
            .querySelectorAll(".swiper-pagination-bullet"),
          fakedDots = item
            .closest(".swiper-controls-wrapper")
            .querySelectorAll("li");

        //изменение вида текущего фейкдотса
        let mutationObserver = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            for (let i = 0; i < originalDots.length; i++) {
              fakedDots[i].classList.remove("swiper-pagination-bullet-active");

              if (
                originalDots[i].classList.contains(
                  "swiper-pagination-bullet-active"
                )
              ) {
                currentSlide = i;
                fakedDots[i].classList.add("swiper-pagination-bullet-active");
              }
            }
          });
        });
        for (let i of originalDots) {
          mutationObserver.observe(i, {
            attributes: true,
            attributeOldValue: true,
          });
        }

        item.addEventListener("click", function () {
          function checkCurrentSlide() {}
          // проверка текущего слайда

          // обработка клика по кнопкам и отображение текущего дотса
          if (
            item.getAttribute("data-change") &&
            currentSlide + 1 < dots.length
          ) {
            originalDots[currentSlide + 1].click();
            currentSlide++;
          } else if (!item.getAttribute("data-change") && currentSlide > 0) {
            originalDots[currentSlide - 1].click();
            currentSlide--;
          }

          // обработка клика по дотсам
          for (let array of clickDots) {
            for (let index = 0; index < array.length; index++) {
              array[index].addEventListener("click", function () {
                let originalDots = array[index]
                  .closest("section")
                  .querySelector(".swiper")
                  .querySelectorAll(".swiper-pagination-bullet");
                originalDots[index].click();
              });
            }
          }
        });
      }
    }

    changeSlide(btnArrows);
  }

  // открытие форм попапов
  if (qOne(".js-reg")) {
    const jsRegister = qOne(".js-register"),
      jsRegBtn = qAll(".js-reg");
    jsRegBtn.forEach((el) => {
      el.addEventListener("click", () => {
        closePopaps();
        jsRegister.classList.toggle("active");
        overlay.classList.toggle("overlay--active");
      });
    });
  }

  if (qOne(".js-log")) {
    const jsLogin = qOne(".js-login"),
      jsLogBtn = qAll(".js-log");

    jsLogBtn.forEach((el) => {
      el.addEventListener("click", () => {
        closePopaps();
        jsLogin.classList.toggle("active");
        overlay.classList.toggle("overlay--active");
      });
    });
  }

  //табы в блоге
  if (qOne(".articles-tabs__btn")) {
    const articlesTabsBtn = qAll(".articles-tabs__btn"),
      articles = qAll(".article");

    for (let i = 0; i < articlesTabsBtn.length; i++) {
      articlesTabsBtn[i].addEventListener("click", () => {
        for (let item of articlesTabsBtn) {
          item.classList.remove("articles-tabs__btn--active");
        }
        for (let item of articles) {
          item.classList.remove("article--active");
        }
        articlesTabsBtn[i].classList.add("articles-tabs__btn--active");
        articles[i].classList.add("article--active");
      });
    }

    //адаптив кнопка показа меню
    const showMenuBtn = qOne(".articles-tabs__show-menu"),
      tabsMenu = qOne(".articles-tabs__menu");

    showMenuBtn.addEventListener("click", () => {
      showMenuBtn.classList.toggle("active");
      tabsMenu.classList.toggle("active");
      overlay.classList.toggle("overlay--active");
    });
  }

  //попапы с формами
  if (qOne(".popap-form")) {
    const formFieldset = qAll(".popap-form__page"),
      progressbarItem = qAll(".progressbar__item"),
      next = qAll(".js-next"),
      previous = qAll(".js-previous"),
      progressbar = qOne(".progressbar");

    //ширина прогрессбара зависящая от количества страничек
    progressbar.style.width = `${progressbarItem.length * 68 - 68}px`;

    //клик по кнопке вперед
    for (let i = 0; i < next.length; i++) {
      next[i].addEventListener("click", () => {
        formFieldset[i].classList.remove("popap-form__page--active");
        progressbar.style.setProperty(
          "--progressbar-width",
          persent(i + 1, formFieldset)
        );
        formFieldset[i + 1].classList.add("popap-form__page--active");
        progressbarItem[i + 1].classList.add("progressbar__item--active");

        progressbarItem[i + 1].classList.add("progressbar__item--text");
        progressbarItem[i].classList.remove("progressbar__item--text");
      });
    }

    //клик по кнопке назад
    for (let i = 0; i < previous.length; i++) {
      previous[i].addEventListener("click", () => {
        formFieldset[i].classList.add("popap-form__page--active");
        progressbar.style.setProperty(
          "--progressbar-width",
          persent(i, formFieldset)
        );
        formFieldset[i + 1].classList.remove("popap-form__page--active");
        progressbarItem[i + 1].classList.remove("progressbar__item--active");
        progressbarItem[i + 1].classList.remove("progressbar__item--text");
        progressbarItem[i].classList.add("progressbar__item--text");
      });
    }

    // линия прогресса и функция вычисления %
    const progress = () => {
      progressbar.style.setProperty(
        "--progressbar-width",
        persent(i, formFieldset)
      );
    };

    const persent = (item, arr) => {
      return `${(item / (arr.length - 1)) * 100}%`;
    };

    // расположение элементов в прогрессбаре
    for (let i = 0; i < progressbarItem.length; i++) {
      progressbarItem[i].style.setProperty("left", persent(i, progressbarItem));
    }
  }

  //кастомный селект
  if (qOne(".select")) {
    const selectHeader = qAll(".select__header");
    if (selectHeader) {
      for (let item of selectHeader) {
        let select = item.closest(".select");
        let options = select.querySelectorAll("option");

        select.querySelector("span").innerText = options[0].innerText;

        for (let option of options) {
          option
            .closest(".select")
            .querySelector(
              "ul"
            ).innerHTML += `<li class="select__item">${option.innerText}</li>`;

          if (option.hasAttribute("selected")) {
            option.closest(".select").querySelector("span").innerText =
              option.innerText;
          }
        }

        let selectItem = select.querySelectorAll("li");
        for (let i = 0; i < selectItem.length; i++) {
          selectItem[i].addEventListener("click", () => {
            select.querySelector("select").value = selectItem[i].innerText;
            select.querySelector(".select__current").innerText =
              selectItem[i].innerText;
            select.classList.remove("select--active");
          });
        }

        item.addEventListener("click", function () {
          this.closest(".select").classList.toggle("select--active");
        });
      }
    }
  }

  // маска телефона по умолчанию +7
  function maskPhone(selector, masked = "+7 (___) ___-__-__") {
    const elems = document.querySelectorAll(selector);

    function mask(event) {
      const keyCode = event.keyCode;
      const template = masked,
        def = template.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, "");
      let i = 0,
        newValue = template.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
      i = newValue.indexOf("_");
      if (i !== -1) {
        newValue = newValue.slice(0, i);
      }
      let reg = template
        .substr(0, this.value.length)
        .replace(/_+/g, function (a) {
          return "\\d{1," + a.length + "}";
        })
        .replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (
        !reg.test(this.value) ||
        this.value.length < 5 ||
        (keyCode > 47 && keyCode < 58)
      ) {
        this.value = newValue;
      }
      if (event.type === "blur" && this.value.length < 5) {
        this.value = "";
      }
    }

    for (const elem of elems) {
      elem.addEventListener("input", mask);
      elem.addEventListener("focus", mask);
      elem.addEventListener("blur", mask);
    }
  }
  maskPhone("[type=tel]");
});
