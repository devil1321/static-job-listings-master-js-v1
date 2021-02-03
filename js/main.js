let filtered = []
let filteredHistory = []
let flIndex = -1
let isRemoved = false
let actualWord = 0;
let tempItems
class Data {
    async getData() {
        try {
            let data = await fetch('../data.json')
            data = await data.json()
            return data
        } catch (error) {
            console.log(error);
        }
    }
}

class UI {
    static setFunctionality(items) {
        UI.reloadWrapper();
        UI.showData(items)
        let footer__bandges = document.querySelectorAll('.app__card-footer-badge')
        footer__bandges.forEach(bandge => {
            bandge.addEventListener('click', UI.addSearchItem)
        })
        let searchBandgesDelete = document.querySelectorAll('.app__search-bandge-delete')
        searchBandgesDelete.forEach(bandge => {
            bandge.addEventListener('click', UI.removeSearchBandge)
        })
        let clearBtn = document.querySelector('.app__search-btn-clear')
        clearBtn.addEventListener('click', UI.clearSearch)
    }
    static reloadWrapper() {
        let appSearch = document.querySelector('.app__search')
        let searchWrapper = document.querySelector('.app__search-wrapper ')
        if (appSearch.children.length <= 0) {
            searchWrapper.style.opacity = '0'
        } else {
            searchWrapper.style.opacity = '1'
        }
    }
    static showData(data) {
            let cardsContainer = document.querySelector('.app__list')
            let cardFooter = document.querySelectorAll('.app__card-footer');

            cardsContainer.innerHTML = ''
            data.forEach(item => {
                        const {
                            id,
                            company,
                            logo,
                            featured,
                            position,
                            role,
                            level,
                            postedAt,
                            contract,
                            location,
                            languages,
                            tools
                        } = item
                        let card = document.createElement('div')
                        card.classList.add('app__card')
                        if (item.new || featured) {
                            card.style.borderLeft = '2px solid hsl(180, 29%, 50%);'
                        } else {
                            card.style.borderLeft = '0px'
                        }
                        card.innerHTML = `<img src=${logo} alt="card-logo" class="app__card-img">
            <div class="app__card-inner-wrapper">
                <div class="app__card-header">
                    <div class="app__card-title d-flex a-i-c">
                        <p class="app__card-title-text">${company}</p>
                        ${item.new ? `<p class="app__card-badge light">NEW!</p>`:""}
                    ${featured ? `<p class="app__card-badge dark">FEATURED</p>`:""}
                    </div>
                    <h1 class="app__card-subtitle">${position}</h1>
                    <div class="app__card-header-footer d-flex a-i-c">
                        <p class="app__card-header-footer-text">${postedAt}</p>
                        <div class="app__card-header-footer-dot"></div>
                        <p class="app__card-header-footer-text">${contract}</p>
                        <div class="app__card-header-footer-dot"></div>
                        <p class="app__card-header-footer-text">${location}</p>
                    </div>
                </div>
            </div>
            <div class="app__card-footer d-flex a-i-c f-w">
                <p class="app__card-footer-badge" data-role="${role}">${role}</p>
                <p class="app__card-footer-badge" data-level="${level}">${level}</p>
            ${languages.length > 0 ? languages.map(language =>{
                return `<p class="app__card-footer-badge data-language="${languages.join(';')}">${language}</p>`
            }).join('') :``}
            ${tools.length > 0 ? tools.map(tool =>{
                return `<p class="app__card-footer-badge" data-tools="${tools.join(';')}">${tool}</p>`
            }).join('') : ``}
            </div>
        </div>`
        cardsContainer.appendChild(card)

            })
        }
        static filterCategory(items){
                let words = UI.getWords();
                actualWord = words.length-1
                if(filteredHistory.length === 0){
                    tempItems = items
                    
                }else{
                    if(filteredHistory[flIndex] !== undefined){
                        tempItems = filteredHistory[flIndex]
                     
                    }
                }
                if(isRemoved === false){
                 tempItems = tempItems.filter(({role,level,languages,tools})=>{
                    return tools.includes(words[actualWord]) ||
                    role.includes(words[actualWord]) ||
                    level.includes(words[actualWord]) ||
                    languages.includes(words[actualWord])
                })
                    filteredHistory.push(tempItems)
                    flIndex = flIndex + 1
                   
                }
                
                    if(filteredHistory.length >= 0 && filteredHistory[flIndex] !== undefined){
                        UI.showData(filteredHistory[flIndex])
                    }else if(flIndex <= 1){
                        flIndex = -1
                        filteredHistory = []
                        let data = new Data
                        data.getData().then(items=> UI.setFunctionality(items))
                    }

               
                let footer__bandges = document.querySelectorAll('.app__card-footer-badge')  
                footer__bandges.forEach(bandge=>{
                bandge.addEventListener('click',UI.addSearchItem)
            })
            }
        
        static getWords(){
            let words = []
            let appSearchBandge = document.querySelectorAll('.app__search-bandge-text');
            appSearchBandge.forEach(bandge =>{
                words.push(bandge.textContent)
            })
            return words
        }
        static addSearchItem(e){
            let searchContainer = document.querySelector('.app__search')
            let searchBandge = document.createElement('div')
            searchBandge.classList = 'app__search-bandge d-flex j-c-sb a-i-c'
            let searchBandgeText = e.target.textContent
            searchBandge.innerHTML = `<p class="app__search-bandge-text">${searchBandgeText}</p>
                                    <div class="app__search-bandge-delete">X</div>`
            searchContainer.appendChild(searchBandge)
            let searchBandgesDelete = document.querySelectorAll('.app__search-bandge-delete')
            searchBandgesDelete.forEach(bandge=>{
                bandge.onclick = function(e) { UI.removeSearchBandge(e)};
            })
            UI.reloadWrapper()
            isRemoved = false
            let data = new Data();
            data.getData().then(items=>{
                if(filtered.length === 0){
                    UI.filterCategory(items)
                }else{
                    UI.filterCategory(filtered)
                }
            })
        }
        static removeSearchBandge(e){ 
            e.target.parentElement.remove();
            UI.reloadWrapper()
           filtered.pop()
         
               flIndex = flIndex - 1
         
            isRemoved = true
            let data = new Data();
            data.getData().then(items=>{
                    UI.filterCategory(items)
            })
         
        }
        static clearSearch(){
            let searchContainer = document.querySelector('.app__search')
            searchContainer.innerHTML = ''
            UI.reloadWrapper()
            let data = new Data()
            data.getData().then(items => UI.setFunctionality(items))
        }
    }


    window.addEventListener('DOMContentLoaded',function(){
        let data = new Data();
        data.getData().then(items=>{
            UI.setFunctionality(items)
        });
    })