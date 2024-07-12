export class TextAnalysisService {
  static countWords(text: string): number {
    const words = text.trim().split(/[\s.,!?;:()]+/);
    return words.filter((word) => word.length > 0).length;
  }

  static countCharacters(text: string): number {
    return text.replace(/\s+/g, "").length;
  }

  static countSentences(text: string): number {
    return text.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0)
      .length;
  }

  static countParagraphs(text: string): number {
    return text.split(/\n+/).filter((paragraph) => paragraph.trim().length > 0)
      .length;
  }

  static findLongestWord(text: string): string {
    let longestWord = "";

    // Split the text into words considering various delimiters
    const words = text.trim().split(/[\s.,!?;:()]+/);

    words.forEach((word) => {
      // Split the word further based on special characters
      const subWords = word.split(/[\/\-_]+/);

      subWords.forEach((subWord) => {
        // Remove non-alphanumeric characters except hyphen and apostrophe
        const cleanedWord = subWord.replace(/[^\w'-]/g, "");

        if (cleanedWord.length > longestWord.length) {
          longestWord = cleanedWord;
        }
      });
    });

    return longestWord;
  }
}
