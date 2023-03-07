{
    // method to submit the form data for new Comment using AJAX
    let createComment = function () {

        let newCommentForm = $('#new-comment-form');

        newCommentForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function (data) {
                    //console.log(data.data.comment); //currently only showing data
                    let domComment = newCommentDom(data.data.comment);
                    let CommentContainer = document.querySelector(`#post-comments-${data.data.comment.post._id}`);
                    CommentContainer.innerHTML = domComment + CommentContainer.innerHTML;

                    new Noty({
                        theme: 'relax',
                        text: "Comments added",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                    document.querySelector(`#input-${data.data.comment.post._id}`).value = '';

                    // deleteComment($(' .delete-comment-button', domComment));
                    let CommentContainerLi = document.querySelectorAll('.comments-list');

                    CommentContainerLi.forEach(element => {
                        deleteComment($(' .delete-comment-button', element));
                    });

                },
                error: function (err) {
                    console.log(err.responseText);
                }
            });
        });
    }

    //method to create post inside DOM
    let newCommentDom = function (comment) {
        return `<li class="comments-list" id="comment-${comment._id}">
            <p>
                    <small>
                        <a class="delete-comment-button" href="comments/destroy/${comment._id}">X</a>
                    </small>
                    ${comment.content}
                            <br>
                            <small>
                                ${comment.user.name}
                            </small>
            </p>
        </li>`
    }

    //method to delete the comment
    let deleteComment = function (deleteLink) {
        $(deleteLink).click(function (e) {
            console.log('clicked');
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#comment-${data.data.comment_id}`).remove();
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });

            new Noty({
                theme: 'relax',
                text: "Comment Deleted",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        });
    }

    let CommentContainerLi = document.querySelectorAll('.comments-list');

    CommentContainerLi.forEach(element => {
        // console.log(element);
        deleteComment($(' .delete-comment-button', element));
    });

    createComment();
}