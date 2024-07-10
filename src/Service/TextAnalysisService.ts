export class TextAnalysisService {

  static countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  static countCharacters(text: string): number {
    return text.replace(/\s+/g, '').length;
  }

  static countSentences(text: string): number {
    return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
  }

  static countParagraphs(text: string): number {
    return text.split(/\n+/).filter(paragraph => paragraph.trim().length > 0).length;
  }

  static findLongestWord(text: string): string {
    return text.split(/\s+/).reduce((longest, current) => {
      return current.length > longest.length ? current : longest;
    }, '');
  }
}
