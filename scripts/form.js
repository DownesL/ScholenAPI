"use strict";

(function () {
    const search = document.querySelector("#search");

    const location = document.querySelector("#location");
    const offer = document.querySelector("#offer");
    const method = document.querySelector("#method");
    const form = document.querySelector("form");
    const primary = document.querySelector("#primary");
    const secondary = document.querySelector("#secondary")

    const errSearch = document.querySelector("#searchErr")
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



    let displaySet = 0;
    let globalDataBasis2, globalDataSec2, reviewContent;
    let scrollsearch = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        resetErrors();
        const isValid = validateForm();
        if (isValid) {
            console.log('Form is valid');
            searchArea.classList.toggle('hidden');
            resultList.classList.toggle('hidden');
            await fetchReview();
            await fetchData2();
            displaySet++;
            //resetForm();
        } else {
            console.log('Form is invalid')
        }
        scrollsearch = true;
    })

    primary.addEventListener('click', () => {
        setSelectOptions()
    });
    secondary.addEventListener('click', () => {
        setSelectOptions()
    });

    resultBtn.addEventListener('click', () => {
        searchArea.classList.toggle('hidden');
        resultList.classList.toggle('hidden');
        displaySet = 0;
        document.querySelectorAll(".result").forEach((el) => {
            resultList2.removeChild(el)
        });
        scrollsearch = false;
    });
    tagOffers.addEventListener('click', () => {
        if (tagOffers.getAttribute("aria-expanded") === "true") {
            document.querySelector(".aanbodLegende").setAttribute("aria-hidden", true);
            tagOffers.setAttribute("aria-expanded", "false");
        } else {
            document.querySelector(".aanbodLegende").setAttribute("aria-hidden", false);
            tagOffers.setAttribute("aria-expanded", "true");
        }
        document.querySelector(".netLegende").setAttribute("aria-hidden", true)
        netTags.setAttribute("aria-expanded", "false");

    });
    netTags.addEventListener('click', () => {
        if (netTags.getAttribute("aria-expanded") === "true") {
            document.querySelector(".netLegende").setAttribute("aria-hidden", true);
            netTags.setAttribute("aria-expanded", "false");
        } else {
            document.querySelector(".netLegende").setAttribute("aria-hidden", false);
            netTags.setAttribute("aria-expanded", "true");
        }
        document.querySelector(".aanbodLegende").setAttribute("aria-hidden", true)
        tagOffers.setAttribute("aria-expanded", "false");
    })


    //FORM VALIDATION
    const validateForm = () => {
        let isValid = true;
        if (search.value.search(/(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+[\=\>\<=\!\~]+.+)|(let\s+.+[\=]\s*.*)|(begin\s*.*\s*end)|(\s*[\/\*]+\s*.*\s*[\*\/]+)|(\s*(\-\-)\s*.*\s+)|(\s*(contains|containsall|containskey)\s+.*)))(\s*[\;]\s*)*)+)/i) !== -1) {
            setError(errSearch, 'De formvalidatie detecteerde SQL-injectie, probeer opnieuw');
            isValid = false;
        }
        if (location.value === '0') {
            setError(errlocation, 'Geen locatie meegegeven, vul locatie in');
            isValid = false;
        }
        if (method.value === "0") {
            setError(errMethod, 'Geen methode meegegeven, vul methode in');
            isValid = false;
        }
        if (!primary.checked && !secondary.checked) {
            setError(errType, 'Geen graad meegegeven, vul graad in');
            isValid = false;
        }
        if (offer.value === "0") {
            setError(errOffer, 'Geen offer meegegeven, vul offer in');
            isValid = false;
        }
        return isValid;
    }
    const setError = (el, msg) => {
        el.style.display = 'block';
        el.innerText = msg;
    }
    const resetErrors = () => {
        errMethod.style.display = 'none';
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

    //LOAD IN A MAP
    const drawMap = (el,latitude, longitude) => {
        if (el.childElementCount) return;
        const map = new google.maps.Map(el, {
            center: { lat: latitude, lng: longitude },
            zoom: 15,
        });
    };

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
        //WEBSITE
        const web = document.createElement("a")
        const webLink = `https://${el.fields.website}`;
        const webText = document.createTextNode("Website: " + el.fields.naam);
        //MAP
        const ligging = document.createElement("p");
        const mapDiv = document.createElement("div");


        let review = reviewContent.data.find((item) => item.schoolnr === (el.fields.schoolnr * 1));


        //DESCRIPTION
        const para = document.createElement("p");
        const paraText = document.createTextNode(review ? review.description : "nog geen omschrijving")
        //RATING
        const ratingDiv = document.createElement("div");
        const ratingSpan = document.createElement("span");
        const ratingSpanText = document.createTextNode(`Score: ${review ? Math.round(review.avgScore*100)/100 : "nog geen score"}`);
        //EIGEN REVIEW/OMSCHRIJVING TOEVOEGEN
        const ownReview = document.createElement("p");
        const ownReviewText = document.createTextNode("Schrijf een eigen review.");

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
        web.setAttribute("href", webLink);
        web.appendChild(webText);
        //RATING
        ratingDiv.appendChild(ratingSpan);
        ratingSpan.appendChild(ratingSpanText);
        //REVIEW
        ownReview.appendChild(ownReviewText);
        //TEXT TOEVOEGEN AAN LIGGING:
        ligging.appendChild(document.createTextNode("Ligging:"))
        //SECTION
        result.appendChild(header);
        result.appendChild(tags);
        result.appendChild(locationHeader);
        result.appendChild(para);
        result.appendChild(web);
        result.appendChild(ratingDiv);
        result.appendChild(ownReview);
        result.appendChild(ligging);
        result.appendChild(mapDiv);
        resultList2.appendChild(result);

        result.setAttribute("tabindex","0");
        //ADDING EVENT LISTENERS FOR THE REVIEWS
        ownReview.addEventListener('click', () => {
            writeAReview(el.fields.schoolnr*1);
            document.querySelector("#main").classList.toggle("hidden");
            document.querySelector("#writeWebRev").classList.toggle("hidden");

        })
        ownReview.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') {
                writeAReview(el.fields.schoolnr*1);
                document.querySelector("#writeWebRev").classList.toggle("hidden");
                document.querySelector("#main").classList.toggle("hidden");
            }
        })
        result.addEventListener('focus',()=>{
            drawMap(mapDiv,el.fields.geo_point_2d[0],el.fields.geo_point_2d[1]);
        });
        result.addEventListener('mouseover',()=>{
            drawMap(mapDiv,el.fields.geo_point_2d[0],el.fields.geo_point_2d[1]);
        });

        //ADD CLASSNAMES
        result.className = "result";
        tags.className = "tags";
        offerTag.className = "tag offerTag";
        netTag.className = "tag netTag";
        para.className = "description";
        ratingDiv.className = "rating";
        ownReview.className = "leaveAReview";
        mapDiv.className = "map";
        ownReview.setAttribute("tabindex","0");
    }
    //CHANGING THE POSSIBLE OPTION ACCORDING TO PRIMARY/SECONDARY SCHOOL
    const setSelectOptions = () => {
        const scndOfferArr = ["SO", "BuSO", "DBSO"];
        const frstOfferArr = ["BA", "BuO", "KO", "LO"];

        if (secondary.checked && !primary.checked) {
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
        if (secondary.checked && primary.checked) {
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
    const fetchData2 = async () => {
        const searchQuery = (search.value === "" ? "" : "naam%3D" + search.value);

        const queryStart = (displaySet * 10)
        const rows = (primary.checked && secondary.checked ? "&rows=5" : "&rows=10")
        const locatieQuery = (location.value === "any" ? "" : "&refine.gemeente=" + location.value);
        const aanbodQuery = (offer.value === "any" ? "" : "&refine.aanbod=" + offer.value);
        const netQuery = (method.value === "any" ? "" : "&refine.onderwijsnet=" + method.value);
        const linkBasisScholen2 = `https://data.stad.gent/api/records/1.0/search/?dataset=locaties-basisscholen-gent&q=${searchQuery}&start=${queryStart}${aanbodQuery}${netQuery}${locatieQuery}${rows}`
        const linkSecundaireScholen2 = `https://data.stad.gent/api/records/1.0/search/?dataset=locaties-secundaire-scholen-gent&q=${searchQuery}&start=${queryStart}${aanbodQuery}${netQuery}${locatieQuery}${rows}`

        try {
            const responseBasis = await fetch(linkBasisScholen2);
            if (!responseBasis.ok) throw Error();
            globalDataBasis2 = await responseBasis.json();
            const responseSec = await fetch(linkSecundaireScholen2);
            if (!responseSec.ok) throw Error();
            globalDataSec2 = await responseSec.json();
        } catch (err) {
            console.log(err)
        }
        console.log(globalDataBasis2);
        try {
            if (primary.checked && !secondary.checked) {
                if (globalDataBasis2.nhits === 0) throw Error();
                globalDataBasis2.records.forEach((el) => createHtml(el));
            }
            if (!primary.checked && secondary.checked) {
                if (globalDataSec2.nhits === 0) throw Error();
                globalDataSec2.records.forEach((el) => createHtml(el));
            }
            if (primary.checked && secondary.checked) {
                if (globalDataBasis2.nhits === 0 && globalDataSec2.nhits === 0) throw Error();
                let dataTemp = globalDataBasis2.records.concat(globalDataSec2.records);
                dataTemp.forEach((el) => createHtml(el));
            }
        } catch (err) {
            console.log(err);
            setZeroResults();
        }
    }
    //FETCH REVIEWS FROM DB
    const fetchReview = async (schoolId) => {
        try {
            const review = await fetch("https://schoolsearchserver.lukasdownes.ikdoeict.be/reviews");
            if (!review.ok) throw Error();
            reviewContent = await review.json();
        } catch (err) {
            console.log(err)
        }
        console.log(reviewContent.data);
    }

    /**
     * This part of the js is for the infinite scroll effect
     */

    let lastKnownScrollPosition = 0;
    let ticking = false;
    let scrollCount = 1;

    function moooooooreData(scrollPos) {
        //console.log(lastKnownScrollPosition)
        if (scrollPos >= scrollCount * 1000 + 500) {
            fetchData2();
            displaySet++;
            scrollCount++;
        }
    }

    document.addEventListener('scroll', function (e) {
        lastKnownScrollPosition = window.scrollY;
        if (!ticking && scrollsearch) {
            window.requestAnimationFrame(function () {
                moooooooreData(lastKnownScrollPosition);
                ticking = false;
            });
            ticking = true;
        }
    });
    // ^ and this is where it ends


    //UPLOAD FORM
    const schoolRevSection = document.querySelector("#form2");
    const schoolRevForm = document.querySelector("#form2 form")
    const scoreInput = document.querySelector("#score");
    const descr = document.querySelector("#descr");
    const descrErr = document.querySelector("#descrErr");
    const closebtn = document.querySelector("#form2 .close");

    closebtn.addEventListener('click',()=>{
        resetForm2();
        resetErrors();
        schoolRevSection.classList.toggle("hidden");
        document.querySelector("#main").classList.toggle("hidden");
        document.querySelector("#writeWebRev").classList.toggle("hidden");

    })
    document.querySelectorAll("input[type=range]").forEach((el)=>{
        el.addEventListener("input", () => {
            el.previousElementSibling.innerHTML = el.value;
        })
    })
    document.querySelectorAll("textarea").forEach((el) => {
        el.addEventListener("input", () => {
            el.nextElementSibling.innerHTML = `${el.value.length}/200`
        })
    })

    //WRITING A NEW REVIEW
    let schoolnrForReview;
    const writeAReview = (schoolnr) => {
        schoolnrForReview = schoolnr;
        schoolRevSection.classList.toggle("hidden");
    }
    schoolRevForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        resetErrors2()
        const isValid = validateForm2();
        if (isValid) {
            await submitReview();
            resetForm2()
            schoolRevSection.classList.toggle("hidden");
            document.querySelector("#writeWebRev").classList.toggle("hidden");

        }
    })
    //SUBMITTING THE NEW REVIEW
    const submitReview = async () => {
        const scoreText = scoreInput.value;
        const reviewText = descr.value;
        try {
            const result = await fetch("https://schoolsearchserver.lukasdownes.ikdoeict.be/reviews", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    schoolnr: schoolnrForReview,
                    score: scoreText,
                    descr: reviewText
                }),
            })
        } catch (err) {
            console.log(err);
        }
    }
    const validateForm2 = () => {
        let isValid = true;
        if (descr.value === "" || descr.value.length > 200) {
            setError(descrErr, (descr.value === "" ? "Vul een omschrijving in." : "De omschrijving is te lang. Gebruik maximaal 200 tekens."));
            isValid = false;
        }
        if (descr.value.search(/(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+[\=\>\<=\!\~]+.+)|(let\s+.+[\=]\s*.*)|(begin\s*.*\s*end)|(\s*[\/\*]+\s*.*\s*[\*\/]+)|(\s*(\-\-)\s*.*\s+)|(\s*(contains|containsall|containskey)\s+.*)))(\s*[\;]\s*)*)+)/i) !== -1) {
            setError(descrErr, "De formvalidatie detecteerde SQL-injectie");
            isValid = false;
        }
        return isValid;
    }
    const resetErrors2 = () => {
        descrErr.style.display = 'none'
    }
    const resetForm2 = () => {
        descr.value = "";
        descr.nextElementSibling.innerHTML = "0/200"
        scoreInput.value = 3;
        scoreInput.previousElementSibling.innerHTML = "3";
    }

})();