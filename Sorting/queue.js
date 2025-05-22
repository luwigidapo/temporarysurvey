const queueVisual = document.querySelector("#queue-visual");
const sizeValue = document.querySelector("#size_value");
const queueInput = document.querySelector("#queue-input");
const enqueueBtn = document.querySelector("#enqueue-btn");
const dequeueBtn = document.querySelector("#dequeue-btn");
const clearBtn = document.querySelector("#clear-btn");
const backBtn = document.querySelector("#back-btn");
const maximizeBtn = document.querySelector("#maximize-btn");
const statusDisplay = document.querySelector("#status");
const speedSlider = document.querySelector("#speed-slider");
const widthInput = document.querySelector("#width-input");
const heightInput = document.querySelector("#height-input");

// Animation controls
const skipBackBtn = document.querySelector("#skip-back-btn");
const stepBackBtn = document.querySelector("#step-back-btn");
const pauseBtn = document.querySelector("#pause-btn");
const stepForwardBtn = document.querySelector("#step-forward-btn");
const skipForwardBtn = document.querySelector("#skip-forward-btn");
const changeCanvasBtn = document.querySelector("#change-canvas-btn");
const moveControlsBtn = document.querySelector("#move-controls-btn");

class Queue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }

    enqueue(value) {
        const newNode = { value, next: null };
        if (!this.rear) {
            this.front = this.rear = newNode;
        } else {
            this.rear.next = newNode;
            this.rear = newNode;
        }
        this.size++;
    }

    dequeue() {
        if (!this.front) return null;
        const value = this.front.value;
        this.front = this.front.next;
        if (!this.front) this.rear = null;
        this.size--;
        return value;
    }

    clear() {
        this.front = this.rear = null;
        this.size = 0;
    }

    toArray() {
        const array = [];
        let current = this.front;
        while (current) {
            array.push(current.value);
            current = current.next;
        }
        return array;
    }
}

const queue = new Queue();
let animationSpeed = 500; // Default speed
let animationQueue = [];
let isAnimating = false;
let isPaused = false;
let currentAnimation = null;

// Audio effects
var enqueueSound = new Audio('beep.mp3');
var dequeueSound = new Audio('wrong.mp3');

function updateQueueVisualization() {
    // Clear the queue visualization
    while (queueVisual.firstChild) {
        queueVisual.removeChild(queueVisual.firstChild);
    }
    
    // Update the size display
    sizeValue.textContent = queue.size;
    
    const nodes = queue.toArray();
    if (nodes.length === 0) {
        statusDisplay.textContent = "Queue is empty";
        return;
    }

    const containerWidth = queueVisual.clientWidth;
    const containerHeight = queueVisual.clientHeight;
    const nodeSpacing = 100;
    const startX = (containerWidth - (nodes.length * nodeSpacing)) / 2;
    
    // Create nodes and links
    nodes.forEach((value, index) => {
        const node = document.createElement("div");
        node.className = 'node';
        if (index === 0) node.classList.add('front');
        if (index === nodes.length - 1) node.classList.add('rear');
        node.textContent = value;
        node.style.left = `${startX + index * nodeSpacing}px`;
        node.style.top = `${containerHeight / 2 - 30}px`;
        queueVisual.appendChild(node);

        // Add front/rear pointers
        if (index === 0) {
            const frontPointer = document.createElement("div");
            frontPointer.className = 'pointer front';
            frontPointer.textContent = 'Front';
            frontPointer.style.left = `${startX + index * nodeSpacing + 30}px`;
            queueVisual.appendChild(frontPointer);
        }
        if (index === nodes.length - 1) {
            const rearPointer = document.createElement("div");
            rearPointer.className = 'pointer rear';
            rearPointer.textContent = 'Rear';
            rearPointer.style.left = `${startX + index * nodeSpacing + 30}px`;
            queueVisual.appendChild(rearPointer);
        }

        // Add links between nodes
        if (index < nodes.length - 1) {
            const link = document.createElement("div");
            link.className = 'link';
            const linkLength = nodeSpacing - 60;
            link.style.width = `${linkLength}px`;
            link.style.left = `${startX + index * nodeSpacing + 60}px`;
            link.style.top = `${containerHeight / 2}px`;
            queueVisual.appendChild(link);

            const arrow = document.createElement("div");
            arrow.className = 'arrow';
            arrow.style.left = `${startX + index * nodeSpacing + 60 + linkLength - 12}px`;
            arrow.style.top = `${containerHeight / 2 - 8}px`;
            queueVisual.appendChild(arrow);
        }
    });

    statusDisplay.textContent = "Queue visualization updated";
}

function animateEnqueue(value) {
    statusDisplay.textContent = `Enqueuing ${value}...`;
    return new Promise((resolve) => {
        // Animation steps would go here
        queue.enqueue(value);
        updateQueueVisualization();
        enqueueSound.play();
        setTimeout(() => {
            statusDisplay.textContent = `Enqueued ${value}`;
            resolve();
        }, animationSpeed);
    });
}

function animateDequeue() {
    statusDisplay.textContent = "Dequeuing...";
    return new Promise((resolve) => {
        const value = queue.dequeue();
        updateQueueVisualization();
        dequeueSound.play();
        setTimeout(() => {
            statusDisplay.textContent = value ? `Dequeued ${value}` : "Queue is empty";
            resolve(value);
        }, animationSpeed);
    });
}

function clearQueue() {
    if (queue.size === 0) {
        alert("Queue is already empty");
        return;
    }
    
    if (confirm("Are you sure you want to clear the queue?")) {
        queue.clear();
        updateQueueVisualization();
    }
}

// Event listeners
enqueueBtn.addEventListener('click', function() {
    const value = queueInput.value.trim();
    if (value === "") {
        alert("Please enter a value to enqueue");
        return;
    }
    animateEnqueue(value);
    queueInput.value = "";
});

dequeueBtn.addEventListener('click', animateDequeue);
clearBtn.addEventListener('click', clearQueue);

// Allow pressing Enter to enqueue
queueInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const value = queueInput.value.trim();
        if (value !== "") {
            animateEnqueue(value);
            queueInput.value = "";
        }
    }
});

// Animation controls
speedSlider.addEventListener('input', function() {
    animationSpeed = 1000 - (this.value * 100);
});

pauseBtn.addEventListener('click', function() {
    isPaused = !isPaused;
    this.textContent = isPaused ? "Resume" : "Pause";
});

changeCanvasBtn.addEventListener('click', function() {
    queueVisual.style.width = `${widthInput.value}px`;
    queueVisual.style.height = `${heightInput.value}px`;
    updateQueueVisualization();
});

// Back button to return to sorting visualizer
backBtn.addEventListener('click', function() {
    window.location.href = 'sorting.html';
});

// Maximize button implementation
maximizeBtn.addEventListener('click', function() {
    document.getElementById('fullbody').classList.toggle('maximized');
    this.textContent = document.getElementById('fullbody').classList.contains('maximized') ? 
        'Minimize' : 'Maximize';
});

// Initialize with empty queue visualization
updateQueueVisualization();