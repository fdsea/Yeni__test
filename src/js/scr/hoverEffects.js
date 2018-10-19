class SetHoverEffects {
  constructor({wrapper, tabsContainer, tabClass, videoContainer, videoDelay, addedClasses, accentColor, elementsForAnimation = []}) {
    this.container = document.querySelector(tabsContainer);
    this.section = document.querySelector(wrapper);
    this.videoContainer = document.querySelector(videoContainer);
    this.tabsClass = tabClass;
    this.tabs = document.querySelectorAll(this.tabsClass);
    this.addedClasses = addedClasses;
    this.accentColor = accentColor;
    this.animElements = elementsForAnimation;
    this.containerDefaultBackground = this.section.getAttribute('data-desctop-bg-image');
    this.containerDefaultBackgroundOnMobile = this.section.getAttribute('data-mobile-bg-image');
    this.backgroundImages = [];
    this.stopID = null;
    this.videoDelay = videoDelay;
    this.setControllers();
  }
  getScreenWidth() {
    return document.documentElement.clientWidth;
  }
  setControllers() {
    [...this.tabs].forEach((tab) => {
      tab.addEventListener('mouseover', () => {
        this.setInactiveClass();
        this.setActiveClass(tab);
        this.setElementsAnimation('add');

        clearTimeout(this.stopID);

        this.stopID = setTimeout(() => {
          this.setVideoBackground(tab);
          this.videoContainer.style.opacity = '1';

          this.removeBackgroundImage();

          this.section.classList.add('page-wraper--video-on');
        }, this.videoDelay);

      });
      tab.addEventListener('mouseout', () => {
        clearTimeout(this.stopID);
        this.videoContainer.style.opacity = '0';
        this.section.classList.remove('page-wraper--video-on');
        this.setElementsAnimation('remove');
      });
    });
    this.container.addEventListener('mouseleave', () => {
      [...this.tabs].forEach(tab => {
        tab.classList.remove(this.addedClasses.inactive);
        tab.classList.remove(this.addedClasses.active);
      });
      this.videoContainer.style.opacity = '0';
      this.section.classList.remove('page-wraper--video-on');
      if(document.documentElement.clientWidth >= 640) {
        this.setBackgroundImageOnContainer(`url(${this.containerDefaultBackground})`);
      }else{
        this.setBackgroundImageOnContainer(`url(${this.containerDefaultBackgroundOnMobile})`);
      }
      this.setElementsAnimation('remove');
    });
  }
  setInactiveClass() {
    [...this.tabs].forEach(tab => {
      tab.classList.remove(this.addedClasses.active);
      tab.classList.add(this.addedClasses.inactive);
    });
  }
  setActiveClass(currentElement) {
    if( currentElement.classList.contains(`${this.tabsClass.slice(1)}`) ) {
      let bg = currentElement.getAttribute('data-bg-url');
      this.setBackgroundImageOnContainer(`url(${bg})`);
      currentElement.classList.remove(this.addedClasses.inactive);
      currentElement.classList.add(this.addedClasses.active);
    }else{
      return false;
    }
  }
  setVideoBackground(tab) {
    let currentURL = '';
    if(this.getScreenWidth() <= 630) {
      currentURL = tab.getAttribute('data-video-mobile-url');
    }else{
      currentURL = tab.getAttribute('data-video-url');
    }
    this.videoContainer.src = currentURL;
  }
  setElementsAnimation(action) {
    this.animElements.forEach(animElement => {
      animElement.el.classList[action](animElement.animClass);
    });
  }
  setBackgroundImageOnContainer(url) {
    this.section.style['background-image'] = url;
    this.section.style['background-color'] = this.accentColor;
  }
  removeBackgroundImage() {
    this.section.style['background-image'] = 'linear-gradient(transparent, transparent)';
    this.section.style['background-color'] = 'transparent';
  }
}

export default SetHoverEffects;
