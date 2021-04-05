export function tryit(tree) {
    return tree.match({
        tag: "a",
        content: [ "Try it" ]
    }, node => ({
        ...node,
        attrs: {
            ...node.attrs,
            "class": "try-it"
        }
    }));
}