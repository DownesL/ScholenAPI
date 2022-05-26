"use strict";

(function() {
    const search = document.querySelector("#search");

    const location = document.querySelector("#location");
    const offer = document.querySelector("#offer");
    const method = document.querySelector("#method");
    const form = document.querySelector("form");
    const primary = document.querySelector("#primary");
    const secondary = document.querySelector("#secondary")

    const errlocation = document.querySelector("#locationErr");
    const errType = document.querySelector("#typeErr");
    const errOffer = document.querySelector("#offerErr");
    const errMethod = document.querySelector("#methodErr");

    const searchArea = document.querySelector(".searchArea")
    const resultList = document.querySelector(".results");
    const resultList2 = document.querySelector("#results");
    const resultBtn = document.querySelector("#newSearchFilter");

    const tagOffers = document.querySelector(".tagLegende .tag.offerTag");
    const netTags = document.querySelector(".tagLegende .tag.netTag");

    form.addEventListener('submit', e => {
        e.preventDefault();
        resetErrors();
        const isValid = validateForm();
        if(isValid) {
            console.log('Form is valid');
            searchArea.classList.toggle('hidden');
            resultList.classList.toggle('hidden');
            fetchData2();
            //resetForm();
        } else {
            console.log('Form is invalid')
        } 
    })
    
    primary.addEventListener('click', ()=>{
        setSelectOptions()
    });
    secondary.addEventListener('click', ()=>{
        setSelectOptions()
    });

    resultBtn.addEventListener('click', () => {
        searchArea.classList.toggle('hidden');
        resultList.classList.toggle('hidden');
        document.querySelectorAll(".result").forEach((el) => {
            resultList2.removeChild(el)
        });
    });
    tagOffers.addEventListener('click', () => {
        if(tagOffers.getAttribute("aria-expanded")) {
            document.querySelector(".aanbodLegende").toggleAttribute("aria-hidden",true);
            tagOffers.toggleAttribute("aria-expanded", "false");
        } else {
            document.querySelector(".aanbodLegende").toggleAttribute("aria-hidden",false);
            tagOffers.toggleAttribute("aria-expanded", "true");
        }
        document.querySelector(".netLegende").toggleAttribute("aria-hidden", true)
        netTags.toggleAttribute("aria-expanded", "false");
        
    });
    netTags.addEventListener('click',() => {
        if(netTags.getAttribute("aria-expanded")) {
            document.querySelector(".netLegende").toggleAttribute("aria-hidden", true);
            netTags.toggleAttribute("aria-expanded", "false");
        } else {
            document.querySelector(".netLegende").toggleAttribute("aria-hidden",false);
            netTags.toggleAttribute("aria-expanded", "true");
        }
        document.querySelector(".aanbodLegende").toggleAttribute("aria-hidden", true)
        tagOffers.toggleAttribute("aria-expanded", "false");
    })

    //FORM VALIDATION
    const validateForm = ()=> {
        let isValid = true;
        if (location.value === '0') {
            setError(errlocation,'Geen locatie meegegeven, vul locatie in');
            isValid = false;
        }
        if (method.value === "0") {
            setError(errMethod,'Geen methode meegegeven, vul methode in');
            isValid = false;
        }
        if (!primary.checked && !secondary.checked) {
            setError(errType,'Geen graad meegegeven, vul graad in');
            isValid = false;
        }
        if (offer.value === "0") {
            setError(errOffer,'Geen offer meegegeven, vul offer in');
            isValid = false;
        }
        return isValid;
    }
    const setError = (el, msg) => {
        el.style.display = 'block';
        el.innerText = msg;
    }
    const resetErrors = ()=>{
        errMethod.style.display ='none';
        errOffer.style.display = 'none';
        errType.style.display = 'none';
        errlocation.style.display = 'none';
    }
    const resetForm = () => {
        location.value = 0;
        offer.value = 0;
        method.value = 0;
        primary.checked = false;
        secondary.checked = false;
        
    }
    //FETCH REVIEW FROM DB
    const fetchReview = async (schoolId) => {
        let reviewContent;
        try {
            let review = await fetch("https://schoolsearchserver.lukasdownes.ikdoeict.be/reviews");
            if(!review.ok) throw Error();
            reviewContent = await responseBasis.json();
        }
        catch (err) {
            console.log(err)
        }
    }
    //DISPLAYING ALL THE FETCHED DATA
    const createHtml = (el) => {
        const result = document.createElement("section");
        //HEADER
        const header = document.createElement("h2");
        const headerText = document.createTextNode(`${el.fields.naam}`)
        //LOCATION
        const locationHeader = document.createElement('h3');
        const locationHeaderText = document.createTextNode(`${el.fields.gemeente}`);
        //TAGS
        const tags = document.createElement("div");
        const offerTag = document.createElement("span");
        const offerTagText = document.createTextNode(`${el.fields.aanbod}`);
        const netTag = document.createElement("span");
        const netTagText = document.createTextNode(`${el.fields.onderwijsnet}`);
        //DESCRIPTION
        const para = document.createElement("p");
        const paraText = document.createTextNode("Deze school heeft nog geen reviews")
        //WEBSITE
        const web = document.createElement("a")
        const webLink = `www.${el.fields.website}`;
        const webText = document.createTextNode("Website: " + el.fields.naam);
        //RATING
        const ratingDiv = document.createElement("div");
        const ratingSpan = document.createElement("span");
        const ratingSpanText = document.createTextNode("Score: * * * * *");
        //EIGEN REVIEW/OMSCHRIJVING TOEVOEGEN
        const ownReview = document.createElement("p");
        const ownReviewText = document.createTextNode("Schrijf een eigen review.");

        fetchReview(el.fields.schoolnr);

        //HEADER
        header.appendChild(headerText);
        //TAGS
        tags.appendChild(offerTag);
        tags.appendChild(netTag);
        offerTag.appendChild(offerTagText)
        netTag.appendChild(netTagText)
        //LOCATION
        locationHeader.appendChild(locationHeaderText);
        //DESCRIPTION
        para.appendChild(paraText);
        //WEBSITE
        web.setAttribute("href",webLink);
        web.appendChild(webText);
        //RATING
        ratingDiv.appendChild(ratingSpan);
        ratingSpan.appendChild(ratingSpanText);
        //REVIEW
        ownReview.appendChild(ownReviewText);
        //SECTION
        result.appendChild(header);
        result.appendChild(tags);
        result.appendChild(locationHeader);
        result.appendChild(para);
        result.appendChild(web);
        result.appendChild(ratingDiv);
        result.appendChild(ownReview);
        resultList2.appendChild(result);

        //ADD CLASSNAMES
        result.className = "result";
        tags.className = "tags";
        offerTag.className = "tag offerTag";
        netTag.className = "tag netTag";
        para.className = "description";
        ratingDiv.className = "rating";
        ownReview.className = "leaveAReview";
    }
    //CHANGING THE POSSIBLE OPTION ACCORDING TO PRIMARY/SECONDARY SCHOOL
    const setSelectOptions = () => {
        const scndOfferArr = ["SO", "BuSO", "DBSO"];
        const frstOfferArr = ["BA", "BuO","KO","LO"];

        if(secondary.checked && !primary.checked) {
            scndOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })
            frstOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).setAttribute("disabled", "");
            })
        }
        if (primary.checked && !secondary.checked) {
            scndOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).setAttribute("disabled", "");
            })
            frstOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })
        } 
        if(secondary.checked && primary.checked) {
            scndOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })
            frstOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })
        }
        offer.value = 0;
        method.value = 0;
    }
    //ERROR MESSAGE IF NO RESULTS WERE FOUND
    const setZeroResults = () => {
        const result = document.createElement("section");
        //HEADER
        const header = document.createElement("h2");
        const headerText = document.createTextNode("Geen resultaten gevonden");

        //DESCRIPTION
        const para = document.createElement("p");
        const paraText = document.createTextNode("Je zoekresultaten leverden geen resultaten op.");
        
        //HEADER
        header.appendChild(headerText);
        //DESCRIPTION
        para.appendChild(paraText);
        //SECTION
        result.appendChild(header);
        result.appendChild(para);
        resultList2.appendChild(result);

        //ADD CLASSNAMES
        result.className = "result noResults";
        para.className = "description";
    }

    let displaySet = 0;
    let globalDataBasis2, globalDataSec2;
    const fetchData2 = async () => {
        const searchQuery = (search.value === "" ? "" : "naam%3D"+search.value);
        
        const queryStart = (displaySet*10)
        const rows = (primary.checked && secondary.checked ? "&rows=5" : "&rows=10")
        const locatieQuery = (location.value === "any" ? "" : "&refine.gemeente=" + location.value);
        const aanbodQuery = (offer.value === "any" ? "" : "&refine.aanbod=" + offer.value);
        const netQuery = (method.value === "any" ? "" : "&refine.onderwijsnet=" + method.value);
        const linkBasisScholen2 = `https://data.stad.gent/api/records/1.0/search/?dataset=locaties-basisscholen-gent&q=${searchQuery}&start=${queryStart}${aanbodQuery}${netQuery}${locatieQuery}${rows}`
        const linkSecundaireScholen2 = `https://data.stad.gent/api/records/1.0/search/?dataset=locaties-secundaire-scholen-gent&q=${searchQuery}&start=${queryStart}${aanbodQuery}${netQuery}${locatieQuery}${rows}`
    
        try {
            let responseBasis = await fetch(linkBasisScholen2);
            if(!responseBasis.ok) throw Error();
            globalDataBasis2 = await responseBasis.json();
            let responseSec = await fetch(linkSecundaireScholen2);
            if (!responseSec.ok) throw Error();
            globalDataSec2 = await responseSec.json();
        }
        catch (err) {
            console.log(err)
        }
        try {
            if(primary.checked && !secondary.checked) {
                if (globalDataBasis2.nhits === 0) throw Error();
                globalDataBasis2.records.forEach((el) => createHtml(el));
            }
            if(!primary.checked && secondary.checked) {
                if (globalDataSec2.nhits === 0) throw Error();
                globalDataSec2.records.forEach((el) => createHtml(el));
            }
            if(primary.checked && secondary.checked) {
                if (globalDataBasis2.nhits === 0 && globalDataSec2.nhits === 0) throw Error();
                let dataTemp = globalDataBasis2.records.concat(globalDataSec2.records);
                dataTemp.forEach((el) => createHtml(el));
            }
        } catch(err) {
            console.log(err);
            setZeroResults();
        }
        

    }

    /**
     * This part of the js is for the infinite scroll effect    
     */

    let lastKnownScrollPosition = 0;
    let ticking = false;
    let scrollCount = 1;

    function moooooooreData(scrollPos) {
        console.log(lastKnownScrollPosition)
        if (scrollPos >= scrollCount*1000) {
            fetchData2();
            displaySet++;
            scrollCount++;
        }
    }

    document.addEventListener('scroll', function(e) {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                moooooooreData(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    });
})();