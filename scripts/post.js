const form = document.querySelector("#giveAScore");

//SUBMITTING THE NEW REVIEW
const submitReview = async () => {
    const result = await fetch("https://schoolsearchserver.lukasdownes.ikdoeict.be/reviews",{
        method : "POST",
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            schoolnr : schoolnr,
            score : scoreText,
            descr : reviewText
        }),
    })
}