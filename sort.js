const BG_COLOR = 'black'
        const COMPARE_COLOR = 'blue'
        const FOUND_COLOR = 'green'
        const SELECT_COLOR = 'red'

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function setActivity(active) {
            document.getElementById('generatearray').disabled = active
            document.getElementById('linearsearch').disabled = active
            document.getElementById('binarysearch').disabled = active
            document.getElementById('bubblesort').disabled = active
            document.getElementById('selectionsort').disabled = active
        }

        function enable() {
            setActivity(false)
        }

        function disable() {
            setActivity(true)
        }

        function getLinearSearchVisualization(number, array) {
            let visualizationArray = []
            for (let i = 0; i < array.length; ++i) {
                if (number === array[i]) {
                    visualizationArray.push({
                        pos: i,
                        found: true,
                    })

                    return visualizationArray
                } else {
                  visualizationArray.push({
                        pos: i,
                    })
                }
            }
            visualizationArray.push({
                pos: array.length - 1,
                found: false
            })

            return visualizationArray
        }

        function getBubbleSortVisualization(array) {
            let visualizationArr = []
            let len = array.length;
            let swapped;
            do {
                swapped = false;
                for (let i = 0; i < len - 1; i++) {
                    visualizationArr.push({
                        position_i: i,
                        position_j: i + 1,
                        status: 'compare',
                    })
                    if (array[i] > array[i + 1]) {
                        visualizationArr.push({
                            position_i: i,
                            position_j: i + 1,
                            status: 'swap',
                        })  
                        let tmp = array[i];
                        array[i] = array[i + 1];
                        array[i + 1] = tmp;
                        swapped = true;
                    }
                }
            } while (swapped);
            return visualizationArr;
        }

        function getSelectionSortVisualization(array) {
            let visualizationArr = []
            let len = array.length;
            for (let i = 0; i < len; i++) {
                let min = i
                visualizationArr.push({
                    min: i,
                    status: 'select-min',
                })
                for (let j = i + 1; j < len; j++) {
                  visualizationArr.push({
                        min,
                        j,
                        status: 'compare'
                    })
                    if (array[min] > array[j]) {
                      visualizationArr.push({
                            min: j,
                            status: 'select-min',
                        })
                        min = j
                    }
                }

                if (min !== i) {
                  visualizationArr.push({
                        min,
                        i,
                        status: 'swap'
                    })
                    let tmp = array[i]
                    array[i] = array[min]
                    array[min] = tmp
                }
            }
            return visualizationArr
        }

        
        function getBinarySearchVisualization(number, array) {
            let visualizationArr =  []

            let lowIndex = 0
            let highIndex = array.length - 1
            let midIndex
            visualizationArr.push({
                lowIndex,
                highIndex,
                status: 'compare',
            })
            while (lowIndex <= highIndex) {
                midIndex = Math.floor((lowIndex + highIndex) / 2)
                visualizationArr.push({
                    midIndex,
                    status: 'select'
                })
                if (array[midIndex] == number) {
                  visualizationArr.push({
                        midIndex,
                        status: 'found'
                    })
                    return visualizationArr
                } else if (array[midIndex] < number) {
                    lowIndex = midIndex + 1
                    visualizationArr.push({
                        lowIndex,
                        highIndex,
                        status: 'compare',
                    })
                } else {
                    highIndex = midIndex - 1
                    visualizationArr.push({
                        lowIndex,
                        highIndex,
                        status: 'compare',
                    })
                }
            }
            visualizationArr.push({
                lowIndex,
                midIndex,
                highIndex,
                status: 'not-found',
            })
            return  visualizationArr;
        }


        async function doBubbleSort() {
            if (!array.length) {
               alert("Generate An Array")
            }
            disable();
            let arrayBoxChildElements = Array.from(document.getElementById('array-box').children)
            let visualizationArr = getBubbleSortVisualization(array)
            let previous
            for (let i = 0; i < visualizationArr.length; ++i) {
                await sleep(300)
                if (previous) {
                  arrayBoxChildElements[previous.position_i].style.backgroundColor = BG_COLOR
                  arrayBoxChildElements[previous.position_j].style.backgroundColor = BG_COLOR
                }
                const visualization = visualizationArr[i]

                if (visualization.status === 'compare') {
                  arrayBoxChildElements[visualization.position_i].style.backgroundColor = COMPARE_COLOR
                  arrayBoxChildElements[visualization.position_j].style.backgroundColor = COMPARE_COLOR
                } else {
                  arrayBoxChildElements[visualization.position_i].style.backgroundColor = SELECT_COLOR
                  arrayBoxChildElements[visualization.position_j].style.backgroundColor = SELECT_COLOR
                    await sleep(300)
                    const tempHeight = arrayBoxChildElements[visualization.position_i].style.height
                    arrayBoxChildElements[visualization.position_i].style.height = arrayBoxChildElements[visualization.position_j].style.height
                    arrayBoxChildElements[visualization.position_j].style.height = tempHeight
                }

                previous = visualization
            }

            if (previous) {
              arrayBoxChildElements[previous.position_i].style.backgroundColor = BG_COLOR
              arrayBoxChildElements[previous.position_j].style.backgroundColor = BG_COLOR
            }
            enable();
        }


        async function doSelectionSort() {
            if (!array.length) {
               alert("Generate An Array")
            }
            disable();
            let arrayBoxChildElements = Array.from(document.getElementById('array-box').children)
            let visualizationArr = getSelectionSortVisualization(array)
            let previous

            for (let i = 0; i < visualizationArr.length; ++i) {
                await sleep(300)
                if (previous) {
                   previous.min && (arrayBoxChildElements[previous.min].style.backgroundColor = BG_COLOR)
                   previous.j && (arrayBoxChildElements[previous.j].style.backgroundColor = BG_COLOR)
                   previous.i && (arrayBoxChildElements[previous.i].style.backgroundColor = BG_COLOR)
                }
                const visualization = visualizationArr[i]

                if (visualization.status === 'compare') {
                  arrayBoxChildElements[visualization.min].style.backgroundColor = COMPARE_COLOR
                  arrayBoxChildElements[visualization.j].style.backgroundColor = COMPARE_COLOR
                } else if (visualization.status === 'swap') {
                  arrayBoxChildElements[visualization.min].style.backgroundColor = SELECT_COLOR
                  arrayBoxChildElements[visualization.i].style.backgroundColor = SELECT_COLOR
                    await sleep(300)
                    const tempHeight = arrayBoxChildElements[visualization.min].style.height
                    arrayBoxChildElements[visualization.min].style.height = arrayBoxChildElements[visualization.i].style.height
                    arrayBoxChildElements[visualization.i].style.height = tempHeight
                } else {
                  arrayBoxChildElements[visualization.min].style.backgroundColor = FOUND_COLOR
                }

                previous = visualization
            }

            if (previous) {
               previous.min && (arrayBoxChildElements[previous.min].style.backgroundColor = BG_COLOR)
               previous.j && (arrayBoxChildElements[previous.j].style.backgroundColor = BG_COLOR)
                previous.i&& (arrayBoxChildElements[previous.i].style.backgroundColor = BG_COLOR)
            }
            enable();
        }

        let arraySize, number, array = [];
        function generateArray() {
          arraySize = document.getElementById('array-size').value
            if (!arraySize || arraySize<2 || arraySize>80) {
               alert("Array Size Should Be More Than Two And Less Than 80")
            }
            let arrayBox = document.getElementById('array-box')
            let arrayLastChild = arrayBox.lastElementChild; 
            while (arrayLastChild) { 
                arrayBox.removeChild(arrayLastChild); 
                arrayLastChild = arrayBox.lastElementChild; 
            }
            array = []
            for (let i = 0; i < arraySize; ++i) {
                let randomNumber = getRandomNumber(5, 500)
                array.push(randomNumber)
                let newElement = document.createElement('div')
                newElement.className = "tower"
                newElement.style.height = randomNumber + 'px'
                arrayBox.appendChild(newElement)
            }
        }

        async function doLinearSearch() {
          disable();
            let visualizationArray = getLinearSearchVisualization(number, [...array])
            let arrayBoxChildElements = Array.from(document.getElementById('array-box').children)
            let previous
            for (let i = 0; i < visualizationArray.length; ++i) {
                let visualization = visualizationArray[i]
                await sleep(100)
                
                if (Number.isInteger(previous)) {
                    arrayBoxChildElements[previous].style.backgroundColor = BG_COLOR
                }
                if (visualization.found === true) {
                    arrayBoxChildElements[visualization.pos].style.backgroundColor = FOUND_COLOR
                    alert("Found")
                    break
                } else if (visualization.found === false) {
                   arrayBoxChildElements[visualization.pos].style.backgroundColor = BG_COLOR
                    alert("Not Found")
                    break
                } else {
                    arrayBoxChildElements[visualization.pos].style.backgroundColor = SELECT_COLOR
                    previous = visualization.pos
                }
            }
            enable();
        } 

        async function doBinarySearch() {
            disable();
            array.sort((a, b) => a - b)
            let arrayBoxChildElement = document.getElementById('array-box')
            let child = arrayBoxChildElement.lastElementChild;
            while (child) { 
              arrayBoxChildElement.removeChild(child); 
                child = arrayBoxChildElement.lastElementChild; 
            }
            for (let i = 0; i < array.length; ++i) {
                let lineElement = document.createElement('div')
                lineElement.className = "tower"
                lineElement.style.height = array[i] + 'px'
                arrayBoxChildElement.appendChild(lineElement)
            }
            await sleep(1000)
            let visualizationArr = getBinarySearchVisualization(number, array)
            let previous
            let arrayBoxChildElements = Array.from(document.getElementById('array-box').children)
            for (let i = 0; i < visualizationArr.length; ++i) {
                  const visualization = visualizationArr[i]
                await sleep(300)
                if (previous) {
                    if (previous.status === 'compare') {
                      arrayBoxChildElements[previous.lowIndex].style.backgroundColor = BG_COLOR
                        previous.highIndex >= 0 && (arrayBoxChildElements[previous.highIndex].style.backgroundColor = BG_COLOR)
                    } else {
                      arrayBoxChildElements[previous.midIndex].style.backgroundColor = BG_COLOR
                    }
                }
                if (visualization.status === 'found') {
                  arrayBoxChildElements[visualization.midIndex].style.backgroundColor = FOUND_COLOR
                    alert("Found")
                    break
                } else if (visualization.status === 'not-found') {
                  arrayBoxChildElements[visualization.lowIndex].style.backgroundColor = BG_COLOR
                  arrayBoxChildElements[visualization.midIndex].style.backgroundColor = BG_COLOR
                  visualization.highIndex >= 0 && (arrayBoxChildElements[visualization.highIndex].style.backgroundColor = BG_COLOR)
                   alert("Not Found")
                } else if (visualization.status === 'compare') {
                  arrayBoxChildElements[visualization.lowIndex].style.backgroundColor = COMPARE_COLOR
                  visualization.highIndex >= 0 && (arrayBoxChildElements[visualization.highIndex].style.backgroundColor = COMPARE_COLOR)
                    await sleep(300)
                } else {
                  arrayBoxChildElements[visualization.midIndex].style.backgroundColor = SELECT_COLOR
                }

                previous = visualization
            }

            enable();
        }