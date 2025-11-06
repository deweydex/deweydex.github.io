from typing import List

class StringAndNumberExercises:
    @staticmethod
    def convert_to_lowercase(input_str: str) -> str:
        """
        Problem 23: Write a program to convert a given string into lowercase.
        
        Example:
            Input: "Write A Python PROGRAM"
            Output: "write a python program"
        
        Args:
            input_str: String to convert to lowercase
            
        Returns:
            Lowercase version of the input string
        """
        # TODO: Write your code here to convert the string to lowercase
        pass

    @staticmethod
    def find_longest_word(sentence: str) -> str:
        """
        Problem 24: Find the longest word in a string.
        
        Example:
            Input: "Write a Python Program to display the following pattern"
            Output: "following"
        
        Note: If there are multiple words with the same length, return the first one.
        
        Args:
            sentence: Input string to analyze
            
        Returns:
            The longest word in the string
        """
        # TODO: Write your code here to find the longest word
        pass

    @staticmethod
    def get_odd_numbers() -> List[int]:
        """
        Problem 25: Generate all odd numbers from 1 to 99.
        The function should return a list of odd numbers that can be printed one per line.
        
        Example Output: [1, 3, 5, ..., 97, 99]
        
        Returns:
            List of all odd numbers from 1 to 99
        """
        # TODO: Write your code here to generate odd numbers
        pass

    @staticmethod
    def compute_prime_sum() -> int:
        """
        Problem 26: Compute the sum of the first 500 prime numbers.
        
        Expected Output: 824693
        
        Returns:
            Sum of first 500 prime numbers
        """
        # TODO: Write your code here to compute the sum of first 500 primes
        # Hint: First create a method to check if a number is prime
        # Then find the first 500 primes and sum them
        pass

    @staticmethod
    def sum_of_digits(number: int) -> int:
        """
        Problem 27: Compute the sum of an integer's digits.
        
        Example:
            Input: 12
            Output: 3 (because 1 + 2 = 3)
        
        Args:
            number: Integer whose digits should be summed
            
        Returns:
            Sum of the digits
        """
        # TODO: Write your code here to sum the digits
        pass

    @staticmethod
    def is_prime(number: int) -> bool:
        """
        Helper method: Check if a number is prime.
        
        Args:
            number: Number to check for primality
            
        Returns:
            True if the number is prime, False otherwise
        """
        # TODO: Implement prime number check if needed for compute_prime_sum
        pass


# Example test cases
def main():
    exercises = StringAndNumberExercises()
    
    # Uncomment to test your solutions:
    # print(exercises.convert_to_lowercase("Write A Python PROGRAM"))
    # print(exercises.find_longest_word("Write a Python Program to display the following pattern"))
    # print('\n'.join(map(str, exercises.get_odd_numbers())))
    # print(exercises.compute_prime_sum())
    # print(exercises.sum_of_digits(12))


if __name__ == "__main__":
    main()
