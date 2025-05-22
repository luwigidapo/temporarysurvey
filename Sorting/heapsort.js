var beep = new Audio('beep.mp3');
var mouseclick = new Audio('Mouseclick.mp3');
var done = new Audio('wrong.mp3');

const HeapSortButton = document.querySelector(".HeapSort");
HeapSortButton.addEventListener('click', async function () {
    mouseclick.play();
    selectText.innerHTML = `Heap Sort (${sortOrder})..`;
    
    // Update info panels
    document.getElementById('algorithm-definition').innerHTML = `
        <p><strong>Heap Sort</strong> is a comparison-based sorting algorithm that uses a binary heap data structure.</p>
        <p><strong>How it works:</strong></p>
        <ol>
            <li>Build a max-heap (or min-heap) from the input data</li>
            <li>Swap the root element with the last element of the heap</li>
            <li>Reduce the heap size by 1 and heapify the root</li>
            <li>Repeat until the heap is empty</li>
        </ol>
        <p>This algorithm has an optimal O(n log n) time complexity.</p>
    `;
    
    document.getElementById('code_java').innerHTML = 
`void heapSort(int arr[]) {
    int n = arr.length;

    // Build heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // Extract elements from heap
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        // Heapify the reduced heap
        heapify(arr, i, 0);
    }
}

void heapify(int arr[], int n, int i) {
    int largest = i; // Initialize largest as root
    int l = 2 * i + 1;
    int r = 2 * i + 2;

    // If left child is larger than root
    if (l < n && arr[l] > arr[largest])
        largest = l;

    // If right child is larger than largest so far
    if (r < n && arr[r] > arr[largest])
        largest = r;

    // If largest is not root
    if (largest != i) {
        int swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;

        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}`;

    document.getElementById('time').innerHTML = 
`Time Complexity:
- Worst Case: O(n log n) - All cases
- Average Case: O(n log n) - All cases
- Best Case: O(n log n) - All cases

Space Complexity: O(1) - In-place sorting`;

    disableSortingBtn();
    disableSizeSlider();
    disableNewArrayBtn();
    resetCounters();
    startTimer();
    
    try {
        await HeapSort();
        if (!shouldReset) {
            done.play();
            selectText.innerHTML = `Sorting Complete!`;
            stopTimer();
        }
    } catch (e) {
        console.log("Sorting was interrupted");
    }
    
    enableSortingBtn();
    enableSizeSlider();
    enableNewArrayBtn();
});

async function HeapSort() {
    shouldReset = false;
    const barContainers = document.querySelectorAll('.bar-container');
    const n = barContainers.length;

    // Color definitions
    const originalColor = 'cyan';
    const heapifyColor = 'rgb(250, 5, 54)';
    const leftChildColor = 'rgb(245, 212, 24)';
    const rightChildColor = 'rgb(100, 200, 100)';
    const swapColor = 'orange';
    const sortedColor = 'rgb(0,255,0)';

    async function swap(index1, index2) {
        // Add swap indicators
        addComparisonIndicator(index1, "Swapping ⇄", swapColor);
        addComparisonIndicator(index2, "Swapping ⇄", swapColor);
        
        const tempHeight = barContainers[index1].querySelector('.bar').style.height;
        const tempText = barContainers[index1].querySelector('.bar-number').textContent;

        barContainers[index1].querySelector('.bar').style.height = barContainers[index2].querySelector('.bar').style.height;
        barContainers[index1].querySelector('.bar-number').textContent = barContainers[index2].querySelector('.bar-number').textContent;

        barContainers[index2].querySelector('.bar').style.height = tempHeight;
        barContainers[index2].querySelector('.bar-number').textContent = tempText;

        barContainers[index1].querySelector('.bar').style.background = swapColor;
        barContainers[index2].querySelector('.bar').style.background = swapColor;

        incrementSwap();
        await waitforme(delay);

        // Remove swap indicators
        removeComparisonIndicator(index1);
        removeComparisonIndicator(index2);

        barContainers[index1].querySelector('.bar').style.background = originalColor;
        barContainers[index2].querySelector('.bar').style.background = originalColor;
    }

    async function heapify(n, i) {
        if (shouldReset) {
            resetBarColors();
            removeComparisonIndicators();
            return;
        }

        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;

        // Highlight current node being heapified
        barContainers[largest].querySelector('.bar').style.background = heapifyColor;
        addComparisonIndicator(largest, "Heapify", heapifyColor);

        if (l < n) {
            // Highlight left child
            barContainers[l].querySelector('.bar').style.background = leftChildColor;
            addComparisonIndicator(l, "Left Child", leftChildColor);
            
            await waitforme(delay);
            incrementComparison();

            // Compare and update largest
            if (sortOrder === 'ascending' && parseInt(barContainers[l].querySelector('.bar-number').textContent) > parseInt(barContainers[largest].querySelector('.bar-number').textContent)) {
                largest = l;
                updateComparisonDisplay(
                    parseInt(barContainers[l].querySelector('.bar-number').textContent),
                    parseInt(barContainers[i].querySelector('.bar-number').textContent),
                    '>'
                );
            } else if (sortOrder === 'descending' && parseInt(barContainers[l].querySelector('.bar-number').textContent) < parseInt(barContainers[largest].querySelector('.bar-number').textContent)) {
                largest = l;
                updateComparisonDisplay(
                    parseInt(barContainers[l].querySelector('.bar-number').textContent),
                    parseInt(barContainers[i].querySelector('.bar-number').textContent),
                    '<'
                );
            }
        }

        if (r < n) {
            // Highlight right child
            barContainers[r].querySelector('.bar').style.background = rightChildColor;
            addComparisonIndicator(r, "Right Child", rightChildColor);
            
            await waitforme(delay);
            incrementComparison();

            // Compare and update largest
            if (sortOrder === 'ascending' && parseInt(barContainers[r].querySelector('.bar-number').textContent) > parseInt(barContainers[largest].querySelector('.bar-number').textContent)) {
                largest = r;
                updateComparisonDisplay(
                    parseInt(barContainers[r].querySelector('.bar-number').textContent),
                    parseInt(barContainers[largest].querySelector('.bar-number').textContent),
                    '>'
                );
            } else if (sortOrder === 'descending' && parseInt(barContainers[r].querySelector('.bar-number').textContent) < parseInt(barContainers[largest].querySelector('.bar-number').textContent)) {
                largest = r;
                updateComparisonDisplay(
                    parseInt(barContainers[r].querySelector('.bar-number').textContent),
                    parseInt(barContainers[largest].querySelector('.bar-number').textContent),
                    '<'
                );
            }
        }

        // Reset colors and indicators
        if (l < n) {
            barContainers[l].querySelector('.bar').style.background = originalColor;
            removeComparisonIndicator(l);
        }
        if (r < n) {
            barContainers[r].querySelector('.bar').style.background = originalColor;
            removeComparisonIndicator(r);
        }
        barContainers[i].querySelector('.bar').style.background = originalColor;
        removeComparisonIndicator(i);

        updateComparisonDisplay('', '', '');

        // If heap condition is violated, swap and recurse
        if (largest !== i) {
            await swap(i, largest);
            await heapify(n, largest);
        }
    }

    // Build max heap (rearrange array)
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (shouldReset) {
            resetBarColors();
            removeComparisonIndicators();
            return;
        }
        await heapify(n, i);
    }

    // Extract elements from the heap one by one
    for (let i = n - 1; i > 0; i--) {
        if (shouldReset) {
            resetBarColors();
            removeComparisonIndicators();
            return;
        }
        
        // Highlight the root and current last element
        addComparisonIndicator(0, "Root", heapifyColor);
        addComparisonIndicator(i, "Moving to sorted", sortedColor);
        
        await swap(0, i);
        barContainers[i].querySelector('.bar').style.background = sortedColor;
        
        // Remove indicators
        removeComparisonIndicator(0);
        removeComparisonIndicator(i);
        
        await heapify(i, 0);
    }

    if (!shouldReset) {
        barContainers[0].querySelector('.bar').style.background = sortedColor;
        // Final coloring
        barContainers.forEach(container => {
            container.querySelector('.bar').style.background = sortedColor;
        });
    }
}

// Helper functions for comparison indicators
function addComparisonIndicator(index, text, color) {
    // First remove any existing indicator at this position
    removeComparisonIndicator(index);
    
    const barContainer = document.querySelectorAll('.bar-container')[index];
    if (!barContainer) return null;
    
    const indicator = document.createElement('div');
    indicator.className = 'comparison-indicator';
    indicator.textContent = text;
    indicator.style.position = 'absolute';
    indicator.style.top = '-25px';
    indicator.style.left = '50%';
    indicator.style.transform = 'translateX(-50%)';
    indicator.style.backgroundColor = color || '#333';
    indicator.style.color = 'white';
    indicator.style.padding = '2px 5px';
    indicator.style.borderRadius = '3px';
    indicator.style.fontSize = '12px';
    indicator.style.zIndex = '10';
    indicator.style.whiteSpace = 'nowrap';
    
    // Add arrow
    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.bottom = '-8px';
    arrow.style.left = '50%';
    arrow.style.transform = 'translateX(-50%)';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderLeft = '6px solid transparent';
    arrow.style.borderRight = '6px solid transparent';
    arrow.style.borderTop = `8px solid ${color || '#333'}`;
    
    indicator.appendChild(arrow);
    barContainer.appendChild(indicator);
    
    return indicator;
}

function removeComparisonIndicator(index) {
    const barContainer = document.querySelectorAll('.bar-container')[index];
    if (!barContainer) return;
    
    const indicator = barContainer.querySelector('.comparison-indicator');
    if (indicator) {
        barContainer.removeChild(indicator);
    }
}

function removeComparisonIndicators() {
    document.querySelectorAll('.comparison-indicator').forEach(indicator => {
        indicator.parentNode?.removeChild(indicator);
    });
}

function resetBarColors() {
    const bars = document.querySelectorAll('.bar');
    bars.forEach(el => {
        el.style.background = '';
    });
}