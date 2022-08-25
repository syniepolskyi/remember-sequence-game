
const cellsRef = document.querySelector(".cells tbody")
const btnRef = document.querySelector(".start-btn")



Array.from(Array(10).keys()).forEach((el) => {
    setTimeout(() => {
        let markup = "<tr>"
        Array.from(Array(10).keys()).forEach((el2) => {
            markup += `<td>`
            +`<button type="button" class="cell" data-idx="${el*10 + el2}" disabled>`
            +`${el*10 + el2}`
            +`</button>`
            +`</td>`
        })
        markup += "</tr>"
        cellsRef.innerHTML += markup
    }, 10 + el*10)
})

cellsRef.innerHTML += "</tr>"

let seconds = 5
let level = +localStorage.getItem("level") || 1
let orderCounter = 1
document.querySelector(".level > span").textContent = level

function generateAndRemember(){
    if(seconds === 0){
        seconds = -1
        hideSeq()
        return
    }
    if(seconds === 5){
        btnRef.setAttribute("disabled","disabled")
        generateRandomSeq()
    }
    const str = `Запам'ятовуйте (${seconds})`
    seconds--
    btnRef.textContent = str
    setTimeout(() => {
        generateAndRemember()
    }, 1000)
}

function generateRandomSeq(){
    orderCounter = 1
    document.querySelectorAll(".cell").forEach(el => {
        el.textContent = ''
    })
    document.querySelectorAll(".cell-good").forEach(el => {
        el.classList.remove("cell-good")
    })
    document.querySelectorAll(".cell-bad").forEach(el => {
        el.classList.remove("cell-bad")
    })
    document.querySelectorAll("[data-ordered]").forEach(el => {
        el.removeAttribute("data-ordered")
        el.setAttribute("disabled","disabled")
    })
    for (let i = 0; i < 2 + level; i++){
        let idx = Math.round(Math.random() * 100) - 1
        if (idx < 0) {
            idx = 0
        }
        const btn = document.querySelector(`[data-idx="${idx}"]`)
        if(btn.textContent.length){
            i--
            continue
        }
        btn.setAttribute("data-ordered", (i+1))
        btn.textContent = (i+1)
    }
}

function hideSeq(){
    let isSuccess = cellsRef.classList.contains("success")
    let isLoss = cellsRef.classList.contains("loss")
    if(seconds === 0 || isSuccess || isLoss){
        seconds = 5
        orderCounter = 1
        btnRef.textContent = "Час вийшов"
        if(isSuccess){
            level++
            document.querySelector(".level > span").textContent = level
            localStorage.setItem("level", level)
            btnRef.textContent = "ПЕРЕМОГА!"
            cellsRef.classList.toggle("success", false)
        }
        if(isLoss){
            btnRef.textContent = "поразка"
            cellsRef.classList.toggle("loss", false)
        }
        document.querySelectorAll("[data-ordered]").forEach(el => {
            el.classList.toggle("cell-bad", !isSuccess)
            el.classList.toggle("cell-good", isSuccess)
            el.setAttribute("disabled", "disabled")
        })
        setTimeout(() =>{
            // btnRef.textContent = "Нова Послідовність"
            // btnRef.removeAttribute("disabled")
            generateAndRemember()
        },2000)
        return 
    }
    if(seconds === -1){
        document.querySelectorAll("[data-ordered]").forEach(el => {
            el.textContent = '?'
            el.removeAttribute("disabled")
        })
        seconds = 3 + level
    }
    const str = `Натискайте у тому ж порядку (${seconds})`
    seconds--
    btnRef.textContent = str
    setTimeout(() => {
        hideSeq()
    }, 1000)
}

btnRef.addEventListener("click", (e) => {
    generateAndRemember()
})

cellsRef.addEventListener("click", (ev) => {
    const elem = ev.target.closest(".cell")
    if(!elem || elem.getAttribute("disabled")){
        return
    }
    elem.setAttribute("disabled", "disabled")
    let orderNum = +elem.getAttribute("data-ordered")
    let className = "cell-bad"
    elem.textContent = orderNum
    if(orderNum === orderCounter){
        className = "cell-good"
    }
    elem.classList.toggle(className, true)
    if(orderNum !== orderCounter){
        cellsRef.classList.add("loss")
        return 
    }
    let isSuccess = 
    [...document.querySelectorAll("[data-ordered]")]
        .reduce((acc,el) => {
            return acc && el.classList.contains("cell-good")
        },true)
    if(isSuccess){
        cellsRef.classList.add("success")
    }
    
    orderCounter++
})

document.querySelector(".reload-level").addEventListener("click", (ev) => {
    level = 1
    document.querySelector(".level > span").textContent = level
    localStorage.removeItem("level")
})

document.querySelector('video').play();