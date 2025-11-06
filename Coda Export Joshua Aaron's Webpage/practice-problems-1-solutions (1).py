# 1. Print name in separate line
def print_hello_name(name: str) -> None:
    """
    Prints 'Hello' and the given name on separate lines.
    
    Args:
        name (str): The name to print
    """
    print("Hello")
    print(name)

# 2. Sum of two numbers
def sum_numbers(a: float, b: float) -> float:
    """
    Returns the sum of two numbers.
    
    Args:
        a (float): First number
        b (float): Second number
    
    Returns:
        float: Sum of the two numbers
    """
    return a + b

# 3. Division of two numbers
def divide_numbers(a: float, b: float) -> float:
    """
    Returns the result of dividing the first number by the second.
    
    Args:
        a (float): Dividend
        b (float): Divisor
    
    Returns:
        float: Result of division
        
    Raises:
        ZeroDivisionError: If b is zero
    """
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b

# 4. Specified operations
def calculate_expressions() -> list[float]:
    """
    Calculates the results of specified arithmetic operations.
    
    Returns:
        list[float]: List of results from each calculation
    """
    results = [
        -1 + 4 * 6,
        (35 + 5) % 7,
        14 + -4 * 6 / 11,
        2 + 15 / 6 * 1 - 7 % 2
    ]
    return results

# 5. Swap two numbers
def swap_numbers(a: float, b: float) -> tuple[float, float]:
    """
    Swaps two numbers and returns them as a tuple.
    
    Args:
        a (float): First number
        b (float): Second number
    
    Returns:
        tuple[float, float]: Tuple containing swapped numbers (b, a)
    """
    return b, a
