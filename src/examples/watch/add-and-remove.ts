(async () => {
    const { person, generals, idempotencePublished } =
        await populateData();

    // Define a condition testing whether a post is published.
    function postIsPublished(post) {
        return j.exists({
            type: "Blog.Post.Published",
            post
        }).suchThat(j.not(postIsUnpublished));
    }

    function postIsUnpublished(published) {
        return j.exists({
            type: "Blog.Post.Unpublished",
            published
        });
    }

    // Look for published posts authored by the user.
    function publishedPostsByAuthor(author) {
        return j.match({
            type: "Blog.Post",
            author
        }).suchThat(postIsPublished);
    }

    function addPostToList(post) {
        console.log("Add post to list:");
        console.log(JSON.stringify(post, null, 2));

        return {
            element: "<li>",
            post
        };
    }

    function removePostFromList(postListItem) {
        console.log("Remove post from list:");
        console.log(JSON.stringify(postListItem, null, 2));
    }


    console.log("Watching for published posts:");
    const postWatch = j.watch(person,
        j.for(publishedPostsByAuthor),
        addPostToList,
        removePostFromList);
    await pause();

    console.log("\n");
    console.log("Publishing a post:");
    await publishPost(generals);
    await pause();

    console.log("\n");
    console.log("Unpublishing a post:");
    await unpublishPost(idempotencePublished);
    await pause();

    postWatch.stop();
})();

async function populateData() {
    const person = await j.fact({
        type: "Jinaga.User",
        publicKey: "---IF THIS WERE A REAL USER, THEIR PUBLIC KEY WOULD BE HERE---"
    });

    const historicalModeling = await j.fact({
        type: "Blog.Post",
        author: person,
        title: "What is Historical Modeling?"
    });
    await publishPost(historicalModeling);

    const idempotence = await j.fact({
        type: "Blog.Post",
        author: person,
        title: "Idempotence"
    });
    const idempotencePublished = await publishPost(idempotence);

    const generals = await j.fact({
        type: "Blog.Post",
        author: person,
        title: "What Two Generals Can Teach Us About Web APIs"
    });

    return {
        person,
        generals,
        idempotencePublished
    };
}

async function publishPost(post) {
    return await j.fact({
        type: "Blog.Post.Published",
        post
    });
}

async function unpublishPost(published) {
    return await j.fact({
        type: "Blog.Post.Unpublished",
        published
    });
}

function pause() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 100);
    });
}