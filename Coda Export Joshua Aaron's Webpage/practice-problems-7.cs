public class NumberAndStringChecks
{
    /// <summary>
    /// Problem 33: Check if a given positive number is a multiple of 3 or 7.
    /// 
    /// Example:
    /// Input: 15
    /// Output: True (because 15 is a multiple of 3)
    /// 
    /// Input: 14
    /// Output: True (because 14 is a multiple of 7)
    /// 
    /// Input: 8
    /// Output: False
    /// 
    /// Note: Assume input is positive
    /// </summary>
    /// <param name="number">Positive integer to check</param>
    /// <returns>True if the number is a multiple of 3 or 7, false otherwise</returns>
    public static bool IsMultipleOf3Or7(int number)
    {
        // TODO: Write your code here to check if number is multiple of 3 or 7
        return false;
    }

    /// <summary>
    /// Problem 34: Check if a string starts with a specified word.
    /// 
    /// Example:
    /// Input: ("Hello how are you?", "Hello")
    /// Output: True
    /// 
    /// Input: ("Good morning!", "Hello")
    /// Output: False
    /// 
    /// Note: The check should be case-sensitive
    /// </summary>
    /// <param name="text">String to check</param>
    /// <param name="word">Word to look for at the start</param>
    /// <returns>True if the string starts with the specified word, false otherwise</returns>
    public static bool StartsWithWord(string text, string word)
    {
        // TODO: Write your code here to check if text starts with word
        return false;
    }

    /// <summary>
    /// Problem 35: Check if one number is less than 100 and another is greater than 200.
    /// 
    /// Example:
    /// Input: (75, 250)
    /// Output: True
    /// 
    /// Input: (150, 250)
    /// Output: False
    /// 
    /// Note: Either number can be the one less than 100 while the other is greater than 200
    /// </summary>
    /// <param name="num1">First number to check</param>
    /// <param name="num2">Second number to check</param>
    /// <returns>True if one number is < 100 and the other is > 200, false otherwise</returns>
    public static bool CheckNumberRange(int num1, int num2)
    {
        // TODO: Write your code here to check the number ranges
        return false;
    }

    /// <summary>
    /// Problem 36: Check if either of two integers is in the range -10 to 10 (inclusive).
    /// 
    /// Example:
    /// Input: (-5, 8)
    /// Output: True (both numbers are in range)
    /// 
    /// Input: (-15, 15)
    /// Output: False (neither number is in range)
    /// 
    /// Note: The range includes both -10 and 10
    /// </summary>
    /// <param name="num1">First number to check</param>
    /// <param name="num2">Second number to check</param>
    /// <returns>True if either number is in the range -10 to 10, false otherwise</returns>
    public static bool IsInRange(int num1, int num2)
    {
        // TODO: Write your code here to check if either number is in range -10 to 10
        return false;
    }

    // You can add a Main method to test your solutions
    public static void Main()
    {
        // Example test cases:
        // Console.WriteLine(IsMultipleOf3Or7(15));  // Should print: True
        // Console.WriteLine(StartsWithWord("Hello how are you?", "Hello"));  // Should print: True
        // Console.WriteLine(CheckNumberRange(75, 250));  // Should print: True
        // Console.WriteLine(IsInRange(-5, 8));  // Should print: True
    }
}
