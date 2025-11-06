using System;

public class CodingChallenges
{
    // 1. Print name in separate line
    public static void PrintHelloName(string name)
    {
        Console.WriteLine("Hello");
        Console.WriteLine(name);
    }

    // 2. Sum of two numbers
    public static double SumNumbers(double a, double b)
    {
        return a + b;
    }

    // 3. Division of two numbers
    public static double DivideNumbers(double a, double b)
    {
        if (b == 0)
            throw new DivideByZeroException("Cannot divide by zero");
        return a / b;
    }

    // 4. Specified operations
    public static double[] CalculateExpressions()
    {
        return new double[]
        {
            -1 + 4 * 6,
            (35 + 5) % 7,
            14 + -4 * 6 / 11,
            2 + 15 / 6.0 * 1 - 7 % 2
        };
    }

    // 5. Swap two numbers
    public static (double, double) SwapNumbers(double a, double b)
    {
        return (b, a);
    }
}
