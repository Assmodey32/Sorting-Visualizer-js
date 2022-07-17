const randomizeArray_btn = document.getElementById('randomize-array-btn');
const barsContainer = document.getElementById('bars-container');
const sort_btn = document.getElementById('array-sort-btn');
const selectSort_method = document.getElementById('select-sort-method');
const inputRange = document.getElementById('inputRange');
const inputNumber = document.getElementById('inputNumber');

// config
let numOfBars = 50;
const minValue = 50;
const maxValue = 1000;

// Bar colors
const barBackgroundColor = '#eee';
const barBackgroundColorTransition = '#E32636'
const barBackgroundColorSorted = '#8CCB5E';
const barBacjgroundColorAwait = '	#1E90FF'

const delay = 50;

let array = [];

// Events
document.addEventListener('DOMContentLoaded', () => {
  array = createRandomArray(numOfBars);
  drawBars(array);
});

randomizeArray_btn.addEventListener('click', () => {
  array = createRandomArray(numOfBars);
  drawBars(array);
});

sort_btn.addEventListener('click', () => {
  // selectionSort();
  // bubbleSort();
  // insertionSort();
  sort();

});

inputNumber.addEventListener('input', handleInput);
inputRange.addEventListener('input', handleInput);

function handleInput() {
  numOfBars = inputNumber.value;
  array = createRandomArray(numOfBars);
  drawBars(array);
}


function generateRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomArray(length) {
  let array = [];
  for (let i = 0; i < length; i++) {
    array.push(generateRandomInt(minValue, maxValue));
  }
  return array;
}



function createBar(value, maxValue, length) {
  let bar = document.createElement('div');
  bar.classList.add('bar');
  bar.style.height = `${value*100/maxValue}%`;
  bar.style.width = `${100/length}%`;
  return bar;
}

function drawBars(array) {
  barsContainer.innerHTML = '';

  let maxOfArray = Math.max(...array);

  for (let i = 0; i < array.length; i++) {
    let bar = createBar(array[i], maxOfArray, array.length);
    barsContainer.appendChild(bar);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sort() {
  let sortMethod = selectSort_method.value;
  switch (sortMethod) {
    case 'Bubble sort':
      bubbleSort();
      break;
    case 'Selection sort':
      selectionSort();
      break;
    case 'Insertion sort':
      insertionSort();
      break;
    case 'Quick sort':
      quickSort();
      break;
    case 'Merge sort':
      mergeSort();
      break;
    default:
      break;
  }
}

function rgbToHex(r, g, b) {
  return ((r << 16) | (g << 8) | b).toString(16);
}

async function bubbleSort() {
  sort_btn.disabled = true;
  let bars = document.querySelectorAll('.bar');
  for (let i = 0; i < array.length; ++i) {
    for (let j = 0; j < array.length - i - 1; ++j) {
      bars[j].style.backgroundColor = bars[j + 1].style.backgroundColor = '#E32636';
      await sleep(delay);
      if (array[j] > array[j + 1]) {
        // swapping values in array
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        // swapping heights of bars
        [bars[j].style.height, bars[j + 1].style.height] = [bars[j + 1].style.height, bars[j].style.height];
      }
      bars[j].style.backgroundColor = bars[j + 1].style.backgroundColor = barBackgroundColor;
      await sleep(delay);
    }
    bars[array.length - i - 1].style.backgroundColor = barBackgroundColorSorted;
  }
  sort_btn.disabled = false;
}

async function selectionSort() {
  sort_btn.disabled = true;
  let bars = document.querySelectorAll('.bar');
  for (let i = 0; i < array.length; ++i) {
    let minIndex = i;
    bars[i].style.backgroundColor = barBacjgroundColorAwait;
    for (let j = i + 1; j < array.length; ++j) {
      let minIndexFound = false;
      bars[j].style.backgroundColor = barBackgroundColorTransition;
      if (array[j] < array[minIndex]) {
        if (minIndex !== i) {
          // switching color of previous min to white
          bars[minIndex].style.backgroundColor = barBackgroundColor;
          // switching color of new min to red
          bars[j].style.backgroundColor = barBackgroundColorTransition;
        }
        minIndex = j;
        minIndexFound = true;
        await sleep(delay);
      }
      await sleep(delay);
      if (!minIndexFound) {
        bars[j].style.backgroundColor = barBackgroundColor;
      }
    }
    // swapping values in array
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
    // swapping heights of bars
    [bars[i].style.height, bars[minIndex].style.height] = [bars[minIndex].style.height, bars[i].style.height];

    bars[minIndex].style.backgroundColor = barBackgroundColor;
    // mark leftmost unsorted bar as sorted
    bars[i].style.backgroundColor = barBackgroundColorSorted;

  }
  sort_btn.disabled = false;
}

async function insertionSort() {
  sort_btn.disabled = true;
  let bars = document.querySelectorAll('.bar');
  bars[0].style.backgroundColor = barBackgroundColorSorted;
  for (let i = 1; i < array.length; ++i) {
    let j = i;
    while (j > 0 && array[j] < array[j - 1]) {
      bars[j - 1].style.backgroundColor = barBackgroundColorTransition;
      // swapping values in array
      [array[j], array[j - 1]] = [array[j - 1], array[j]];
      // swapping heights of bars
      [bars[j].style.height, bars[j - 1].style.height] = [bars[j - 1].style.height, bars[j].style.height];
      j--;
      await sleep(delay);
      bars[j].style.backgroundColor = barBackgroundColorSorted;

    }
    bars[i].style.backgroundColor = barBackgroundColorSorted;
  }
  sort_btn.disabled = false;
}

async function mergeSort() {
  sort_btn.disabled = true;
  await mergeSortHelper(array, 0, array.length - 1);
  sort_btn.disabled = false;
}

async function mergeSortHelper(array, leftIndex, right) {
  if (leftIndex < right) {
    let middle = Math.floor((leftIndex + right) / 2);
    await mergeSortHelper(array, leftIndex, middle);
    await mergeSortHelper(array, middle + 1, right);
    await merge(array, leftIndex, middle, right);
  }
}

async function merge(array, left, middle, right) {
  let bars = document.querySelectorAll('.bar');
  let tempArray = [];
  let leftIndex = left;
  let rightIndex = middle + 1;
  while (leftIndex <= middle && rightIndex <= right) {
    let tempLeftIndex = leftIndex;
    let tempRightIndex = rightIndex;
    bars[leftIndex].style.backgroundColor = bars[rightIndex].style.backgroundColor = barBackgroundColorTransition;
    if (array[leftIndex] < array[rightIndex]) {
      tempArray.push({
        value: array[leftIndex],
        height: bars[leftIndex].style.height,
      });
      leftIndex++;
    } else {
      tempArray.push({
        value: array[rightIndex],
        height: bars[rightIndex].style.height,
      });
      rightIndex++;
    }
    await sleep(delay);
    bars[tempLeftIndex].style.backgroundColor = bars[tempRightIndex].style.backgroundColor = barBackgroundColor;
  }
  while (leftIndex <= middle) {
    tempArray.push({
      value: array[leftIndex],
      height: bars[leftIndex].style.height,
    });
    leftIndex++;
    await sleep(delay);
  }
  while (rightIndex <= right) {
    tempArray.push({
      value: array[rightIndex],
      height: bars[rightIndex].style.height,
    });
    rightIndex++;
    await sleep(delay);
  }
  for (let i = 0; i < tempArray.length; i++) {
    array[left + i] = tempArray[i].value;
    bars[left + i].style.height = tempArray[i].height;

    if (array.length === tempArray.length)
      bars[left + i].style.backgroundColor = barBackgroundColorSorted;
    await sleep(delay / 2);
  }
}