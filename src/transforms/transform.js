import PostHTML from "posthtml";
import { tryit } from "./tryit";

export function transform(html) {
    const finalHtml = PostHTML([tryit])
        .process(html, { sync: true })
        .html;

    return finalHtml;
}