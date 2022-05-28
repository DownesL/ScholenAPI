(function() {
    const form = document.querySelector("#form3 form");
    const nameErr = document.querySelector("#naamErr");
    const reviewErr = document.querySelector("#reviewErr");
    const name = document.querySelector("#naam");
    const reviewInput = document.querySelector("#review");
    const score = document.querySelector("#scoreWeb")
    const formSection = document.querySelector("#form3");
    const webFormRes = document.querySelector("#webFormRes");
    const writeWebRev = document.querySelector("#writeWebRev");
    const reviewList = document.querySelector(".reviewList")
    const reviewSort = document.querySelector("#reviewSorteer");
    const closeBtnRev = document.querySelector("#form3 .close");
    const closeBtnRevList = document.querySelector("#webFormRes .close");

    closeBtnRevList.addEventListener('click', () => {
        toggleViewNext()
    })
    closeBtnRevList.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            toggleViewNext();
        }
    });
    closeBtnRev.addEventListener('click', ()=>{
        toggleView();
    })
    closeBtnRev.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            toggleView();
        }
    });
    document.querySelector("#webFormRes button").addEventListener('click', async () => {
        document.querySelectorAll(".reviewList section").forEach((el) => {
            reviewList.removeChild(el);
        })
        await getReviews(reviewSort.value);
    })
    writeWebRev.addEventListener('click', () => {
        toggleView()
    })

    const toggleView = () => {
        writeWebRev.classList.toggle("hidden");
        formSection.classList.toggle("hidden");
        document.querySelector("#main").classList.toggle("hidden");
    }
    const toggleViewNext = () => {
        writeWebRev.classList.toggle("hidden");
        webFormRes.classList.toggle("hidden");
        document.querySelector("#main").classList.toggle("hidden");
    }





    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        resetErrors();
        const isValid = validateForm();
        if (isValid) {
            console.log('Form is valid');
            try {
                await submitReview();
                await getReviews();
            } catch (err) {
                console.log(err)
            }
            formSection.classList.toggle('hidden');
            webFormRes.classList.toggle('hidden');
            resetForm();
        } else {
            console.log('Form is invalid')
        }
    });
    const resetErrors = () => {
        nameErr.style.display = 'none';
        reviewErr.style.display = 'none';
    }
    const validateForm = () => {
        let isvalid = true;
        if (name.value === "") {
            setError(nameErr,"Gelieve een naam in te vullen.")
            isvalid = false;
        }
        if (reviewInput.value === "") {
            setError(reviewErr,"Gelieve een review te schrijven.")
            isvalid = false;
        }
        if (name.value.search(/(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+[\=\>\<=\!\~]+.+)|(let\s+.+[\=]\s*.*)|(begin\s*.*\s*end)|(\s*[\/\*]+\s*.*\s*[\*\/]+)|(\s*(\-\-)\s*.*\s+)|(\s*(contains|containsall|containskey)\s+.*)))(\s*[\;]\s*)*)+)/i) !== -1) {
            setError(nameErr, "De formvalidatie detecteerde SQL-injectie, probeer iets anders.")
            isvalid = false;
        }
        if (reviewInput.value.search(/(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from\s*.+)|(insert\s*.+\s*into\s*.+)|(update\s*.+\s*set\s*.+)|(delete\s*.+\s*from\s*.+)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+[\=\>\<=\!\~]+.+)|(let\s+.+[\=]\s*.*)|(begin\s*.*\s*end)|(\s*[\/\*]+\s*.*\s*[\*\/]+)|(\s*(\-\-)\s*.*\s+)|(\s*(contains|containsall|containskey)\s+.*)))(\s*[\;]\s*)*)+)/i) !== -1){
            setError(reviewErr, "De formvalidatie detecteerde SQL-injectie, probeer iets anders.")
            isvalid = false;
        }
        return isvalid;
    }
    const setError = (el, msg) => {
        el.style.display = 'block';
        el.innerText = msg;
    }
    const resetForm = () => {
        name.value = "";
        reviewInput.value = "";
        reviewInput.nextElementSibling.innerHTML = "0/200";
        score.value = 3;
        score.previousElementSibling.innerHTML = "3";
    }
    //GETTING THE NEW REVIEW
    const getReviews = async (order="datum DESC") => {
        const result = await fetch(`https://schoolsearchserver.lukasdownes.ikdoeict.be/websitereviews/${order}`)
        if(!result.ok) throw Error();
        const resultContent = await result.json();
        resultContent.data.forEach((el) => {
            createReview(el);
        })
    }
    //CREATING THE HTML FOR THE REVIEWS
    const createReview = (el) => {
        const review = document.createElement("section");
        //HEADER
        const header = document.createElement("h3");
        const headerText = document.createTextNode(`${el.naam}`)
        //DESCRIPTION
        const para = document.createElement("p");
        const paraText = document.createTextNode(`${el.commentaar}`)
        //RATING
        const ratingDiv = document.createElement("div");
        const ratingSpan = document.createElement("span");
        const ratingSpanText = document.createTextNode(`Score: ${el.score}`);
        //EIGEN REVIEW/OMSCHRIJVING TOEVOEGEN
        const datum = document.createElement("span");
        const datumText = document.createTextNode(`${el.datum.split("T")[0]}`);


        //HEADER
        header.appendChild(headerText);
        //DESCRIPTION
        para.appendChild(paraText);
        //RATING
        ratingDiv.appendChild(ratingSpan)
        ratingSpan.appendChild(ratingSpanText);
        //REVIEW
        datum.appendChild(datumText);
        //SECTION
        review.appendChild(header);
        review.appendChild(para);
        review.appendChild(ratingDiv);
        review.appendChild(datum);
        reviewList.appendChild(review);

        //ADD CLASSNAMES
        review.className = "review";
        para.className = "reviewText";
        ratingDiv.className = "rating";
        datum.className = "datum";
    }

    //SUBMITTING THE NEW REVIEW
    const submitReview = async () => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
        const result = await fetch("https://schoolsearchserver.lukasdownes.ikdoeict.be/websitereviews/",{
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                name: name.value,
                review: reviewInput.value,
                score: score.value,
                datum: date
            }),
        })
        if (!result.ok) throw Error()
    }
})();

