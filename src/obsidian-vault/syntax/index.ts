import { img_wiki_syntax } from './img';
import { links_wiki_syntax } from './links';

function convert(text) {
    return links_wiki_syntax(img_wiki_syntax(text));
}

export { convert };