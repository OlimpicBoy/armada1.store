
// Зчитування коментарів з файлу JS та відображення їх на сторінці
function getCommentsFromFile() {
    var script = document.createElement('script');
    script.src = 'contants/comments.js';
    document.head.appendChild(script);

    script.onload = function () {
        displayComments(comments);
    };
}
var likedComments = JSON.parse(localStorage.getItem('likedComments')) || [];

// Function to toggle like for a comment
function toggleLike(index, likeCount) {
    var likeCountElement = document.getElementById('likeCount_' + index);

    // Check if the element with the specified ID exists
    if (!likeCountElement) {
        console.error('Element with ID ' + 'likeCount_' + index + ' not found.');
        return;
    }

    // Check if the comment is already liked by the user
    var isLiked = likedComments.includes(index);

    if (isLiked) {
        // User has already liked the comment, so unlike it

        likedComments = likedComments.filter(item => item !== index);
    } else {
        // User has not liked the comment, so like it
        likeCount++;
        likedComments.push(index);
    }

    // Update the like count in the UI
    likeCountElement.textContent = likeCount;

    // Update the likedComments array in localStorage
    localStorage.setItem('likedComments', JSON.stringify(likedComments));
}


function deleteComment(whereAprea) {
    var guestComments = JSON.parse(localStorage.getItem('guestComments')) || [];
    var updatedComments = guestComments.filter(comment => comment.whereAprea !== whereAprea);
    localStorage.setItem('guestComments', JSON.stringify(updatedComments));
}
function displayComments(comments) {
    var commentsContainer = document.getElementById('commentsContainer');
    var guestComments  = JSON.parse(localStorage.getItem('guestComments')) || [];
    if (comments && comments.length > 0) {
        comments.forEach(function (commentObj, index) {
            var commentDiv = document.createElement('div');
            commentDiv.classList.add('commentWrapperJs');
        
            commentDiv.innerHTML = `
<div class="commentItem">
    <img class="commentImage" src="./img/${commentObj.img}" alt="client avatar">
    <div class="commentText">
        <a class="commentClientName" target="_blank" href="${commentObj.Clientlink}">${commentObj.ClientName}</a>
        <span class="commentClientDescrp">${commentObj.CLientText}</span>
        ${commentObj.img_rev !== "" ? `<img src="./img/${commentObj.img_rev}" style="width: 250px; height: auto"></img>` : ''}
        <div class="buttonContainter" style="margin-top: 5px;">
            <div class="buttonAddWrapper">
                <button class="customAddButton" id="addButton_ + ${index}" onclick="addInput(${index})"></button>
            </div>
            <div class="buttonLikeWrapper">
                <button class="customLikeButton" onclick="toggleLike(${index}, ${commentObj.likeCount})"></button>
                <span class="customLikeCount" id="likeCount_${index}">${commentObj.likeCount}</span>     
            </div>
        </div>
    </div>
</div>`;

            commentsContainer.appendChild(commentDiv);
          if (guestComments && guestComments.length > 0) {
    var matchingSubComments = guestComments.filter(item => item.whereAprea === index);

    // Перевірка, чи є підкоментарі для поточного ітерованого коментаря
    if (matchingSubComments.length > 0) {
        var subCommentsContainer = document.createElement('div');
        subCommentsContainer.classList.add('subCommentsContainer');
    
       
        matchingSubComments.forEach(function (subComment) {
            var subCommentDiv = document.createElement('div');
            subCommentDiv.classList.add('subCommentWrapper');

            subCommentDiv.innerHTML = `
              
                <div class="commentItemGuest">
                <div class="commentImageGuest" ></div>
                <div class="commentText">
                    <span style="color:black; font-weight:700">Guest</span>
                    <span class="commentClientDescrp">${subComment.CLientText}</span>
                  
                </div>
          
            `;

            subCommentsContainer.appendChild(subCommentDiv);
      
        });

        // Додайте контейнер з маленькими коментарями під основний коментар
        commentDiv.appendChild(subCommentsContainer);
    }
}
            // Якщо є коментарі для даного основного коментаря, вивести їх
          

            // Перевірте, чи коментар був вподобаний і оновіть likeCount
            if (likedComments.includes(index)) {
                var likeCountElement = document.getElementById('likeCount_' + index);
                if (likeCountElement) {
                    likeCountElement.textContent = commentObj.likeCount + 1;
                }
            }
        });
    } else {
        commentsContainer.textContent = '';
    }
}

function addComment(newCommentText, index) {
    // Check if a comment text is provided
    if (newCommentText) {
        // Create a new comment object
        var newComment = {
            ClientName: 'Guest', // You can customize this
            CLientText: newCommentText,
            whereAprea: index, // Initial like count
        };

        // Fetch comments from localStorage
        var guestComments = JSON.parse(localStorage.getItem('guestComments')) || [];

        // Add the new comment to the array
        guestComments.push(newComment);

        // Update localStorage with the new array of comments
        localStorage.setItem('guestComments', JSON.stringify(guestComments));

        // Display the updated comments
       

        // Remove the input and button elements
        removeInputAndButton(index);
       displayComments(null)
       displayComments(comments)
    }
}

function removeInputAndButton(index) {
    // Find the comment container using the index
    var commentContainer = document.querySelector('.commentWrapperJs:nth-child(' + (index + 1) + ')');

    // Remove the input and button elements
    var inputElement = commentContainer.querySelector('input');
    var addButton = commentContainer.querySelector('.addButtonInputDown'); // Коректний селектор

    if (inputElement && addButton) {
        inputElement.remove();
        addButton.remove();
    }
}

function addInput(index) {
    // Check if an input with the same index is already open
    var existingInput = document.getElementById('input_' + index);
    var existingButton = document.getElementById('addButtonInput_' + index);

    // If an input exists, close it
    if (existingInput && existingButton) {
        existingInput.remove();
        existingButton.remove();
        return;
    }

    // Create a new input element
    var inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.className = "customCommentInput";
    inputElement.placeholder = 'Введіть коментар';
    inputElement.id = 'input_' + index;

    // Create a new button element for adding comments
    var addButton = document.createElement('button');
    addButton.textContent = 'Добавити Коментар';
    addButton.id = 'addButtonInput_' + index;
    addButton.className = "addButtonInputDown";
    addButton.onclick = function () {
        // Call the addComment function with the input value when the "Add" button is clicked
        addComment(inputElement.value, index);
    };

    // Find the comment container using the index
    var commentContainer = document.querySelector('.commentWrapperJs:nth-child(' + (index + 1) + ')');

    // Insert the input and button elements after the customAddButton
    commentContainer.appendChild(inputElement);
    commentContainer.appendChild(addButton);
}
// Виклик функції для зчитування коментарів з файлу
getCommentsFromFile();
