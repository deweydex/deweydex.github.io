
Introduction

In this notebook, we’ll rebuild our solar system explorer using object-oriented programming principles. We’ll create a proper class hierarchy for celestial objects and implement travel in a more structured way.

Let’s see how classes can help us create a more robust and extensible solar system explorer! 🚀

#r "nuget:System.Collections"

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

Creating a Class Hierarchy

Let’s start by creating a base class for all celestial locations.

// Base class for all space locations
public abstract class CelestialLocation
{
    public string Name { get; set; }
    public string FunFact { get; set; }
    
    public CelestialLocation(string name, string funFact)
    {
        Name = name;
        FunFact = funFact;
    }
    
    // Method to provide information about this location
    public virtual string GetInfo()
    {
        return $"{Name}: {FunFact}";
    }
    
    // Each location provides custom arrival messaging
    public abstract string GetArrivalMessage();
    
    // Each location provides custom departure messaging
    public abstract string GetDepartureMessage();
}

Now, let’s create classes for our three types of celestial objects. First, planets:

// Planet class
public class Planet : CelestialLocation
{
    public double DistanceFromSun { get; set; } // millions of km
    public bool HasRings { get; set; }
    
    public Planet(string name, double distanceFromSun, bool hasRings, string funFact) 
        : base(name, funFact)
    {
        DistanceFromSun = distanceFromSun;
        HasRings = hasRings;
    }
    
    public override string GetInfo()
    {
        string ringsInfo = HasRings ? "Has magnificent rings!" : "No rings, how ordinary.";
        return $"{base.GetInfo()}\nDistance from Sun: {DistanceFromSun} million km\n{ringsInfo}";
    }
    
    public override string GetArrivalMessage()
    {
        return $"Touchdown on planet {Name}! Gravity stabilizers engaged. {(HasRings ? "Wow, those rings look even better up close!" : "Clear skies for landing!")}";
    }
    
    public override string GetDepartureMessage()
    {
        return $"Blasting off from {Name}'s gravitational pull! Engaging warp speed in 3...2...1...";
    }
}

Next, let’s create our Moon class:

// Moon class
public class Moon : CelestialLocation
{
    public string ParentPlanet { get; set; }
    public bool HasWater { get; set; }
    
    public Moon(string name, string parentPlanet, bool hasWater, string funFact) 
        : base(name, funFact)
    {
        ParentPlanet = parentPlanet;
        HasWater = hasWater;
    }
    
    public override string GetInfo()
    {
        string waterInfo = HasWater ? "Contains water - potential for space swimming!" : "No water detected - bring your own beverages.";
        return $"{base.GetInfo()}\nOrbits: {ParentPlanet}\n{waterInfo}";
    }
    
    public override string GetArrivalMessage()
    {
        return $"Soft landing on {Name}, a moon of {ParentPlanet}! Reduced gravity detected - watch your step or you might accidentally do a backflip!";
    }
    
    public override string GetDepartureMessage()
    {
        return $"Gently pushing off from {Name}'s surface. The views of {ParentPlanet} from here are spectacular!";
    }
}

Finally, let’s create our SpaceStation class:

// Space Station class
public class SpaceStation : CelestialLocation
{
    public string OrbitingBody { get; set; }
    public int CrewCapacity { get; set; }
    
    public SpaceStation(string name, string orbitingBody, int crewCapacity, string funFact) 
        : base(name, funFact)
    {
        OrbitingBody = orbitingBody;
        CrewCapacity = crewCapacity;
    }
    
    public override string GetInfo()
    {
        return $"{base.GetInfo()}\nOrbits: {OrbitingBody}\nCrew Capacity: {CrewCapacity} space explorers";
    }
    
    public override string GetArrivalMessage()
    {
        return $"*Mechanical docking sounds* Connected to {Name} space station! Please wait for the airlock to pressurize and remember the artificial gravity toggle switch is on the left.";
    }
    
    public override string GetDepartureMessage()
    {
        return $"Disconnecting docking clamps from {Name}. Don't forget to wave to the crew through the portal windows!";
    }
}

Creating the SolarSystemMap Class

Now, let’s create a class that manages all our celestial locations and handles travel:

public class SolarSystemMap
{
    private List<CelestialLocation> locations;
    public CelestialLocation CurrentLocation { get; private set; }
    
    public SolarSystemMap()
    {
        locations = new List<CelestialLocation>();
    }
    
    public void AddLocation(CelestialLocation location)
    {
        locations.Add(location);
        // If this is our first location, start here
        if (locations.Count == 1)
        {
            CurrentLocation = location;
            Console.WriteLine($"Starting our adventure at {location.Name}!");
            Console.WriteLine(location.GetArrivalMessage());
            Console.WriteLine($"Fun Fact: {location.FunFact}");
        }
    }
    
    public void DisplayAllLocations()
    {
        Console.WriteLine("\n🌌 Solar System Map: All Known Locations 🌌");
        
        var planets = locations.OfType<Planet>().ToList();
        var moons = locations.OfType<Moon>().ToList();
        var stations = locations.OfType<SpaceStation>().ToList();
        
        Console.WriteLine($"\n🪐 Planets ({planets.Count}):");
        foreach (var planet in planets)
        {
            string current = planet == CurrentLocation ? " [YOU ARE HERE]" : "";
            Console.WriteLine($"  - {planet.Name} ({planet.DistanceFromSun} million km from Sun){current}");
        }
        
        Console.WriteLine($"\n🌙 Moons ({moons.Count}):");
        foreach (var moon in moons)
        {
            string current = moon == CurrentLocation ? " [YOU ARE HERE]" : "";
            Console.WriteLine($"  - {moon.Name} (Orbits: {moon.ParentPlanet}){current}");
        }
        
        Console.WriteLine($"\n🚀 Space Stations ({stations.Count}):");
        foreach (var station in stations)
        {
            string current = station == CurrentLocation ? " [YOU ARE HERE]" : "";
            Console.WriteLine($"  - {station.Name} (Orbits: {station.OrbitingBody}, Crew: {station.CrewCapacity}){current}");
        }
    }
    
    public bool TravelTo(string destinationName)
    {
        // Find the destination
        CelestialLocation destination = locations.FirstOrDefault(loc => loc.Name == destinationName);
        
        if (destination == null)
        {
            Console.WriteLine($"Error: {destinationName} not found in our star charts! Did autocorrect strike again?");
            return false;
        }
        
        if (destination == CurrentLocation)
        {
            Console.WriteLine($"You're already at {destinationName}! Save fuel for interstellar donut runs.");
            return false;
        }
        
        // Execute the travel sequence
        Console.WriteLine("\n=== COMMENCING TRAVEL SEQUENCE ===");
        Console.WriteLine(CurrentLocation.GetDepartureMessage());
        
        // Travel narration based on types
        string fromType = CurrentLocation.GetType().Name;
        string toType = destination.GetType().Name;
        
        Console.WriteLine($"\n🚀 TRAVELING from {CurrentLocation.Name} ({fromType}) to {destination.Name} ({toType}) 🚀");
        GenerateTravelNarration(CurrentLocation, destination);
        
        // Arrival
        Console.WriteLine("\n" + destination.GetArrivalMessage());
        Console.WriteLine($"Fun Fact: {destination.FunFact}");
        
        // Update current location
        CurrentLocation = destination;
        return true;
    }
    
    private void GenerateTravelNarration(CelestialLocation from, CelestialLocation to)
    {
        // Generate some fun travel narration based on the types of locations
        bool isPlanetToMoon = from is Planet && to is Moon;
        bool isMoonToPlanet = from is Moon && to is Planet;
        bool isToStation = to is SpaceStation;
        bool isFromStation = from is SpaceStation;
        
        List<string> narrations = new List<string>();
        
        // Add type-specific narrations
        if (isPlanetToMoon)
        {
            narrations.Add("Planet to moon travel: Reducing thrusters as we approach this smaller celestial body!");
            narrations.Add("Microgravity mode initiated. Please secure your floating snacks!");
        }
        else if (isMoonToPlanet)
        {
            narrations.Add("Moon to planet travel: Increasing gravity compensators for landing on this massive orb!");
            narrations.Add("Prepare for significant gravity change. Your hair might suddenly obey physics again.");
        }
        else if (isToStation)
        {
            narrations.Add("Approaching space station: Remember to use the docking protocols and not the parking brake!");
            narrations.Add("Station control suggests you bring your own toilet paper. They're running low.");
        }
        else if (isFromStation)
        {
            narrations.Add("Departing station: Artificial gravity disengaging. Everything not strapped down is now a projectile!");
        }
        
        // Add some general travel narrations
        narrations.Add("Your cosmic GPS recalculating route...");
        narrations.Add("Ship's entertainment system now playing: 'Space Oddity'");
        narrations.Add("Passing through an asteroid field! Just kidding, those are just space dust particles on the windshield.");
        
        // Output 2-3 random narrations
        Random random = new Random();
        int narrationsToShow = random.Next(2, 4);
        
        for (int i = 0; i < narrationsToShow; i++)
        {
            if (narrations.Count == 0) break;
            
            int index = random.Next(narrations.Count);
            Console.WriteLine($"🌠 {narrations[index]}");
            narrations.RemoveAt(index);
            
            // In a notebook we'll skip the sleep delay
            // Thread.Sleep(1000);
        }
    }
}

Let’s Create Our Solar System and Try It Out!

Now let’s populate our solar system and start exploring:

// Create our solar system map
SolarSystemMap solarSystem = new SolarSystemMap();

Console.WriteLine("🚀 Welcome to Solar System Explorer 2.0! 🚀");
Console.WriteLine("Preparing for your interstellar adventure...\n");

// Add planets
solarSystem.AddLocation(new Planet("Mars", 227.9, false, 
    "Home to Olympus Mons, the tallest mountain in the solar system!"));
solarSystem.AddLocation(new Planet("Saturn", 1433.5, true, 
    "Its rings would make a fabulous hula hoop for a giant!"));
solarSystem.AddLocation(new Planet("Earth", 149.6, false, 
    "The only planet known to have chocolate cake. Coincidence? I think not."));

// Add moons
solarSystem.AddLocation(new Moon("Europa", "Jupiter", true, 
    "Has an ocean under its icy crust where space fish might be doing the backstroke!"));
solarSystem.AddLocation(new Moon("Titan", "Saturn", false, 
    "Has lakes of liquid methane! Not recommended for skinny dipping."));
solarSystem.AddLocation(new Moon("Luna", "Earth", false, 
    "Earth's moon is simply called 'the Moon' which shows a severe lack of creativity."));

// Add space stations
solarSystem.AddLocation(new SpaceStation("ISS", "Earth", 7, 
    "Astronauts see 16 sunrises every day! Talk about needing coffee."));
solarSystem.AddLocation(new SpaceStation("Lunar Gateway", "Moon", 4, 
    "Future lunar outpost where astronauts will practice their moon walks!"));

// Display all locations
solarSystem.DisplayAllLocations();

Let’s test our TravelTo function:

// Travel to different locations
Console.WriteLine("\n=== TIME TO EXPLORE! ===");

// Try traveling to a moon
solarSystem.TravelTo("Europa");

// Try traveling to a space station
solarSystem.TravelTo("ISS");

// Try traveling to a planet
solarSystem.TravelTo("Saturn");

// Try traveling to a nonexistent location
solarSystem.TravelTo("Vulcan");

Benefits of the Class-Based Approach

Let’s compare our class-based approach with the original implementation:

1. Clean Abstraction: The CelestialLocation base class defines the common interface for all locations.
2. Polymorphism: Each location type can implement its own arrival and departure messages.
3. Encapsulation: The travel logic is now encapsulated within the SolarSystemMap class.
4. State Management: We’re now tracking the current location as an object reference, eliminating the possibility of type/object mismatch.
5. Extensibility: Adding new location types is simple and won’t require changing the TravelTo method.
6. Type Safety: We use actual types instead of string representations.

Student Exercises

1. Add a new celestial object type (e.g., AsteroidBelt)
2. Implement a search function to find all locations that orbit a specific body
3. Add a “fuel” system to limit how far you can travel without refueling
4. Create a method to calculate the distance between two locations
5. Implement a feature that shows nearby locations from your current position
