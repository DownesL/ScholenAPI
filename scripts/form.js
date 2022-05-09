"use strict";

(function() {

    const location = document.querySelector("#location");
    const type = document.querySelector("#type");
    const offer = document.querySelector("#offer");
    const method = document.querySelector("#method");
    const form = document.querySelector("form");

    const errlocation = document.querySelector("#locationErr");
    const errType = document.querySelector("#typeErr");
    const errOffer = document.querySelector("#offerErr");
    const errMethod = document.querySelector("#methodErr");

    form.addEventListener('submit', e=> {
        e.preventDefault();
        resetErrors();
        const isValid = validateForm();
        if(isValid) {
            console.log('Form is valid');
            resetForm();
        } else {
            console.log('Form is invalid')
        }
    })

    type.addEventListener('focusout',()=> {
        const scndOfferArr = ["SO", "BuSO", "DBSO"];
        const frstOfferArr = ["BA", "BuO","KO","LO"];

        const scndMethodArr = [""];
        const frstMethodArr = ["Freinet","Jenaplan","EG","Dalton","Leefschool","Montessori"];

        if(type.value === "Secondary") {
            scndOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })
            frstOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).setAttribute("disabled", "");
            })/*
            scndMethodArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })*/
            frstMethodArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).setAttribute("disabled", "");
            })
        }
        if (type.value === "Primary") {
            scndOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).setAttribute("disabled", "");
            })
            frstOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })/*
            scndMethodArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).setAttribute("disabled", "");
            })*/
            frstMethodArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })
        } else if(type.value === "all") {
            scndOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })
            frstOfferArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })/*
            scndMethodArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })*/
            frstMethodArr.forEach((el) => {
                document.querySelector(`option[value="${el}"]`).removeAttribute("disabled");
            })
        }
        offer.value = 0;
        method.value = 0;
    });

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
        if (type.value === "0") {
            setError(errType,'Geen type meegegeven, vul type in');
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
        type.value = 0;
        
    }
})();