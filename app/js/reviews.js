document.getElementById("review_form").addEventListener("submit", function(event){
    event.preventDefault();
    let name = document.getElementById("name").value;
    let date = document.getElementById("date").value;
    let rating = document.getElementById("rating").value;
    let comments = document.getElementById("comments").value;

    DBHelper.addReview({
        name: name,
        date: date,
        rating: rating,
        comments: comments
    });
})