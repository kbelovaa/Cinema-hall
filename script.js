(async function() {
    const $total = document.getElementById('total');
    const $count = document.getElementById('count');
    const $moviePicker = document.getElementById('movie-picker');
    const $rows = document.querySelectorAll('.seats-row');

    let ticketPrice = 0;
    let selectedCount = 0;
    let selectedSeats = [];
    
    document.addEventListener('change', onMoviePickerChange);
    document.addEventListener('click', onSeatClick);
    
    populateUI();
    
    function onMoviePickerChange(e) {
        if (e.target === $moviePicker) {
            ticketPrice = +$moviePicker.value;
            
            localStorage.setItem('selectedMovie', $moviePicker.selectedIndex);
            
            updateTotal();
        }
    }

    function onSeatClick(e) {
        if (e.target.classList.contains('seat')) {
            e.target.classList.toggle('seat--selected');

            const $row = e.target.parentNode;
            const seatNumber = [...$row.children].indexOf(e.target);
            const $hall = $row.parentNode;
            const rowNumber = [...$hall.children].indexOf($row) - 1;

            if (e.target.classList.contains('seat--selected')) {
                selectedCount += 1;
                selectedSeats.push({rowNumber: rowNumber, seatNumber: seatNumber});
            } else {
                selectedCount -= 1;
                selectedSeats.splice(selectedSeats.findIndex(seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber), 1);
            }

            localStorage.setItem('seatsCount', selectedCount);
            localStorage.setItem('seatsCoords', JSON.stringify(selectedSeats));

            updateTotal();
        }
    }

    function updateTotal() {
        $count.innerText = selectedCount;
        $total.innerText = selectedCount * ticketPrice;
        selectedSeats.forEach(seat => {
            $rows[seat.rowNumber].children[seat.seatNumber].classList.add('seat--selected');
        });
    }

    function populateUI() {
        selectedCount = +localStorage.getItem('seatsCount') ?? 0;
        $moviePicker.selectedIndex = localStorage.getItem('selectedMovie') ?? 0;
        ticketPrice = +$moviePicker.value;
        if (localStorage.getItem('seatsCoords')) {
            selectedSeats = JSON.parse(localStorage.getItem('seatsCoords'));
        }
        updateTotal();
    }
})()
