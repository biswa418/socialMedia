{
    // method to submit the form data for new post using AJAX
    let createPost = function () {

        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    //console.log(data); //currently only showing data
                    let domPost = newPostDom(data.data.post);
                    let postContainer = document.querySelector('#list-posts-container>ul');
                    postContainer.innerHTML = domPost + postContainer.innerHTML;

                    new ToggleLike($(' .toggle-like-button', domPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post Created",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                    document.querySelector('#new-post-form>textarea').value = '';

                    deletePost($(' .delete-post-button', domPost));
                },
                error: function (err) {
                    console.log(err.responseText);
                }
            })

            // fetch('/posts/create', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: new URLSearchParams(newPostForm.serialize()).toString()
            // })
            //     .then((body) => {
            //         console.log(body);
            //     })
            //     .catch(error => {
            //         console.error('Error:', error);
            //     });

        });
    }

    //method to create post inside DOM
    let newPostDom = function (post) {
        return `<li id="post-${post._id}">
                    <p>
                            <small>
                                <a class="delete-post-button" href="posts/destroy/${post._id}">X</a>
                            </small>

                            ${post.content}
                            <br>

                            <small>
                                ${post.user.name}
                            </small>

                            <br>
                            <small>
                                <a class="toogle-like-button" data-likes="0" href="/likes/togglt/id=${post._id}&type=Post">
                                    0 Likes
                                </a>
                            </small>
                    </p>
                
                    <div class="post-comments">
                            <form action="/comments/create" method="POST">
                                <input type="text" name="content" placeholder="Type here to add comment..">
                                <input type="hidden" name="post" value="${post._id}">
                                <input type="submit" value="Add Comment">
                            </form>
                
                            <div class="post-comments-list">
                                <ul id="post-comments-${post._id}">

                                </ul>
                            </div>
                    </div>
                </li>`
    }

    //method to delete the post
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });

            new Noty({
                theme: 'relax',
                text: "Post and Comments Deleted",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        });
    }

    let postContainerLi = document.querySelectorAll('#list-posts-container>ul>li');

    postContainerLi.forEach(element => {
        deletePost($(' .delete-post-button', element));
    });

    createPost();
}