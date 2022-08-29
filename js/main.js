
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

let secondsToRemember = 5
let seconds = secondsToRemember
let level = +localStorage.getItem("level") || 1
let orderCounter = 1
let timeId = 0
document.querySelector(".level > span").textContent = level

function generateAndRemember(){
    if(seconds <= 0){
        seconds = -1
        document.querySelector(".sleepy-mode").setAttribute("disabled","disabled")
        hideSeq()
        return
    }
    if(seconds === secondsToRemember){
        btnRef.setAttribute("data-wait","on")
        btnRef.removeAttribute("disabled")
        generateRandomSeq()
    }
    const str = `Are you ready? (${seconds})`
    seconds--
    btnRef.textContent = str
    timeId = setTimeout(() => {
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
        seconds = secondsToRemember
        orderCounter = 1
        btnRef.textContent = "Time is up 🕝"
        if(isSuccess){
            level++
            document.querySelector(".level > span").textContent = level
            localStorage.setItem("level", level)
            btnRef.textContent = "🎉🎉 WELL DONE 🎉🎉"
            cellsRef.classList.toggle("success", false)
        }
        if(isLoss){
            btnRef.textContent = "🙊 you can better!"
            cellsRef.classList.toggle("loss", false)
        }
        document.querySelectorAll("[data-ordered]").forEach(el => {
            el.classList.toggle("cell-bad", !isSuccess)
            el.classList.toggle("cell-good", isSuccess)
            el.setAttribute("disabled", "disabled")
        })
        if(!document.querySelector(".sleepy-mode").getAttribute("data-set")){
            document.querySelector(".sleepy-mode").removeAttribute("disabled")
        }
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
        seconds = secondsToRemember + level
    }
    const str = `Restore the sequence (${seconds})`
    seconds--
    btnRef.removeAttribute("data-wait")
    btnRef.setAttribute("disabled", "disabled")
    btnRef.textContent = str
    timeId = setTimeout(() => {
        hideSeq()
    }, 1000)
}

btnRef.addEventListener("click", (e) => {
    if(e.currentTarget.getAttribute("data-wait")){
        clearTimeout(timeId)
        e.currentTarget.removeAttribute("data-wait")
        e.currentTarget.setAttribute("disabled", "disabled")
        seconds = -1
        document.querySelector(".sleepy-mode").setAttribute("disabled","disabled")
        hideSeq()
        return 
    }
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
    secondsToRemember = 5
    seconds = secondsToRemember
    document.querySelector(".sleepy-mode").removeAttribute("disabled")
    document.querySelector(".sleepy-mode").removeAttribute("data-set")
    document.querySelector(".sleepy-mode").textContent = '"Sleepy" mode'
    clearTimeout(timeId)
    generateAndRemember()
})

document.querySelector(".sleepy-mode").addEventListener("click", (ev) => {
    secondsToRemember = 10
    seconds = secondsToRemember
    ev.currentTarget.setAttribute("disabled","disabled")
    ev.currentTarget.setAttribute("data-set","on")
    let str = ev.currentTarget.textContent
    ev.currentTarget.textContent = str + " (enabled)"
})
