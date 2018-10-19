import SetHoverEffects from './scr/hoverEffects.js';
import CustomSelect from './scr/customSelect.js';

let chBG = changeBgImageOnMobile();
chBG(document.documentElement.clientWidth);



new SetHoverEffects({
  wrapper: '.page-wrapper',
  tabsContainer: '.tabs-container',
  tabClass: '.tab',
  videoContainer: '.video-container',
  addedClasses: {
    active: 'tab--is-active',
    inactive: 'tab--inactive'
  },
  accentColor: '#e45871',
  elementsForAnimation: [
    {
      el: document.querySelector('.page-header'),
      animClass: 'page-header--isHover'
    },
    {
      el: document.querySelector('.benefits-container'),
      animClass: 'benefits-container--isHover'
    },
    {
      el: document.querySelector('.page-wrapper__overlayout'),
      animClass: 'page-wrapper__overlayout--isHover'
    }
  ],
  videoDelay: 2000
});


let cs = new CustomSelect({
  type: '.',
  container: 'lang-select__select',
  dataPrefix: 'cs-element',
  namespace:'cs-component',
  keyCodes: [13, 86],
  icon: ''
});

cs.init();


let selectView = setMobileViewLangField();


selectView(document.documentElement.clientWidth, cs);


function setMobileViewLangField() {
  let opts = document.querySelectorAll('.lang-select__select option');
  return function(size, selectLink) {
    if(opts && (size <= 640)) {
      [...opts].forEach(opt => {
        opt.setAttribute('data-use-alt-status', 'false');
      });
    }else{
      [...opts].forEach(opt => {
        opt.setAttribute('data-use-alt-status', 'true');
      });
    }
    selectLink.changeViewOnBrackpoints();
  };
}

function changeBgImageOnMobile() {
  let el = document.querySelector('.page-wrapper');
  let defaultImageURL = el.getAttribute('data-desctop-bg-image');//`${el.style.backgroundImage}`.split('"')[1];
  let mobileImageURL = el.getAttribute('data-mobile-bg-image');
  let wrapper = document.querySelector('.page-wrapper');
  return function(size) {
    let isVideoOn = wrapper.classList.contains('page-wraper--video-on');
    if( size < 640 && !isVideoOn ) {
      el.style.backgroundImage = `url(${mobileImageURL})`;
    }
    else if (size >= 640 && !isVideoOn) {
      el.style.backgroundImage = `url(${defaultImageURL})`;
    }
  };
}

function setResizeParameters() {
  window.addEventListener('resize', () => {
    let currentSize = document.documentElement.clientWidth;
    chBG(currentSize);
    selectView(currentSize, cs);
  }, false);
}

setResizeParameters();




