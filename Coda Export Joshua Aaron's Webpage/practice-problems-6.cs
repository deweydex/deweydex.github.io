using System;
using System.IO;
using System.Linq;

public class StringAndArrayExercises
{
    /// <summary>
    /// Problem 28: Reverse the words of a sentence.
    /// 
    /// Example:
    /// Input: "Display the pattern like pyramid using the alphabet."
    /// Output: "alphabet. the using pyramid like pattern the Display"
    /// 
    /// Note: Preserve the original punctuation and spacing between words.
    /// </summary>
    /// <param name="sentence">The input sentence to reverse</param>
    /// <returns>String with words in reverse order</returns>
    public static string ReverseWords(string sentence)
    {
        // TODO: Write your code here to reverse the words
        return "";
    }

    /// <summary>
    /// Problem 29: Find the size of a specified file in bytes.
    /// 
    /// Example:
    /// Input: "example.txt"
    /// Output: 31 (bytes)
    /// 
    /// Note: Make sure to handle cases where the file doesn't exist
    /// </summary>
    /// <param name="filePath">Path to the file to check</param>
    /// <returns>Size of the file in bytes, or -1 if file doesn't exist</returns>
    public static long GetFileSize(string filePath)
    {
        // TODO: Write your code here to get file size
        // Remember to use try-catch for file operations
        return 0;
    }

    /// <summary>
    /// Problem 30: Convert a hexadecimal number to decimal.
    /// 
    /// Example:
    /// Input: "4B0"
    /// Output: 1200
    /// 
    /// Note: Handle both uppercase and lowercase hex digits
    /// </summary>
    /// <param name="hexNumber">String representation of hexadecimal number</param>
    /// <returns>Decimal (base-10) value of the number</returns>
    public static int HexToDecimal(string hexNumber)
    {
        // TODO: Write your code here to convert hex to decimal
        return 0;
    }

    /// <summary>
    /// Problem 31: Multiply corresponding elements of two integer arrays.
    /// 
    /// Example:
    /// Input arrays: [1, 3, -5, 4] and [1, 4, -5, -2]
    /// Output: [1, 12, 25, -8]
    /// 
    /// Note: Assume both arrays have the same length
    /// </summary>
    /// <param name="array1">First array of integers</param>
    /// <param name="array2">Second array of integers</param>
    /// <returns>Array containing products of corresponding elements</returns>
    public static int[] MultiplyArrays(int[] array1, int[] array2)
    {
        // TODO: Write your code here to multiply corresponding elements
        return new int[] { };
    }

    /// <summary>
    /// Problem 32: Create a string of four copies of the last four characters.
    /// If the string is less than 4 characters, return the original string.
    /// 
    /// Example:
    /// Input: "The quick brown fox jumps over the lazy dog."
    /// Output: "dog.dog.dog.dog."
    /// </summary>
    /// <param name="text">Input string</param>
    /// <returns>Four copies of last four chars or original string if length < 4</returns>
    public static string RepeatLastFour(string text)
    {
        // TODO: Write your code here to repeat the last four characters
        return "";
    }

    // You can add a Main method to test your solutions
    public static void Main()
    {
        // Example test cases:
        // Console.WriteLine(ReverseWords("Display the pattern like pyramid using the alphabet."));
        // Console.WriteLine(GetFileSize("example.txt"));
        // Console.WriteLine(HexToDecimal("4B0"));
        // Console.WriteLine(string.Join(" ", MultiplyArrays(
        //     new int[] { 1, 3, -5, 4 },
        //     new int[] { 1, 4, -5, -2 }
        // )));
        // Console.WriteLine(RepeatLastFour("The quick brown fox jumps over the lazy dog."));
    }
}
