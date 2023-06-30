let sv

document.querySelector(".init").onclick = function () {
    sv = SortVisibilization.
        getRandomInstance(1000,
            document.querySelector("#svgc"))
    sv.monkeySort()
}

document.querySelector(".boot").onclick = function () {
    sv.isReady = true
    sv.monkeySort()
}
