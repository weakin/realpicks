export default function () {
  let top = window.scrollY
  if (top > 100 && top < 499) {
    $('html,body').animate({scrollTop: 0}, 250)
  } else if (top > 500 && top < 999) {
    $('html,body').animate({scrollTop: 0}, 500)
  } else if (top > 1000) {
    $('html,body').animate({scrollTop: 0}, 750)
  }
}

