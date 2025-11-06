class NumberAndStringChecks:
    @staticmethod
    def is_multiple_of_3_or_7(number: int) -> bool:
        """
        Problem 33: Check if a given positive number is a multiple of 3 or 7.
        
        Examples:
            >>> is_multiple_of_3_or_7(15)
            True  # because 15 is a multiple of 3
            >>> is_multiple_of_3_or_7(14)
            True  # because 14 is a multiple of 7
            >>> is_multiple_of_3_or_7(8)
            False
        
        Args:
            number: Positive integer to check
            
        Returns:
            True if the number is a multiple of 3 or 7, false otherwise
        """
        # TODO: Write your code here to check if number is multiple of 3 or 7
        pass

    @staticmethod
    def starts_with_word(text: str, word: str) -> bool:
        """
        Problem 34: Check if a string starts with a specified word.
        
        Examples:
            >>> starts_with_word("Hello how are you?", "Hello")
            True
            >>> starts_with_word("Good morning!", "Hello")
            False
        
        Note: The check should be case-sensitive
        
        Args:
            text: String to check
            word: Word to look for at the start
            
        Returns:
            True if the string starts with the specified word, false otherwise
        """
        # TODO: Write your code here to check if text starts with word
        pass

    @staticmethod
    def check_number_range(num1: int, num2: int) -> bool:
        """
        Problem 35: Check if one number is less than 100 and another is greater than 200.
        
        Examples:
            >>> check_number_range(75, 250)
            True
            >>> check_number_range(150, 250)
            False
        
        Note: Either number can be the one less than 100 while the other is greater than 200
        
        Args:
            num1: First number to check
            num2: Second number to check
            
        Returns:
            True if one number is < 100 and the other is > 200, false otherwise
        """
        # TODO: Write your code here to check the number ranges
        pass

    @staticmethod
    def is_in_range(num1: int, num2: int) -> bool:
        """
        Problem 36: Check if either of two integers is in the range -10 to 10 (inclusive).
        
        Examples:
            >>> is_in_range(-5, 8)
            True  # both numbers are in range
            >>> is_in_range(-15, 15)
            False  # neither number is in range
        
        Note: The range includes both -10 and 10
        
        Args:
            num1: First number to check
            num2: Second number to check
            
        Returns:
            True if either number is in the range -10 to 10, false otherwise
        """
        # TODO: Write your code here to check if either number is in range -10 to 10
        pass


# Example test cases
def main():
    checks = NumberAndStringChecks()
    
    # Uncomment to test your solutions:
    # print(checks.is_multiple_of_3_or_7(15))  # Should print: True
    # print(checks.starts_with_word("Hello how are you?", "Hello"))  # Should print: True
    # print(checks.check_number_range(75, 250))  # Should print: True
    # print(checks.is_in_range(-5, 8))  # Should print: True


if __name__ == "__main__":
    main()
