def check_negative_positive(num1: int, num2: int) -> bool:
    """
    Check if one number is negative and one is positive.
    
    Args:
        num1 (int): First integer
        num2 (int): Second integer
        
    Returns:
        bool: True if one is negative and one is positive, False otherwise
        
    Examples:
        Input: -5, 25
        Output: True
        
        Input: 5, 25
        Output: False
        
        Input: -5, -25
        Output: False
    """
    # TODO: Check if one number is negative and one is positive
    pass

def compute_triple_sum(num1: int, num2: int) -> int:
    """
    Compute the sum of two integers. If the values are the same, 
    return triple their sum.
    
    Args:
        num1 (int): First integer
        num2 (int): Second integer
        
    Returns:
        int: Sum of numbers, or triple the sum if numbers are equal
        
    Examples:
        Input: 5, 5
        Output: 30  # (5 + 5) * 3
        
        Input: 5, 6
        Output: 11  # 5 + 6
    """
    # TODO: Return triple sum if numbers are equal, regular sum otherwise
    pass

def get_absolute_difference(num1: int, num2: int) -> int:
    """
    Get absolute difference between two numbers. Return double the absolute
    difference if first number is greater than second number.
    
    Args:
        num1 (int): First integer
        num2 (int): Second integer
        
    Returns:
        int: Absolute difference or double the absolute difference
        
    Examples:
        Input: 25, 15
        Output: 20  # (25 - 15) * 2
        
        Input: 15, 25
        Output: 10  # |15 - 25|
    """
    # TODO: Calculate absolute difference and double it if num1 > num2
    pass

def check_sum_twenty(num1: int, num2: int) -> bool:
    """
    Check if one of the numbers is 20 or if their sum is 20.
    
    Args:
        num1 (int): First integer
        num2 (int): Second integer
        
    Returns:
        bool: True if one number is 20 or sum is 20, False otherwise
        
    Examples:
        Input: 20, 5
        Output: True  # One number is 20
        
        Input: 15, 5
        Output: True  # Sum is 20
        
        Input: 15, 6
        Output: False # Neither number is 20 and sum isn't 20
    """
    # TODO: Check if either number is 20 or if their sum is 20
    pass

def is_within_twenty(number: int) -> bool:
    """
    Check if the given integer is within 20 of 100 or 200.
    
    Args:
        number (int): Integer to check
        
    Returns:
        bool: True if number is within 20 of 100 or 200, False otherwise
        
    Examples:
        Input: 115
        Output: True  # Within 20 of 100
        
        Input: 190
        Output: True  # Within 20 of 200
        
        Input: 25
        Output: False # Not within 20 of either 100 or 200
    """
    # TODO: Check if number is within 20 of either 100 or 200
    pass
