export function getAllComments(content: string): string[] {
  const regexComment = new RegExp(/(\/\*\*?([\s\S]*?)\*\/)|(\/\/(.*)$)/g);
  const AllComments = content.match(regexComment);
  return AllComments.map(c => {
    return c.replace(/(\*|\r|\n|\/)/g, '').trim();
  });
}
