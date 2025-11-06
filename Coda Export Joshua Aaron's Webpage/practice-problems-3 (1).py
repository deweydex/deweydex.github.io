def print_number_rectangle(number: int) -> None:
    """
    Print a rectangle pattern using a number (3 columns wide and 5 rows tall).
    
    Args:
        number (int): The number to use in the pattern
        
    Expected Output (for input 5):
        555
        5 5
        5 5
        5 5
        555
    """
    # TODO: Print the rectangle pattern
    pass

def convert_temperature(celsius: float) -> tuple[float, float]:
    """
    Convert Celsius temperature to Kelvin and Fahrenheit.
    
    Args:
        celsius (float): Temperature in Celsius
        
    Returns:
        tuple[float, float]: (kelvin, fahrenheit)
        
    Example:
        Input: 30
        Output: (303.15, 86.0)
    """
    # TODO: Convert celsius to kelvin and fahrenheit
    # Hint: Kelvin = Celsius + 273.15
    #       Fahrenheit = (Celsius * 9/5) + 32
    pass

def remove_character(text: str, position: int) -> str:
    """
    Remove a character at the specified position from a string.
    
    Args:
        text (str): Input string
        position (int): Position of character to remove (0-based index)
        
    Returns:
        str: String with character removed
        
    Example:
        Input: text="w3resource", position=2
        Output: "w3esource"
    """
    # TODO: Remove character at given position and return modified string
    pass

def swap_first_last_chars(text: str) -> str:
    """
    Create a new string with the first and last characters swapped.
    
    Args:
        text (str): Input string
        
    Returns:
        str: String with first and last characters swapped
        
    Examples:
        Input: "Python"
        Output: "nythoP"
        
        Input: "w3resource"
        Output: "e3resourcw"
    """
    # TODO: Swap first and last characters and return modified string
    pass

def wrap_first_char(text: str) -> str:
    """
    Create a new string with the first character added at front and back.
    String must be length 1 or more.
    
    Args:
        text (str): Input string (length >= 1)
        
    Returns:
        str: Modified string with first character added at both ends
        
    Example:
        Input: "Python"
        Output: "PythonP"
        
        Input: "The quick brown fox"
        Output: "TThe quick brown foxT"
    """
    # TODO: Add first character to beginning and end of string
    pass
