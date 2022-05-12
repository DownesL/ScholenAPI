"use strict";
(function() {
    const linkBasisScholen = 'https://data.stad.gent/api/records/1.0/search/?dataset=locaties-basisscholen-gent&q=&rows=500';
    const linkSecundaireScholen = 'https://data.stad.gent/api/records/1.0/search/?dataset=locaties-secundaire-scholen-gent&q=&rows=500';
    let globalDataBasis;
    let globalDataSec;
    const search = document.querySelector("#search");
    const location = document.querySelector("#location");
    const type = document.querySelector("#type");
    const offer = document.querySelector("#offer");
    const method = document.querySelector("#method");
    const form = document.querySelector("form");
    const errlocation = document.querySelector("#locationErr");
    const errType = document.querySelector("#typeErr");
    const errOffer = document.querySelector("#offerErr");
    const errMethod = document.querySelector("#methodErr");
    const searchArea = document.querySelector(".searchArea");
    const resultList = document.querySelector(".results");
    const resultBtn = document.querySelector("#newSearchFilter");
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        resetErrors();
        const isValid = validateForm();
        if (isValid) {
            console.log('Form is valid');
            searchArea.classList.toggle('hidden');
            resultList.classList.toggle('hidden');
            fetchData();
        //resetForm();
        } else console.log('Form is invalid');
    });
    type.addEventListener('focusout', ()=>{
        const scndOfferArr = [
            "SO",
            "BuSO",
            "DBSO"
        ];
        const frstOfferArr = [
            "BA",
            "BuO",
            "KO",
            "LO"
        ];
        if (type.value === "Secondary") {
            scndOfferArr.forEach((el)=>{
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            });
            frstOfferArr.forEach((el)=>{
                document.querySelector(`option[value="${el}"]`).setAttribute("disabled", "");
            });
        }
        if (type.value === "Primary") {
            scndOfferArr.forEach((el)=>{
                document.querySelector(`option[value="${el}"]`).setAttribute("disabled", "");
            });
            frstOfferArr.forEach((el)=>{
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            });
        }
        if (type.value === "any") {
            scndOfferArr.forEach((el)=>{
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            });
            frstOfferArr.forEach((el)=>{
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            });
        }
        offer.value = 0;
        method.value = 0;
    });
    resultBtn.addEventListener('click', ()=>{
        searchArea.classList.toggle('hidden');
        resultList.classList.toggle('hidden');
        document.querySelectorAll(".result").forEach((el)=>{
            resultList.removeChild(el);
        });
    });
    const validateForm = ()=>{
        let isValid = true;
        if (location.value === '0') {
            setError(errlocation, 'Geen locatie meegegeven, vul locatie in');
            isValid = false;
        }
        if (method.value === "0") {
            setError(errMethod, 'Geen methode meegegeven, vul methode in');
            isValid = false;
        }
        if (type.value === "0") {
            setError(errType, 'Geen type meegegeven, vul type in');
            isValid = false;
        }
        if (offer.value === "0") {
            setError(errOffer, 'Geen offer meegegeven, vul offer in');
            isValid = false;
        }
        return isValid;
    };
    const setError = (el, msg)=>{
        el.style.display = 'block';
        el.innerText = msg;
    };
    const resetErrors = ()=>{
        errMethod.style.display = 'none';
        errOffer.style.display = 'none';
        errType.style.display = 'none';
        errlocation.style.display = 'none';
    };
    const resetForm = ()=>{
        location.value = 0;
        offer.value = 0;
        method.value = 0;
        type.value = 0;
    };
    const displayData = ()=>{
        let data;
        if (type.value === "Primary") data = globalDataBasis.records.filter((el)=>(offer.value === "any" ? true : el.fields.aanbod === offer.value) && (method.value === "any" ? true : el.fields.onderwijsnet === method.value) && (location.value === "any" ? true : el.fields.gemeente === location.value)
        );
        if (type.value === "Secondary") data = globalDataSec.records.filter((el)=>(offer.value === "any" ? true : el.fields.aanbod === offer.value) && (method.value === "any" ? true : el.fields.onderwijsnet === method.value) && (location.value === "any" ? true : el.fields.gemeente === location.value)
        );
        if (type.value === "any") {
            let dataBasisTemp = globalDataBasis.records.filter((el)=>(offer.value === "any" ? true : el.fields.aanbod === offer.value) && (method.value === "any" ? true : el.fields.onderwijsnet === method.value) && (location.value === "any" ? true : el.fields.gemeente === location.value)
            );
            let dataSecTemp = globalDataSec.records.filter((el)=>(offer.value === "any" ? true : el.fields.aanbod === offer.value) && (method.value === "any" ? true : el.fields.onderwijsnet === method.value) && (location.value === "any" ? true : el.fields.gemeente === location.value)
            );
            data = dataBasisTemp.concat(dataSecTemp);
        }
        if (search.value !== "") data = data.filter((el)=>el.fields.naam.search(search.value) !== -1
        );
        console.log(data);
        data.forEach((el)=>{
            const result = document.createElement("div");
            const header = document.createElement("h2");
            const headerText = document.createTextNode(`${el.fields.naam}`);
            const locationHeader = document.createElement('h3');
            const locationHeaderText = document.createTextNode(`${el.fields.gemeente}`);
            const tags = document.createElement("div");
            const offerTag = document.createElement("span");
            const offerTagText = document.createTextNode(`${el.fields.aanbod}`);
            const netTag = document.createElement("span");
            const netTagText = document.createTextNode(`${el.fields.onderwijsnet}`);
            const para = document.createElement("p");
            const paraText = document.createTextNode("Deze school is heel mooi en heel goed");
            const ratingDiv = document.createElement("div");
            const ratingSpan = document.createElement("span");
            const ratingSpanText = document.createTextNode("Score: * * * * *");
            tags.appendChild(offerTag);
            tags.appendChild(netTag);
            offerTag.appendChild(offerTagText);
            netTag.appendChild(netTagText);
            para.appendChild(paraText);
            ratingDiv.appendChild(ratingSpan);
            ratingSpan.appendChild(ratingSpanText);
            result.appendChild(header);
            header.appendChild(headerText);
            result.appendChild(tags);
            result.appendChild(locationHeader);
            locationHeader.appendChild(locationHeaderText);
            result.appendChild(para);
            result.appendChild(ratingDiv);
            resultList.appendChild(result);
            result.className = "result";
            tags.className = "tags";
            offerTag.className = "tag offerTag";
            netTag.className = "tag netTag";
            para.className = "description";
            ratingDiv.className = "rating";
        });
    };
    const fetchData = async ()=>{
        try {
            let responseBasis = await fetch(linkBasisScholen);
            if (!responseBasis.ok) throw Error();
            globalDataBasis = await responseBasis.json();
            let responseSec = await fetch(linkSecundaireScholen);
            if (!responseSec.ok) throw Error();
            globalDataSec = await responseSec.json();
            displayData();
        } catch (err) {
            console.log(err);
        }
    };
})();

//# sourceMappingURL=index.1a15b2df.js.map
