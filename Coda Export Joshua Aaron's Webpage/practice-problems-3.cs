public partial class CodingExercises
{
    /// <summary>
    /// Print a rectangle pattern using a number (3 columns wide and 5 rows tall)
    /// </summary>
    /// <param name="number">Number to use in pattern</param>
    /// <example>
    /// Input: 5
    /// Output:
    /// 555
    /// 5 5
    /// 5 5
    /// 5 5
    /// 555
    /// </example>
    public static void PrintNumberRectangle(int number)
    {
        // TODO: Print the rectangle pattern
    }

    /// <summary>
    /// Convert Celsius temperature to Kelvin and Fahrenheit
    /// </summary>
    /// <param name="celsius">Temperature in Celsius</param>
    /// <returns>Tuple containing Kelvin and Fahrenheit temperatures</returns>
    /// <example>
    /// Input: 30
    /// Output: (303.15, 86.0)
    /// </example>
    public static (double Kelvin, double Fahrenheit) ConvertTemperature(double celsius)
    {
        // TODO: Convert celsius to kelvin and fahrenheit
        // Hint: Kelvin = Celsius + 273.15
        //       Fahrenheit = (Celsius * 9/5) + 32
        return (0, 0); // Replace with your solution
    }

    /// <summary>
    /// Remove a character at the specified position from a string
    /// </summary>
    /// <param name="text">Input string</param>
    /// <param name="position">Position of character to remove (0-based index)</param>
    /// <returns>String with character removed</returns>
    /// <example>
    /// Input: text="w3resource", position=2
    /// Output: "w3esource"
    /// </example>
    public static string RemoveCharacter(string text, int position)
    {
        // TODO: Remove character at given position and return modified string
        return string.Empty; // Replace with your solution
    }

    /// <summary>
    /// Create a new string with the first and last characters swapped
    /// </summary>
    /// <param name="text">Input string</param>
    /// <returns>String with first and last characters swapped</returns>
    /// <example>
    /// Input: "Python"
    /// Output: "nythoP"
    /// </example>
    public static string SwapFirstLastChars(string text)
    {
        // TODO: Swap first and last characters and return modified string
        return string.Empty; // Replace with your solution
    }

    /// <summary>
    /// Create a new string with the first character added at front and back
    /// </summary>
    /// <param name="text">Input string (length >= 1)</param>
    /// <returns>Modified string with first character added at both ends</returns>
    /// <example>
    /// Input: "The quick brown fox"
    /// Output: "TThe quick brown foxT"
    /// </example>
    public static string WrapFirstChar(string text)
    {
        // TODO: Add first character to beginning and end of string
        return string.Empty; // Replace with your solution
    }
}
