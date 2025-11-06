from typing import List
import os

class StringAndArrayExercises:
    @staticmethod
    def reverse_words(sentence: str) -> str:
        """
        Problem 28: Reverse the words of a sentence.
        
        Example:
            Input: "Display the pattern like pyramid using the alphabet."
            Output: "alphabet. the using pyramid like pattern the Display"
        
        Note: Preserve the original punctuation and spacing between words.
        
        Args:
            sentence: The input sentence to reverse
            
        Returns:
            String with words in reverse order
        """
        # TODO: Write your code here to reverse the words
        pass

    @staticmethod
    def get_file_size(file_path: str) -> int:
        """
        Problem 29: Find the size of a specified file in bytes.
        
        Example:
            Input: "example.txt"
            Output: 31 (bytes)
        
        Note: Make sure to handle cases where the file doesn't exist
        
        Args:
            file_path: Path to the file to check
            
        Returns:
            Size of the file in bytes, or -1 if file doesn't exist
        """
        # TODO: Write your code here to get file size
        # Remember to use try-except for file operations
        pass

    @staticmethod
    def hex_to_decimal(hex_number: str) -> int:
        """
        Problem 30: Convert a hexadecimal number to decimal.
        
        Example:
            Input: "4B0"
            Output: 1200
        
        Note: Handle both uppercase and lowercase hex digits
        
        Args:
            hex_number: String representation of hexadecimal number
            
        Returns:
            Decimal (base-10) value of the number
        """
        # TODO: Write your code here to convert hex to decimal
        pass

    @staticmethod
    def multiply_arrays(array1: List[int], array2: List[int]) -> List[int]:
        """
        Problem 31: Multiply corresponding elements of two integer arrays.
        
        Example:
            Input arrays: [1, 3, -5, 4] and [1, 4, -5, -2]
            Output: [1, 12, 25, -8]
        
        Note: Assume both arrays have the same length
        
        Args:
            array1: First array of integers
            array2: Second array of integers
            
        Returns:
            List containing products of corresponding elements
        """
        # TODO: Write your code here to multiply corresponding elements
        pass

    @staticmethod
    def repeat_last_four(text: str) -> str:
        """
        Problem 32: Create a string of four copies of the last four characters.
        If the string is less than 4 characters, return the original string.
        
        Example:
            Input: "The quick brown fox jumps over the lazy dog."
            Output: "dog.dog.dog.dog."
        
        Args:
            text: Input string
            
        Returns:
            Four copies of last four chars or original string if length < 4
        """
        # TODO: Write your code here to repeat the last four characters
        pass


# Example test cases
def main():
    exercises = StringAndArrayExercises()
    
    # Uncomment to test your solutions:
    # print(exercises.reverse_words("Display the pattern like pyramid using the alphabet."))
    # print(exercises.get_file_size("example.txt"))
    # print(exercises.hex_to_decimal("4B0"))
    # print(exercises.multiply_arrays([1, 3, -5, 4], [1, 4, -5, -2]))
    # print(exercises.repeat_last_four("The quick brown fox jumps over the lazy dog."))


if __name__ == "__main__":
    main()
