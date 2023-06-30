class SortVisibilization {
    /** 根据传入的数组所重新构造的数组 */
    #arrRebuilt = []
    /** 图形化容器 */
    #svgc
    /** 排序就绪检测 */
    isReady = false
    /** 当前窗口标题 */
    #title = "Hello, world!"
    /** 数组在一种排序方法中已循环的次数 */
    #shuffles = 0

    /** 
     * 接受需要可视化排序的数组，并根据其构造一个相同元素顺序的特殊等差数组。
     * 
     * @param {Array} arr 原始数组
     * @param {HTMLDivElement} graphicalContainer 图形化容器
     */
    constructor(arr, graphicalContainer) {
        if (!arr || !graphicalContainer)
            throw new Error("Necessary parameter(s) is/are missing! ")
        if (!graphicalContainer.hasAttribute("svgc"))
            console.warn("Invalid container! A useable container must be specially designed for graphical display and has 'svgc' attribute. ")
        /** 原始数组顺序排序后的结果 */
        const arrOriginalFinal = Array.from(arr).sort()
        /** 特殊等差数组。其仅在[0, 1]中有离散取值 */
        let arrRebuiltFinal = []
        for (let i = 1; i <= arr.length; i++)
            arrRebuiltFinal.push(i)
        for (let i = 0; i < arr.length; i++) {
            let e = arrRebuiltFinal[arrOriginalFinal.indexOf(arr[i])]
            if (this.#arrRebuilt.includes(e))
                while (this.#arrRebuilt.includes(++e));
            this.#arrRebuilt.push(e)
        }
        for (let i = 0; i < arr.length; i++)
            this.#arrRebuilt[i] /= arr.length
        this.#svgc = graphicalContainer
    }

    static getRandomInstance(length, graphicalContainer) {
        let arr = []
        for (let i = 0; i < length; i++)
            arr.push(Math.random())
        return new SortVisibilization(arr, graphicalContainer)
    }

    #initGraphics(arr, title) {
        this.#svgc.style.cssText += `--e-amount: ` + arr.length
        this.#title = title
        this.#shuffles = 0
        this.#svgc.querySelector(".info").innerHTML =
            this.#title + ` - shuffles = ` + this.#shuffles
        this.#updateGraphics(arr)
    }

    #updateGraphics(arr, isShufflesAdded, ...highlight) {
        let es = ""
        arr.forEach(e => {
            es += `<div style="height: ` + (e * 100) + `%"></div>`
        })
        this.#svgc.querySelector(".es").innerHTML = es
        if (isShufflesAdded)
            this.#svgc.querySelector(".info").innerHTML =
                this.#title + ` - shuffles = ` + ++this.#shuffles
        highlight.forEach(hlp => {
            this.#svgc.querySelector(".es").childNodes[hlp.index].style.cssText += `background: ` + hlp.color
        })
    }

    bubbleSort() {
        let arr = Array.from(this.#arrRebuilt)
        this.#initGraphics(arr, "Bubble Sort")
        if (!this.isReady)
            return;
        for (let i = 0; i < arr.length - 1; i++)
            for (let j = 0; j < arr.length - 1 - i; j++)
                setTimeout(() => {
                    if (arr[j] > arr[j + 1]) {
                        let t = arr[j]
                        arr[j] = arr[j + 1]
                        arr[j + 1] = t
                    }
                    if (j < arr.length - 2 - i)
                        this.#updateGraphics(arr, false, { "index": j, "color": "red" }, { "index": j + 1, "color": "grey" })
                    else
                        this.#updateGraphics(arr, true, { "index": j, "color": "red" }, { "index": j + 1, "color": "grey" })
                }, 100)
        this.isReady = false
    }

    monkeySort() {
        let arr = Array.from(this.#arrRebuilt)
        this.#initGraphics(arr, "Monkey Sort")
        if (!this.isReady)
            return;
        function isDone(arr) {
            for (let i = 0; i < arr.length - 1; i++)
                if (arr[i] > arr[i + 1])
                    return false
            return true
        }
        let id = setInterval(() => {
            arr.sort(function () {
                return (0.5 - Math.random());
            })
            this.#updateGraphics(arr, true)
            if (isDone(arr))
                clearInterval(id)
        }, 0)
        this.isReady = false
    }
}