/* WRITE YOUR JS HERE... YOU MAY REQUIRE MORE THAN ONE JS FILE. IF SO SAVE IT SEPARATELY IN THE SCRIPTS DIRECTORY */
function createTimeBlock(start, end, color) {
    const block = document.createElement('div');
    block.classList.add('time-block');
    block.style.backgroundColor = color;
    block.style.width = `${(end - start) * 10}px`; // Scale width based on time duration
    block.style.left = `${start * 10}px`; // Position based on start time
    block.textContent = `${start}:00 - ${end}:00`;
    document.querySelector('.timeline-container').appendChild(block);
}

// Example usage
createTimeBlock(9, 17, '#ff7043'); // Orange block from 9 AM to 5 PM

