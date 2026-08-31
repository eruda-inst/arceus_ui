export default class Misc {
  static getInitials = (fullName?: string): string => {
    if (!fullName) return "";

    const trimmedName = fullName.trim();
    const upperName = trimmedName.toUpperCase();
    const words = upperName.split(" ");
    const wordCount = words.length;

    if (wordCount === 1) return words[0][0];

    const firstInitial = words[0][0];
    const lastInitial = words[wordCount - 1][0];

    return firstInitial + lastInitial;
  };
}
