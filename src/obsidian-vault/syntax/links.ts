function links_wiki_syntax(page_content, bp_peer: {}) {

    const element = { pattern: /\[\[(?!.*!).*?\|(.*?)\]\]/g, target: "[[$2|$1]]" };
    const array = [...page_content.matchAll(element.pattern)];
    var page_content = page_content.replace(element.pattern, element.target);
}

export { links_wiki_syntax }