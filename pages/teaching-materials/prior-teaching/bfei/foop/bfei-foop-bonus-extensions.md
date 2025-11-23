Solar System Bonus 3 of 3

Solar System Explorer 3.0: Advanced Extensions

Introduction

In this notebook, we’ll build upon our class-based solar system explorer by adding advanced features and new celestial object types. These extensions demonstrate how easily an object-oriented design can be expanded.

Let’s enhance our cosmic adventure! 🚀✨

#r "nuget:System.Collections"

using System;
using System.Collections.Generic;
using System.Linq;

Getting Started

First, let’s include our base classes from the previous notebook:

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

// Basic SolarSystemMap class (simplified version)
public class SolarSystemMap
{
    protected List<CelestialLocation> locations;
    public CelestialLocation CurrentLocation { get; protected set; }
    
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
        }
    }
    
    public bool TravelTo(string destinationName)
    {
        CelestialLocation destination = locations.FirstOrDefault(loc => loc.Name == destinationName);
        
        if (destination == null)
        {
            Console.WriteLine($"Error: {destinationName} not found!");
            return false;
        }
        
        // Update current location
        CurrentLocation = destination;
        return true;
    }
}

Extension 1: New Celestial Object Types

Let’s add new types of celestial objects to expand our solar system:

// Asteroid class
public class Asteroid : CelestialLocation
{
    public double Size { get; set; } // km diameter
    public bool IsMiningOperation { get; set; }
    
    public Asteroid(string name, double size, bool isMiningOperation, string funFact) 
        : base(name, funFact)
    {
        Size = size;
        IsMiningOperation = isMiningOperation;
    }
    
    public override string GetInfo()
    {
        string miningInfo = IsMiningOperation 
            ? "Active mining operation - watch for space trucks!" 
            : "Untapped resources await the brave prospector!";
            
        return $"{base.GetInfo()}\nSize: {Size} km diameter\n{miningInfo}";
    }
    
    public override string GetArrivalMessage()
    {
        return $"Anchoring to asteroid {Name} with gravity hooks! Remember to wear magnetic boots or you'll float away with the space dust!";
    }
    
    public override string GetDepartureMessage()
    {
        return $"Detaching from {Name}. Mind the floating debris as we exit the microgravity field!";
    }
}

// Black Hole class
public class BlackHole : CelestialLocation
{
    public double Mass { get; set; } // solar masses
    public bool IsSupermassive { get; set; }
    
    public BlackHole(string name, double mass, bool isSupermassive, string funFact) 
        : base(name, funFact)
    {
        Mass = mass;
        IsSupermassive = isSupermassive;
    }
    
    public override string GetInfo()
    {
        string massDescription = IsSupermassive 
            ? "SUPERMASSIVE black hole - the ultimate cosmic vacuum cleaner!" 
            : "Regular black hole - still not recommended for vacations";
            
        return $"{base.GetInfo()}\nMass: {Mass} solar masses\n{massDescription}";
    }
    
    public override string GetArrivalMessage()
    {
        return $"Approaching the event horizon of {Name}! Time dilation activated - what feels like minutes to us will be years back home. Don't worry, our ship has anti-spaghettification shields!";
    }
    
    public override string GetDepartureMessage()
    {
        return $"Engaging gravitational slingshot maneuver to escape {Name}'s pull. If you feel stretched, that's normal!";
    }
}

// Let's test our new celestial object types
Asteroid ceres = new Asteroid("Ceres", 939, true, 
    "Largest object in the asteroid belt. Has mysterious bright spots that might be alien disco balls!");

BlackHole sagittariusA = new BlackHole("Sagittarius A*", 4.3e6, true, 
    "The supermassive black hole at the center of our galaxy. It's on a diet, consuming less than expected!");

Console.WriteLine("New Celestial Objects:\n");
Console.WriteLine(ceres.GetInfo());
Console.WriteLine("\nArrival at asteroid:");
Console.WriteLine(ceres.GetArrivalMessage());
Console.WriteLine("\nDeparture from asteroid:");
Console.WriteLine(ceres.GetDepartureMessage());

Console.WriteLine("\n" + sagittariusA.GetInfo());
Console.WriteLine("\nArrival at black hole:");
Console.WriteLine(sagittariusA.GetArrivalMessage());
Console.WriteLine("\nDeparture from black hole:");
Console.WriteLine(sagittariusA.GetDepartureMessage());

Extension 2: Enhanced SolarSystemMap with Travel Costs

Let’s enhance our SolarSystemMap class to include travel costs and distances:

// Enhanced SolarSystemMap with travel costs and fuel system
public class EnhancedSolarSystemMap : SolarSystemMap
{
    public double FuelLevel { get; private set; }
    public double MaxFuel { get; private set; }
    
    public EnhancedSolarSystemMap(double initialFuel)
    {
        MaxFuel = initialFuel;
        FuelLevel = initialFuel;
    }
    
    public override bool TravelTo(string destinationName)
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
        
        // Calculate travel cost
        double travelCost = CalculateTravelCost(CurrentLocation, destination);
        
        // Check if we have enough fuel
        if (travelCost > FuelLevel)
        {
            Console.WriteLine($"⚠️ INSUFFICIENT FUEL! ⚠️ This journey requires {travelCost:F1} units of fuel, but you only have {FuelLevel:F1} units.");
            return false;
        }
        
        // Execute the travel sequence
        Console.WriteLine("\n=== COMMENCING TRAVEL SEQUENCE ===");
        Console.WriteLine(CurrentLocation.GetDepartureMessage());
        
        // Travel narration based on types
        Console.WriteLine($"\n🚀 TRAVELING from {CurrentLocation.Name} to {destination.Name} 🚀");
        Console.WriteLine($"Distance: {CalculateDistance(CurrentLocation, destination):F1} million km");
        Console.WriteLine($"Fuel consumption: {travelCost:F1} units");
        
        // Deduct fuel
        FuelLevel -= travelCost;
        Console.WriteLine($"Remaining fuel: {FuelLevel:F1}/{MaxFuel} units");
        
        // Arrival
        Console.WriteLine("\n" + destination.GetArrivalMessage());
        Console.WriteLine($"Fun Fact: {destination.FunFact}");
        
        // Update current location
        CurrentLocation = destination;
        return true;
    }
    
    public double CalculateTravelCost(CelestialLocation from, CelestialLocation to)
    {
        // Base cost plus distance-based component
        double baseCost = 10;
        double distance = CalculateDistance(from, to);
        
        // Different costs based on destination type
        if (to is BlackHole)
        {
            return baseCost + distance * 2.0; // Black holes are expensive to reach
        }
        else if (to is Asteroid)
        {
            return baseCost + distance * 0.5; // Asteroids are easier to reach
        }
        else if (to is SpaceStation)
        {
            return baseCost + distance * 0.7; // Space stations have docking assistance
        }
        
        return baseCost + distance; // Standard rate for planets and moons
    }
    
    public double CalculateDistance(CelestialLocation from, CelestialLocation to)
    {
        // A simplified distance calculation for demonstration
        // In reality, we'd need orbital positions, etc.
        
        if (from is Planet fromPlanet && to is Planet toPlanet)
        {
            // Direct distance between planets (simplified)
            return Math.Abs(fromPlanet.DistanceFromSun - toPlanet.DistanceFromSun);
        }
        else if (from is Moon fromMoon && to is Moon toMoon)
        {
            // Moon to moon - depends on parent planets
            if (fromMoon.ParentPlanet == toMoon.ParentPlanet)
            {
                return 0.5; // Moons around same planet
            }
            return 100; // Moons around different planets
        }
        else if ((from is Moon moon && to is Planet planet && moon.ParentPlanet == planet.Name) ||
                (from is Planet planet2 && to is Moon moon2 && planet2.Name == moon2.ParentPlanet))
        {
            // Travel between a moon and its parent planet
            return 0.3;
        }
        else if (to is SpaceStation station)
        {
            // Distance to a space station depends on what it's orbiting
            if (from.Name == station.OrbitingBody)
            {
                return 0.05; // Very close if from the body it orbits
            }
            else if (from is Planet fromPlanet2)
            {
                // Calculate based on orbiting body
                var orbitingBody = locations.OfType<Planet>()
                    .FirstOrDefault(p => p.Name == station.OrbitingBody);
                if (orbitingBody != null)
                {
                    return Math.Abs(fromPlanet2.DistanceFromSun - orbitingBody.DistanceFromSun);
                }
            }
        }
        
        // Default distance if we can't calculate more precisely
        return 50;
    }
    
    public void Refuel(double amount)
    {
        double newLevel = Math.Min(FuelLevel + amount, MaxFuel);
        double actualAmount = newLevel - FuelLevel;
        FuelLevel = newLevel;
        
        Console.WriteLine($"⛽ Refueled {actualAmount:F1} units!");
        Console.WriteLine($"Current fuel level: {FuelLevel:F1}/{MaxFuel} units");
    }
    
    public void ShowNearbyLocations(double maxDistance = 100)
    {
        Console.WriteLine($"\n🔭 Scanning for locations within {maxDistance} million km of {CurrentLocation.Name}...");
        
        var nearbyLocations = locations
            .Where(loc => loc != CurrentLocation && CalculateDistance(CurrentLocation, loc) <= maxDistance)
            .OrderBy(loc => CalculateDistance(CurrentLocation, loc))
            .ToList();
        
        if (nearbyLocations.Count == 0)
        {
            Console.WriteLine("No locations found nearby. It's lonely out here in space!");
            return;
        }
        
        Console.WriteLine($"Found {nearbyLocations.Count} nearby locations:");
        foreach (var location in nearbyLocations)
        {
            double distance = CalculateDistance(CurrentLocation, location);
            double fuel = CalculateTravelCost(CurrentLocation, location);
            string fuelStatus = fuel <= FuelLevel ? "✅" : "❌";
            
            Console.WriteLine($"- {location.Name} ({location.GetType().Name}): {distance:F1} million km away");
            Console.WriteLine($"  Travel cost: {fuel:F1} fuel units {fuelStatus}");
        }
    }
}

Extension 3: Weather System for Planets

Let’s add a weather system that generates dynamic conditions for planets:

// Weather system for planets
public class WeatherSystem
{
    private Random random = new Random();
    private Dictionary<string, List<WeatherCondition>> planetWeather;
    
    public WeatherSystem()
    {
        planetWeather = new Dictionary<string, List<WeatherCondition>>();
        
        // Define possible weather for Earth
        planetWeather["Earth"] = new List<WeatherCondition>
        {
            new WeatherCondition("Sunny", "Clear blue skies, perfect for a spacewalk!"),
            new WeatherCondition("Rainy", "Earth's water cycle in action. Bring an umbrella!"),
            new WeatherCondition("Stormy", "Lightning makes the atmosphere sparkle. Stay inside your ship!"),
            new WeatherCondition("Cloudy", "The planet is being modest today, hiding under a fluffy blanket."),
            new WeatherCondition("Snowy", "Those white patches aren't dandruff, it's frozen precipitation!")
        };
        
        // Define possible weather for Mars
        planetWeather["Mars"] = new List<WeatherCondition>
        {
            new WeatherCondition("Dust storm", "The planet is having a bad hair day. Visibility: zero."),
            new WeatherCondition("Clear", "Enjoy the reddish landscape! Sunscreen recommended despite the distance."),
            new WeatherCondition("Windy", "Hold onto your space hat! The thin atmosphere is really moving today."),
            new WeatherCondition("Frosty", "Carbon dioxide frost glitters on the surface. It's technically dry ice!"),
            new WeatherCondition("Global dust event", "The entire planet is playing hide and seek. And winning.")
        };
        
        // Define possible weather for Saturn
        planetWeather["Saturn"] = new List<WeatherCondition>
        {
            new WeatherCondition("Ring rain", "Particles from the rings are showering down. It's cosmic precipitation!"),
            new WeatherCondition("Hexagonal storms", "The north pole's geometric weather pattern is showing off again."),
            new WeatherCondition("Gas currents", "The atmosphere is extra swirly today, like a cosmic lava lamp."),
            new WeatherCondition("Calm bands", "The cloud bands are unusually serene. Suspicious..."),
            new WeatherCondition("Auroras", "The magnetic field is putting on a light show at the poles!")
        };
    }
    
    public WeatherCondition GetCurrentWeather(string planetName)
    {
        // Return "unknown" weather if we don't have data for this planet
        if (!planetWeather.ContainsKey(planetName))
        {
            return new WeatherCondition("Unknown", "Our meteorologists are still figuring out this planet's weather patterns.");
        }
        
        // Select a random weather condition from the list for this planet
        var conditions = planetWeather[planetName];
        int index = random.Next(conditions.Count);
        return conditions[index];
    }
    
    // Add weather data for a new planet
    public void AddPlanetWeather(string planetName, List<WeatherCondition> conditions)
    {
        planetWeather[planetName] = conditions;
    }
    
    // Get a weather forecast (multiple days)
    public List<WeatherCondition> GetWeatherForecast(string planetName, int days)
    {
        List<WeatherCondition> forecast = new List<WeatherCondition>();
        
        for (int i = 0; i < days; i++)
        {
            forecast.Add(GetCurrentWeather(planetName));
        }
        
        return forecast;
    }
}

// Weather condition class
public class WeatherCondition
{
    public string Condition { get; set; }
    public string Description { get; set; }
    
    public WeatherCondition(string condition, string description)
    {
        Condition = condition;
        Description = description;
    }
    
    public override string ToString()
    {
        return $"{Condition}: {Description}";
    }
}

// Let's test our weather system
WeatherSystem weatherSystem = new WeatherSystem();

Console.WriteLine("🌦️ Planetary Weather Report 🌦️\n");

Console.WriteLine("Earth Weather:");
var earthWeather = weatherSystem.GetCurrentWeather("Earth");
Console.WriteLine(earthWeather);

Console.WriteLine("\nMars Weather:");
var marsWeather = weatherSystem.GetCurrentWeather("Mars");
Console.WriteLine(marsWeather);

Console.WriteLine("\nSaturn Weather:");
var saturnWeather = weatherSystem.GetCurrentWeather("Saturn");
Console.WriteLine(saturnWeather);

Console.WriteLine("\n3-Day Mars Forecast:");
var marsForecast = weatherSystem.GetWeatherForecast("Mars", 3);
for (int i = 0; i < marsForecast.Count; i++)
{
    Console.WriteLine($"Day {i+1}: {marsForecast[i]}");
}

Let’s Put It All Together!

Now let’s use all of our extensions to create an advanced solar system explorer:

// Create our enhanced solar system map
EnhancedSolarSystemMap solarSystem = new EnhancedSolarSystemMap(100.0);
WeatherSystem weatherSystem = new WeatherSystem();

Console.WriteLine("🚀✨ Welcome to Solar System Explorer 3.0! ✨🚀");
Console.WriteLine("Preparing for your advanced interstellar adventure...\n");

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

// Add our new celestial objects
solarSystem.AddLocation(new Asteroid("Ceres", 939, true, 
    "Largest object in the asteroid belt. Has mysterious bright spots that might be alien disco balls!"));
solarSystem.AddLocation(new BlackHole("Sagittarius A*", 4.3e6, true, 
    "The supermassive black hole at the center of our galaxy. It's on a diet, consuming less than expected!"));

// Display current location and fuel status
Console.WriteLine($"Starting our journey on {solarSystem.CurrentLocation.Name}");
Console.WriteLine($"Fuel level: {solarSystem.FuelLevel:F1} units\n");

// Check nearby locations
solarSystem.ShowNearbyLocations();

// Travel to different locations
Console.WriteLine("\n=== TIME TO EXPLORE! ===");

// Try traveling to Mars with weather report
if (solarSystem.TravelTo("Mars"))
{
    Console.WriteLine("\n🌦️ Weather Report for Mars:");
    Console.WriteLine(weatherSystem.GetCurrentWeather("Mars"));
}

// Try traveling to Saturn
if (solarSystem.TravelTo("Saturn"))
{
    Console.WriteLine("\n🌦️ Weather Report for Saturn:");
    Console.WriteLine(weatherSystem.GetCurrentWeather("Saturn"));
}

// Show nearby locations from Saturn
solarSystem.ShowNearbyLocations();

// Try traveling to Titan (moon of Saturn) - should be close
solarSystem.TravelTo("Titan");

// Low on fuel? Let's refuel
solarSystem.Refuel(50);

// Try traveling to distant black hole - should require a lot of fuel
solarSystem.TravelTo("Sagittarius A*");

// Final fuel status
Console.WriteLine($"\nFinal fuel status: {solarSystem.FuelLevel:F1} units");

Conclusion

Our solar system explorer has come a long way! We’ve seen how object-oriented programming allows us to:

1. Easily add new types - We added Asteroids and Black Holes with minimal effort
2. Extend functionality - We added travel costs, distances, and a weather system
3. Maintain a clean design - Each new feature fits neatly into our class hierarchy
4. Create rich interactions - The travel system now considers fuel, distances, and location types

These extensions demonstrate the power of object-oriented design - we can continuously expand our universe without having to rewrite existing code.

Student Exercises

1. Add a SpaceAnomaly class that has random effects when visited
2. Implement a trading system between locations
3. Add a mission system with objectives to complete
4. Create a crew management system for your spaceship
5. Implement a time system where travel takes a certain number of days depending on distance
