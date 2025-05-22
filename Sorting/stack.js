const stackBody = document.querySelector("#stack-layout");
const sizeValue = document.querySelector("#size_value");
const stackInput = document.querySelector("#stack-input");
const pushBtn = document.querySelector("#push-btn");
const popBtn = document.querySelector("#pop-btn");
const clearBtn = document.querySelector("#clear-btn");
const backBtn = document.querySelector("#back-btn");
const maximizeBtn = document.querySelector("#maximize-btn");

let stack = [];
const MAX_SIZE = 15; 

const pushSound = new Audio('beep.mp3');
const popSound = new Audio('wrong.mp3');

function updateStackVisualization() {
    sizeValue.textContent = `${stack.length} / ${MAX_SIZE}`;
    const stackSlots = document.querySelectorAll(".stack-slot");
    const topBox = document.querySelector(".top-box");

    stackSlots.forEach(slot => {
        slot.textContent = '';
        slot.classList.remove('filled');
    });
    topBox.textContent = '';

    for (let i = 0; i < stack.length; i++) {
        const index = MAX_SIZE - i - 1;
        stackSlots[index].textContent = stack[i];
        stackSlots[index].classList.add('filled');
    }

    if (stack.length > 0) {
        topBox.textContent = stack[stack.length - 1];
    }
}

function pushToStack() {
    if (stack.length >= MAX_SIZE) return alert("Stack overflow!");
    const value = stackInput.value.trim();
    if (value === "") return alert("Please enter a value to push");
    
    // Create a temporary visual element (number) at the stackInput location
    const tempElement = document.createElement("div");
    tempElement.textContent = value;
    tempElement.style.position = 'absolute';
    tempElement.style.left = `${stackInput.getBoundingClientRect().left}px`;
    tempElement.style.top = `${stackInput.getBoundingClientRect().top}px`;
    tempElement.style.transition = 'all 0.5s ease';
    document.body.appendChild(tempElement);

    // Force reflow to ensure the element is in the DOM
    tempElement.getBoundingClientRect();

    // Calculate the final position (top box)
    const topBoxRect = document.querySelector(".top-box").getBoundingClientRect();
    tempElement.style.left = `${topBoxRect.left}px`;
    tempElement.style.top = `${topBoxRect.top}px`;
    tempElement.style.transform = 'scale(0)';

    stack.push(value);
    stackInput.value = '';

    setTimeout(() => {
        tempElement.remove();
        const slotIndex = MAX_SIZE - stack.length;
        const pushedSlot = document.querySelector(`.stack-row:nth-child(${slotIndex + 1}) .stack-slot`);
        pushedSlot.textContent = value;
        pushedSlot.classList.add('filled', 'highlight');
        updateStackVisualization();

        setTimeout(() => pushedSlot.classList.remove('highlight'), 500);

        pushSound.play();
    }, 500);
}

function popFromStack() {
    if (stack.length === 0) return alert("Stack underflow!");
    
    const poppedValue = stack.pop();
    alert(`Popped value: ${poppedValue}`);

    const topSlot = document.querySelector(`.stack-row:nth-child(${MAX_SIZE - stack.length}) .stack-slot`);

    const tempElement = document.createElement("div");
    tempElement.textContent = poppedValue;
    tempElement.style.position = 'absolute';
    tempElement.style.left = `${topSlot.getBoundingClientRect().left}px`;
    tempElement.style.top = `${topSlot.getBoundingClientRect().top}px`;
    tempElement.style.transition = 'all 0.5s ease';
    document.body.appendChild(tempElement);

    tempElement.getBoundingClientRect();

    const inputRect = stackInput.getBoundingClientRect();
    tempElement.style.left = `${inputRect.left}px`;
    tempElement.style.top = `${inputRect.top}px`;
    tempElement.style.transform = 'scale(0)';

    setTimeout(() => {
        tempElement.remove();
        updateStackVisualization();
    }, 500);

    popSound.play();
}

function clearStack() {
    if (stack.length === 0) return alert("Stack is already empty");
    if (!confirm("Are you sure you want to clear the stack?")) return;
    stack = [];
    updateStackVisualization();
}

pushBtn.addEventListener('click', pushToStack);
popBtn.addEventListener('click', popFromStack);
clearBtn.addEventListener('click', clearStack);

stackInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') pushToStack();
});

backBtn.addEventListener('click', () => window.location.href = 'sorting.html');

maximizeBtn.addEventListener('click', () => {
    document.getElementById('fullbody').classList.toggle('maximized');
    this.textContent = document.getElementById('fullbody').classList.contains('maximized') ? 'Minimize' : 'Maximize';
});

updateStackVisualization();
