function setMobileViewLangField () {
  let opts = document.querySelectorAll('.lang-select__select option');
  console.log(23)
  if(opts){
    [...opts].forEach(opt => {
      opt.setAttribute('data-use-alt-status', 'false');
    });
  }else{
    return false;
  }
}

export default setMobileViewLangField;
