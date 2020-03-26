function displayModalTiket() {
  $('.modal-tiket').show();
  $('.content-booking-ticket').css({zIndex: 1051});
}

function removeModalTiket() {
  $('.modal-tiket').hide();
  $('.content-booking-ticket').css({zIndex: 0});
}
