class Carousel {
  constructor(carouselElement) {
    this._carouselElement = carouselElement;
  }

  //indicators are the dots in the buttom of the carousel
  _changeIndicator(direction) {
    const carouselIndicator = this._carouselElement.querySelectorAll('.carousel__indicator');
    if (direction > 0) {
      carouselIndicator[this._counter - 1].classList.remove('carousel__indicator_active');
      carouselIndicator[this._counter].classList.add('carousel__indicator_active');
    }
    if (direction < 0) {
      carouselIndicator[this._counter + 1].classList.remove('carousel__indicator_active');
      carouselIndicator[this._counter].classList.add('carousel__indicator_active');
    }
    if (direction === 0) {
      carouselIndicator[this._counter].classList.remove('carousel__indicator_active');
      carouselIndicator[0].classList.add('carousel__indicator_active');
    }
  }

  _rotate(direction) {
    const carouselTrack = this._carouselElement.querySelector('.carousel__track');
    carouselTrack.style.transition = "transform 0.6s ease-in-out";
    this._counter += direction;
    carouselTrack.style.transform = 'translateX(' + ( -this._sizeOfSlide * this._numberOfSlidesPerPage * this._counter ) + 'px)';
    this._changeIndicator(direction);
  }

  _restart() {
    const carouselTrack = this._carouselElement.querySelector('.carousel__track');
    carouselTrack.style.transition = "transform 0.6s ease-in-out";
    carouselTrack.style.transform = 'translateX(' + 0 + 'px)';
    this._changeIndicator(0);
    this._counter = 0;
  }

  //indicators are the dots in the buttom of the carousel
  _setIndicators() {
    const carouselTrack = this._carouselElement.querySelector('.carousel__track');
    const carouselIndicators = this._carouselElement.querySelector('.carousel__indicators');

    const button = [];
    for(let i=0; i < this._numberOfTransitions + 1; i++){
      button[i] = document.createElement("BUTTON");
      button[i].classList.add('carousel__indicator');
      carouselIndicators.appendChild(button[i]);
    }

    // new const "carouselIndicator" is created which contains all the new indicators created in the for loop
    const carouselIndicator = this._carouselElement.querySelectorAll('.carousel__indicator');

    carouselIndicator[0].classList.add('carousel__indicator_active');
    carouselTrack.style.transform = 'translateX(' + ( -this._sizeOfSlide * this._numberOfSlidesPerPage * this._counter ) + 'px)';
  }

  _setCarousel() {
    const carouselSlides = this._carouselElement.querySelectorAll('.carousel__slide');
    const carouselTrack = this._carouselElement.querySelector('.carousel__track');

    this._counter = 0;

    if(carouselTrack.classList.contains('carousel__track_type_statistics')) {
      if(screen.width > 768) {
        this._numberOfSlidesPerPage = 3;
      }
      else if(screen.width <= 768 && screen.width > 425) {
        this._numberOfSlidesPerPage = 2;
      }
      else {
        this._numberOfSlidesPerPage = 1;
      }
    }
    else {
      this._numberOfSlidesPerPage = 1;
    }
    const numOfSlides = carouselSlides.length;

    this._numberOfTransitions = Math.ceil(numOfSlides / this._numberOfSlidesPerPage) - 1;
    this._slidePersentageOutOfScreen = (1 / this._numberOfSlidesPerPage) * 100;
    const carouselOverflowWidth = Math.ceil(this._slidePersentageOutOfScreen * carouselSlides.length);
    carouselTrack.style.width = carouselOverflowWidth + "%";
    const carouselSlidesStyle = getComputedStyle(carouselSlides[0]);
    this._sizeOfSlide = carouselSlides[0].clientWidth + parseInt(carouselSlidesStyle.getPropertyValue('margin-right'), 10);
  }

  _setEventListeners() {
    const carouselTrack = this._carouselElement.querySelector('.carousel__track');
    const prevButton = this._carouselElement.querySelector('.carousel__slide-button_type_prev');
    const nextButton = this._carouselElement.querySelector('.carousel__slide-button_type_next');
    //Button Listeners
    nextButton.addEventListener('click', () => {
      carouselTrack.style.animationPlayState = "paused";
      if(this._counter >= this._numberOfTransitions) { return;}
      this._rotate(1);
    });

    prevButton.addEventListener('click', () => {
      carouselTrack.style.animationPlayState = "paused";
      if(this._counter <= 0) { return; }
      this._rotate(-1);
    });

    //Hover Listeners
    carouselTrack.addEventListener("mouseover", () => {
      carouselTrack.style.animationPlayState = "paused";
    });

    carouselTrack.addEventListener("mouseout", () => {
      carouselTrack.style.animationPlayState = "running";
    });

    //Resize screen Listener
    window.addEventListener('resize', () => {
      //init carousel
      this._setCarousel();
      carouselTrack.style.transform = 'translateX(' + ( -this._sizeOfSlide * this._numberOfSlides * this._counter ) + 'px)';
      //init indicators
      const indicatorList = Array.from(this._carouselElement.querySelectorAll('.carousel__indicator'));
      indicatorList.forEach((indicatorElement) => {
        indicatorElement.remove();
      });
      this._setIndicators();
    });

  }

  _interval() {
    const carouselTrack = this._carouselElement.querySelector('.carousel__track');

    setInterval(() => {
      if(carouselTrack.style.animationPlayState !== "paused"){
        if(this._counter >= this._numberOfTransitions) {
          this._restart();
        }
        else {
          this._rotate(1);
        }
      }
    }, 8000);
  }

  generateCarousel() {
    this._setCarousel();
    this._setIndicators();
    this._setEventListeners();
    this._interval();
  }
}

export { Carousel };
