using System;
using System.Collections.Generic;
using System.Linq;

public class StringAndNumberExercises
{
    /// <summary>
    /// Problem 23: Write a program to convert a given string into lowercase.
    /// 
    /// Example:
    /// Input: "Write A C# Sharp PROGRAM"
    /// Output: "write a c# sharp program"
    /// </summary>
    /// <param name="input">String to convert to lowercase</param>
    /// <returns>Lowercase version of the input string</returns>
    public static string ConvertToLowerCase(string input)
    {
        // TODO: Write your code here to convert the string to lowercase
        return "";
    }

    /// <summary>
    /// Problem 24: Find the longest word in a string.
    /// 
    /// Example:
    /// Input: "Write a C# Sharp Program to display the following pattern"
    /// Output: "following"
    /// 
    /// Note: If there are multiple words with the same length, return the first one.
    /// </summary>
    /// <param name="sentence">Input string to analyze</param>
    /// <returns>The longest word in the string</returns>
    public static string FindLongestWord(string sentence)
    {
        // TODO: Write your code here to find the longest word
        return "";
    }

    /// <summary>
    /// Problem 25: Print all odd numbers from 1 to 99.
    /// The method should return a list of odd numbers that can be printed one per line.
    /// 
    /// Example Output: [1, 3, 5, ..., 97, 99]
    /// </summary>
    /// <returns>List of all odd numbers from 1 to 99</returns>
    public static List<int> GetOddNumbers()
    {
        // TODO: Write your code here to generate odd numbers
        return new List<int>();
    }

    /// <summary>
    /// Problem 26: Compute the sum of the first 500 prime numbers.
    /// 
    /// Expected Output: 824693
    /// </summary>
    /// <returns>Sum of first 500 prime numbers</returns>
    public static long ComputePrimeSum()
    {
        // TODO: Write your code here to compute the sum of first 500 primes
        // Hint: First create a method to check if a number is prime
        // Then find the first 500 primes and sum them
        return 0;
    }

    /// <summary>
    /// Problem 27: Compute the sum of an integer's digits.
    /// 
    /// Example:
    /// Input: 12
    /// Output: 3 (because 1 + 2 = 3)
    /// </summary>
    /// <param name="number">Integer whose digits should be summed</param>
    /// <returns>Sum of the digits</returns>
    public static int SumOfDigits(int number)
    {
        // TODO: Write your code here to sum the digits
        return 0;
    }

    // Optional: Helper method for testing if a number is prime
    private static bool IsPrime(int number)
    {
        // TODO: Implement prime number check if needed for Problem 26
        return false;
    }

    // You can add a Main method to test your solutions
    public static void Main()
    {
        // Example test cases:
        // Console.WriteLine(ConvertToLowerCase("Write A C# Sharp PROGRAM"));
        // Console.WriteLine(FindLongestWord("Write a C# Sharp Program to display the following pattern"));
        // foreach (var num in GetOddNumbers()) Console.WriteLine(num);
        // Console.WriteLine(ComputePrimeSum());
        // Console.WriteLine(SumOfDigits(12));
    }
}
