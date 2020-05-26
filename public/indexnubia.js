//Buy Ticket and buy CD -> About page
var buyTickets = document.getElementsByClassName('tour-btn')
for(var i =0; i < buyTickets.length; i++){
    var buyTicket = buyTickets[i];
    buyTicket.addEventListener('click', ticketPurchased);
}

function ticketPurchased(){
    alert('Thank you for purchasing our ticket/CD.')
}