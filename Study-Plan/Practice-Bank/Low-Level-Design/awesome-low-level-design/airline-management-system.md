# Low-level design problem: airline management system

> Copied from <https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/airline-management-system.md> (GPL-3.0, by Ashish Pratap Singh). Questions and answers are the source's own; nothing was answered or rewritten here.


# Designing an Airline Management System

## Requirements

1. The airline management system should allow users to search for flights based on source, destination, and date.
2. Users should be able to book flights, select seats, and make payments.
3. The system should manage flight schedules, aircraft assignments, and crew assignments.
4. The system should handle passenger information, including personal details and baggage information.
5. The system should support different types of users, such as passengers, airline staff, and administrators.
6. The system should be able to handle cancellations, refunds, and flight changes.
7. The system should ensure data consistency and handle concurrent access to shared resources.
8. The system should be scalable and extensible to accommodate future enhancements and new features.

## UML Class Diagram

![](images/awesome-low-level-design_class-diagrams_airlinemanagementsystem-class-diagram.png)

## Implementations

#### [Java Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/java/src/airlinemanagementsystem)

#### [Python Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/python/airlinemanagementsystem)

#### [C++ Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/cpp/airlinemanagementsystem)

#### [C# Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/csharp/airlinemanagementsystem)

#### [Go Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/golang/airlinemanagementsystem)

## Classes, Interfaces and Enumerations

1. The **Flight** class represents a flight in the airline management system, with properties such as flight number, source, destination, departure time, arrival time, and available seats.
2. The **Aircraft** class represents an aircraft, with properties like tail number, model, and total seats.
3. The **Passenger** class represents a passenger, with properties such as ID, name, email, and phone number.
4. The **Booking** class represents a booking made by a passenger for a specific flight and seat, with properties such as booking number, flight, passenger, seat, price, and booking status.
5. The **Seat** class represents a seat on a flight, with properties like seat number, seat type, and seat status.
6. The **Payment** class represents a payment made for a booking, with properties such as payment ID, payment method, amount, and payment status.
7. The **FlightSearch** class provides functionality to search for flights based on source, destination, and date.
8. The **BookingManager** class manages the creation and cancellation of bookings. It follows the Singleton pattern to ensure a single instance of the booking manager.
9. The **PaymentProcessor** class handles the processing of payments. It follows the Singleton pattern to ensure a single instance of the payment processor.
10. The **AirlineManagementSystem** class serves as the main entry point of the system, combining all the components and providing methods for flight management, booking, payment processing, and other operations.


---

## Official solutions from the repository

<details><summary><b>java</b> (17 files)</summary>


**Aircraft.java**

```java
package airlinemanagementsystem;

public class Aircraft {
    private final String tailNumber;
    private final String model;
    private final int totalSeats;

    public Aircraft(String tailNumber, String model, int totalSeats) {
        this.tailNumber = tailNumber;
        this.model = model;
        this.totalSeats = totalSeats;
    }

    public String getTailNumber() {
        return tailNumber;
    }
}
```


**AirlineManagementSystem.java**

```java
package airlinemanagementsystem;

import airlinemanagementsystem.booking.Booking;
import airlinemanagementsystem.booking.BookingManager;
import airlinemanagementsystem.flight.Flight;
import airlinemanagementsystem.flight.FlightSearch;
import airlinemanagementsystem.payment.Payment;
import airlinemanagementsystem.payment.PaymentProcessor;
import airlinemanagementsystem.seat.Seat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AirlineManagementSystem {
    private final Map<String, Flight> flights;
    private final Map<String, Aircraft> aircrafts;
    private final Map<String, Passenger> passengers;
    private final FlightSearch flightSearch;
    private final BookingManager bookingManager;
    private final PaymentProcessor paymentProcessor;

    public AirlineManagementSystem() {
        flights = new HashMap<>();
        aircrafts = new HashMap<>();
        passengers = new HashMap<>();
        flightSearch = new FlightSearch();
        bookingManager = BookingManager.getInstance();
        paymentProcessor = PaymentProcessor.getInstance();
    }

    public Passenger addPassenger(String name, String email) {
        Passenger passenger = new Passenger(name, email);
        passengers.put(passenger.getId(), passenger);
        return passenger;
    }

    public Aircraft addAircraft(String tailNumber, String model, int totalSeats) {
        Aircraft aircraft = new Aircraft(tailNumber, model, totalSeats);
        aircrafts.put(tailNumber, aircraft);
        return aircraft;
    }

    public Flight addFlight(String source, String destination, LocalDateTime departure,
                            LocalDateTime arrival, String aircraftNumber) {
        Aircraft aircraft = aircrafts.get(aircraftNumber);
        Flight flight = new Flight(source, destination, departure, arrival, aircraft);
        flights.put(flight.getFlightNumber(), flight);
        flightSearch.addFlight(flight);
        return flight;
    }

    public List<Flight> searchFlights(String source, String destination, LocalDate date) {
        return flightSearch.searchFlights(source, destination, date);
    }

    public Booking bookFlight(String flightNumber, String passengerId, Seat seat, double price) {
        Flight flight = flights.get(flightNumber);
        Passenger passenger = passengers.get(passengerId);
        return bookingManager.createBooking(flight, passenger, seat, price);
    }

    public void cancelBooking(String bookingNumber) {
        bookingManager.cancelBooking(bookingNumber);
    }

    public void processPayment(Payment payment) {
        paymentProcessor.processPayment(payment);
    }
}
```


**AirlineManagementSystemDemo.java**

```java
package airlinemanagementsystem;

import airlinemanagementsystem.booking.Booking;
import airlinemanagementsystem.flight.Flight;
import airlinemanagementsystem.seat.Seat;
import airlinemanagementsystem.seat.SeatType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AirlineManagementSystemDemo {
    public static void run() {
        AirlineManagementSystem airlineManagementSystem = new AirlineManagementSystem();

        // Create passengers
        Passenger passenger1 = airlineManagementSystem.addPassenger("John Doe", "john@example.com");
        Passenger passenger2 = airlineManagementSystem.addPassenger("John Smith", "smith@example.com");

        // Create aircrafts
        Aircraft aircraft1 = airlineManagementSystem.addAircraft("A001", "Boeing 747", 300);
        Aircraft aircraft2 = airlineManagementSystem.addAircraft("A002", "Airbus A380", 500);

        // Create flights
        LocalDateTime departureTime1 = LocalDateTime.now().plusDays(1);
        LocalDateTime arrivalTime1 = departureTime1.plusHours(2);
        Flight flight1 = airlineManagementSystem.addFlight("New York", "London", departureTime1, arrivalTime1, aircraft1.getTailNumber());

        LocalDateTime departureTime2 = LocalDateTime.now().plusDays(3);
        LocalDateTime arrivalTime2 = departureTime2.plusHours(5);
        Flight flight2 = airlineManagementSystem.addFlight("Paris", "Tokyo", departureTime2, arrivalTime2, aircraft2.getTailNumber());

        // Search flights
        List<Flight> searchResults = airlineManagementSystem.searchFlights("New York", "London", LocalDate.now().plusDays(1));
        System.out.println("Search Results:");
        for (Flight flight : searchResults) {
            System.out.println("Flight: " + flight.getFlightNumber() + " - " + flight.getSource() + " to " + flight.getDestination());
        }

        // Book a flight
        Booking booking = airlineManagementSystem.bookFlight(flight1.getFlightNumber(), passenger1.getId(), new Seat("25A", SeatType.ECONOMY), 100);
        if (booking != null) {
            System.out.println("Booking successful. Booking ID: " + booking.getId());
        } else {
            System.out.println("Booking failed.");
        }

        // Cancel a booking
        airlineManagementSystem.cancelBooking(booking.getId());
        System.out.println("Booking cancelled.");
    }
}
```


**Passenger.java**

```java
package airlinemanagementsystem;

import java.util.UUID;

public class Passenger {
    private final String id;
    private final String name;
    private final String email;

    public Passenger(String name, String email) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.email = email;
    }

    public String getId() {
        return id;
    }
}
```


**README.md**

```md
# Airline Management System (LLD)

## Problem Statement

Design and implement an Airline Management System that allows users to book flights, manage passengers, handle seat assignments, process payments, and track bookings and flights.

---

## Requirements

- **Flight Management:** The system manages flights, each with a unique flight number, aircraft, source, destination, and schedule.
- **Aircraft Management:** Each flight is associated with an aircraft, which has a model and a set of seats.
- **Seat Management:** The system manages seat assignments and availability for each flight.
- **Passenger Management:** Passengers can be added, updated, and associated with bookings.
- **Booking Management:** Users can book flights, and the system tracks bookings, assigned seats, and passengers.
- **Payment Processing:** The system processes payments for bookings.
- **Extensibility:** Easy to add new features such as loyalty programs, meal selection, or multi-leg journeys.

---

## Core Entities

- **AirlineManagementSystem:** Main class that manages flights, bookings, passengers, and payments.
- **Flight:** Represents a flight with flight number, aircraft, source, destination, schedule, and seats.
- **Aircraft:** Represents an aircraft with a model and a set of seats.
- **Seat:** Represents a seat on an aircraft, with seat number, class, and availability.
- **Passenger:** Represents a user with ID, name, and contact details.
- **Booking:** Represents a booking, including user(s), flight, seat(s), and payment.
- **Payment (in payment/):** Represents a payment transaction for a booking.

---

## Class Design

## UML Class Diagram

![](../../../../uml-diagrams/class-diagrams/airlinemanagementsystem-class-diagram.png)

### 1. AirlineManagementSystem

- **Fields:** List<Flight> flights, List<Booking> bookings, List<Passenger> passengers, PaymentProcessor paymentProcessor
- **Methods:** addFlight(Flight), addPassenger(Passenger), bookFlight(Passenger, Flight, Seat, Payment), getAvailableSeats(Flight), getBookings(Passenger), etc.

### 2. Flight (in flight/)

- **Fields:** String flightNumber, Aircraft aircraft, String source, String destination, Date schedule, List<Seat> seats

### 3. Aircraft

- **Fields:** String model, List<Seat> seats

### 4. Seat (in seat/)

- **Fields:** String seatNumber, String seatClass, boolean isAvailable

### 5. Passenger

- **Fields:** int id, String name, String contactInfo

### 6. Booking (in booking/)

- **Fields:** int id, Passenger user, Flight flight, List<Seat> seats, Payment payment

### 7. Payment (in payment/)

- **Fields:** int id, double amount, String method, PaymentStatus status

### 8. PaymentProcessor (in payment/)

- **Methods:** process(Payment), validate(Payment)

---

## Example Usage

```java
AirlineManagementSystem system = new AirlineManagementSystem();
Aircraft aircraft = new Aircraft("Boeing 737", seatList);
Flight flight = new Flight("AI101", aircraft, "DEL", "BOM", new Date(), seatList);
system.addFlight(flight);

Passenger alice = new Passenger(1, "Alice", "alice@email.com");
system.addPassenger(alice);

Seat seat = flight.getAvailableSeats().get(0);
Payment payment = new Payment(1, 5000.0, "CREDIT_CARD");
system.bookFlight(alice, flight, seat, payment);
```

---

## Demo

See `AirlineManagementSystemDemo.java` for a sample usage and simulation of the airline management system.

---

## Extending the Framework

- **Add loyalty programs:** Track frequent flyer points and rewards.
- **Add meal selection:** Allow passengers to select meals during booking.
- **Add multi-leg journeys:** Support bookings with multiple connecting flights.

---
```


**booking/Booking.java**

```java
package airlinemanagementsystem.booking;

import airlinemanagementsystem.flight.Flight;
import airlinemanagementsystem.Passenger;
import airlinemanagementsystem.seat.Seat;

import java.util.UUID;

public class Booking {
    private final String id;
    private final Flight flight;
    private final Passenger passenger;
    private final Seat seat;
    private final double price;
    private BookingStatus status;

    public Booking(Flight flight, Passenger passenger, Seat seat, double price) {
        this.id = UUID.randomUUID().toString();
        this.flight = flight;
        this.passenger = passenger;
        this.seat = seat;
        this.price = price;
        this.status = BookingStatus.CONFIRMED;
    }

    public void cancel() {
        status = BookingStatus.CANCELLED;
        seat.release();
    }

    public String getId() {
        return id;
    }
}
```


**booking/BookingManager.java**

```java
package airlinemanagementsystem.booking;

import airlinemanagementsystem.flight.Flight;
import airlinemanagementsystem.Passenger;
import airlinemanagementsystem.seat.Seat;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class BookingManager {
    private static BookingManager instance;
    private final Map<String, Booking> bookings;
    private final Object lock = new Object();

    private BookingManager() {
        bookings = new HashMap<>();
    }

    public static synchronized BookingManager getInstance() {
        if (instance == null) {
            instance = new BookingManager();
        }
        return instance;
    }

    public Booking createBooking(Flight flight, Passenger passenger, Seat seat, double price) {
        String bookingNumber = UUID.randomUUID().toString();
        Booking booking = new Booking(flight, passenger, seat, price);
        synchronized (lock) {
            bookings.put(bookingNumber, booking);
        }
        return booking;
    }

    public void cancelBooking(String bookingNumber) {
        synchronized (lock) {
            Booking booking = bookings.get(bookingNumber);
            if (booking != null) {
                booking.cancel();
            }
        }
    }
}
```


**booking/BookingStatus.java**

```java
package airlinemanagementsystem.booking;

public enum BookingStatus {
    CONFIRMED,
    CANCELLED,
    PENDING,
    EXPIRED
}
```


**flight/Flight.java**

```java
package airlinemanagementsystem.flight;

import airlinemanagementsystem.Aircraft;
import airlinemanagementsystem.seat.Seat;

import java.time.LocalDateTime;
import java.util.*;

public class Flight {
    private final String flightNumber;
    private final String source;
    private final String destination;
    private final LocalDateTime departureTime;
    private final LocalDateTime arrivalTime;
    private final FlightStatus status;
    private final Aircraft aircraft;
    private final Map<String, Seat> seats;
    private final List<Seat> availableSeats;

    public Flight(String source, String destination, LocalDateTime departureTime, LocalDateTime arrivalTime, Aircraft aircraft) {
        this.flightNumber = UUID.randomUUID().toString();
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.status = FlightStatus.ON_TIME;
        this.aircraft = aircraft;
        this.seats = new HashMap<>();
        this.availableSeats = new ArrayList<>();
    }

    public synchronized boolean isSeatAvailable(String seatNo) {
        Seat seat = seats.get(seatNo);
        return seat != null && !seat.isBooked();
    }

    public synchronized void reserveSeat(String seatNo) {
        Seat seat = seats.get(seatNo);
        if (seat == null) throw new IllegalArgumentException("Invalid seat number");
        seat.reserve();
    }

    public synchronized void releaseSeat(String seatNo) {
        Seat seat = seats.get(seatNo);
        if (seat != null) seat.release();
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public List<Seat> getAvailableSeats() {
        return availableSeats;
    }
}
```


**flight/FlightSearch.java**

```java
package airlinemanagementsystem.flight;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class FlightSearch {
    private final List<Flight> flights;

    public FlightSearch() {
        this.flights = new ArrayList<>();
    }

    public void addFlight(Flight flight) {
        flights.add(flight);
    }

    public List<Flight> searchFlights(String source, String destination, LocalDate date) {
        return flights.stream()
                .filter(flight -> flight.getSource().equalsIgnoreCase(source)
                        && flight.getDestination().equalsIgnoreCase(destination)
                        && flight.getDepartureTime().toLocalDate().equals(date))
                .collect(Collectors.toList());
    }
}
```


**flight/FlightStatus.java**

```java
package airlinemanagementsystem.flight;

public enum FlightStatus {
    ON_TIME, DELAYED, CANCELLED
}
```


**payment/Payment.java**

```java
package airlinemanagementsystem.payment;

public class Payment {
    private final String paymentId;
    private final String paymentMethod;
    private final double amount;
    private PaymentStatus status;

    public Payment(String paymentId, String paymentMethod, double amount) {
        this.paymentId = paymentId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.status = PaymentStatus.PENDING;
    }

    public void processPayment() {
        // Process payment logic
        status = PaymentStatus.COMPLETED;
    }
}
```


**payment/PaymentProcessor.java**

```java
package airlinemanagementsystem.payment;

public class PaymentProcessor {
    private static PaymentProcessor instance;

    private PaymentProcessor() {
    }

    public static synchronized PaymentProcessor getInstance() {
        if (instance == null) {
            instance = new PaymentProcessor();
        }
        return instance;
    }

    public void processPayment(Payment payment) {
        // Process payment using the selected payment method
        payment.processPayment();
    }
}
```


**payment/PaymentStatus.java**

```java
package airlinemanagementsystem.payment;

public enum PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED
}
```


**seat/Seat.java**

```java
package airlinemanagementsystem.seat;

public class Seat {
    private final String seatNumber;
    private final SeatType type;
    private SeatStatus status;

    public Seat(String seatNumber, SeatType type) {
        this.seatNumber = seatNumber;
        this.type = type;
        this.status = SeatStatus.AVAILABLE;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void reserve() {
        status = SeatStatus.RESERVED;
    }

    public void release() {
        status = SeatStatus.AVAILABLE;
    }

    public synchronized boolean isBooked() {
        return status == SeatStatus.OCCUPIED;
    }
}
```


**seat/SeatStatus.java**

```java
package airlinemanagementsystem.seat;

public enum SeatStatus {
    AVAILABLE,
    RESERVED,
    OCCUPIED
}
```


**seat/SeatType.java**

```java
package airlinemanagementsystem.seat;

public enum SeatType {
    ECONOMY,
    PREMIUM_ECONOMY,
    BUSINESS,
    FIRST_CLASS
}
```

</details>

<details><summary><b>python</b> (12 files)</summary>


**README.md**

```md
# Designing an Airline Management System

## Requirements
1. The airline management system should allow users to search for flights based on source, destination, and date.
2. Users should be able to book flights, select seats, and make payments.
3. The system should manage flight schedules, aircraft assignments, and crew assignments.
4. The system should handle passenger information, including personal details and baggage information.
5. The system should support different types of users, such as passengers, airline staff, and administrators.
6. The system should be able to handle cancellations, refunds, and flight changes.
7. The system should ensure data consistency and handle concurrent access to shared resources.
8. The system should be scalable and extensible to accommodate future enhancements and new features.

## Classes, Interfaces and Enumerations
1. The **Flight** class represents a flight in the airline management system, with properties such as flight number, source, destination, departure time, arrival time, and available seats.
2. The **Aircraft** class represents an aircraft, with properties like tail number, model, and total seats.
3. The **Passenger** class represents a passenger, with properties such as ID, name, email, and phone number.
4. The **Booking** class represents a booking made by a passenger for a specific flight and seat, with properties such as booking number, flight, passenger, seat, price, and booking status.
5. The **Seat** class represents a seat on a flight, with properties like seat number, seat type, and seat status.
6. The **Payment** class represents a payment made for a booking, with properties such as payment ID, payment method, amount, and payment status.
7. The **FlightSearch** class provides functionality to search for flights based on source, destination, and date.
8. The **BookingManager** class manages the creation and cancellation of bookings. It follows the Singleton pattern to ensure a single instance of the booking manager.
9. The **PaymentProcessor** class handles the processing of payments. It follows the Singleton pattern to ensure a single instance of the payment processor.
10. The **AirlineManagementSystem** class serves as the main entry point of the system, combining all the components and providing methods for flight management, booking, payment processing, and other operations.
```


**aircraft.py**

```py
class Aircraft:
    def __init__(self, tail_number, model, total_seats):
        self.tail_number = tail_number
        self.model = model
        self.total_seats = total_seats
```


**airline_management_system.py**

```py
from flight import Flight
from aircraft import Aircraft
from flight_search import FlightSearch
from booking_manager import BookingManager
from payment_processor import PaymentProcessor

class AirlineManagementSystem:
    def __init__(self):
        self.flights = []
        self.aircrafts = []
        self.flight_search = FlightSearch(self.flights)
        self.booking_manager = BookingManager()
        self.payment_processor = PaymentProcessor()

    def add_flight(self, flight):
        self.flights.append(flight)

    def add_aircraft(self, aircraft):
        self.aircrafts.append(aircraft)

    def search_flights(self, source, destination, date):
        return self.flight_search.search_flights(source, destination, date)

    def book_flight(self, flight, passenger, seat, price):
        return self.booking_manager.create_booking(flight, passenger, seat, price)

    def cancel_booking(self, booking_number):
        self.booking_manager.cancel_booking(booking_number)

    def process_payment(self, payment):
        self.payment_processor.process_payment(payment)
```


**airline_management_system_demo.py**

```py
from datetime import datetime, timedelta
from typing import List
from airline_management_system import AirlineManagementSystem
from passenger import Passenger
from flight import Flight
from aircraft import Aircraft
from seat import Seat, SeatType

class AirlineManagementSystemDemo:
    @staticmethod
    def run():
        airline_management_system = AirlineManagementSystem()

        # Create users
        passenger1 = Passenger("U001", "John Doe", "john@example.com", "1234567890")

        # Create flights
        departure_time1 = datetime.now() + timedelta(days=1)
        arrival_time1 = departure_time1 + timedelta(hours=2)
        flight1 = Flight("F001", "New York", "London", departure_time1, arrival_time1)

        departure_time2 = datetime.now() + timedelta(days=3)
        arrival_time2 = departure_time2 + timedelta(hours=5)
        flight2 = Flight("F002", "Paris", "Tokyo", departure_time2, arrival_time2)

        airline_management_system.add_flight(flight1)
        airline_management_system.add_flight(flight2)

        # Create aircrafts
        aircraft1 = Aircraft("A001", "Boeing 747", 300)
        aircraft2 = Aircraft("A002", "Airbus A380", 500)
        airline_management_system.add_aircraft(aircraft1)
        airline_management_system.add_aircraft(aircraft2)

        # Search flights
        search_date = datetime.now().date() + timedelta(days=1)
        search_results: List[Flight] = airline_management_system.search_flights("New York", "London", search_date)
        print("Search Results:")
        for flight in search_results:
            print(f"Flight: {flight.flight_number} - {flight.source} to {flight.destination}")

        seat = Seat("25A", SeatType.ECONOMY)

        # Book a flight
        booking = airline_management_system.book_flight(flight1, passenger1, seat, 100)
        if booking:
            print(f"Booking successful. Booking ID: {booking.booking_number}")
        else:
            print("Booking failed.")

        # Cancel a booking
        airline_management_system.cancel_booking(booking.booking_number)
        print("Booking cancelled.")

if __name__ == "__main__":
    AirlineManagementSystemDemo.run()
```


**booking.py**

```py
from enum import Enum

class BookingStatus(Enum):
    CONFIRMED = 1
    CANCELLED = 2
    PENDING = 3
    EXPIRED = 4

class Booking:
    def __init__(self, booking_number, flight, passenger, seat, price):
        self.booking_number = booking_number
        self.flight = flight
        self.passenger = passenger
        self.seat = seat
        self.price = price
        self.status = BookingStatus.CONFIRMED

    def cancel(self):
        self.status = BookingStatus.CANCELLED
```


**booking_manager.py**

```py
import datetime
from booking import Booking
from threading import Lock

class BookingManager:
    _instance = None
    _lock = Lock()

    def __new__(cls):
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.bookings = {}
        self.booking_counter = 0

    def create_booking(self, flight, passenger, seat, price):
        booking_number = self._generate_booking_number()
        booking = Booking(booking_number, flight, passenger, seat, price)
        with self._lock:
            self.bookings[booking_number] = booking
        return booking

    def cancel_booking(self, booking_number):
        with self._lock:
            booking = self.bookings.get(booking_number)
            if booking:
                booking.cancel()

    def _generate_booking_number(self):
        self.booking_counter += 1
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        return f"BKG{timestamp}{self.booking_counter:06d}"
```


**flight.py**

```py
from datetime import datetime

class Flight:
    def __init__(self, flight_number, source, destination, departure_time, arrival_time):
        self.flight_number = flight_number
        self.source = source
        self.destination = destination
        self.departure_time = departure_time
        self.arrival_time = arrival_time
        self.available_seats = []

    def get_source(self):
        return self.source

    def get_destination(self):
        return self.destination

    def get_departure_time(self):
        return self.departure_time
```


**flight_search.py**

```py
from datetime import date

class FlightSearch:
    def __init__(self, flights):
        self.flights = flights

    def search_flights(self, source, destination, date):
        return [flight for flight in self.flights
                if flight.get_source().lower() == source.lower()
                and flight.get_destination().lower() == destination.lower()
                and flight.get_departure_time().date() == date]
```


**passenger.py**

```py
class Passenger:
    def __init__(self, passenger_id, name, email, phone):
        self.id = passenger_id
        self.name = name
        self.email = email
        self.phone = phone
```


**payment.py**

```py
from enum import Enum

class PaymentStatus(Enum):
    PENDING = 1
    COMPLETED = 2
    FAILED = 3
    REFUNDED = 4

class Payment:
    def __init__(self, payment_id, payment_method, amount):
        self.payment_id = payment_id
        self.payment_method = payment_method
        self.amount = amount
        self.status = PaymentStatus.PENDING

    def process_payment(self):
        # Process payment logic
        self.status = PaymentStatus.COMPLETED
```


**payment_processor.py**

```py
from threading import Lock

class PaymentProcessor:
    _instance = None
    _lock = Lock()

    def __new__(cls):
        if not cls._instance:
            with cls._lock:
                if not cls._instance:
                    cls._instance = super().__new__(cls)
        return cls._instance

    def process_payment(self, payment):
        # Process payment using the selected payment method
        payment.process_payment()
```


**seat.py**

```py
from enum import Enum

class SeatStatus(Enum):
    AVAILABLE = 1
    RESERVED = 2
    OCCUPIED = 3

class SeatType(Enum):
    ECONOMY = 1
    PREMIUM_ECONOMY = 2
    BUSINESS = 3
    FIRST_CLASS = 4

class Seat:
    def __init__(self, seat_number, seat_type):
        self.seat_number = seat_number
        self.type = seat_type
        self.status = SeatStatus.AVAILABLE

    def reserve(self):
        self.status = SeatStatus.RESERVED

    def release(self):
        self.status = SeatStatus.AVAILABLE
```

</details>

<details><summary><b>cpp</b> (13 files)</summary>


**AirlineManagementSystem.cpp**

```cpp
#include "AirlineManagementSystem.hpp"
#include <iostream>

AirlineManagementSystem::AirlineManagementSystem() : bookingIdCounter(1) {}

AirlineManagementSystem::~AirlineManagementSystem() {
    for (auto flight : flights) delete flight;
    for (auto passenger : passengers) delete passenger;
    for (auto booking : bookings) delete booking;
}

void AirlineManagementSystem::addFlight(Flight* flight) {
    flights.push_back(flight);
}

void AirlineManagementSystem::addPassenger(Passenger* passenger) {
    passengers.push_back(passenger);
}

std::string AirlineManagementSystem::createBooking(Flight* flight, Passenger* passenger, int seatNumber) {
    if (!flight->bookSeat(seatNumber)) {
        return "";
    }
    
    std::string bookingId = "B" + std::to_string(bookingIdCounter++);
    Booking* booking = new Booking(bookingId, flight, passenger, seatNumber);
    bookings.push_back(booking);
    return bookingId;
}

bool AirlineManagementSystem::cancelBooking(std::string bookingId) {
    Booking* booking = findBooking(bookingId);
    if (!booking) return false;
    
    booking->getFlight()->cancelSeat(booking->getSeatNumber());
    
    auto it = std::find(bookings.begin(), bookings.end(), booking);
    if (it != bookings.end()) {
        bookings.erase(it);
        delete booking;
        return true;
    }
    return false;
}

void AirlineManagementSystem::displayAllFlights() const {
    std::cout << "\nAll Flights:" << std::endl;
    for (const auto& flight : flights) {
        flight->displayFlightInfo();
        std::cout << "------------------------" << std::endl;
    }
}

void AirlineManagementSystem::displayAllPassengers() const {
    std::cout << "\nAll Passengers:" << std::endl;
    for (const auto& passenger : passengers) {
        passenger->displayInfo();
        std::cout << "------------------------" << std::endl;
    }
}

void AirlineManagementSystem::displayAllBookings() const {
    std::cout << "\nAll Bookings:" << std::endl;
    for (const auto& booking : bookings) {
        booking->displayBookingInfo();
        std::cout << "------------------------" << std::endl;
    }
}

Flight* AirlineManagementSystem::findFlight(std::string flightNumber) const {
    for (auto flight : flights) {
        if (flight->getFlightNumber() == flightNumber) return flight;
    }
    return nullptr;
}

Passenger* AirlineManagementSystem::findPassenger(std::string passportNumber) const {
    for (auto passenger : passengers) {
        if (passenger->getPassportNumber() == passportNumber) return passenger;
    }
    return nullptr;
}

Booking* AirlineManagementSystem::findBooking(std::string bookingId) const {
    for (auto booking : bookings) {
        if (booking->getBookingId() == bookingId) return booking;
    }
    return nullptr;
}
```


**AirlineManagementSystem.hpp**

```hpp
#ifndef AIRLINE_MANAGEMENT_SYSTEM_HPP
#define AIRLINE_MANAGEMENT_SYSTEM_HPP

#include <vector>
#include <string>
#include "Flight.hpp"
#include "Passenger.hpp"
#include "Booking.hpp"

class AirlineManagementSystem {
private:
    std::vector<Flight*> flights;
    std::vector<Passenger*> passengers;
    std::vector<Booking*> bookings;
    int bookingIdCounter;

public:
    AirlineManagementSystem();
    ~AirlineManagementSystem();
    
    void addFlight(Flight* flight);
    void addPassenger(Passenger* passenger);
    std::string createBooking(Flight* flight, Passenger* passenger, int seatNumber);
    bool cancelBooking(std::string bookingId);
    
    void displayAllFlights() const;
    void displayAllPassengers() const;
    void displayAllBookings() const;
    
    Flight* findFlight(std::string flightNumber) const;
    Passenger* findPassenger(std::string passportNumber) const;
    Booking* findBooking(std::string bookingId) const;
};

#endif
```


**AirlineManagementSystemDemo.cpp**

```cpp
#include "AirlineManagementSystem.hpp"
#include <iostream>

int main() {
    AirlineManagementSystem ams;
    
    // Create flights
    Flight* flight1 = new Flight("FL001", "New York", "London", "2024-03-20 10:00", 100);
    Flight* flight2 = new Flight("FL002", "London", "Paris", "2024-03-21 15:30", 80);
    ams.addFlight(flight1);
    ams.addFlight(flight2);
    
    // Create passengers
    Passenger* passenger1 = new Passenger("John Doe", "P123456", "+1-555-0123");
    Passenger* passenger2 = new Passenger("Jane Smith", "P789012", "+1-555-0124");
    ams.addPassenger(passenger1);
    ams.addPassenger(passenger2);
    
    // Display all flights and passengers
    ams.displayAllFlights();
    ams.displayAllPassengers();
    
    // Create bookings
    std::string booking1 = ams.createBooking(flight1, passenger1, 1);
    std::string booking2 = ams.createBooking(flight2, passenger2, 1);
    
    if (!booking1.empty()) {
        std::cout << "\nBooking created successfully: " << booking1 << std::endl;
    }
    if (!booking2.empty()) {
        std::cout << "Booking created successfully: " << booking2 << std::endl;
    }
    
    // Display all bookings
    ams.displayAllBookings();
    
    // Cancel a booking
    if (ams.cancelBooking(booking1)) {
        std::cout << "\nBooking " << booking1 << " cancelled successfully" << std::endl;
    }
    
    // Display updated bookings
    ams.displayAllBookings();
    
    return 0;
}
```


**Booking.cpp**

```cpp
#include "Booking.hpp"
#include <iostream>

Booking::Booking(std::string bookingId, Flight* flight, Passenger* passenger, int seatNumber)
    : bookingId(bookingId), flight(flight), passenger(passenger), seatNumber(seatNumber) {}

std::string Booking::getBookingId() const { return bookingId; }
Flight* Booking::getFlight() const { return flight; }
Passenger* Booking::getPassenger() const { return passenger; }
int Booking::getSeatNumber() const { return seatNumber; }

void Booking::displayBookingInfo() const {
    std::cout << "\nBooking Details:" << std::endl;
    std::cout << "Booking ID: " << bookingId << std::endl;
    std::cout << "Seat Number: " << seatNumber << std::endl;
    passenger->displayInfo();
    flight->displayFlightInfo();
}
```


**Booking.hpp**

```hpp
#ifndef BOOKING_HPP
#define BOOKING_HPP

#include "Flight.hpp"
#include "Passenger.hpp"
#include <string>

class Booking {
private:
    std::string bookingId;
    Flight* flight;
    Passenger* passenger;
    int seatNumber;

public:
    Booking(std::string bookingId, Flight* flight, Passenger* passenger, int seatNumber);
    
    std::string getBookingId() const;
    Flight* getFlight() const;
    Passenger* getPassenger() const;
    int getSeatNumber() const;
    void displayBookingInfo() const;
};

#endif
```


**Flight.cpp**

```cpp
#include "Flight.hpp"
#include <iostream>

Flight::Flight(std::string flightNumber, std::string origin, std::string destination, 
               std::string departureTime, int capacity) 
    : flightNumber(flightNumber), origin(origin), destination(destination),
      departureTime(departureTime), capacity(capacity) {
    
    // Initialize seats
    for (int i = 1; i <= capacity; i++) {
        seats.push_back(Seat(i, false));
    }
}

std::string Flight::getFlightNumber() const { return flightNumber; }
std::string Flight::getOrigin() const { return origin; }
std::string Flight::getDestination() const { return destination; }
std::string Flight::getDepartureTime() const { return departureTime; }
int Flight::getCapacity() const { return capacity; }
std::vector<Seat>& Flight::getSeats() { return seats; }

void Flight::displayFlightInfo() const {
    std::cout << "Flight " << flightNumber << std::endl;
    std::cout << "From: " << origin << " To: " << destination << std::endl;
    std::cout << "Departure Time: " << departureTime << std::endl;
    std::cout << "Capacity: " << capacity << " seats" << std::endl;
}

bool Flight::bookSeat(int seatNumber) {
    if (seatNumber < 1 || seatNumber > capacity) return false;
    if (seats[seatNumber - 1].isBooked()) return false;
    
    seats[seatNumber - 1].book();
    return true;
}

bool Flight::cancelSeat(int seatNumber) {
    if (seatNumber < 1 || seatNumber > capacity) return false;
    if (!seats[seatNumber - 1].isBooked()) return false;
    
    seats[seatNumber - 1].cancel();
    return true;
}
```


**Flight.hpp**

```hpp
#ifndef FLIGHT_HPP
#define FLIGHT_HPP

#include <string>
#include <vector>
#include "Seat.hpp"

class Flight {
private:
    std::string flightNumber;
    std::string origin;
    std::string destination;
    std::string departureTime;
    int capacity;
    std::vector<Seat> seats;

public:
    Flight(std::string flightNumber, std::string origin, std::string destination, 
           std::string departureTime, int capacity);
    
    std::string getFlightNumber() const;
    std::string getOrigin() const;
    std::string getDestination() const;
    std::string getDepartureTime() const;
    int getCapacity() const;
    std::vector<Seat>& getSeats();
    
    void displayFlightInfo() const;
    bool bookSeat(int seatNumber);
    bool cancelSeat(int seatNumber);
};

#endif
```


**Passenger.cpp**

```cpp
#include "Passenger.hpp"
#include <iostream>

Passenger::Passenger(std::string name, std::string passportNumber, std::string contactNumber)
    : name(name), passportNumber(passportNumber), contactNumber(contactNumber) {}

std::string Passenger::getName() const { return name; }
std::string Passenger::getPassportNumber() const { return passportNumber; }
std::string Passenger::getContactNumber() const { return contactNumber; }

void Passenger::displayInfo() const {
    std::cout << "Passenger Details:" << std::endl;
    std::cout << "Name: " << name << std::endl;
    std::cout << "Passport Number: " << passportNumber << std::endl;
    std::cout << "Contact Number: " << contactNumber << std::endl;
}
```


**Passenger.hpp**

```hpp
#ifndef PASSENGER_HPP
#define PASSENGER_HPP

#include <string>

class Passenger {
private:
    std::string name;
    std::string passportNumber;
    std::string contactNumber;

public:
    Passenger(std::string name, std::string passportNumber, std::string contactNumber);
    
    std::string getName() const;
    std::string getPassportNumber() const;
    std::string getContactNumber() const;
    void displayInfo() const;
};

#endif
```


**README.md**

```md
# Designing an Airline Management System

## Requirements
1. The airline management system should allow users to search for flights based on source, destination, and date.
2. Users should be able to book flights, select seats, and make payments.
3. The system should manage flight schedules, aircraft assignments, and crew assignments.
4. The system should handle passenger information, including personal details and baggage information.
5. The system should support different types of users, such as passengers, airline staff, and administrators.
6. The system should be able to handle cancellations, refunds, and flight changes.
7. The system should ensure data consistency and handle concurrent access to shared resources.
8. The system should be scalable and extensible to accommodate future enhancements and new features.

## Classes, Interfaces and Enumerations
1. The **Flight** class represents a flight in the airline management system, with properties such as flight number, source, destination, departure time, arrival time, and available seats.
2. The **Aircraft** class represents an aircraft, with properties like tail number, model, and total seats.
3. The **Passenger** class represents a passenger, with properties such as ID, name, email, and phone number.
4. The **Booking** class represents a booking made by a passenger for a specific flight and seat, with properties such as booking number, flight, passenger, seat, price, and booking status.
5. The **Seat** class represents a seat on a flight, with properties like seat number, seat type, and seat status.
6. The **Payment** class represents a payment made for a booking, with properties such as payment ID, payment method, amount, and payment status.
7. The **FlightSearch** class provides functionality to search for flights based on source, destination, and date.
8. The **BookingManager** class manages the creation and cancellation of bookings. It follows the Singleton pattern to ensure a single instance of the booking manager.
9. The **PaymentProcessor** class handles the processing of payments. It follows the Singleton pattern to ensure a single instance of the payment processor.
10. The **AirlineManagementSystem** class serves as the main entry point of the system, combining all the components and providing methods for flight management, booking, payment processing, and other operations.
```


**Seat.cpp**

```cpp
#include "Seat.hpp"

Seat::Seat(int number, bool isBooked) 
    : seatNumber(number), booked(isBooked) {}

int Seat::getSeatNumber() const { return seatNumber; }
bool Seat::isBooked() const { return booked; }
void Seat::book() { booked = true; }
void Seat::cancel() { booked = false; }
```


**Seat.hpp**

```hpp
#ifndef SEAT_HPP
#define SEAT_HPP

class Seat {
private:
    int seatNumber;
    bool booked;

public:
    Seat(int number, bool isBooked = false);
    
    int getSeatNumber() const;
    bool isBooked() const;
    void book();
    void cancel();
};

#endif
```


**airline_system**

```
����            �  ��!        H   __PAGEZERO                                                        �  __TEXT                                                    __text          __TEXT          |=     ,�      |=               �            __stubs         __TEXT          ��     �      ��              �           __gcc_except_tab__TEXT          ��     �      ��                             __cstring       __TEXT          L�     �      L�                             __unwind_info   __TEXT           �     �       �                                �   __DATA_CONST           @              @                  __got           __DATA_CONST          0                       >              H   __LINKEDIT       @     @      @     @                   4  �    @ @  3  �   @Q �        �b �  �� �     P       j  j  N   �  &                           А �                             /usr/lib/dyld             |�]8J�M�OL�B�2                       �*              (  �   H�                 0          �@   /usr/lib/libc++.1.dylib    8           8   /usr/lib/libSystem.B.dylib      &      0` �  )      �b            Z @                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              �� ��{��C �� ��@�� �
  ��@� a �  ��@� � �  ��@�( �RH ��{A��� ��_��� ��{��C �� ��@�� �� ��@��{A��� ��_��� ��{��C �� ��@�� � ��@��{A��� ��_��� ��{��C �� ��@�� �_ ��@��{A��� ��_��� ��{��C �� ��@�� ������@��{A��� ��_�����{	��C����_�� ���������^�n  �����^�w  ����  �� ѡ� �~  �� 6  �� ч  � @����]�� � ����  7  �@��  ��@�, �    �� ш  �����@�a ������\��  �����\��  ��' �  ���#��  �� 6  �ѣ  � @��# ��#@�� � ����  7  �@��  ��@��+ �    �Ѥ  �����@�� �� ��@��  �� ��@��  �� �  �� �� ��  �� 6  �� ��  � @�� ��@�� � ����  7  �@��  ��@��+ �    �� ��  �����@� � ��  ��@� a ��  ��@��  ���_��{I�����_��� ��{��C �� ��@� @�� �� ��@��{A��� ��_��� ��{��C �� ��@�@�� �� ��@��{A��� ��_��� ��{��C �� �� ��@��@�� �  R  �{A��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�� �� ��@��{A��� ��_��C �� ��@� @�! �  ��C ��_��� ��{��C �� ��@� @�� �� ��@��{A��� ��_��� ��{��C �� ��@�@�� �� ��@��{A��� ��_��� ��{��C �� �� ��@��@�1 �  R  �{A��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�� �7 ��@��{A��� ��_��C �� ��@� @�! �  ��C ��_��� ��{��C �� ��@� @�� �� ��@��{A��� ��_��� ��{��C �� ��@�@�� �� ��@��{A��� ��_��� ��{��C �� �� ��@��@� �  R  �{A��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�� �" ��@��{A��� ��_��C �� ��@� @�! �  ��C ��_��� ��{��C �� ��@�� ��	 ��@��{A��� ��_��� ��{��C �� ��@�� �� ��@��{A��� ��_��� ��{��C �� ��@�� �] ��@��{A��� ��_��� ��{��C �� ��@�� ������@��{A��� ��_��� ��{��C ���� �� �� ��@�  ��{A��� ��_��� ��{��� ����� ���_�� �@�� �U ��@�	 @�	����  7  �@��@��* �  �@��@�* �  �{B��� ��_��� ��{��C ���� �� �� ��@� a �  ��{A��� ��_��� ��{��� ����� ���_�� �@�� �� ��@�	 @�	����  7  �@��@�j* �  �@��@�c* �  �{B��� ��_�����{
����� ���������������_�� ���^���]�_# ��  7  �@�A  �!0�c  �]  �@� �R  ��8 I@� (I ���� �W* ��@��@�@  � 4�_  �  ���) � ��V* �� �  �@�( �R  � 9�� ��) �  �@���^��^���]��� ��! �   �R  � 9�� ��) ��@��@��#��' � � �N  �  ( �R  ��8��]8 7  ������C����) �   ������C�  ������C�  ������C��� ��) �  �@9�  6  �@�* �    �@��) �    �@��) �  �{J�����_֠�[�k) ��� ��{��� ����� ���_�� ��@�� ��@��{B��� ��_��� ��{��� �� ����� �� ��@��@� �Ҁ) �� ��@�> ��{B��� ��_��� ��{��� ����� ���_�� �@�� �� ��@�	 @�	����  7  �@��@��) �  �@��@��) �  �{B��� ��_��C��{�����������_�� ��� �� �W) ��@��@�a  ��# �  �� �S) ��#@����^� ���� 7   �R  ��8J  ��������� �B) �I  �� �� ��^�4! �� ��^�=! �� ��@��" ��@� � �h����@���� � �p����@��3 ���Z��3@�i  ��@��C�� ��� � �e���� ��@��c��/ �l���� 6  �@�� �� ��C��C� �Ҟ  ��@��+@�r  ��' ��^�� � ����  7  �@�j����@�r) �  ( �R  ��8   �R  ��8  ��_8  �{L��C��_֠\��( ����{����� �������_�� ����^�� �����^�� ���  �� ѡ� �� �` 6  �� �� � @�� ��@�� �� ��  ��@��@� �� ��@�� ��( ��@��  6  �@����    �� ѹ �������  ��_��{G����_��� ��{��� �� �� �� �  �C ��# ����  6  �C ���� @��@�)@�	���h  7      �C ��������@������_��{B��� ��_��C��{����C �� ��������^�� �� �� ��@��c �� �� ��@�� �(@��@�
�� ��@�!@��@� ! �� �� ��@�� ��@��@�! � ��@��@�b	 ������_��{D��C��_��� ��{��� ����� �� ���_�� ��@��@� ��@��{B��� ��_����{��� ������_�� �`  � �@�A  �!<�'  �  �!4�6  ��@����_�S  �� ��_�\  �� �  �c ��C �c  �� 6  �c �l  �� ��@� @�h! �`  � �@�A  �!t�  �  �!4�  �  �c �c  �����{C����_��� ��{��� ����� ���_�� ��@�� ��@�( ��@�� ��@�� ��{B��� ��_��� ��{��C �� �� ��@��@� ?��{A��� ��_��� ��{��C �� ��@�� ��@�	@�)�^� 	�A�R� �� ��@� ( ��@�( ��@��{A��� ��_��� ��{��C �� ��@� @�� �� ��@��{A��� ��_��� ��{��C �� ��@�@�� �� ��@��{A��� ��_��� ��{��C �� �� ��@��@�y �  R  �{A��� ��_��C �� ��@� @��C ��_��C �� ��@� @�! �  ��C ��_����{��� ������_�� �`  � �@�A  �!������  �!4������@�a ����_�   �� ��_�)  �� �  �c ��C �0  �� 6  �c �9  �� ��@� @�' �`  � �@�A  �!t�s���  �!4�����  �c �0  �����{C����_��� ��{��C �� ��@� @�� �� ��@��{A��� ��_��� ��{��C �� ��@�@�� �� ��@��{A��� ��_��� ��{��C �� �� ��@��@�, �  R  �{A��� ��_��C �� ��@� @��C ��_��C �� ��@� @�! �  ��C ��_����{��� ������_�� �`  � �@�A  �!�+���  �!4�:����@�� ����_�   �� ��_�)  �� �  �c ��C �0  �� 6  �c �9  �� ��@� @�U �@  � �@�A  �!t��������!4����  �c �0  �����{C����_��� ��{��C �� ��@� @�r �� ��@��{A��� ��_��� ��{��C �� ��@�@�f �� ��@��{A��� ��_��� ��{��C �� �� ��@��@�� �  R  �{A��� ��_��C �� ��@� @��C ��_��C �� ��@� @�! �  ��C ��_����{����� �������_����^���������^������  �� ѡ� �
���` 6  �� ���� @�� ��@�� �� �� ��@��@�  �� ��@�� ��& ��@��  6  �@����    �� ����������  ��_��{G����_��C��{���������_�1 �� ��@�� ���^�, ��@� ����  7   �R  ��88  �_�� �� ���^�� �� ��_�� �� 6  �@��@��@��& �  q��  ��8$    �@� ���H 7  �@��9�@�)�9	k���  7   �R  ��8    �@� �� ��@� �� ��@� �� ����( �R  ��8  ��_8  �{D��C��_����{����� �������_�a ����^���������^�������  �� ѡ� �����` 6  �� ����� @�� ��@�� �� ��% ��@��@������ ��@�� �a& ��@��  6  �@����    �� �����������  ��_��{G����_��� ��{��� ����� ���_�  �� ��@�	  �� ��@� ���  �{B��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�� � ��  ��@� !�.& ��@� � �+& ��@� a �(& ��@�&& ��@��{A��� ��_��� ��{��C �� ��@�� �  ��@��{A��� ��_��� ��{��� ������_�� ��C �
  �  �C �  �  �@��{B��� ��_�  ��� ��{��� ����� ���_�� ��@�/  ��@��{B��� ��_��{��i& �\& ��� ��{��� ������_�� � @�(  ��@� @�S  ��@�@�@� ���� 7  �@� @�M  ��@� @�a  ��@�� �	@�)@�� � @�d  ��@�� ��@�I  �  �{B��� ��_��C �� �� ��@��@�  ��C ��_��C��{��������_���e  �� ��_�� �a  �� ��_�� �E  �� ��_�� �Y  �� ��_�� �_  �� ��_�� �Q  �� ��_����5  ��@��@��@��@��@���^�� ��_��

�C
�
	�9  ��{D��C��_��C �� ��C ��_��� ��{��C �� ��@� @�L  ��{A��� ��_��� ��{��� ����� �� ���_��@��@�r  ��{B��� ��_��� ��{��C �� ��@� A ��  ��{A��� ��_��� ��{��C �� ��@�� ��  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� �� �� �� �� �� ��� ��_��� ��{��C �� ��@� @�  ��{A��� ��_��C �� ��@�(@�)@�	�	�� 
ɚ�C ��_��C �� ��@��C ��_����{��� ��������_�� �@�� �  �_��@�	���� 7  �@������ ��@� ! �� ������ ��@�;% �  ����@��_�( ��{C����_�(����� ��{��C �� �� ��@��@�  ��{A��� ��_��C �� �� ��C ��_��� ��{��� ����� �� ��@��@��}ӂ ��  �  �{B��� ��_������ ��{��� ����� �� ���_��@�  ��{B��� ��_��� ��{��C �� �� ��@�  ��{A��� ��_��� ��{��C �� ��@�M% ��{A��� ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@� A �  ��{A��� ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ����� ���_�  �� ��@�	  �� ��@� ���  �{B��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�� � � ��$ ��@� a ��$ ��@��$ ��@��{A��� ��_��� ��{��� ����� ���_�  �� ��@�	  �� ��@� ���  �{B��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�� �s$ ��@��{A��� ��_��� ��{��� ����� ���_�  �� ��@�	  �� ��@� ���  �{B��� ��_��C �� ��@� @��C ��_��� ��{��� ����� ���_�  �� ��@�	  �� ��@� ���  �{B��� ��_��C �� ��@� @��C ��_��� ��{��� ����� ���_�  �� ��@�	  �� ��@� ���  �{B��� ��_��C �� ��@� @��C ��_��� ��{��� ������_�� � � ��C �� � A ��? �
  �  �@�  �  �@��{B��� ��_������ ��{��� ����� �� ���_�� ��@��@�	  ��@��{B��� ��_��C �� ��C ��_����{��� ������� ���_�� ��_�  ��@�  ��@��{C����_��C �� �� ��@�  ��C ��_��� ��{��� �� ��@�� �  ��@��{B��� ��_��� ��{��C �� ��@�� �  ��@��{A��� ��_��C �� ��@��C ��_��� ��{��� ������_�� � � ��C �� � A ��? �
  �  �@�  �  �@��{B��� ��_־����� ��{��� ����� �� ���_�� ��@��@�	  ��@��{B��� ��_��C �� ��C ��_����{��� ������� ���_�� ��_�  ��@�  ��@��{C����_��C �� �� ��@�  ��C ��_��� ��{��� �� ��@�� �  ��@��{B��� ��_��� ��{��C �� ��@�� �  ��@��{A��� ��_��C �� ��@��C ��_��� ��{��� ������_�� � � ��C �� � A ��? �
  �  �@�  �  �@��{B��� ��_�c����� ��{��� ����� �� ���_�� ��@��@�	  ��@��{B��� ��_��C �� ��C ��_����{��� ������� ���_�� ��_�  ��@�  ��@��{C����_��C �� �� ��@�  ��C ��_��� ��{��� �� ��@�� �  ��@��{B��� ��_��� ��{��C �� ��@�� �  ��@��{A��� ��_��C �� ��@��C ��_��� ��{��� ������_�� ��C �
  �  �C �  �  �@��{B��� ��_�
����� ��{��� ����� ���_�� ��@�,  ��@��{B��� ��_��� ��{��� ������_�� � @�(  ��@� @�S  ��@�@�@� ���� 7  �@� @�M  ��@� @�a  ��@�� �	@�)@�� � @�d  ��@�� ��@�I  �  �{B��� ��_��C �� �� ��@��@�  ��C ��_��C��{��������_���e  �� ��_�� �a  �� ��_�� �E  �� ��_�� �Y  �� ��_�� �_  �� ��_�� �Q  �� ��_����5  ��@��@��@��@��@���^�� ��_��

�C
�
	�9  ��{D��C��_��C �� ��C ��_��� ��{��C �� ��@� @�L  ��{A��� ��_��� ��{��� ����� �� ���_��@��@�r  ��{B��� ��_��� ��{��C �� ��@� A �x  ��{A��� ��_��� ��{��C �� ��@�� �|  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� �� �� �� �� �� ��� ��_��� ��{��C �� ��@� @�  ��{A��� ��_��C �� ��@�(@�)@�	�	�� 
ɚ�C ��_��C �� ��@��C ��_����{��� ��������_�� �@�� �  �_��@�	���� 7  �@������ ��@� ! �� ������ ��@�F" �  ����@��_�( ��{C����_�*����� ��{��C �� �� ��@��@�  ��{A��� ��_��C �� �� ��C ��_��� ��{��� ����� �� ��@��@��}������  �{B��� ��_�
����� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@� A �  ��{A��� ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ������_�� ��C �
  �  �C �  �  �@��{B��� ��_������� ��{��� ����� ���_�� ��@�,  ��@��{B��� ��_��� ��{��� ������_�� � @�(  ��@� @�S  ��@�@�@� ���� 7  �@� @�M  ��@� @�a  ��@�� �	@�)@�� � @�d  ��@�� ��@�I  �  �{B��� ��_��C �� �� ��@��@�  ��C ��_��C��{��������_���e  �� ��_�� �a  �� ��_�� �E  �� ��_�� �Y  �� ��_�� �_  �� ��_�� �Q  �� ��_����5  ��@��@��@��@��@���^�� ��_��

�C
�
	�9  ��{D��C��_��C �� ��C ��_��� ��{��C �� ��@� @�L  ��{A��� ��_��� ��{��� ����� �� ���_��@��@�r  ��{B��� ��_��� ��{��C �� ��@� A �x  ��{A��� ��_��� ��{��C �� ��@�� �|  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� �� �� �� �� �� ��� ��_��� ��{��C �� ��@� @�  ��{A��� ��_��C �� ��@�(@�)@�	�	�� 
ɚ�C ��_��C �� ��@��C ��_����{��� ��������_�� �@�� �  �_��@�	���� 7  �@������ ��@� ! �� ������ ��@�! �  ����@��_�( ��{C����_������� ��{��C �� �� ��@��@�  ��{A��� ��_��C �� �� ��C ��_��� ��{��� ����� �� ��@��@��}�������  �{B��� ��_������� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@� A �  ��{A��� ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ������_�� ��C �
  �  �C �  �  �@��{B��� ��_֙����� ��{��� ����� ���_�� ��@�,  ��@��{B��� ��_��� ��{��� ������_�� � @�(  ��@� @�S  ��@�@�@� ���� 7  �@� @�M  ��@� @�a  ��@�� �	@�)@�� � @�d  ��@�� ��@�I  �  �{B��� ��_��C �� �� ��@��@�  ��C ��_��C��{��������_���e  �� ��_�� �a  �� ��_�� �E  �� ��_�� �Y  �� ��_�� �_  �� ��_�� �Q  �� ��_����5  ��@��@��@��@��@���^�� ��_��

�C
�
	�9  ��{D��C��_��C �� ��C ��_��� ��{��C �� ��@� @�L  ��{A��� ��_��� ��{��� ����� �� ���_��@��@�r  ��{B��� ��_��� ��{��C �� ��@� A �x  ��{A��� ��_��� ��{��C �� ��@�� �|  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� �� �� �� �� �� ��� ��_��� ��{��C �� ��@� @�  ��{A��� ��_��C �� ��@�(@�)@�	�	�� 
ɚ�C ��_��C �� ��@��C ��_����{��� ��������_�� �@�� �  �_��@�	���� 7  �@������ ��@� ! �� ������ ��@�� �  ����@��_�( ��{C����_ֶ����� ��{��C �� �� ��@��@�  ��{A��� ��_��C �� �� ��C ��_��� ��{��� ����� �� ��@��@��}��Ҕ���  �{B��� ��_֖����� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@� A �  ��{A��� ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� �� �� ��@��@��# �  ���_��{B��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@�  ��� ��_��� ��{��� �� �� ��@��@��# �  ���_��{B��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@�  ��� ��_��� ��{��� �� �� ��@��@��# �  ���_��{B��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@�  ��� ��_��� ��{��C �� ��@� A �^  ��{A��� ��_�����{��C��������_�� �� �" ��_  ��@�d���� ��@������ ��@��_�� �  � ��@�! �� �l  ��{E�����_�� ���� �� �d  �  �@�� ����{�����������_�� �D���� ��@����l���� ��@� �  �� ��@�� �d����@�� ���^��� ��  ���^�� ��#@�e���� ��@��_�� �  �@��� ��#@�! ��# ��  �  �� ��  ��{G����_�� ����' ��� ��  �  �@�b ��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� ��{��� ����� �� ���_��@��@�� ��{B��� ��_��� ��{��C �� ��@�� �   ��@��{A��� ��_��� �� �� �� ��@��@�  ��@�@� ��@�@��@�
	� ��� ��_��� �� �� �� ��@��@�@�( ��� ��_��C �� ��@�@�	 @�( ��C ��_��C��{���������_�� ��  �� ���^��@�	�臟�  7  �@��  ��@������ ��@��@�J ��)	ʚ	��'��  7  �@����  �@�H ��}	��C �� ��c щ  � @����  ��_��{D��C��_����{��� ������� �� ���_�� ��_��@��@�( ��@��{C����_����{�����������_�� �/����@�v����@�� �@��� � ��@�@��� �  ��_�@��� �� ��@��]���]��@��@��@��@�� �� ��� Ѩ����� �� ��@��_�( ��_�! �� ��@��_� ! �A �� ��@������ ��_�M �� ��@�� ��@��_�@��_�( �n���� ��@�� ��@� ��{G����_��� ��{��C �� ��@�� �� ��@��{A��� ��_����{��� ������_�9  �� ��C �� ���>  �� ��@��c �� �  �� �  �@� @��{C����_֞����� ��{��C �� �@  � X�f  ��� ��{��� ����� ���_��@��  ��{B��� ��_��� ��{��� ����� ���_��@�  ��{B��� ��_��� ��{��C �� ��@�5  ��{A��� ��_��� ��{��C �� ��@� A �0  ��{A��� ��_��{��� �8  ��{���_��� ��{��� �� �� ��@��@�� �
  ��  6  �@�� �  �@�� �  �@��{B��� ��_��� �� �� �� ��@�@��@�)@�	��'�  �� ��_��C �� �  ���C ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_�  ��_��� ��{��� ���� �ғ �� ���_�  �  �@�A  �!�@�B  �B @�� �� ��@�� ���� �� �  �@�� ��� ��{��� ����� ���_�� ��@�  ��@��{B��� ��_��� ��{��� �H  ��@�A �� ����� ���_�� ��@�� ��@��@�  ��{B��� ��_��� ��{��� �� �� ��@��@�� ѝ����  6  �@�� �  �@�� �  �@��{B��� ��_�����{��C��������� ��_�� ������� �� ��@� a �&  ���^� ����  7  �@� �
  �@�;  ���^�)  ��@�� �� ��@�( ��@����  �@� @��^�
	� � � @���^�
	�� �0  ��@�  ���_��{E�����_��� ��{��� ����� �� ���_�� ��@��@�)  ��@��{B��� ��_��� ��{��� �� �� ��@��@�7  �� ��@�� ��@��@��{B��� ��_��� ��{��C �� ��@� a �^  ��{A��� ��_��� ��{��C �� ��@� a �d  ��{A��� ��_��� ��{��� ����� �� ���_�� ��@�}����@��@� ! �  ��@��{B��� ��_��C �� �� ��@��@�  ��C ��_��� ��{��� ����� ���_��@�� �o ��@� �臟h  7    ��@� �}���  ��{B��� ��_��� ��{��C � �Ү �� �" ��@�A  �!�@�B  �B(@�� ��� ��{��C �� �� ��@�  ��{A��� ��_��� ��{��C �� ��@�� ��{A��� ��_��� ��{��C �� ��@� ! �  ��{A��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@������{A��� ��_��C��{��������������# ��' �� ���<��=��<��=��=��=�@��@��@��@��@��@�Y  �������_���_��{H��C��_��� ��{��� ����� ���_�� ��@�� ��@��{B��� ��_��C �� ��@� @��C ��_��� �� �� ��@�@�� ��@�@��@�( ��@��@�( ��� ��_��C��{����������_����f���� ���^�� �b���� ���^�� �F���� ���^�� �Z���� ���^�� �>���� ���^�� �R����@��@��@��@��@�� ���^��_��

�C
�
	�>����{D��C��_��C �� ��C ��_�����{	��C������������������<��=��<��=��<��=�@��@��@��@��@��@��� �  ���=��<�_���_��{I�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����o��{����� ������������������<��<��<��<�Y���Y��X���X����7  ���<�+�=��<�'�=��<��=�;@��?@�w  ��C ��G ��S@��W@��K@��O@��C@��G@���Ѡ��� ���<��=��<��=�+@��/@��#@��'@��  ���� ��3 ��7 ���<��=��<��=�@��@��@��@��  ��@�� ��@����� �� �� �_  ��{V��oU�����_����{����� �������������<��=�@��@�=  ��� �� ��������<��=�@��@�4  ��@�� ��@���� �� �� �=  ��{G����_�����{����� ������������ �� �� �  �C ѡ� �m  �@ 6  �C �� �z  � @�� ��� �� �  ��@�� ��@�( ��  ��@��  �����@��C ��� �  ��{F�����_����{��� �� �� ���=��=�@��@�y  �������_���_��{C����_��� ��{��� �� �� ��@����� ���_��@�p  ��{B��� ��_�����{��C������� �� ���<��=��=��=�@��@��@��@�  �������_���_��{E�����_�����{���������� �� ���<��=��=��=�@��@��@��@�b  �� �� �  �@��@�������_���_��{F�����_�m����� ��{��� ����� ���_����� ��@�|���� ��@� ���  �{B��� ��_��� ��{��C �� �  ��@�  ��{A��� ��_��C �� ��@�@�� ��@� ! �� ��C ��_��C �� ��@�@�! � ��C ��_��_��� �� �� ���=��=�@��@��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@� �=  �=�@� �= �=�� ��_��� �� �� �� �� ���=��=�@��@��� ��_��C �� �� ��@��@�  ��@� ��C ��_����{��� ����_�� �� ����  ��@�@� ���( 7  �@�d���� ��@�� � @�� �  �� �  �@��@��@�S���  ��_��{C����_������� ��{��C �� ��@�@�  ��{A��� ��_��� ��{��C �� ��@�� �5  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� ��{��� ����� ���_��@�  ��{B��� ��_����{��� ���� ��_�� �  �@��@�)	@�	���� 7  �@�����@�� �		@� ! � 	 �T���� ��@�� �  ����{C����_֜����� ��{��C �� ��@� a �  ��{A��� ��_��� ��{��C �� ��@������{A��� ��_��� ��{��C �� ��@� A �^  ��{A��� ��_�����{��C��������_�� �� �" ��_  ��@�&���� ��@�Y���� ��@��_�� �  � ��@�! �� �l  ��{E�����_�� ���� �� �d  �  �@�  ����{�����������_�� ����� ��@����.���� ��@� �  �� ��@�� �&����@�� ���^��� ��  ���^�� ��#@�'���� ��@��_�e �  �@��� ��#@�! ��# ��  �  �� ��  ��{G����_�� ����' ��� ��  �  �@�� ��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� ��{��� ����� �� ���_��@��@�V ��{B��� ��_��� ��{��C �� ��@�� �   ��@��{A��� ��_��� �� �� �� ��@��@�  ��@�@� ��@�@��@�
	� ��� ��_��� �� �� �� ��@��@�@�( ��� ��_��C �� ��@�@�	 @�( ��C ��_��C��{���������_�� ��  �� ���^��@�	�臟�  7  �@��  ��@�w���� ��@��@�J ��)	ʚ	��'��  7  �@����  �@�H ��}	��C �� ��c ���� @����  ��_��{D��C��_����{��� ������� �� ���_�� ��_��@��@��  ��@��{C����_����{�����������_�� ������@�8����@�� �@��� �W ��@�@��� �S ��_�@��� �O ��@��]���]��@��@��@��@�) �� ��� Ѩ����O �� ��@��_�( ��_�! �N ��@��_� ! �A �I ��@������ ��_��  �� ��@�A ��@��_�@��_�( �0���� ��@�G ��@�p ��{G����_��� ��{��C �� ��@�� �
 ��@��{A��� ��_����{��� ������_�#  �_ ��C �� �������� ��@��c �� ������ �  �@� @��{C����_�&����� ��{��C �� �   � X������� ��{��C �� ��@�  ��{A��� ��_��� ��{��C �� ��@� A �	  ��{A��� ��_��C �� �  ���C ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_�����{��C��������� ��_�� ������� �� ��@� a �&  ���^� ����  7  �@� �
  �@�;  ���^�)  ��@�� �� ��@�( ��@����  �@� @��^�
	� � � @���^�
	�� �0  ��@�  ���_��{E�����_��� ��{��� ����� �� ���_�� ��@��@�)  ��@��{B��� ��_��� ��{��� �� �� ��@��@�7  �� ��@�� ��@��@��{B��� ��_��� ��{��C �� ��@� a �>  ��{A��� ��_��� ��{��C �� ��@� a �D  ��{A��� ��_��� ��{��� ����� �� ���_�� ��@������@��@� ! �  ��@��{B��� ��_��C �� �� ��@��@�  ��C ��_��� ��{��� ����� ���_��@�� �� ��@� �臟h  7  ����@� �}���&����{B��� ��_��� ��{��C �� ��@� ! �  ��{A��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�0����{A��� ��_��C��{��������������# ��' �� ���<��=��<��=��=��=�@��@��@��@��@��@�Y  �������_���_��{H��C��_��� ��{��� ����� ���_�� ��@�� ��@��{B��� ��_��C �� ��@� @��C ��_��� �� �� ��@�@�� ��@�@��@�( ��@��@�( ��� ��_��C��{����������_��������� ���^�� ������ ���^�� ������ ���^�� ������ ���^�� ������ ���^�� ������@��@��@��@��@�� ���^��_��

�C
�
	������{D��C��_��C �� ��C ��_�����{	��C������������������<��=��<��=��<��=�@��@��@��@��@��@��� �  ���=��<�_���_��{I�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����o��{����� ������������������<��<��<��<�Y���Y��X���X����7  ���<�+�=��<�'�=��<��=�;@��?@�w  ��C ��G ��S@��W@��K@��O@��C@��G@���Ѡ��1 ���<��=��<��=�+@��/@��#@��'@��  ���� ��3 ��7 ���<��=��<��=�@��@��@��@��  ��@�� ��@����� �� �� �_  ��{V��oU�����_����{����� �������������<��=�@��@�=  ��� �� ��������<��=�@��@�4  ��@�� ��@���� �� �� �=  ��{G����_�����{����� ������������ �� �� �  �C ѡ� �m  �@ 6  �C �� �z  � @�� ��� �� �  ��@�� ��@�( ��  ��@��  �����@��C ��� �  ��{F�����_����{��� �� �� ���=��=�@��@�y  �������_���_��{C����_��� ��{��� �� �� ��@����� ���_��@�p  ��{B��� ��_�����{��C������� �� ���<��=��=��=�@��@��@��@�  �������_���_��{E�����_�����{���������� �� ���<��=��=��=�@��@��@��@�b  �� �� �  �@��@�������_���_��{F�����_֢����� ��{��� ����� ���_����� ��@�|���� ��@� ���  �{B��� ��_��� ��{��C �� �  ��@�  ��{A��� ��_��C �� ��@�@�� ��@� ! �� ��C ��_��C �� ��@�@�! � ��C ��_��_��� �� �� ���=��=�@��@��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@� �=  �=�@� �= �=�� ��_��� �� �� �� �� ���=��=�@��@��� ��_��C �� �� ��@��@�  ��@� ��C ��_����{��� ����_�� �� ����  ��@�@� ���( 7  �@������ ��@�� � @�� �  �� �  �@��@��@�����  ��_��{C����_������ ��{��C �� ��@�@�  ��{A��� ��_��� ��{��C �� ��@�� �5  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� ��{��� ����� ���_��@�  ��{B��� ��_����{��� ���� ��_�� �  �@��@�)	@�	���� 7  �@�<����@�� �		@� ! � 	 ������ ��@�� �  ����{C����_������� ��{��C �� ��@� a �  ��{A��� ��_��� ��{��C �� ��@�����{A��� ��_����{��� ��������_�� ��G ѢK �  ��_�� ��_�� ��@�� ��@�� ��@�!  ��@��{C����_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� ��{��C �� ��@�;  �� �  �@��{A��� ��_֊����C �� ��C ��_����{��� ������� ���_�� �  ��@�
  ��@��{C����_��C �� ��@��C ��_��� ��{��� �� ��@�� �  ��@��{B��� ��_��� ��{��C �� ��@�� �  ��@��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@�� ��{A��� ��_��� ��{��� ����� ���_�� ��@�  ��@��{B��� ��_��� ��{��� �� �� ��@�� ��	�����@� �= �=	@�(	 ��@�  �  �@������@�  ��  6  �@��@�&  �    ��_��{B��� ��_� ����� ��{��� ������_�� �� �� �  ���=  �=�@� ��{B��� ��_��� ��{��C �� ��@�  �\@9}S r��  �{A��� ��_��C �� �� ��C ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@� A �^  ��{A��� ��_�����{��C��������_�� �� �" ��_  ��@������ ��@������ ��@��_�� �  � ��@�! �� �l  ��{E�����_�� ���� �� �d  �  �@�x ����{�����������_�� ������ ��@��������� ��@� �  �� ��@�� ������@�� ���^��� ��  ���^�� ��#@������ ��@��_�� �  �@��� ��#@�! ��# ��  �  �� ��  ��{G����_�� ����' ��� ��  �  �@�B ��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� ��{��� ����� �� ���_��@��@�� ��{B��� ��_��� ��{��C �� ��@�� �   ��@��{A��� ��_��� �� �� �� ��@��@�  ��@�@� ��@�@��@�
	� ��� ��_��� �� �� �� ��@��@�@�( ��� ��_��C �� ��@�@�	 @�( ��C ��_��C��{���������_�� ��  �� ���^��@�	�臟�  7  �@��  ��@�	���� ��@��@�J ��)	ʚ	��'��  7  �@����  �@�H ��}	��C �� ��c �i��� @����  ��_��{D��C��_����{��� ������� �� ���_�� ��_��@��@��  ��@��{C����_����{�����������_�� ������@������@�� �@��� �W ��@�@��� �S ��_�@��� �O ��@��]���]��@��@��@��@�) �� ��� Ѩ����O �� ��@��_�( ��_�! �N ��@��_� ! �A �I ��@������ ��_��  �� ��@�A ��@��_�@��_�( ������ ��@�G ��@�p ��{G����_��� ��{��C �� ��@�� �
 ��@��{A��� ��_����{��� ������_�#  �� ��C �� ������� ��@��c �� ������ �  �@� @��{C����_�~����� ��{��C �� �   � X�F����� ��{��C �� ��@�  ��{A��� ��_��� ��{��C �� ��@� A �	  ��{A��� ��_��C �� �  ���C ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_�����{��C��������� ��_�� ������� �� ��@� a �&  ���^� ����  7  �@� �
  �@�;  ���^�)  ��@�� �� ��@�( ��@����  �@� @��^�
	� � � @���^�
	�� �0  ��@�  ���_��{E�����_��� ��{��� ����� �� ���_�� ��@��@�)  ��@��{B��� ��_��� ��{��� �� �� ��@��@�7  �� ��@�� ��@��@��{B��� ��_��� ��{��C �� ��@� a �>  ��{A��� ��_��� ��{��C �� ��@� a �D  ��{A��� ��_��� ��{��� ����� �� ���_�� ��@������@��@� ! �  ��@��{B��� ��_��C �� �� ��@��@�  ��C ��_��� ��{��� ����� ���_��@�� �� ��@� �臟h  7  u����@� �}���~����{B��� ��_��� ��{��C �� ��@� ! �  ��{A��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�0����{A��� ��_��C��{��������������# ��' �� ���<��=��<��=��=��=�@��@��@��@��@��@�Y  �������_���_��{H��C��_��� ��{��� ����� ���_�� ��@�� ��@��{B��� ��_��C �� ��@� @��C ��_��� �� �� ��@�@�� ��@�@��@�( ��@��@�( ��� ��_��C��{����������_����g���� ���^�� �c���� ���^�� �G���� ���^�� �[���� ���^�� �?���� ���^�� �S����@��@��@��@��@�� ���^��_��

�C
�
	�?����{D��C��_��C �� ��C ��_�����{	��C������������������<��=��<��=��<��=�@��@��@��@��@��@��� �  ���=��<�_���_��{I�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����o��{����� ������������������<��<��<��<�Y���Y��X���X����7  ���<�+�=��<�'�=��<��=�;@��?@�w  ��C ��G ��S@��W@��K@��O@��C@��G@���Ѡ�ц ���<��=��<��=�+@��/@��#@��'@��  ���� ��3 ��7 ���<��=��<��=�@��@��@��@��  ��@�� ��@����� �� �� �_  ��{V��oU�����_����{����� �������������<��=�@��@�=  ��� �� ��������<��=�@��@�4  ��@�� ��@���� �� �� �=  ��{G����_�����{����� ������������ �� �� �  �C ѡ� �m  �@ 6  �C �� �z  � @�� ��� �� �  ��@�� ��@�( ��  ��@��  �����@��C ��� �  ��{F�����_����{��� �� �� ���=��=�@��@�y  �������_���_��{C����_��� ��{��� �� �� ��@����� ���_��@�p  ��{B��� ��_�����{��C������� �� ���<��=��=��=�@��@��@��@�  �������_���_��{E�����_�����{���������� �� ���<��=��=��=�@��@��@��@�b  �� �� �  �@��@�������_���_��{F�����_������� ��{��� ����� ���_����� ��@�|���� ��@� ���  �{B��� ��_��� ��{��C �� �  ��@�  ��{A��� ��_��C �� ��@�@�� ��@� ! �� ��C ��_��C �� ��@�@�! � ��C ��_��_��� �� �� ���=��=�@��@��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@� �=  �=�@� �= �=�� ��_��� �� �� �� �� ���=��=�@��@��� ��_��C �� �� ��@��@�  ��@� ��C ��_����{��� ����_�� �� ����  ��@�@� ���( 7  �@������ ��@�� � @�� �  �� �  �@��@��@�T���  ��_��{C����_�n����� ��{��C �� ��@�@�  ��{A��� ��_��� ��{��C �� ��@�� �5  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� ��{��� ����� ���_��@�  ��{B��� ��_����{��� ���� ��_�� �  �@��@�)	@�	���� 7  �@�<����@�� �		@� ! � 	 �U���� ��@�K �  ����{C����_�)����� ��{��C �� ��@� a �  ��{A��� ��_��� ��{��C �� ��@������{A��� ��_��� ��{��� ����� ���_������ ��@������ ��@� �	�� 
ɚ�{B��� ��_��� ��{��C �� ��@������ ��@��{A��� ��_��� ��{��� ����� ���_�� ��@�   �  �@����� ��@�� ��@�����@��@�  ��{B��� ��_��������{��� ������� ���_��_��@�9  �� �� ��@��{C����_��C �� �� ��C ��_�����{��C��������_��������� ���^�� ������ ���^�� ������ ���^�� ������ ���^�� ��_�� ������ ���^��������@��@��@��@��@��^�� ���^��

�C
�
	������{E�����_����{��� �� �� �� ��@��@��@�  �������_���_��{C����_����{��� �� �� �� ��@��@��@�  �������_���_��{C����_��C��{�������������^��^�%  ��������\�� ��]�� ���]�G  ��@��@�� ��� �0  �� ��# ���^��@�T  �� �� �� ���]��#@�Y  �� ��@�� �� �;  �������_���_��{H��C��_��C��{������� ���^�$  ��c �� �� ��@�  �� ��@��C �� �#  �������_���_��{D��C��_����{��� �� �� �� �� ��@��@��@�9  �������_���_��{C����_��� ��{��C �� ��@�w  ��{A��� ��_��� ��{��� �� �� ��@��@��C �t  ��@��@��{B��� ��_��� ��{��C �� �� ��@��@�  ��{A��� ��_��� ��{��� ����� ���_��@�x  �� �  �@��{B��� ��_������C��{������� �� �� �� ��@���^�	�	��
ɚ� ��@���^��@��}�[ ��@��@��@�
	��# �� �  �������_���_��{D��C��_��� ��{��� �� �� ��@��@��C �  ��@��@��{B��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@�@�  ��@�@� ��� ��_��� ��{��C �� ��@������{A��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@�@�  ��@�@� ��� ��_��� ��{��� ����� ���_�� ��@�� ���_������@��@�) �
��)
ʚ 
	��{B��� ��_��� ��{��� ����� �� ���_�� ��@������ ��@�  ��{B��� ��_�����{	��C�����������_��� �Y
 �  �� �p  ��G �  �G@� 6  ��_��#��  ��_�� ���_�	@�)�^� 	� ��C �  �C@�	�R	
� q���  7  �_���^�	�� �  �_�� �  �@�� ��_���^�	�� ���_�	@�)�^�	�� ���_�	@�)�^� 	��  ��/ �  �/@��@��@��@��@��'@� =  �� �  �@��Ѩ��  �@ 6  ��_�	@�)�^� 	�� �R�  �    �������  ��������� �
 �  �]�i
 ���_�	@�)�^� 	�C
 �  e
 �  ��_��{I�����_�  �� �� �����������X
 �    �]�� ������C �� ��@�@9  �C ��_�����{	��C���������������8�_� ����  7  �_����z  ��]���^�	���]��  ��' ��'@��\�	��ǟ�  7  �\��'@�	��' �  �' �  �^���^�	��# ��#@� ��ǟ 7  �_���^��#@��  ��#@� ����  7  ���_����P    �'@� ��ǟ� 7  �'@����8� �� ��  ��@��_�� ��  �� ��@��'@��  �� �  �@��'@�	���� 7  ���_����( �R� �	  � ���� �� �v �-  � �  � �q ��@� q��h  7      ��]��^�	��# ��#@� ��ǟ 7  �_��^��#@�]  ��#@� ����  7  ���_����    �]� ��x  ��_����  ��_��{I�����_��@� ��� ��{��� ����� ���_�� ��@��  ��@��{B��� ��_��C �� ��@� 	@��C ��_��� ��{��C �� ��@�� � ��@��@� �  6  �@��R�  ��@� (� �  �@��@�  �{A��� ��_��C �� ��@�@� ���  �C ��_��� ��{��C �� �� ��@��@��  ��{A��� ��_��C �� ��@� 
@��C ��_��� ��{��� ����� �� ���_��@��@� @�1@� ?��{B��� ��_��� ��{��� ����� ��? 9��_�� ��@��?�9  ��@��{B��� ��_��� ��{��C �� ��@�*  �$  ��{A��� ��_��� �� �� ��@�(
@�� ��@�(
 ��@��� ��_��� ��{��� ����� ��? 9��_�� ��; ��7 �&����@��@��?�9� ��@�<����@��{B��� ��_��C �� ��@��C ��_��� ��{��� ������_�� ������  6  �@�  �� �  �@�  �� �  �@��{B��� ��_��� ��{��C �� ��@�����  @��{A��� ��_��� ��{��C �� ��@�����  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ����� ���_�� ��@�	@�)�^� 	�
  �� �  �@��@�  ��{B��� ��_�y����� ��{��C �� ��@�  ��{A��� ��_��C �� ��@� @��C ��_��C �� �� ��@��@�	k��  �C ��_�  ��_��C��{�������s8��_��c �� �, ��@�  �� �  �@��s�8  �� �  �c �x ��@�  �{D��C��_�� ���� ��c �n �  �@� ��� ��{��C �� ��@�!  �!�@�	 ��{A��� ��_��� ��{��C �� �� 9�@���9 @�@� ?�  �{A��� ��_��� ��{��C �� �� ��@� @��@�	*f ��{A��� ��_��� ��{��� �� �� ��@��@��# �  ���_��{B��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@�  ��� ��_��� ��{��� �� �� ��@��@��# �  ���_��{B��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@�  ��� ��_��� ��{��� �� �� ��@��@��# �  ���_��{B��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@�  ��� ��_��� ��{��� ������_�� ������  6  �@�&  �� �  �@�,  �� �  �@��{B��� ��_����{��� ���� �� ��@� ����  7  ���
  �_��@��@�"  �� �  �@����  ��_��{C����_�x����� ��{��C �� ��@����� @��{A��� ��_��� ��{��C �� ��@�z���\@9	 �	� @��{A��� ��_��� ��{��� ����� �� ���_��@��@��
 ��{B��� ��_��o���{��C ���
�(  ��@��3 �������x��� �Ҭ
 ��7 �  ( �R  ��8�c�  �!t�����  ���  �!������  �#�  �!������  ���  �!������  �7@��cѢ�ѣ#Ѥ�х�R� �   �R  ��8���
 ��#�
 ����
 ��c�
 ��7@��� ��z
 ��/ �  ( �R  �9���  �!�g���  ���  �!��b���  �#�  �!(�]���  ���  �!@�X���  �/@�������#����
�R� �   �R  �9����	 ��#��	 �����	 �����	 ��/@����Y����y���  �Q����u���   	��@
 ��+ �  ( �R  �_9�#�  �!��-���  ���  �!��(���  �c�  �!��#���  �+@��#�����c�� �   �R  �_9�c��	 �����	 ��#��	 ��+@�� � 	��
 ��' �  ( �R  ��9���  �!�����  �c�  �!$�����  ��  �!D�����  �'@�����c���� �   �R  ��9���	 ��c��	 �����	 ��'@�� ��@����F���  �@����B���  ������  ��Ѥ���  �Y��@������# �R]���  �Q��@��#����# �RV���  ��� �  7  �3@�  �!t�'����# �  �#@��� �� �  �@�����!4�.���  �  ������C��  ������C�  ������C�  ������C�  ������C�  ������C����:	 �  �#�7	 �  ���4	 �  �c�1	 �  ��Q8�  6  �7@��	 �  �  ������C�  ������C�  ������C�  ������C�  ������C����	 �  �#�	 �  ���	 �  ���	 �  �E9�  6  �/@�n	 �  �  ������C�  ������C�  ������C�  ������C��c�� �  ���� �  �#�� �  �_D9�  6  �+@�O	 �  �  ������C�  ������C�  ������C�  ������C���� �  �c�� �  ���� �  ��B9�  6  �'@�0	 �  a  ������C�Z  ������C�S  �#�\  �` 7  �3@�  �!��|���� �  �@��#�]  �� �  �@�����!4�����    ���8���  ������ �  ������:����' �  ���� ��'@�� 6  �3@�  �!p�Z���� �  �@���;  �� �  �@�  �!��O���� �  �@�����!4�[���    ������C����{ �  ���
���  ����#�t ����r ���������^���
��{A��o¨�_��#�i �  ���f �  �������  ��X�- ��� ��{��C �� ��@�����  ���  �{A��� ��_��� ��{��� ����� ���_�� ��@�i���� ��@������@�� ��@������{B��� ��_����{��� ��������� �� �� ���_�� �2 ��@��@� ��@� ��@�( ��{C����_����{��� ��������� �� �� ���_�� ��@��@��@������@��{C����_��� ��{��� �� �� ��@�� ����� ��@�
 ��{B��� ��_��C �� ��@� 
@��C ��_��C �� ��@� @��C ��_��C �� ��@� )@��C ��_��� ��{��� �� �   � �@�� ������_�� �  �!����������!4�� ������@�  �!@������@������@������@�  �!t������@�)@�� ��@������@� @�8 ��@� 
@��  ��{B��� ��_�����{
�����# �� �� �������������������_�� �� ����� ��@��#@� a ��' �� �  �@��@� � �� �� �  �@��@� !�� �� �  �@���\�	a � ��� �@  �( �R���  ��[���\�	k�ן( 7  �@���� ���[��C� �R 3 �  �@��C�6  �    ��[� �������������  �������  �������  � ��@��������U����@�t �  ��_��{J�����_��@�m �  �'@�j �  �@�g �  �\�1 ��� ��{��C �� ��@�� �1 ��@��{A��� ��_��� ��{��� ����� ���_�� �@�� �~ ��@�	 @�	��7��  7  �@��@�� �  �@��@�{ �  �{B��� ��_��C��{������������������ ���� �� ���_�� ��@�a����@��{D��C��_��� ��{��� �� �� ��@�� ����� ��@� ��{B��� ��_��� ��{��� �� �� ��@�� ����� ��@�a � ��{B��� ��_��� ��{��� �� �� ��@�� ����� ��@�� �� ��{B��� ��_��� ��{��� �� �� ��@�� ����� ��@�!�� ��{B��� ��_��C �� ��@� a@��C ��_��C �� ��@� ���C ��_��� ��{��� �� �   � �@�� ������_�� �  �!�������@���������!4�� ������@�  �!�������@�a �u���  �!�������@�� �o����@������@�  �! ������@�!�f����@������@�  �!D�z����@�a@�� �  �!p�t����@������{B��� ��_��� ��{��� �� �� ��@�� ��@� q觟( 7  �@��@�)a@�	k�ǟ�  7   �R  ��8  �@� ���@�	 q�	�}@�  �A ��  6   �R  ��8  �@� ���@�	 q�	�}@�  �9 �( �R  ��8  ��_8  �{B��� ��_��C �� �� ��@�@��@� 
	��C ��_��� ��{��� �� �� ��@�� ��@� q觟( 7  �@��@�)a@�	k�ǟ�  7   �R  ��8  �@� ���@�	 q�	�}@������ ��  7   �R  ��8  �@� ���@�	 q�	�}@������ �( �R  ��8  ��_8  �{B��� ��_��� ��{��� ������_�� � � ��C �� � A ��? �
  �  �@�  �  �@��{B��� ��_������ ��{��� ����� �� ���_�� ��@��@�	  ��@��{B��� ��_��C �� ��C ��_����{��� ������� ���_�� ��_�  ��@�  ��@��{C����_��C �� �� ��@�  ��C ��_��� ��{��� �� ��@�� �  ��@��{B��� ��_��� ��{��C �� ��@�� �  ��@��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@� A �^  ��{A��� ��_�����{��C��������_�� �� �" ��_  ��@�?���� ��@�r���� ��@��_�� �  � ��@�! �� �l  ��{E�����_�� ���� �� �d  �  �@�q ����{�����������_�� ����� ��@����G���� ��@� �  �� ��@�� �?����@�� ���^��� ��  ���^�� ��#@�@���� ��@��_�� �  �@��� ��#@�! ��# ��  �  �� ��  ��{G����_�� ����' ��� ��  �  �@�; ��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� ��{��� ����� �� ���_��@��@�� ��{B��� ��_��� ��{��C �� ��@�� �   ��@��{A��� ��_��� �� �� �� ��@��@�  ��@�@� ��@�@��@�
	� ��� ��_��� �� �� �� ��@��@�@�( ��� ��_��C �� ��@�@�	 @�( ��C ��_��C��{���������_�� ��  �� ���^��@�	�臟�  7  �@��  ��@������ ��@��@�J ��)	ʚ	��'��  7  �@����  �@�H ��}	��C �� ��c �b��� @����  ��_��{D��C��_����{��� ������� �� ���_�� ��_��@��@��  ��@��{C����_����{�����������_�� �
����@�Q����@�� �@��� �W ��@�@��� �S ��_�@��� �O ��@��]���]��@��@��@��@�) �� ��� Ѩ����O �� ��@��_�( ��_�! �N ��@��_� ! �A �I ��@������ ��_��  �� ��@�A ��@��_�@��_�( �I���� ��@�G ��@�p ��{G����_��� ��{��C �� ��@�� � ��@��{A��� ��_����{��� ������_�#  �� ��C �� ������� ��@��c �� ������ �  �@� @��{C����_�w����� ��{��C �� �   � X�?����� ��{��C �� ��@�  ��{A��� ��_��� ��{��C �� ��@� A �	  ��{A��� ��_��C �� �  ���C ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_�����{��C��������� ��_�� ������� �� ��@� a �&  ���^� ����  7  �@� �
  �@�;  ���^�)  ��@�� �� ��@�( ��@����  �@� @��^�
	� � � @���^�
	�� �0  ��@�  ���_��{E�����_��� ��{��� ����� �� ���_�� ��@��@�)  ��@��{B��� ��_��� ��{��� �� �� ��@��@�7  �� ��@�� ��@��@��{B��� ��_��� ��{��C �� ��@� a �>  ��{A��� ��_��� ��{��C �� ��@� a �D  ��{A��� ��_��� ��{��� ����� �� ���_�� ��@������@��@� ! �  ��@��{B��� ��_��C �� �� ��@��@�  ��C ��_��� ��{��� ����� ���_��@�� �� ��@� �臟h  7  n����@� �}Ӂ ��w����{B��� ��_��� ��{��C �� ��@� ! �  ��{A��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�0����{A��� ��_��C��{��������������# ��' �� ���<��=��<��=��=��=�@��@��@��@��@��@�Y  �������_���_��{H��C��_��� ��{��� ����� ���_�� ��@�� ��@��{B��� ��_��C �� ��@� @��C ��_��� �� �� ��@�@�� ��@�@��@�( ��@��@�( ��� ��_��C��{����������_��������� ���^�� ������ ���^�� ������ ���^�� ������ ���^�� ������ ���^�� ������@��@��@��@��@�� ���^��_��

�C
�
	������{D��C��_��C �� ��C ��_�����{	��C������������������<��=��<��=��<��=�@��@��@��@��@��@��� �  ���=��<�_���_��{I�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����o��{����� ������������������<��<��<��<�Y���Y��X���X����7  ���<�+�=��<�'�=��<��=�;@��?@�y  ��C ��G ��S@��W@��K@��O@��C@��G@���Ѡ��y ���<��=��<��=�+@��/@��#@��'@��  ���� ��3 ��7 ���<��=��<��=�@��@��@��@��  ��@�� ��@����� �� �� �a  ��{V��oU�����_����{����� �������������<��=�@��@�?  ��� �� ��������<��=�@��@�6  ��@�� ��@���� �� �� �?  ��{G����_�����{����� ������������ �� �� �  �C ѡ� �o  �� 6  �C �� �|  �� ��� �� ��  ��@�� ��@�
@�* �@9( 9�  ��@��  �����@��C ��� �  ��{F�����_����{��� �� �� ���=��=�@��@�y  �������_���_��{C����_��� ��{��� �� �� ��@����� ���_��@�p  ��{B��� ��_�����{��C������� �� ���<��=��=��=�@��@��@��@�  �������_���_��{E�����_�����{���������� �� ���<��=��=��=�@��@��@��@�b  �� �� �  �@��@�������_���_��{F�����_������� ��{��� ����� ���_�}���� ��@�z���� ��@� ���  �{B��� ��_��� ��{��C �� �  ��@�  ��{A��� ��_��C �� ��@�@�� ��@� ! �� ��C ��_��C �� ��@�@�! � ��C ��_��_��� �� �� ���=��=�@��@��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@� �=  �=�@� �= �=�� ��_��� �� �� �� �� ���=��=�@��@��� ��_��C �� �� ��@��@�  ��@� ��C ��_����{��� ����_�� �� ����  ��@�@� ���( 7  �@������ ��@�� � @�� �  �� �  �@��@��@�����  ��_��{C����_�e����� ��{��C �� ��@�@�  ��{A��� ��_��� ��{��C �� ��@�� �5  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� ��{��� ����� ���_��@�  ��{B��� ��_����{��� ���� ��_�� �  �@��@�)	@�	���� 7  �@�:����@�� �		@� ! � 	 ������ ��@�0 �  ����{C����_� ����� ��{��C �� ��@� a �  ��{A��� ��_��� ��{��C �� ��@�I����{A��� ��_�����{��C�� �� ���������������_�� ��  ��@��@� a �� ��  �  �@��@� � ��  �  �@��{E�����_�� ����' �  � ��@�� ����' ��  �  �@��  �  �@��  ����{��� ����������� ���� ���_�� ������@��{C����_��� ��{��� �� �� ��@�� ����� ��@��  ��{B��� ��_��� ��{��� �� �� ��@�� ����� ��@�a ��  ��{B��� ��_��� ��{��� �� �� ��@�� ����� ��@�� ��  ��{B��� ��_��� ��{��� �� �   � �@�� ������_�� �  �!��V�������!4�� �d����@�  �!��N����@�2����@�\����@�  �!��F����@�a �)����@�S����@�  �!< �=����@�� � ����@�J����{B��� ��_��C �� �� �( �RH 
� 9�@��@�  ��@9  9�C ��_��� ��{��� �����C�( �RH 
�38��_�� ��C_��3_8 �����@��{B��� ��_��C �� ��@� @��C ��_��C �� ��@�@9  �C ��_��C �� ��@�( �R( 9�C ��_��C �� ��@� 9�C ��_�  �@� �  �@� �  �
@� �  �@� �  �@� �  �@� �  �@� �  �@� �  �&@� �  �.@� �  �2@� �  �6@� �  �:@� �  �>@� �  �B@� �  �F@� �  �J@� �  �N@� �  �R@� �  �V@� �  �Z@� �  �^@� �  �b@� �  �f@� �  �j@� �  �n@� �  �r@� �  �v@� �  �z@� �  �~@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  �A� �  �A� �  �A� �  �A� �  �A� ���) �  �� �� �� �� �� ��     ��
 4  4x <�     ��
@      ��
d�     ��
$<      ��
(T      ��
(T      ��
(T      ��
@      ��
d�     ��
$<      ��
@      ��
d�     ��
$<      ��
@      ��
d�     ��
$<      �� H  Hp LD  �� �  � � �8  ��
<\      ��     @ $@  ��
<p      ��
X�     ��
d|      �� H  Hp LD  �� �  � � �8  ��
<\      ��
<p      ��
X�     ��
d|      ��
0      ��
<,�     �� H  Hp LD  �� �  � � �8  ��
<\      ��
<p      ��
X�     ��
d|      ��
 \      ��
8      ��1&�(���H  �� �8  ���          �� �  �� ��     ��
(P      �� (  (d D@  ��
@h      ��� (  (� H� \� p� �� �� �� ��	 ��	 ��	 ��	 ��	 �(� ��
 ��
 ��
 ��
 �� �� �� �� �� �L� �� ��� �
� �
|� �`     ��
0      ��1&�(���H  �� �8  ���          �� �  �� ��     ��
(P      �� (  (d D@  ��1&�(���H  �� �8  ���          ��
0      �� �  �� ��     ��
(P      �� (  (d D@  ��  X  X� p� �� � � ��  ��
(T      ��
@      ��
d�     ��
$<      �� H  Hp LD  �� �  � � �8  ��
<\      ��     @ $@  ��
<p      ��
X�     ��
d|      ��1&�(���H  �� �8  ���          ��
0      �� �  �� ��     ��
(P      �� (  (d D@  �� D  Dp X� \T     ��1&�(���H  �� �8  ���          ��
0      �� �  �� ��     ��
(P      �� (  (d D@   B 
All Flights: ------------------------ 
All Passengers: 
All Bookings: vector FL001 New York London 2024-03-20 10:00 FL002 Paris 2024-03-21 15:30 John Doe P123456 +1-555-0123 Jane Smith P789012 +1-555-0124 
Booking created successfully:  Booking created successfully:  
Booking   cancelled successfully 
Booking Details: Booking ID:  Seat Number:  Flight  From:   To:  Departure Time:  Capacity:   seats Passenger Details: Name:  Passport Number:  Contact Number:           8      <              T    0       |=    `   ��                    (E  ��  �G  ��  U  ��  lX  ��  8Y  ��  �\  �  H^  �  �_  $�   a  4�  dd  D�  0e  T�  f  d�  Li  t�  j  ��  �j  ��  4n  ��   o  ��  �q  ��  Lr  ��  �v  ��  �x  ��  p�  �  ��  �  ��  (�  ��  8�  ,�  H�  ��  \�  ��  l�  ��  |�  ԙ  ��  <�  ��  ��  ��  <�  ��  ̞  ��  @�  ��  <�  ��  T�   �  t�  �  ��   �  ��  0�  �  @�  �  t�  `�  ��   �  ��  L�  ��  H�  ��  D�  d�  ��  ��  X�  ��  ��  ��  \�  ��  `�  �  x�  �  ��  ,�  d�  ��      m�     l �  � �  d |  � �  \ t  � �  � �	  h
    t �   @  � �      � �   $  � �  � �  l �  � � |  � � �  � �  �   X p  �   � �  �    H ` �  �    D  `   �  �  $!  `! p!  �! �!  $" 8" �"  �" �"  # 8#  �# �# �#  �$ �$  �% �%  d& �&  �& �& t'  �' �' �'  ( ,(  x( �( �(  �) �)  x* �*  L+ l+  �+ �+ \,  �, �, �,   - -  `- t- �-  �. �.  `/ p/  40 T0  |0 �0 D1  p1 �1 �1  �1 �1  H2 \2  �2 �2  `3 �3  �3 4  @4 �4 �5  �5 �5  |6 �6 7  D9 �9  �:  ; ;  8; L; T; �;  t> �>  �? �?  |@ �@ �@  |A �A  �B �C  �E hF  �F  G $G HG  �G �G �G H �H  ,I �I   J �J �K  �K �K  \L �L �L  $O �O  �O  P  $P 8P   R @R  �R �R  �S �S �S  �T �T  �U $W   Y �Y  Z LZ PZ tZ  �Z �Z [ 8[ �[  X\ �\  �] �] ^  @^ T^  �^ �^  _ �_  ` (`  L` ``  �` �`  �` Pa (b  Lb `b  �b hc �c  �e $f  �f �f  �f �f  �h �h  `i xi  Hj `j �j  Hk Xk  �l �m  �o 4p  �p �p �p q  Pq �q �q �q dr  �r xs  8t �t  �t �t  x Hx  @y ty  �y z  �z �| �| �~   ,  � �  � �  �� Ā  � ,�  Ё � 8�  \� �� �� (�  0� T�  Ą �  X� |�  Ѕ <�  ̆ |�  ԏ �  Ȑ l�  D� t�  @� d�  H� ��  ܗ �  ,� H�  �� ��  ܘ l� D�  h� |�  � �� ��  �� @�  �� ��  �� ��  ܠ ��  |� ��  d� |� ��  d� t�  �� �  � X�  Ȩ � � 8�  t� �� ԩ �� ��  � ��  � ��  D� |�  Į       T      �     �     �     �     �     �     �     �     �	     �
     �     �     �
     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �      �!     �"     �#     �$     �%     �&     �'     �(     �)     �*     �+     �,     �-     �.     �/     �0     �1     �2     �3     �4     �5     �6     �7     �8     �9     �:     �;     �<     �=     �>     �?     �@     �A     �B     �C     �D     �E      �                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        P   h  F                                        @                 �"  � � � $ r � �  V �� �� �0 �| � l  � .	 �	 &
 �
  � �� �� �F
 � �� �b �. �� �� �Z � �� � � � � �� �` � �� �j �, �� �  �F �� �` �� � � ��  D �p �� � � � 
 6 P | � �  __Unwind_Resume __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIP4SeatEES7_S7_EENS_4pairIT_T1_EES9_T0_SA_ __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIPP6FlightEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIPP7BookingEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIPP9PassengerEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ __ZNKSt3__16locale9use_facetERNS0_2idE __ZNKSt3__18ios_base6getlocEv __ZNSt11logic_errorC2EPKc __ZNSt12length_errorD1Ev __ZNSt20bad_array_new_lengthC1Ev __ZNSt20bad_array_new_lengthD1Ev __ZNSt3__111char_traitsIcE11eq_int_typeEii __ZNSt3__111char_traitsIcE3eofEv __ZNSt3__111char_traitsIcE6lengthEPKc __ZNSt3__111char_traitsIcE7compareEPKcS3_m __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEmc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6insertEmPKc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED1Ev __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryC1ERS3_ __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryD1Ev __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEi __ZNSt3__116allocator_traitsINS_9allocatorI4SeatEEE7destroyB7v160006IS2_vEEvRS3_PT_ __ZNSt3__116allocator_traitsINS_9allocatorI4SeatEEE8max_sizeB7v160006IS3_vEEmRKS3_ __ZNSt3__116allocator_traitsINS_9allocatorI4SeatEEE9constructB7v160006IS2_JS2_EvEEvRS3_PT_DpOT0_ __ZNSt3__116allocator_traitsINS_9allocatorIP6FlightEEE7destroyB7v160006IS3_vEEvRS4_PT_ __ZNSt3__116allocator_traitsINS_9allocatorIP6FlightEEE8max_sizeB7v160006IS4_vEEmRKS4_ __ZNSt3__116allocator_traitsINS_9allocatorIP6FlightEEE9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ __ZNSt3__116allocator_traitsINS_9allocatorIP7BookingEEE7destroyB7v160006IS3_vEEvRS4_PT_ __ZNSt3__116allocator_traitsINS_9allocatorIP7BookingEEE8max_sizeB7v160006IS4_vEEmRKS4_ __ZNSt3__116allocator_traitsINS_9allocatorIP7BookingEEE9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ __ZNSt3__116allocator_traitsINS_9allocatorIP9PassengerEEE7destroyB7v160006IS3_vEEvRS4_PT_ __ZNSt3__116allocator_traitsINS_9allocatorIP9PassengerEEE8max_sizeB7v160006IS4_vEEmRKS4_ __ZNSt3__116allocator_traitsINS_9allocatorIP9PassengerEEE9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ __ZNSt3__14coutE __ZNSt3__15ctypeIcE2idE __ZNSt3__16localeD1Ev __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE21__push_back_slow_pathIS1_EEvOT_ __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE22__construct_one_at_endB7v160006IJS1_EEEvDpOT_ __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE21__push_back_slow_pathIRKS2_EEvOT_ __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE22__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE21__push_back_slow_pathIRKS2_EEvOT_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE22__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE21__push_back_slow_pathIRKS2_EEvOT_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE22__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ __ZNSt3__18ios_base33__set_badbit_and_consider_rethrowEv __ZNSt3__18ios_base5clearEj __ZNSt3__19allocatorI4SeatE9constructB7v160006IS1_JS1_EEEvPT_DpOT0_ __ZNSt3__19allocatorIP6FlightE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ __ZNSt3__19allocatorIP7BookingE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ __ZNSt3__19allocatorIP9PassengerE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ __ZNSt3__19to_stringEi __ZSt9terminatev __ZTISt12length_error __ZTISt20bad_array_new_length __ZTVSt12length_error __ZdlPv __Znwm ___cxa_allocate_exception ___cxa_begin_catch ___cxa_end_catch ___cxa_free_exception ___cxa_throw ___gxx_personality_v0 _memcmp _memmove _strlen   _ �    ��  �  ��  ancelBookingENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE reateBookingEP6FlightP9Passengeri  2addPassengerEP9Passenger 	3c  �  �|  �z  1Ev �2Ev � ��  �|  1Ev �2Ev � 1 �9addFlightEP6Flight �C �D � ��  ��  ��  ��  1Eib �2Eib � 4bookEv �6cancelEv �C � �  إ  أ  bookSeatEi �getSeatsEv � ��  Ĝ  1ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_S6_S6_i �2ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_S6_S6_i � 10cancelSeatEi �8 �C � ̙  ��  1ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEP6FlightP9Passengeri �2ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEP6FlightP9Passengeri � ��  ��  1ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_S6_ �2ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_S6_ � Т  ��  �  ̗  ��  0findFlightENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE �1findBookingENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE �3findPassengerENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE �7displayAllFlightsEv �8displayAllBookingsEv � ��  1 �20displayAllPassengersEv �	 ��  ��  13getSeatNumberEv �
8isBookedEv �
 ��  Ȣ  ԡ  ��  �  1getCapacityEv �
4getDestinationEv �
5getFlightNumberEv �
6getDepartureTimeEv �
7displayFlightInfoEv �
 ��  1 �
9getOriginEv � ��  �  BookingIdEv �PassengerEv � ��  ��  2get �3getSeatNumberEv �8displayBookingInfoEv � К  1 �9getFlightEv � ��  ��  ��  1displayInfoEv �6getContactNumberEv �7getPassportNumberEv � ��  1 �7getNameEv �
�� �� �� ��  6FlightEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ �
7BookingEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ �
9PassengerEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ �
 4SeatEES7_S7_EENS_4pairIT_T1_EES9_T0_SA_ �
P �
 23AirlineManagementSystem �	4Seat �
6Flight �7Booking �9Passenger �
St3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIP ��� �� �� ̆  11eq_int_typeEii �3eofEv �6lengthEPKc �7compareEPKcS3_m ��� ط ��  7destroyB7v160006IS2_vEEvRS3_PT_ �8max_sizeB7v160006IS3_vEEmRKS3_ �9constructB7v160006IS2_JS2_EvEEvRS3_PT_DpOT0_ ��� �� ��  7destroyB7v160006IS3_vEEvRS4_PT_ �8max_sizeB7v160006IS4_vEEmRKS4_ �9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ ��� �� ��  7destroyB7v160006IS3_vEEvRS4_PT_ �8max_sizeB7v160006IS4_vEEmRKS4_ �9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ ��� �� ��  7destroyB7v160006IS3_vEEvRS4_PT_ �8max_sizeB7v160006IS4_vEEmRKS4_ �9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ � 6FlightEEE �7BookingEEE �9PassengerEEE � 4SeatEEE �P � 1char_traitsIcE �6allocator_traitsINS_9allocatorI �� ج  1__push_back_slow_pathIS1_EEvOT_ �2__construct_one_at_endB7v160006IJS1_EEEvDpOT_ ��� ��  1__push_back_slow_pathIRKS2_EEvOT_ �2__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ �̽ ��  1__push_back_slow_pathIRKS2_EEvOT_ �2__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ ��� ��  1__push_back_slow_pathIRKS2_EEvOT_ �2__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ � 6FlightNS_9allocatorIS2_EEE2 �7BookingNS_9allocatorIS2_EEE2 �9PassengerNS_9allocatorIS2_EEE2 � 4SeatNS_9allocatorIS1_EEE2 �P �ر �� �� ��  6FlightE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ �7BookingE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ �9PassengerE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ � 4SeatE9constructB7v160006IS1_JS1_EEEvPT_DpOT0_ �P � 1 �6vectorI �9allocatorI � 23AirlineManagementSystem �4Seat �6Flight �7BookingC �9PassengerC �K �St3__1 �    ZN �mh_execute_header � Ȉ  _ �main �   �zL,,,,�004, 004, 004, ,,,,0l4l�4Dl����<�H,X004 �004 �004 ���H\,D4� �(4(@ ((�,@0($$($HDH,HHHX<@,,X<@,,X<@,,D4� �(4(@ ((�,@$($D4� �(4(@ ((�,@$($D4� �(4(@ ((�,@$($4<$4<$4<$(��$<4,D( �D�,`,,$(T4$d4LT�<@((H X4($($x4<�xdd���D8\tH(( $<4,(�(@,�($(��$<4,D( �D�,`$($�<@((H X($x4<�xdd���D8\tH(( $<4,(�(@,�($`<4<,,$4�@8$$(��$<4,D( �D�,`$($�<@((H X($x4<�xdd���D8\tH(( $<4,(�(@,�($H,`@�DD�`H$8,<�8<4$<4P@��4d$,<<(,TT((T$(�,844<$4<$4<$Tl(44�0LXL8��,lT8<<<��$�X<@,,(��$<4,D( �D�,`$($�<@((H X($x4<�xdd���D8\tH(( $<4,(�(@,�($�D8<<�8H    3  � �=     o  � �=     �  �  >     �  � T@     +  � �@     i  � �@     �  � �@     �  �  A     �  � ,A       � LA     Z  � |A     �  � �A     �  � �A       � �A     "  � $B     U  � DB     �  � tB     �  � �B       � �B     E  � �B     V  � C     �  � <C     �  � hC       � �C     ?  � D     �  � �D     �  �  G     &  � 4G     �  � xG     �  � lJ       � �J     t  � �K     �  � �L     <   � �L     �   � M     �   � \M     !  � �M     R!  � �M     �!  � �M     �!  � N     �!  � �N     7"  �  O     y"  � PO     �"  � �O     �"  � �O     ##  � �P     e#  � �P     �#  � �P     �#  � Q     $  � 0Q     I$  � R     �$  � 4T     �$  � |T     %  � �T     %%  � �T     ^%  � U     �%  � `U     �%  � �U     �%  � �U     ?&  � <V     �&  � \V     �&  � W     #'  � $W     b'  � LW     �'  � �W     �'  � �W     5(  � �W     �(  � X     �(  � 0X     )  � XX     C)  � lX     �)  � $Y     �)  � 8Y     �)  � xY     ,*  � �Y     j*  � �Y     �*  � �Y     �*  � Z     B+  � ,Z     �+  � TZ     �+  � xZ     ,  � �Z     T,  � �Z     �,  � �Z     �,  � 0[     �,  � x[     -  � �[     "-  � �[     `-  � \     �-  � \     �-  � d\     .  � |\     M.  � �\     �.  � �\     �.  � 4]     */  � p]     �/  � �]     �/  � �]     70  � �]     �0  � ^     �0  � 4^     1  � H^     S1  � �^     �1  � �^     2  � �^     �2  � ,_     �2  � H_     C3  � t_     r3  � �_     �3  � �_     �3  � `     f4  � H`     �4  � X`     +5  � �`     v5  � �`     �5  � �`     
6  � a     V6  �  a     �6  � da     �6  � �a     (7  � 4b     p7  � Tb     �7  � c     8  � c     W8  � Dc     �8  � xc     �8  � �c     39  � �c     �9  �  d     �9  � (d     :  � Pd     M:  � dd     �:  � e     �:  � 0e     ;  � pe     _;  � �e     �;  � �e     �;  � �e     H<  � �e     �<  � f     �<  � Lf     =  � �f     k=  � g     �=  � <g     >  � �g     a>  � h     �>  � ,h     �>  � `h     D?  � �h     �?  � �h     �?  � �h     8@  � i     {@  � 8i     �@  � Li     	A  � j     AA  � j     ~A  � Xj     �A  � |j     (B  � �j     pB  � �j     �B  � �j     C  � �j     IC  � 4k     �C  � hk     �C  � l     *D  � $l     yD  � �l     �D  � �l     E  � m     kE  � Hm     �E  � pm     �E  � �m     [F  � �m     �F  � �m     �F  �  n     G  � 4n     gG  � �n     �G  �  o     �G  � @o     'H  � do     ~H  � xo     �H  � �o     I  � �o     \I  � �o     �I  � p     �I  � Hp     J  � lp     ]J  � �p     �J  � �p     �J  �  q     K  � 4q     NK  � pq     �K  � �q     �K  � $s     L  � Hs     \L  � \s     �L  � �s     M  � �s     ]M  � dt     �M  � �t     �M  � 8u     9N  � |u     �N  � �v     �N  � �v     O  �  w     lO  � <w     �O  � hw     �O  � �w     �O  � �w     (P  � �w     `P  � Hx     �P  � |x     �P  � �x     Q  � �x     cQ  � �x     �Q  � �x     �Q  � 4y     �Q  � hy     R  � �y     KR  � z     �R  � �z     �R  � {     iS  � X{     �S  � �{     T  � �{     ZT  � �{     �T  � |     �T  � h|     U  � �|     @U  � �|     wU  � �|     �U  � }     V  � (}     kV  � L}     �V  � �}     /W  � �}     hW  � ~     �W  � L~     ?X  � �~     �X  �      �X  � �     ^Y  � �     Z  � H�     �Z  � t�     4[  � ��     �[  � ܂     U\  � �     �\  � p�     ]  � �     i]  � ,�     L^  � T�     �^  � |�     �^  � ��     /_  � ��     �_  � Ą     �_  �  �     7`  � 4�     �`  � `�     �`  � ��     
a  � �     Ta  � <�     �a  � |�     �a  � ��     tb  � (�     �b  � P�     c  � t�     Yc  � �     �c  � (�     �c  � <�     Md  � ��     �d  � ؉     �d  � D�     Se  � d�     �e  � �     �e  � \�     Of  � t�     �f  � ��     �f  �  �     !g  � @�     gg  � h�     �g  � |�     �g  � ��     Jh  � ��     �h  � ��     �h  � Ď     qi  � �     �i  � ,�     j  � T�     kj  � ��     �j  � ��     �j  � �     Qk  � <�     �k  � T�     �k  � x�     �l  � �     �l  � $�     m  � <�     �m  � x�     �m  � $�     @n  � 4�     �n  � ��     o  � �     �o  � t�     �p  � ��     �p  � ĕ     �q  � �     
r  � @�     cr  � ��     �r  � �     *s  � X�     t  � ��     It  � ��     �t  � ȗ     �t  � ̗     [u  � �     �u  � ,�     
v  � `�     ov  � ��     �v  � ��     �v  � @�     6w  � h�     �w  � ��     �w  � ԙ     _x  � T�     �x  � |�     y  � ��     Wy  �  �     �y  � p�     Tz  � ��     �z  � ��     x{  � Л     �{  � ��     �{  � (�     @|  � <�     l|  � `�     �|  � ��     }  � �     j}  � X�     �}  � ��     *~  � ��     �~  � ȝ       � ܝ     �  �  �     �  � �     U�  � ��     ��  � ȟ     �  � ܟ     C�  � L�     ��  � x�     �  � �     C�  � �     ��  � ��     ΂  � ��     9�  � �     w�  � @�     ��  � ��     �  � �     I�  � �     ~�  � �     ΄  � @�     &�  � T�     h�  � (�     ��  � d�     G�  � ��     ��  � ̥     �  � ��     ;�  � <�     ��  � \�     ˇ  � ��     �  � ܦ     s�  � ��       � �     P�  � ��     ��  � ħ       � ܧ     O�  � �     ��  � Ĩ     ��  � Ԩ     F�  � L�     ��  � ��     p�  � �     4�  � @�     ��  � d�     0�  � ��     ��  � �     
�  � <�     ��  � ��     Џ  � ��     ��  �  �     �  � H�     !�  � h�     ��  � l�     ��  � ��     N�  � ̮     ��  �  �     �  � ,�     =�  � T�     {�  � �     Ɠ  � �     �  � H�     p�  � t�     �  � ��     9�  � �     ��  � @�     �  � ��     6�  � ��     ��  � �     ��  � T�     �  � h�     e�  � �     ė  � `�     _�  � ��     �  � X�     U�  � ��     ��  �  �     ,�  � $�     ��  � \�     ٚ  � ��     5�  � ĵ     ��  � H�     ��  � ��     :�  � ��     z�  � �     ��  � �     ��  � P�     =�  � ��     ��  � Է     �  � �     k�  �  �     ��  � �     /�  � \�     ��  � ��     ��  � ��     �  � �     9�  � 0�     y�  � \�     ��  � t�     �  � ��     5�  � �     ��  � �     ��  � @�     ��  � ��     (�  � ��     ��  � ��     �  � $�     G�  � L�     ��  � `�     ޣ  � ��     �  � ؿ     B�  �  �     ��  � ��     ��  � ��     �  � �     
�  � <�     Y�  � p�     ��  � ��     ť  � ��     �  � �     M�  � @�     ��  � d�     Ӧ  � ��     
�  � ��     A�  � ��     ��  � ��     �  � ��     P�  � �     ��  � ��     ب  � (�     T�  � ��     ��  � �     ѩ  � ��     
�  � ��     C�  � �     ��  � X�      �  � h�     h�  � ��     ��  � ��     �  � ��     >�  � �     ��  � 0�     Ĭ  � ��     �  � ��     R�  � ��     ��  � h�     ��  � ��     J�  �  �     ��  �  �     ߮  � ��     �  � �     ��  � 0�     ��  � \�     ��  � ��     D�  � ��     ��  � $�     ��  � 8�     �  � \�     U�  � p�     ��  � D�     �  � ��     j�  � ��     ��  � ��     ��  � �     R�  � X�     ��  � x�     ڳ  � ��     &�  � ��     z�  � �     Ŵ  � 4�     O�  � ��     ��  � ��     ��  � ��     B�  � 4�     ��  � ��     �  � ��     -�  � h�     ��  � ��     O�  � 0�     �  � \�     m�  � ��     �  � ��     ��  � �     غ  � `�     H�  � ��     ��  � �     s�  � D�     ��  � l�     ؼ  � ��     M�  � ��     ��  � ��     ��  � ��     L�  � $�     ��  � P�     ܾ  � x�     �  � �     ]�  � ,�     ��  � l�     ��  � ��     t�  � �     ��  � @�     �    ��     �    ��     2�    ��     E�    ��     X�    ��     k�    �     �    �     ��    $�     ��    4�     ��    D�     ��    T�     ��    d�     ��    t�     �    ��     �    ��     3�    ��     G�    ��     [�    ��     o�    ��     ��    ��     ��    ��     ��    �     ��    �     ��    (�     ��    8�     ��    H�     �    \�     #�    l�     7�    |�     K�    ��     _�    ��     s�    ��     ��    ��     ��    ��     ��    ��     ��    ��     ��     �     ��    �     ��     �     �    0�     '�    @�     ;�    t�     O�    ��     c�    ��     w�    ��     ��    ��     ��    l�     ��    |�     ��    ��     ��    ��     ��    ��     ��    ��     �    �     !�    ,�     4�    D�     G�    T�     Z�    d�     l�    ��     �    ��     ��    ��     ��    ��     ��    ��     ��    ��     ��    ��     ��    ��     �    �     �    �     ,�    ,�     @�    <�     T�    p�     h�    ��     |�    ��     ��    ��     ��    ��     ��    ��     ��    �     ��    �     ��    ,�     �    <�          �D     :     �G     �     (E     �     �C         L>     =    |=     _    �C     �    x>     �    t�     �    ��     �    ��     �    ��     �    ��     �    ��         ��     -    ��     �    D�     �    ��     C    t�     �    �     �    d�     W    PQ     �    �I     0    dS     �    �K     �    �O         (N     ?    @�     [    X�     q    ��     �    H�     �    ��     �    ��     �    ��         �     (    �     F    h�     d    ��     �    ��     �    P�     �    �     �    ��         ��     )    X�     C  � ��     �  � ��     @	  � ī     �	  � $�     D
  � �     o
  � �     �
  � <�     �
  � L�     �
  � �X     5  � ��     �  � 4�     �  � �d     @  � �w     �  � �s     �  � �n     T
  � ��     �
  � �       � �i     l  � �     �  � x�     .  � ��     {  � X�     �  � Lr     (  � �q     �  � ̞     �  � <�     <  � ,�     �  � ��     �  � ��     8  � <t     �  � ��     �  � �               +    H�     1            A            h            �            �            �            �            �            H            �            �            )            n            �            �                        Y            �            �            �            �                        "            9            J            `            ~            �            �            �            �            �            �            �                                    "            +            �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �  �    __ZN23AirlineManagementSystem12addPassengerEP9Passenger __ZN23AirlineManagementSystem13cancelBookingENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE __ZN23AirlineManagementSystem13createBookingEP6FlightP9Passengeri __ZN23AirlineManagementSystem9addFlightEP6Flight __ZN23AirlineManagementSystemC1Ev __ZN23AirlineManagementSystemC2Ev __ZN23AirlineManagementSystemD1Ev __ZN23AirlineManagementSystemD2Ev __ZN4Seat4bookEv __ZN4Seat6cancelEv __ZN4SeatC1Eib __ZN4SeatC2Eib __ZN6Flight10cancelSeatEi __ZN6Flight8bookSeatEi __ZN6Flight8getSeatsEv __ZN6FlightC1ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_S6_S6_i __ZN6FlightC2ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_S6_S6_i __ZN7BookingC1ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEP6FlightP9Passengeri __ZN7BookingC2ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEEP6FlightP9Passengeri __ZN9PassengerC1ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_S6_ __ZN9PassengerC2ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_S6_ __ZNK23AirlineManagementSystem10findFlightENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE __ZNK23AirlineManagementSystem11findBookingENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE __ZNK23AirlineManagementSystem13findPassengerENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE __ZNK23AirlineManagementSystem17displayAllFlightsEv __ZNK23AirlineManagementSystem18displayAllBookingsEv __ZNK23AirlineManagementSystem20displayAllPassengersEv __ZNK4Seat13getSeatNumberEv __ZNK4Seat8isBookedEv __ZNK6Flight11getCapacityEv __ZNK6Flight14getDestinationEv __ZNK6Flight15getFlightNumberEv __ZNK6Flight16getDepartureTimeEv __ZNK6Flight17displayFlightInfoEv __ZNK6Flight9getOriginEv __ZNK7Booking12getBookingIdEv __ZNK7Booking12getPassengerEv __ZNK7Booking13getSeatNumberEv __ZNK7Booking18displayBookingInfoEv __ZNK7Booking9getFlightEv __ZNK9Passenger11displayInfoEv __ZNK9Passenger16getContactNumberEv __ZNK9Passenger17getPassportNumberEv __ZNK9Passenger7getNameEv __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIP4SeatEES7_S7_EENS_4pairIT_T1_EES9_T0_SA_ __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIPP6FlightEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIPP7BookingEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIPP9PassengerEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ __ZNSt3__111char_traitsIcE11eq_int_typeEii __ZNSt3__111char_traitsIcE3eofEv __ZNSt3__111char_traitsIcE6lengthEPKc __ZNSt3__111char_traitsIcE7compareEPKcS3_m __ZNSt3__116allocator_traitsINS_9allocatorI4SeatEEE7destroyB7v160006IS2_vEEvRS3_PT_ __ZNSt3__116allocator_traitsINS_9allocatorI4SeatEEE8max_sizeB7v160006IS3_vEEmRKS3_ __ZNSt3__116allocator_traitsINS_9allocatorI4SeatEEE9constructB7v160006IS2_JS2_EvEEvRS3_PT_DpOT0_ __ZNSt3__116allocator_traitsINS_9allocatorIP6FlightEEE7destroyB7v160006IS3_vEEvRS4_PT_ __ZNSt3__116allocator_traitsINS_9allocatorIP6FlightEEE8max_sizeB7v160006IS4_vEEmRKS4_ __ZNSt3__116allocator_traitsINS_9allocatorIP6FlightEEE9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ __ZNSt3__116allocator_traitsINS_9allocatorIP7BookingEEE7destroyB7v160006IS3_vEEvRS4_PT_ __ZNSt3__116allocator_traitsINS_9allocatorIP7BookingEEE8max_sizeB7v160006IS4_vEEmRKS4_ __ZNSt3__116allocator_traitsINS_9allocatorIP7BookingEEE9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ __ZNSt3__116allocator_traitsINS_9allocatorIP9PassengerEEE7destroyB7v160006IS3_vEEvRS4_PT_ __ZNSt3__116allocator_traitsINS_9allocatorIP9PassengerEEE8max_sizeB7v160006IS4_vEEmRKS4_ __ZNSt3__116allocator_traitsINS_9allocatorIP9PassengerEEE9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE21__push_back_slow_pathIS1_EEvOT_ __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE22__construct_one_at_endB7v160006IJS1_EEEvDpOT_ __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE21__push_back_slow_pathIRKS2_EEvOT_ __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE22__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE21__push_back_slow_pathIRKS2_EEvOT_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE22__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE21__push_back_slow_pathIRKS2_EEvOT_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE22__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ __ZNSt3__19allocatorI4SeatE9constructB7v160006IS1_JS1_EEEvPT_DpOT0_ __ZNSt3__19allocatorIP6FlightE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ __ZNSt3__19allocatorIP7BookingE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ __ZNSt3__19allocatorIP9PassengerE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ __mh_execute_header _main __Unwind_Resume __ZNKSt3__16locale9use_facetERNS0_2idE __ZNKSt3__18ios_base6getlocEv __ZNSt11logic_errorC2EPKc __ZNSt12length_errorD1Ev __ZNSt20bad_array_new_lengthC1Ev __ZNSt20bad_array_new_lengthD1Ev __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEmc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6insertEmPKc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED1Ev __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryC1ERS3_ __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryD1Ev __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEi __ZNSt3__14coutE __ZNSt3__15ctypeIcE2idE __ZNSt3__16localeD1Ev __ZNSt3__18ios_base33__set_badbit_and_consider_rethrowEv __ZNSt3__18ios_base5clearEj __ZNSt3__19to_stringEi __ZSt9terminatev __ZTISt12length_error __ZTISt20bad_array_new_length __ZTVSt12length_error __ZdlPv __Znwm ___cxa_allocate_exception ___cxa_begin_catch ___cxa_end_catch ___cxa_free_exception ___cxa_throw ___gxx_personality_v0 _memcmp _memmove _strlen __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEEC1B7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEEC1B7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEEC1B7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE5beginB7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE3endB7v160006Ev __ZNSt3__1neB7v160006IPP6FlightEEbRKNS_11__wrap_iterIT_EES8_ __ZNKSt3__111__wrap_iterIPP6FlightEdeB7v160006Ev __ZN6FlightD1Ev __ZNSt3__111__wrap_iterIPP6FlightEppB7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE5beginB7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE3endB7v160006Ev __ZNSt3__1neB7v160006IPP9PassengerEEbRKNS_11__wrap_iterIT_EES8_ __ZNKSt3__111__wrap_iterIPP9PassengerEdeB7v160006Ev __ZN9PassengerD1Ev __ZNSt3__111__wrap_iterIPP9PassengerEppB7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE5beginB7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE3endB7v160006Ev __ZNSt3__1neB7v160006IPP7BookingEEbRKNS_11__wrap_iterIT_EES8_ __ZNKSt3__111__wrap_iterIPP7BookingEdeB7v160006Ev __ZN7BookingD1Ev __ZNSt3__111__wrap_iterIPP7BookingEppB7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEED1B7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEED1B7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEED1B7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE9push_backB7v160006ERKS2_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE9push_backB7v160006ERKS2_ __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1B7v160006IDnEEPKc __ZNSt3__1plB7v160006IcNS_11char_traitsIcEENS_9allocatorIcEEEENS_12basic_stringIT_T0_T1_EEPKS6_OS9_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE9push_backB7v160006ERKS2_ __ZNSt3__14findB7v160006INS_11__wrap_iterIPP7BookingEES3_EET_S6_S6_RKT0_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE5eraseB7v160006ENS_11__wrap_iterIPKS2_EE __ZNSt3__111__wrap_iterIPKP7BookingEC1B7v160006IPS2_EERKNS0_IT_EEPNS_9enable_ifIXsr14is_convertibleIS8_S4_EE5valueEvE4typeE __ZNSt3__1lsB7v160006INS_11char_traitsIcEEEERNS_13basic_ostreamIcT_EES6_PKc __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsB7v160006EPFRS3_S4_E __ZNSt3__14endlB7v160006IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_ __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE5beginB7v160006Ev __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE3endB7v160006Ev __ZNSt3__1neB7v160006IPKP6FlightEEbRKNS_11__wrap_iterIT_EES9_ __ZNKSt3__111__wrap_iterIPKP6FlightEdeB7v160006Ev __ZNSt3__111__wrap_iterIPKP6FlightEppB7v160006Ev __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE5beginB7v160006Ev __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE3endB7v160006Ev __ZNSt3__1neB7v160006IPKP9PassengerEEbRKNS_11__wrap_iterIT_EES9_ __ZNKSt3__111__wrap_iterIPKP9PassengerEdeB7v160006Ev __ZNSt3__111__wrap_iterIPKP9PassengerEppB7v160006Ev __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE5beginB7v160006Ev __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE3endB7v160006Ev __ZNSt3__1neB7v160006IPKP7BookingEEbRKNS_11__wrap_iterIT_EES9_ __ZNKSt3__111__wrap_iterIPKP7BookingEdeB7v160006Ev __ZNSt3__111__wrap_iterIPKP7BookingEppB7v160006Ev __ZNSt3__1eqB7v160006INS_9allocatorIcEEEEbRKNS_12basic_stringIcNS_11char_traitsIcEET_EES9_ __ZNSt3__1eqB7v160006IPP6FlightEEbRKNS_11__wrap_iterIT_EES8_ __ZNKSt3__111__wrap_iterIPP6FlightE4baseB7v160006Ev __ZN6FlightD2Ev __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEED1B7v160006Ev __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEED2B7v160006Ev __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE16__destroy_vectorC1ERS4_ ___clang_call_terminate __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE16__destroy_vectorclB7v160006Ev __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE16__destroy_vectorC2ERS4_ __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE17__annotate_deleteB7v160006Ev __ZNSt3__118__debug_db_erase_cB7v160006INS_6vectorI4SeatNS_9allocatorIS2_EEEEEEvPT_ __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE7__clearB7v160006Ev __ZNSt3__116allocator_traitsINS_9allocatorI4SeatEEE10deallocateB7v160006ERS3_PS2_m __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE7__allocB7v160006Ev __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE8capacityB7v160006Ev __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE31__annotate_contiguous_containerB7v160006EPKvS6_S6_S6_ __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE4dataB7v160006Ev __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE4sizeB7v160006Ev __ZNSt3__112__to_addressB7v160006I4SeatEEPT_S3_ __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE22__base_destruct_at_endB7v160006EPS1_ __ZNSt3__19allocatorI4SeatE7destroyB7v160006EPS1_ __ZNSt3__19allocatorI4SeatE10deallocateB7v160006EPS1_m __ZNSt3__119__libcpp_deallocateB7v160006EPvmm __ZNSt3__127__do_deallocate_handle_sizeB7v160006IJEEEvPvmDpT_ __ZNSt3__124__libcpp_operator_deleteB7v160006IJPvEEEvDpT_ __ZNSt3__117__compressed_pairIP4SeatNS_9allocatorIS1_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemINS_9allocatorI4SeatEELi1ELb1EE5__getB7v160006Ev __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIP4SeatNS_9allocatorIS1_EEE5firstB7v160006Ev __ZNKSt3__122__compressed_pair_elemIP4SeatLi0ELb0EE5__getB7v160006Ev __ZNSt3__1eqB7v160006IPP9PassengerEEbRKNS_11__wrap_iterIT_EES8_ __ZNKSt3__111__wrap_iterIPP9PassengerE4baseB7v160006Ev __ZN9PassengerD2Ev __ZNSt3__1eqB7v160006IPP7BookingEEbRKNS_11__wrap_iterIT_EES8_ __ZNKSt3__111__wrap_iterIPP7BookingE4baseB7v160006Ev __ZN7BookingD2Ev __ZNSt3__1eqB7v160006IPKP6FlightEEbRKNS_11__wrap_iterIT_EES9_ __ZNKSt3__111__wrap_iterIPKP6FlightE4baseB7v160006Ev __ZNSt3__1eqB7v160006IPKP9PassengerEEbRKNS_11__wrap_iterIT_EES9_ __ZNKSt3__111__wrap_iterIPKP9PassengerE4baseB7v160006Ev __ZNSt3__1eqB7v160006IPKP7BookingEEbRKNS_11__wrap_iterIT_EES9_ __ZNKSt3__111__wrap_iterIPKP7BookingE4baseB7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEEC2B7v160006Ev __ZNSt3__117__compressed_pairIPP6FlightNS_9allocatorIS2_EEEC1B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__119__debug_db_insert_cB7v160006INS_6vectorIP6FlightNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__117__compressed_pairIPP6FlightNS_9allocatorIS2_EEEC2B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__122__compressed_pair_elemIPP6FlightLi0ELb0EEC2B7v160006IDnvEEOT_ __ZNSt3__122__compressed_pair_elemINS_9allocatorIP6FlightEELi1ELb1EEC2B7v160006ENS_18__default_init_tagE __ZNSt3__19allocatorIP6FlightEC2B7v160006Ev __ZNSt3__116__non_trivial_ifILb1ENS_9allocatorIP6FlightEEEC2B7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEEC2B7v160006Ev __ZNSt3__117__compressed_pairIPP9PassengerNS_9allocatorIS2_EEEC1B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__119__debug_db_insert_cB7v160006INS_6vectorIP9PassengerNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__117__compressed_pairIPP9PassengerNS_9allocatorIS2_EEEC2B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__122__compressed_pair_elemIPP9PassengerLi0ELb0EEC2B7v160006IDnvEEOT_ __ZNSt3__122__compressed_pair_elemINS_9allocatorIP9PassengerEELi1ELb1EEC2B7v160006ENS_18__default_init_tagE __ZNSt3__19allocatorIP9PassengerEC2B7v160006Ev __ZNSt3__116__non_trivial_ifILb1ENS_9allocatorIP9PassengerEEEC2B7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEEC2B7v160006Ev __ZNSt3__117__compressed_pairIPP7BookingNS_9allocatorIS2_EEEC1B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__119__debug_db_insert_cB7v160006INS_6vectorIP7BookingNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__117__compressed_pairIPP7BookingNS_9allocatorIS2_EEEC2B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__122__compressed_pair_elemIPP7BookingLi0ELb0EEC2B7v160006IDnvEEOT_ __ZNSt3__122__compressed_pair_elemINS_9allocatorIP7BookingEELi1ELb1EEC2B7v160006ENS_18__default_init_tagE __ZNSt3__19allocatorIP7BookingEC2B7v160006Ev __ZNSt3__116__non_trivial_ifILb1ENS_9allocatorIP7BookingEEEC2B7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEED2B7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE16__destroy_vectorC1ERS5_ __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE16__destroy_vectorclB7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE16__destroy_vectorC2ERS5_ __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE17__annotate_deleteB7v160006Ev __ZNSt3__118__debug_db_erase_cB7v160006INS_6vectorIP6FlightNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE7__clearB7v160006Ev __ZNSt3__116allocator_traitsINS_9allocatorIP6FlightEEE10deallocateB7v160006ERS4_PS3_m __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE8capacityB7v160006Ev __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE31__annotate_contiguous_containerB7v160006EPKvS7_S7_S7_ __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE4dataB7v160006Ev __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE4sizeB7v160006Ev __ZNSt3__112__to_addressB7v160006IP6FlightEEPT_S4_ __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE22__base_destruct_at_endB7v160006EPS2_ __ZNSt3__19allocatorIP6FlightE7destroyB7v160006EPS2_ __ZNSt3__19allocatorIP6FlightE10deallocateB7v160006EPS2_m __ZNSt3__117__compressed_pairIPP6FlightNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemINS_9allocatorIP6FlightEELi1ELb1EE5__getB7v160006Ev __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIPP6FlightNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNKSt3__122__compressed_pair_elemIPP6FlightLi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEED2B7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE16__destroy_vectorC1ERS5_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE16__destroy_vectorclB7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE16__destroy_vectorC2ERS5_ __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE17__annotate_deleteB7v160006Ev __ZNSt3__118__debug_db_erase_cB7v160006INS_6vectorIP9PassengerNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE7__clearB7v160006Ev __ZNSt3__116allocator_traitsINS_9allocatorIP9PassengerEEE10deallocateB7v160006ERS4_PS3_m __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE8capacityB7v160006Ev __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE31__annotate_contiguous_containerB7v160006EPKvS7_S7_S7_ __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE4dataB7v160006Ev __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE4sizeB7v160006Ev __ZNSt3__112__to_addressB7v160006IP9PassengerEEPT_S4_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE22__base_destruct_at_endB7v160006EPS2_ __ZNSt3__19allocatorIP9PassengerE7destroyB7v160006EPS2_ __ZNSt3__19allocatorIP9PassengerE10deallocateB7v160006EPS2_m __ZNSt3__117__compressed_pairIPP9PassengerNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemINS_9allocatorIP9PassengerEELi1ELb1EE5__getB7v160006Ev __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIPP9PassengerNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNKSt3__122__compressed_pair_elemIPP9PassengerLi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEED2B7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE16__destroy_vectorC1ERS5_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE16__destroy_vectorclB7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE16__destroy_vectorC2ERS5_ __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE17__annotate_deleteB7v160006Ev __ZNSt3__118__debug_db_erase_cB7v160006INS_6vectorIP7BookingNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE7__clearB7v160006Ev __ZNSt3__116allocator_traitsINS_9allocatorIP7BookingEEE10deallocateB7v160006ERS4_PS3_m __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE8capacityB7v160006Ev __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE31__annotate_contiguous_containerB7v160006EPKvS7_S7_S7_ __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE4dataB7v160006Ev __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE4sizeB7v160006Ev __ZNSt3__112__to_addressB7v160006IP7BookingEEPT_S4_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE22__base_destruct_at_endB7v160006EPS2_ __ZNSt3__19allocatorIP7BookingE7destroyB7v160006EPS2_ __ZNSt3__19allocatorIP7BookingE10deallocateB7v160006EPS2_m __ZNSt3__117__compressed_pairIPP7BookingNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemINS_9allocatorIP7BookingEELi1ELb1EE5__getB7v160006Ev __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIPP7BookingNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNKSt3__122__compressed_pair_elemIPP7BookingLi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE11__make_iterB7v160006EPS2_ __ZNSt3__111__wrap_iterIPP6FlightEC1B7v160006EPKvS3_ __ZNSt3__111__wrap_iterIPP6FlightEC2B7v160006EPKvS3_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE11__make_iterB7v160006EPS2_ __ZNSt3__111__wrap_iterIPP9PassengerEC1B7v160006EPKvS3_ __ZNSt3__111__wrap_iterIPP9PassengerEC2B7v160006EPKvS3_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE11__make_iterB7v160006EPS2_ __ZNSt3__111__wrap_iterIPP7BookingEC1B7v160006EPKvS3_ __ZNSt3__111__wrap_iterIPP7BookingEC2B7v160006EPKvS3_ __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIPP6FlightNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__122__compressed_pair_elemIPP6FlightLi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE21_ConstructTransactionC1B7v160006ERS5_m __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE21_ConstructTransactionD1B7v160006Ev __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE21_ConstructTransactionC2B7v160006ERS5_m __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE21_ConstructTransactionD2B7v160006Ev __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE11__recommendB7v160006Em __ZNSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEEC1EmmS5_ __ZNSt3__16vectorIP6FlightNS_9allocatorIS2_EEE26__swap_out_circular_bufferERNS_14__split_bufferIS2_RS4_EE __ZNSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEED1Ev __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE8max_sizeEv __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE20__throw_length_errorB7v160006Ev __ZNSt3__13maxB7v160006ImEERKT_S3_S3_ __ZNSt3__13minB7v160006ImEERKT_S3_S3_ __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNSt3__114numeric_limitsIlE3maxB7v160006Ev __ZNSt3__13minB7v160006ImNS_6__lessImmEEEERKT_S5_S5_T0_ __ZNKSt3__16__lessImmEclB7v160006ERKmS3_ __ZNKSt3__19allocatorIP6FlightE8max_sizeB7v160006Ev __ZNKSt3__117__compressed_pairIPP6FlightNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNKSt3__122__compressed_pair_elemINS_9allocatorIP6FlightEELi1ELb1EE5__getB7v160006Ev __ZNSt3__123__libcpp_numeric_limitsIlLb1EE3maxB7v160006Ev __ZNSt3__120__throw_length_errorB7v160006EPKc __ZNSt12length_errorC1B7v160006EPKc __ZNSt12length_errorC2B7v160006EPKc __ZNSt3__13maxB7v160006ImNS_6__lessImmEEEERKT_S5_S5_T0_ __ZNSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEEC2EmmS5_ __ZNSt3__117__compressed_pairIPP6FlightRNS_9allocatorIS2_EEEC1B7v160006IDnS6_EEOT_OT0_ __ZNSt3__119__allocate_at_leastB7v160006INS_9allocatorIP6FlightEEEENS_19__allocation_resultINS_16allocator_traitsIT_E7pointerEEERS7_m __ZNSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIPP6FlightRNS_9allocatorIS2_EEEC2B7v160006IDnS6_EEOT_OT0_ __ZNSt3__122__compressed_pair_elemIRNS_9allocatorIP6FlightEELi1ELb0EEC2B7v160006IS5_vEEOT_ __ZNSt3__19allocatorIP6FlightE8allocateB7v160006Em __ZSt28__throw_bad_array_new_lengthB7v160006v __ZNSt3__117__libcpp_allocateB7v160006Emm __ZNSt3__121__libcpp_operator_newB7v160006IJmEEEPvDpT_ __ZNSt3__117__compressed_pairIPP6FlightRNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemIRNS_9allocatorIP6FlightEELi1ELb0EE5__getB7v160006Ev __ZNSt3__117__compressed_pairIPP6FlightRNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__142__uninitialized_allocator_move_if_noexceptB7v160006INS_9allocatorIP6FlightEENS_16reverse_iteratorIPS3_EES7_S3_vEET1_RT_T0_SB_S8_ __ZNSt3__116reverse_iteratorIPP6FlightEC1B7v160006ES3_ __ZNKSt3__116reverse_iteratorIPP6FlightE4baseB7v160006Ev __ZNSt3__14swapB7v160006IPP6FlightEENS_9enable_ifIXaasr21is_move_constructibleIT_EE5valuesr18is_move_assignableIS5_EE5valueEvE4typeERS5_S8_ __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE14__annotate_newB7v160006Em __ZNSt3__125__debug_db_invalidate_allB7v160006INS_6vectorIP6FlightNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__14moveB7v160006INS_16reverse_iteratorIPP6FlightEES5_EET0_T_S7_S6_ __ZNSt3__16__moveB7v160006INS_17_ClassicAlgPolicyENS_16reverse_iteratorIPP6FlightEES6_S6_EENS_4pairIT0_T2_EES8_T1_S9_ __ZNSt3__123__dispatch_copy_or_moveB7v160006INS_17_ClassicAlgPolicyENS_11__move_loopIS1_EENS_14__move_trivialENS_16reverse_iteratorIPP6FlightEES9_S9_EENS_4pairIT2_T4_EESB_T3_SC_ __ZNSt3__121__unwrap_and_dispatchB7v160006INS_10__overloadINS_11__move_loopINS_17_ClassicAlgPolicyEEENS_14__move_trivialEEENS_16reverse_iteratorIPP6FlightEESB_SB_Li0EEENS_4pairIT0_T2_EESD_T1_SE_ __ZNSt3__114__unwrap_rangeB7v160006INS_16reverse_iteratorIPP6FlightEES5_EENS_4pairIT0_S7_EET_S9_ __ZNSt3__113__unwrap_iterB7v160006INS_16reverse_iteratorIPP6FlightEENS_18__unwrap_iter_implIS5_Lb0EEELi0EEEDTclsrT0_8__unwrapclsr3stdE7declvalIT_EEEES9_ __ZNSt3__19make_pairB7v160006INS_16reverse_iteratorIPP6FlightEES5_EENS_4pairINS_18__unwrap_ref_decayIT_E4typeENS7_IT0_E4typeEEEOS8_OSB_ __ZNSt3__114__rewrap_rangeB7v160006INS_16reverse_iteratorIPP6FlightEES5_EET_S6_T0_ __ZNSt3__113__rewrap_iterB7v160006INS_16reverse_iteratorIPP6FlightEES5_NS_18__unwrap_iter_implIS5_Lb0EEEEET_S8_T0_ __ZNSt3__1neB7v160006IPP6FlightS3_EEbRKNS_16reverse_iteratorIT_EERKNS4_IT0_EE __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE11__iter_moveB7v160006IRNS_16reverse_iteratorIPP6FlightEEEENS_9enable_ifIXsr12is_referenceIDTdeclsr3stdE7declvalIRT_EEEEE5valueEDTclsr3stdE4movedeclsr3stdE7declvalISC_EEEEE4typeEOSB_ __ZNKSt3__116reverse_iteratorIPP6FlightEdeB7v160006Ev __ZNSt3__116reverse_iteratorIPP6FlightEppB7v160006Ev __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE25__validate_iter_referenceB7v160006IRNS_16reverse_iteratorIPP6FlightEEEEvv __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIPP6FlightEELb0EE8__unwrapB7v160006ES5_ __ZNSt3__14pairINS_16reverse_iteratorIPP6FlightEES5_EC1B7v160006IS5_S5_LPv0EEEOT_OT0_ __ZNSt3__14pairINS_16reverse_iteratorIPP6FlightEES5_EC2B7v160006IS5_S5_LPv0EEEOT_OT0_ __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIPP6FlightEELb0EE8__rewrapB7v160006ES5_S5_ __ZNSt3__116reverse_iteratorIPP6FlightEC2B7v160006ES3_ __ZNSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEED2Ev __ZNSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEE5clearB7v160006Ev __ZNKSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEE8capacityB7v160006Ev __ZNSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEE17__destruct_at_endB7v160006EPS2_ __ZNSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEE17__destruct_at_endB7v160006EPS2_NS_17integral_constantIbLb0EEE __ZNKSt3__114__split_bufferIP6FlightRNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIPP6FlightRNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIPP9PassengerNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__122__compressed_pair_elemIPP9PassengerLi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE21_ConstructTransactionC1B7v160006ERS5_m __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE21_ConstructTransactionD1B7v160006Ev __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE21_ConstructTransactionC2B7v160006ERS5_m __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE21_ConstructTransactionD2B7v160006Ev __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE11__recommendB7v160006Em __ZNSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEEC1EmmS5_ __ZNSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE26__swap_out_circular_bufferERNS_14__split_bufferIS2_RS4_EE __ZNSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEED1Ev __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE8max_sizeEv __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE20__throw_length_errorB7v160006Ev __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNKSt3__19allocatorIP9PassengerE8max_sizeB7v160006Ev __ZNKSt3__117__compressed_pairIPP9PassengerNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNKSt3__122__compressed_pair_elemINS_9allocatorIP9PassengerEELi1ELb1EE5__getB7v160006Ev __ZNSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEEC2EmmS5_ __ZNSt3__117__compressed_pairIPP9PassengerRNS_9allocatorIS2_EEEC1B7v160006IDnS6_EEOT_OT0_ __ZNSt3__119__allocate_at_leastB7v160006INS_9allocatorIP9PassengerEEEENS_19__allocation_resultINS_16allocator_traitsIT_E7pointerEEERS7_m __ZNSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIPP9PassengerRNS_9allocatorIS2_EEEC2B7v160006IDnS6_EEOT_OT0_ __ZNSt3__122__compressed_pair_elemIRNS_9allocatorIP9PassengerEELi1ELb0EEC2B7v160006IS5_vEEOT_ __ZNSt3__19allocatorIP9PassengerE8allocateB7v160006Em __ZNSt3__117__compressed_pairIPP9PassengerRNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemIRNS_9allocatorIP9PassengerEELi1ELb0EE5__getB7v160006Ev __ZNSt3__117__compressed_pairIPP9PassengerRNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__142__uninitialized_allocator_move_if_noexceptB7v160006INS_9allocatorIP9PassengerEENS_16reverse_iteratorIPS3_EES7_S3_vEET1_RT_T0_SB_S8_ __ZNSt3__116reverse_iteratorIPP9PassengerEC1B7v160006ES3_ __ZNKSt3__116reverse_iteratorIPP9PassengerE4baseB7v160006Ev __ZNSt3__14swapB7v160006IPP9PassengerEENS_9enable_ifIXaasr21is_move_constructibleIT_EE5valuesr18is_move_assignableIS5_EE5valueEvE4typeERS5_S8_ __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE14__annotate_newB7v160006Em __ZNSt3__125__debug_db_invalidate_allB7v160006INS_6vectorIP9PassengerNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__14moveB7v160006INS_16reverse_iteratorIPP9PassengerEES5_EET0_T_S7_S6_ __ZNSt3__16__moveB7v160006INS_17_ClassicAlgPolicyENS_16reverse_iteratorIPP9PassengerEES6_S6_EENS_4pairIT0_T2_EES8_T1_S9_ __ZNSt3__123__dispatch_copy_or_moveB7v160006INS_17_ClassicAlgPolicyENS_11__move_loopIS1_EENS_14__move_trivialENS_16reverse_iteratorIPP9PassengerEES9_S9_EENS_4pairIT2_T4_EESB_T3_SC_ __ZNSt3__121__unwrap_and_dispatchB7v160006INS_10__overloadINS_11__move_loopINS_17_ClassicAlgPolicyEEENS_14__move_trivialEEENS_16reverse_iteratorIPP9PassengerEESB_SB_Li0EEENS_4pairIT0_T2_EESD_T1_SE_ __ZNSt3__114__unwrap_rangeB7v160006INS_16reverse_iteratorIPP9PassengerEES5_EENS_4pairIT0_S7_EET_S9_ __ZNSt3__113__unwrap_iterB7v160006INS_16reverse_iteratorIPP9PassengerEENS_18__unwrap_iter_implIS5_Lb0EEELi0EEEDTclsrT0_8__unwrapclsr3stdE7declvalIT_EEEES9_ __ZNSt3__19make_pairB7v160006INS_16reverse_iteratorIPP9PassengerEES5_EENS_4pairINS_18__unwrap_ref_decayIT_E4typeENS7_IT0_E4typeEEEOS8_OSB_ __ZNSt3__114__rewrap_rangeB7v160006INS_16reverse_iteratorIPP9PassengerEES5_EET_S6_T0_ __ZNSt3__113__rewrap_iterB7v160006INS_16reverse_iteratorIPP9PassengerEES5_NS_18__unwrap_iter_implIS5_Lb0EEEEET_S8_T0_ __ZNSt3__1neB7v160006IPP9PassengerS3_EEbRKNS_16reverse_iteratorIT_EERKNS4_IT0_EE __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE11__iter_moveB7v160006IRNS_16reverse_iteratorIPP9PassengerEEEENS_9enable_ifIXsr12is_referenceIDTdeclsr3stdE7declvalIRT_EEEEE5valueEDTclsr3stdE4movedeclsr3stdE7declvalISC_EEEEE4typeEOSB_ __ZNKSt3__116reverse_iteratorIPP9PassengerEdeB7v160006Ev __ZNSt3__116reverse_iteratorIPP9PassengerEppB7v160006Ev __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE25__validate_iter_referenceB7v160006IRNS_16reverse_iteratorIPP9PassengerEEEEvv __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIPP9PassengerEELb0EE8__unwrapB7v160006ES5_ __ZNSt3__14pairINS_16reverse_iteratorIPP9PassengerEES5_EC1B7v160006IS5_S5_LPv0EEEOT_OT0_ __ZNSt3__14pairINS_16reverse_iteratorIPP9PassengerEES5_EC2B7v160006IS5_S5_LPv0EEEOT_OT0_ __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIPP9PassengerEELb0EE8__rewrapB7v160006ES5_S5_ __ZNSt3__116reverse_iteratorIPP9PassengerEC2B7v160006ES3_ __ZNSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEED2Ev __ZNSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEE5clearB7v160006Ev __ZNKSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEE8capacityB7v160006Ev __ZNSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEE17__destruct_at_endB7v160006EPS2_ __ZNSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEE17__destruct_at_endB7v160006EPS2_NS_17integral_constantIbLb0EEE __ZNKSt3__114__split_bufferIP9PassengerRNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIPP9PassengerRNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2B7v160006IDnEEPKc __ZNSt3__117__compressed_pairINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repES5_EC1B7v160006INS_18__default_init_tagESA_EEOT_OT0_ __ZNSt3__119__debug_db_insert_cB7v160006INS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEvPT_ __ZNSt3__117__compressed_pairINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repES5_EC2B7v160006INS_18__default_init_tagESA_EEOT_OT0_ __ZNSt3__122__compressed_pair_elemINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repELi0ELb0EEC2B7v160006ENS_18__default_init_tagE __ZNSt3__122__compressed_pair_elemINS_9allocatorIcEELi1ELb1EEC2B7v160006ENS_18__default_init_tagE __ZNSt3__19allocatorIcEC2B7v160006Ev __ZNSt3__116__non_trivial_ifILb1ENS_9allocatorIcEEEC2B7v160006Ev __ZNSt3__118__constexpr_strlenB7v160006EPKc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1B7v160006EOS5_ __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2B7v160006EOS5_ __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE14__default_initB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__is_longB7v160006Ev __ZNSt3__115__debug_db_swapB7v160006INS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEvPT_S8_ __ZNSt3__117__compressed_pairINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repES5_E5firstB7v160006Ev __ZNSt3__122__compressed_pair_elemINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repELi0ELb0EE5__getB7v160006Ev __ZNKSt3__117__compressed_pairINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repES5_E5firstB7v160006Ev __ZNKSt3__122__compressed_pair_elemINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repELi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIPP7BookingNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__122__compressed_pair_elemIPP7BookingLi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE21_ConstructTransactionC1B7v160006ERS5_m __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE21_ConstructTransactionD1B7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE21_ConstructTransactionC2B7v160006ERS5_m __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE21_ConstructTransactionD2B7v160006Ev __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE11__recommendB7v160006Em __ZNSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEEC1EmmS5_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE26__swap_out_circular_bufferERNS_14__split_bufferIS2_RS4_EE __ZNSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEED1Ev __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE8max_sizeEv __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE20__throw_length_errorB7v160006Ev __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNKSt3__19allocatorIP7BookingE8max_sizeB7v160006Ev __ZNKSt3__117__compressed_pairIPP7BookingNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNKSt3__122__compressed_pair_elemINS_9allocatorIP7BookingEELi1ELb1EE5__getB7v160006Ev __ZNSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEEC2EmmS5_ __ZNSt3__117__compressed_pairIPP7BookingRNS_9allocatorIS2_EEEC1B7v160006IDnS6_EEOT_OT0_ __ZNSt3__119__allocate_at_leastB7v160006INS_9allocatorIP7BookingEEEENS_19__allocation_resultINS_16allocator_traitsIT_E7pointerEEERS7_m __ZNSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIPP7BookingRNS_9allocatorIS2_EEEC2B7v160006IDnS6_EEOT_OT0_ __ZNSt3__122__compressed_pair_elemIRNS_9allocatorIP7BookingEELi1ELb0EEC2B7v160006IS5_vEEOT_ __ZNSt3__19allocatorIP7BookingE8allocateB7v160006Em __ZNSt3__117__compressed_pairIPP7BookingRNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemIRNS_9allocatorIP7BookingEELi1ELb0EE5__getB7v160006Ev __ZNSt3__117__compressed_pairIPP7BookingRNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__142__uninitialized_allocator_move_if_noexceptB7v160006INS_9allocatorIP7BookingEENS_16reverse_iteratorIPS3_EES7_S3_vEET1_RT_T0_SB_S8_ __ZNSt3__116reverse_iteratorIPP7BookingEC1B7v160006ES3_ __ZNKSt3__116reverse_iteratorIPP7BookingE4baseB7v160006Ev __ZNSt3__14swapB7v160006IPP7BookingEENS_9enable_ifIXaasr21is_move_constructibleIT_EE5valuesr18is_move_assignableIS5_EE5valueEvE4typeERS5_S8_ __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE14__annotate_newB7v160006Em __ZNSt3__125__debug_db_invalidate_allB7v160006INS_6vectorIP7BookingNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__14moveB7v160006INS_16reverse_iteratorIPP7BookingEES5_EET0_T_S7_S6_ __ZNSt3__16__moveB7v160006INS_17_ClassicAlgPolicyENS_16reverse_iteratorIPP7BookingEES6_S6_EENS_4pairIT0_T2_EES8_T1_S9_ __ZNSt3__123__dispatch_copy_or_moveB7v160006INS_17_ClassicAlgPolicyENS_11__move_loopIS1_EENS_14__move_trivialENS_16reverse_iteratorIPP7BookingEES9_S9_EENS_4pairIT2_T4_EESB_T3_SC_ __ZNSt3__121__unwrap_and_dispatchB7v160006INS_10__overloadINS_11__move_loopINS_17_ClassicAlgPolicyEEENS_14__move_trivialEEENS_16reverse_iteratorIPP7BookingEESB_SB_Li0EEENS_4pairIT0_T2_EESD_T1_SE_ __ZNSt3__114__unwrap_rangeB7v160006INS_16reverse_iteratorIPP7BookingEES5_EENS_4pairIT0_S7_EET_S9_ __ZNSt3__113__unwrap_iterB7v160006INS_16reverse_iteratorIPP7BookingEENS_18__unwrap_iter_implIS5_Lb0EEELi0EEEDTclsrT0_8__unwrapclsr3stdE7declvalIT_EEEES9_ __ZNSt3__19make_pairB7v160006INS_16reverse_iteratorIPP7BookingEES5_EENS_4pairINS_18__unwrap_ref_decayIT_E4typeENS7_IT0_E4typeEEEOS8_OSB_ __ZNSt3__114__rewrap_rangeB7v160006INS_16reverse_iteratorIPP7BookingEES5_EET_S6_T0_ __ZNSt3__113__rewrap_iterB7v160006INS_16reverse_iteratorIPP7BookingEES5_NS_18__unwrap_iter_implIS5_Lb0EEEEET_S8_T0_ __ZNSt3__1neB7v160006IPP7BookingS3_EEbRKNS_16reverse_iteratorIT_EERKNS4_IT0_EE __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE11__iter_moveB7v160006IRNS_16reverse_iteratorIPP7BookingEEEENS_9enable_ifIXsr12is_referenceIDTdeclsr3stdE7declvalIRT_EEEEE5valueEDTclsr3stdE4movedeclsr3stdE7declvalISC_EEEEE4typeEOSB_ __ZNKSt3__116reverse_iteratorIPP7BookingEdeB7v160006Ev __ZNSt3__116reverse_iteratorIPP7BookingEppB7v160006Ev __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE25__validate_iter_referenceB7v160006IRNS_16reverse_iteratorIPP7BookingEEEEvv __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIPP7BookingEELb0EE8__unwrapB7v160006ES5_ __ZNSt3__14pairINS_16reverse_iteratorIPP7BookingEES5_EC1B7v160006IS5_S5_LPv0EEEOT_OT0_ __ZNSt3__14pairINS_16reverse_iteratorIPP7BookingEES5_EC2B7v160006IS5_S5_LPv0EEEOT_OT0_ __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIPP7BookingEELb0EE8__rewrapB7v160006ES5_S5_ __ZNSt3__116reverse_iteratorIPP7BookingEC2B7v160006ES3_ __ZNSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEED2Ev __ZNSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEE5clearB7v160006Ev __ZNKSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEE8capacityB7v160006Ev __ZNSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEE17__destruct_at_endB7v160006EPS2_ __ZNSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEE17__destruct_at_endB7v160006EPS2_NS_17integral_constantIbLb0EEE __ZNKSt3__114__split_bufferIP7BookingRNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIPP7BookingRNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__1miB7v160006IPKP7BookingS4_EEDTmicldtfp_4baseEcldtfp0_4baseEERKNS_11__wrap_iterIT_EERKNS6_IT0_EE __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE6cbeginB7v160006Ev __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE17__destruct_at_endB7v160006EPS2_ __ZNSt3__14moveB7v160006IPP7BookingS3_EET0_T_S5_S4_ __ZNSt3__16vectorIP7BookingNS_9allocatorIS2_EEE27__invalidate_iterators_pastB7v160006EPS2_ __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE17__annotate_shrinkB7v160006Em __ZNSt3__16__moveB7v160006INS_17_ClassicAlgPolicyEPP7BookingS4_S4_EENS_4pairIT0_T2_EES6_T1_S7_ __ZNSt3__123__dispatch_copy_or_moveB7v160006INS_17_ClassicAlgPolicyENS_11__move_loopIS1_EENS_14__move_trivialEPP7BookingS7_S7_EENS_4pairIT2_T4_EES9_T3_SA_ __ZNSt3__121__unwrap_and_dispatchB7v160006INS_10__overloadINS_11__move_loopINS_17_ClassicAlgPolicyEEENS_14__move_trivialEEEPP7BookingS9_S9_Li0EEENS_4pairIT0_T2_EESB_T1_SC_ __ZNSt3__114__unwrap_rangeB7v160006IPP7BookingS3_EENS_4pairIT0_S5_EET_S7_ __ZNKSt3__114__move_trivialclB7v160006IP7BookingS3_Li0EEENS_4pairIPT_PT0_EES6_S6_S8_ __ZNSt3__113__unwrap_iterB7v160006IPP7BookingNS_18__unwrap_iter_implIS3_Lb1EEELi0EEEDTclsrT0_8__unwrapclsr3stdE7declvalIT_EEEES7_ __ZNSt3__19make_pairB7v160006IPP7BookingS3_EENS_4pairINS_18__unwrap_ref_decayIT_E4typeENS5_IT0_E4typeEEEOS6_OS9_ __ZNSt3__114__rewrap_rangeB7v160006IPP7BookingS3_EET_S4_T0_ __ZNSt3__113__rewrap_iterB7v160006IPP7BookingS3_NS_18__unwrap_iter_implIS3_Lb1EEEEET_S6_T0_ __ZNSt3__119__copy_trivial_implB7v160006IP7BookingS2_EENS_4pairIPT_PT0_EES5_S5_S7_ __ZNSt3__19make_pairB7v160006IRPP7BookingS3_EENS_4pairINS_18__unwrap_ref_decayIT_E4typeENS6_IT0_E4typeEEEOS7_OSA_ __ZNSt3__14pairIPP7BookingS3_EC1B7v160006IRS3_S3_LPv0EEEOT_OT0_ __ZNSt3__14pairIPP7BookingS3_EC2B7v160006IRS3_S3_LPv0EEEOT_OT0_ __ZNSt3__118__unwrap_iter_implIPP7BookingLb1EE8__unwrapB7v160006ES3_ __ZNSt3__14pairIPP7BookingS3_EC1B7v160006IS3_S3_LPv0EEEOT_OT0_ __ZNSt3__14pairIPP7BookingS3_EC2B7v160006IS3_S3_LPv0EEEOT_OT0_ __ZNSt3__118__unwrap_iter_implIPP7BookingLb1EE8__rewrapB7v160006ES3_S3_ __ZNSt3__111__wrap_iterIPKP7BookingEC2B7v160006IPS2_EERKNS0_IT_EEPNS_9enable_ifIXsr14is_convertibleIS8_S4_EE5valueEvE4typeE __ZNSt3__124__put_character_sequenceB7v160006IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m __ZNKSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentrycvbB7v160006Ev __ZNSt3__116__pad_and_outputB7v160006IcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_ __ZNSt3__119ostreambuf_iteratorIcNS_11char_traitsIcEEEC1B7v160006ERNS_13basic_ostreamIcS2_EE __ZNKSt3__18ios_base5flagsB7v160006Ev __ZNKSt3__19basic_iosIcNS_11char_traitsIcEEE4fillB7v160006Ev __ZNKSt3__119ostreambuf_iteratorIcNS_11char_traitsIcEEE6failedB7v160006Ev __ZNSt3__19basic_iosIcNS_11char_traitsIcEEE8setstateB7v160006Ej __ZNKSt3__18ios_base5widthB7v160006Ev __ZNSt3__115basic_streambufIcNS_11char_traitsIcEEE5sputnB7v160006EPKcl __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1B7v160006Emc __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4dataB7v160006Ev __ZNSt3__18ios_base5widthB7v160006El __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2B7v160006Emc __ZNSt3__112__to_addressB7v160006IKcEEPT_S3_ __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE13__get_pointerB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE18__get_long_pointerB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE19__get_short_pointerB7v160006Ev __ZNSt3__114pointer_traitsIPKcE10pointer_toB7v160006ERS1_ __ZNSt3__119ostreambuf_iteratorIcNS_11char_traitsIcEEEC2B7v160006ERNS_13basic_ostreamIcS2_EE __ZNKSt3__19basic_iosIcNS_11char_traitsIcEEE5rdbufB7v160006Ev __ZNKSt3__18ios_base5rdbufB7v160006Ev __ZNKSt3__19basic_iosIcNS_11char_traitsIcEEE5widenB7v160006Ec __ZNSt3__19use_facetB7v160006INS_5ctypeIcEEEERKT_RKNS_6localeE __ZNKSt3__15ctypeIcE5widenB7v160006Ec __ZNSt3__18ios_base8setstateB7v160006Ej __ZNKSt3__16vectorIP6FlightNS_9allocatorIS2_EEE11__make_iterB7v160006EPKS2_ __ZNSt3__111__wrap_iterIPKP6FlightEC1B7v160006EPKvS4_ __ZNSt3__111__wrap_iterIPKP6FlightEC2B7v160006EPKvS4_ __ZNKSt3__16vectorIP9PassengerNS_9allocatorIS2_EEE11__make_iterB7v160006EPKS2_ __ZNSt3__111__wrap_iterIPKP9PassengerEC1B7v160006EPKvS4_ __ZNSt3__111__wrap_iterIPKP9PassengerEC2B7v160006EPKvS4_ __ZNKSt3__16vectorIP7BookingNS_9allocatorIS2_EEE11__make_iterB7v160006EPKS2_ __ZNSt3__111__wrap_iterIPKP7BookingEC1B7v160006EPKvS4_ __ZNSt3__111__wrap_iterIPKP7BookingEC2B7v160006EPKvS4_ __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4sizeB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE15__get_long_sizeB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE16__get_short_sizeB7v160006Ev __ZNSt3__118__constexpr_memcmpB7v160006IcEEiPKT_S3_m __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5emptyB7v160006Ev __ZNSt3__1lsB7v160006IcNS_11char_traitsIcEENS_9allocatorIcEEEERNS_13basic_ostreamIT_T0_EES9_RKNS_12basic_stringIS6_S7_T1_EE __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEEC1B7v160006Ev __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE9push_backB7v160006EOS1_ __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEEixB7v160006Em __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEEC2B7v160006Ev __ZNSt3__117__compressed_pairIP4SeatNS_9allocatorIS1_EEEC1B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__119__debug_db_insert_cB7v160006INS_6vectorI4SeatNS_9allocatorIS2_EEEEEEvPT_ __ZNSt3__117__compressed_pairIP4SeatNS_9allocatorIS1_EEEC2B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__122__compressed_pair_elemIP4SeatLi0ELb0EEC2B7v160006IDnvEEOT_ __ZNSt3__122__compressed_pair_elemINS_9allocatorI4SeatEELi1ELb1EEC2B7v160006ENS_18__default_init_tagE __ZNSt3__19allocatorI4SeatEC2B7v160006Ev __ZNSt3__116__non_trivial_ifILb1ENS_9allocatorI4SeatEEEC2B7v160006Ev __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIP4SeatNS_9allocatorIS1_EEE5firstB7v160006Ev __ZNSt3__122__compressed_pair_elemIP4SeatLi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE21_ConstructTransactionC1B7v160006ERS4_m __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE21_ConstructTransactionD1B7v160006Ev __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE21_ConstructTransactionC2B7v160006ERS4_m __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE21_ConstructTransactionD2B7v160006Ev __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE11__recommendB7v160006Em __ZNSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEEC1EmmS4_ __ZNSt3__16vectorI4SeatNS_9allocatorIS1_EEE26__swap_out_circular_bufferERNS_14__split_bufferIS1_RS3_EE __ZNSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEED1Ev __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE8max_sizeEv __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE20__throw_length_errorB7v160006Ev __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE7__allocB7v160006Ev __ZNKSt3__19allocatorI4SeatE8max_sizeB7v160006Ev __ZNKSt3__117__compressed_pairIP4SeatNS_9allocatorIS1_EEE6secondB7v160006Ev __ZNKSt3__122__compressed_pair_elemINS_9allocatorI4SeatEELi1ELb1EE5__getB7v160006Ev __ZNSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEEC2EmmS4_ __ZNSt3__117__compressed_pairIP4SeatRNS_9allocatorIS1_EEEC1B7v160006IDnS5_EEOT_OT0_ __ZNSt3__119__allocate_at_leastB7v160006INS_9allocatorI4SeatEEEENS_19__allocation_resultINS_16allocator_traitsIT_E7pointerEEERS6_m __ZNSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEE7__allocB7v160006Ev __ZNSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIP4SeatRNS_9allocatorIS1_EEEC2B7v160006IDnS5_EEOT_OT0_ __ZNSt3__122__compressed_pair_elemIRNS_9allocatorI4SeatEELi1ELb0EEC2B7v160006IS4_vEEOT_ __ZNSt3__19allocatorI4SeatE8allocateB7v160006Em __ZNSt3__117__compressed_pairIP4SeatRNS_9allocatorIS1_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemIRNS_9allocatorI4SeatEELi1ELb0EE5__getB7v160006Ev __ZNSt3__117__compressed_pairIP4SeatRNS_9allocatorIS1_EEE5firstB7v160006Ev __ZNSt3__142__uninitialized_allocator_move_if_noexceptB7v160006INS_9allocatorI4SeatEENS_16reverse_iteratorIPS2_EES6_S2_vEET1_RT_T0_SA_S7_ __ZNSt3__116reverse_iteratorIP4SeatEC1B7v160006ES2_ __ZNKSt3__116reverse_iteratorIP4SeatE4baseB7v160006Ev __ZNSt3__14swapB7v160006IP4SeatEENS_9enable_ifIXaasr21is_move_constructibleIT_EE5valuesr18is_move_assignableIS4_EE5valueEvE4typeERS4_S7_ __ZNKSt3__16vectorI4SeatNS_9allocatorIS1_EEE14__annotate_newB7v160006Em __ZNSt3__125__debug_db_invalidate_allB7v160006INS_6vectorI4SeatNS_9allocatorIS2_EEEEEEvPT_ __ZNSt3__14moveB7v160006INS_16reverse_iteratorIP4SeatEES4_EET0_T_S6_S5_ __ZNSt3__16__moveB7v160006INS_17_ClassicAlgPolicyENS_16reverse_iteratorIP4SeatEES5_S5_EENS_4pairIT0_T2_EES7_T1_S8_ __ZNSt3__123__dispatch_copy_or_moveB7v160006INS_17_ClassicAlgPolicyENS_11__move_loopIS1_EENS_14__move_trivialENS_16reverse_iteratorIP4SeatEES8_S8_EENS_4pairIT2_T4_EESA_T3_SB_ __ZNSt3__121__unwrap_and_dispatchB7v160006INS_10__overloadINS_11__move_loopINS_17_ClassicAlgPolicyEEENS_14__move_trivialEEENS_16reverse_iteratorIP4SeatEESA_SA_Li0EEENS_4pairIT0_T2_EESC_T1_SD_ __ZNSt3__114__unwrap_rangeB7v160006INS_16reverse_iteratorIP4SeatEES4_EENS_4pairIT0_S6_EET_S8_ __ZNSt3__113__unwrap_iterB7v160006INS_16reverse_iteratorIP4SeatEENS_18__unwrap_iter_implIS4_Lb0EEELi0EEEDTclsrT0_8__unwrapclsr3stdE7declvalIT_EEEES8_ __ZNSt3__19make_pairB7v160006INS_16reverse_iteratorIP4SeatEES4_EENS_4pairINS_18__unwrap_ref_decayIT_E4typeENS6_IT0_E4typeEEEOS7_OSA_ __ZNSt3__114__rewrap_rangeB7v160006INS_16reverse_iteratorIP4SeatEES4_EET_S5_T0_ __ZNSt3__113__rewrap_iterB7v160006INS_16reverse_iteratorIP4SeatEES4_NS_18__unwrap_iter_implIS4_Lb0EEEEET_S7_T0_ __ZNSt3__1neB7v160006IP4SeatS2_EEbRKNS_16reverse_iteratorIT_EERKNS3_IT0_EE __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE11__iter_moveB7v160006IRNS_16reverse_iteratorIP4SeatEEEENS_9enable_ifIXsr12is_referenceIDTdeclsr3stdE7declvalIRT_EEEEE5valueEDTclsr3stdE4movedeclsr3stdE7declvalISB_EEEEE4typeEOSA_ __ZNKSt3__116reverse_iteratorIP4SeatEdeB7v160006Ev __ZNSt3__116reverse_iteratorIP4SeatEppB7v160006Ev __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE25__validate_iter_referenceB7v160006IRNS_16reverse_iteratorIP4SeatEEEEvv __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIP4SeatEELb0EE8__unwrapB7v160006ES4_ __ZNSt3__14pairINS_16reverse_iteratorIP4SeatEES4_EC1B7v160006IS4_S4_LPv0EEEOT_OT0_ __ZNSt3__14pairINS_16reverse_iteratorIP4SeatEES4_EC2B7v160006IS4_S4_LPv0EEEOT_OT0_ __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIP4SeatEELb0EE8__rewrapB7v160006ES4_S4_ __ZNSt3__116reverse_iteratorIP4SeatEC2B7v160006ES2_ __ZNSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEED2Ev __ZNSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEE5clearB7v160006Ev __ZNKSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEE8capacityB7v160006Ev __ZNSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEE17__destruct_at_endB7v160006EPS1_ __ZNSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEE17__destruct_at_endB7v160006EPS1_NS_17integral_constantIbLb0EEE __ZNKSt3__114__split_bufferI4SeatRNS_9allocatorIS1_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIP4SeatRNS_9allocatorIS1_EEE5firstB7v160006Ev GCC_except_table32 GCC_except_table36 GCC_except_table69 GCC_except_table84 GCC_except_table87 GCC_except_table108 GCC_except_table116 GCC_except_table124 GCC_except_table132 GCC_except_table146 GCC_except_table149 GCC_except_table155 GCC_except_table169 GCC_except_table172 GCC_except_table178 GCC_except_table192 GCC_except_table195 GCC_except_table211 GCC_except_table212 GCC_except_table225 GCC_except_table238 GCC_except_table271 GCC_except_table282 GCC_except_table286 GCC_except_table290 GCC_except_table291 GCC_except_table304 GCC_except_table337 GCC_except_table348 GCC_except_table352 GCC_except_table357 GCC_except_table366 GCC_except_table375 GCC_except_table376 GCC_except_table389 GCC_except_table422 GCC_except_table433 GCC_except_table437 GCC_except_table442 GCC_except_table454 GCC_except_table464 GCC_except_table466 GCC_except_table483 GCC_except_table488 GCC_except_table502 GCC_except_table0 GCC_except_table9 GCC_except_table24 GCC_except_table26 GCC_except_table43 GCC_except_table48 GCC_except_table11 GCC_except_table12 GCC_except_table14 GCC_except_table42 GCC_except_table47 GCC_except_table0 GCC_except_table19 GCC_except_table28 GCC_except_table42 GCC_except_table45 GCC_except_table55 GCC_except_table56 GCC_except_table69 GCC_except_table82 GCC_except_table115 GCC_except_table126 GCC_except_table130 GCC_except_table133 GCC_except_table134 GCC_except_table136 GCC_except_table163 GCC_except_table168 GCC_except_table0 GCC_except_table10 GCC_except_table11 GCC_except_table13 GCC_except_table41 GCC_except_table46            ���  ;          ��  '       g   X       & Z                                         �,       airline_system �w��p�rab�[�c
���y�{�D�O:̞ҭ��Xo��f����kOX�|�|z�ڽ�H�,����Xo��f����kOX�|�|z�ڽ�H�,�?�``
& ����1a�V���lO�ŋI�p?��3�cJD�C�<��T]��l�W��K@��>���^� P��$�U�Q�<��T�r	mE�Ս��]w�V����`���vC,͑��m�s��_�݋����0kx�C4~f�N�:��j1²!���8�2��2�7<�����c.�,�<Zt�4xA����Q:ɸq����U��'�V��-�S�뒦f���>ˑ��Ѯ�EA)K�
�6ΗXM��h� .#����T��y�w��q�wZ'�v{�sJ�워:���V���|"� "L������I~��ӟ�7�w��5��-�7凼�J�q%���j]��-�_%����yT!>��v�� �flc�b�.�L���*���?L҂�:x�-cU#�V,�E���06�<ۗ�#�`Ī�X`�`�x#�1浰KG���Xo��f����kOX�|�|z�ڽ�H�,����Xo��f����kOX�|�|z�ڽ�H�,����Xo��f����kOX�|�|z�ڽ�H�,�BƢ?�U(	�o���2b���NN�̘U�澔��OG�����3� K��q�w;l����`?� E�!�ה�A�D�%˃�<0�Nf�g�wH3��妼�s,Od>s�dxN�����w�+�F�O6�y�
Ң�Q�!96n�r��G)�Խ���_u�6��li��=-��0�?��2��.��Ф	8�)���y�*E�c4����"�p�!
c��Uӈy<Fq��/д�E3��^n +KZ�:��k�#+hp-�}���$.pPByR����6؁���VgHt;��r�Zi�����Q] �`�zpx�tW�Cg���u��2�����H��upP����b_� #���O3�H�ɮ��"�~.eY�9��`C�qsa�M��4��;�x�xm�By�;�r��;�3a0��._bq���D2/ɢ{��LT�i u�{ױ�'	�k��G\�U����K��͵�
���X�N��ࠐO��`X�?��A��8��^T���\�^zҽ   ���1\���(u3�ޑ#bI��.���G�Y�VN�?8�ڟ$�W���D������     
```

</details>

<details><summary><b>golang</b> (13 files)</summary>


**README.md**

```md
# Designing an Airline Management System

## Requirements
1. The airline management system should allow users to search for flights based on source, destination, and date.
2. Users should be able to book flights, select seats, and make payments.
3. The system should manage flight schedules, aircraft assignments, and crew assignments.
4. The system should handle passenger information, including personal details and baggage information.
5. The system should support different types of users, such as passengers, airline staff, and administrators.
6. The system should be able to handle cancellations, refunds, and flight changes.
7. The system should ensure data consistency and handle concurrent access to shared resources.
8. The system should be scalable and extensible to accommodate future enhancements and new features.

## Classes, Interfaces and Enumerations
1. The **Flight** class represents a flight in the airline management system, with properties such as flight number, source, destination, departure time, arrival time, and available seats.
2. The **Aircraft** class represents an aircraft, with properties like tail number, model, and total seats.
3. The **Passenger** class represents a passenger, with properties such as ID, name, email, and phone number.
4. The **Booking** class represents a booking made by a passenger for a specific flight and seat, with properties such as booking number, flight, passenger, seat, price, and booking status.
5. The **Seat** class represents a seat on a flight, with properties like seat number, seat type, and seat status.
6. The **Payment** class represents a payment made for a booking, with properties such as payment ID, payment method, amount, and payment status.
7. The **FlightSearch** class provides functionality to search for flights based on source, destination, and date.
8. The **BookingManager** class manages the creation and cancellation of bookings. It follows the Singleton pattern to ensure a single instance of the booking manager.
9. The **PaymentProcessor** class handles the processing of payments. It follows the Singleton pattern to ensure a single instance of the payment processor.
10. The **AirlineManagementSystem** class serves as the main entry point of the system, combining all the components and providing methods for flight management, booking, payment processing, and other operations.
```


**aircraft.go**

```go
package airlinemanagementsystem

type Aircraft struct {
	TailNumber string
	Model      string
	TotalSeats int
}

func NewAircraft(tailNumber, model string, totalSeats int) *Aircraft {
	return &Aircraft{
		TailNumber: tailNumber,
		Model:      model,
		TotalSeats: totalSeats,
	}
}
```


**airline_management_system.go**

```go
package airlinemanagementsystem

import (
    "sync"
    "time"
)

type AirlineManagementSystem struct {
    flights         []*Flight
    aircrafts       []*Aircraft
    flightSearch    *FlightSearch
    bookingManager  *BookingManager
    paymentProcessor *PaymentProcessor
    mu              sync.RWMutex
}

func NewAirlineManagementSystem() *AirlineManagementSystem {
    system := &AirlineManagementSystem{
        flights:          make([]*Flight, 0),
        aircrafts:        make([]*Aircraft, 0),
        bookingManager:   GetBookingManager(),
        paymentProcessor: GetPaymentProcessor(),
    }
    system.flightSearch = NewFlightSearch(system.flights)
    return system
}

func (ams *AirlineManagementSystem) AddFlight(flight *Flight) {
    ams.mu.Lock()
    defer ams.mu.Unlock()
    ams.flights = append(ams.flights, flight)
}

func (ams *AirlineManagementSystem) AddAircraft(aircraft *Aircraft) {
    ams.mu.Lock()
    defer ams.mu.Unlock()
    ams.aircrafts = append(ams.aircrafts, aircraft)
}

func (ams *AirlineManagementSystem) SearchFlights(source, destination string, date time.Time) []*Flight {
    return ams.flightSearch.SearchFlights(source, destination, date)
}

func (ams *AirlineManagementSystem) BookFlight(flight *Flight, passenger *Passenger, seat *Seat, price float64) *Booking {
    return ams.bookingManager.CreateBooking(flight, passenger, seat, price)
}

func (ams *AirlineManagementSystem) CancelBooking(bookingNumber string) {
    ams.bookingManager.CancelBooking(bookingNumber)
}

func (ams *AirlineManagementSystem) ProcessPayment(payment *Payment) {
    ams.paymentProcessor.ProcessPayment(payment)
}
```


**airline_management_system_demo.go**

```go
package airlinemanagementsystem

import (
	"fmt"
	"time"
)

type Demo struct {
	system *AirlineManagementSystem
}

func NewDemo() *Demo {
	return &Demo{
		system: NewAirlineManagementSystem(),
	}
}

func Run() {
	system := NewAirlineManagementSystem()

	// Create users
	passenger1 := NewPassenger(
		"U001",
		"John Doe",
		"john@example.com",
		"1234567890",
	)

	// Create flights
	departureTime1 := time.Now().AddDate(0, 0, 1)
	arrivalTime1 := departureTime1.Add(2 * time.Hour)
	flight1 := NewFlight(
		"F001",
		"New York",
		"London",
		departureTime1,
		arrivalTime1,
	)

	departureTime2 := time.Now().AddDate(0, 0, 3)
	arrivalTime2 := departureTime2.Add(5 * time.Hour)
	flight2 := NewFlight(
		"F002",
		"Paris",
		"Tokyo",
		departureTime2,
		arrivalTime2,
	)

	system.AddFlight(flight1)
	system.AddFlight(flight2)

	// Create aircrafts
	aircraft1 := NewAircraft("A001", "Boeing 747", 300)
	aircraft2 := NewAircraft("A002", "Airbus A380", 500)

	system.AddAircraft(aircraft1)
	system.AddAircraft(aircraft2)

	// Search flights
	searchDate := time.Now().AddDate(0, 0, 1)
	searchResults := system.SearchFlights("New York", "London", searchDate)

	fmt.Println("Search Results:")
	for _, flight := range searchResults {
		fmt.Printf("Flight: %s - %s to %s\n",
			flight.FlightNumber,
			flight.Source,
			flight.Destination,
		)
	}

	// Create seat
	seat := NewSeat("25A", SeatTypeEconomy)

	// Book a flight
	booking := system.BookFlight(flight1, passenger1, seat, 100.0)
	if booking != nil {
		fmt.Printf("Booking successful. Booking ID: %s\n", booking.BookingNumber)
	} else {
		fmt.Println("Booking failed.")
	}

	// Cancel the booking
	system.CancelBooking(booking.BookingNumber)
	fmt.Println("Booking cancelled.")
}
```


**booking.go**

```go
package airlinemanagementsystem

import "sync"

type Booking struct {
	BookingNumber string
	Flight        *Flight
	Passenger     *Passenger
	Seat          *Seat
	Price         float64
	Status        BookingStatus
	mu            sync.RWMutex
}

func NewBooking(bookingNumber string, flight *Flight, passenger *Passenger, seat *Seat, price float64) *Booking {
	return &Booking{
		BookingNumber: bookingNumber,
		Flight:        flight,
		Passenger:     passenger,
		Seat:          seat,
		Price:         price,
		Status:        BookingStatusConfirmed,
	}
}

func (b *Booking) Cancel() {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.Status = BookingStatusCancelled
}
```


**booking_manager.go**

```go
package airlinemanagementsystem

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

type BookingManager struct {
	bookings       map[string]*Booking
	bookingCounter int64
	mu             sync.RWMutex
}

var (
	bookingManager *BookingManager
	bookingOnce    sync.Once
)

func GetBookingManager() *BookingManager {
	bookingOnce.Do(func() {
		bookingManager = &BookingManager{
			bookings: make(map[string]*Booking),
		}
	})
	return bookingManager
}

func (bm *BookingManager) CreateBooking(flight *Flight, passenger *Passenger, seat *Seat, price float64) *Booking {
	bm.mu.Lock()
	defer bm.mu.Unlock()

	bookingNumber := bm.generateBookingNumber()
	booking := NewBooking(bookingNumber, flight, passenger, seat, price)
	bm.bookings[bookingNumber] = booking
	return booking
}

func (bm *BookingManager) CancelBooking(bookingNumber string) {
	bm.mu.Lock()
	defer bm.mu.Unlock()

	if booking, exists := bm.bookings[bookingNumber]; exists {
		booking.Cancel()
	}
}

func (bm *BookingManager) generateBookingNumber() string {
	counter := atomic.AddInt64(&bm.bookingCounter, 1)
	return fmt.Sprintf("BKG%s%06d",
		time.Now().Format("20060102150405"),
		counter)
}
```


**flight.go**

```go
package airlinemanagementsystem

import (
	"sync"
	"time"
)

type Flight struct {
	FlightNumber   string
	Source         string
	Destination    string
	DepartureTime  time.Time
	ArrivalTime    time.Time
	AvailableSeats []*Seat
	mu             sync.RWMutex
}

func NewFlight(flightNumber, source, destination string, departureTime, arrivalTime time.Time) *Flight {
	return &Flight{
		FlightNumber:   flightNumber,
		Source:         source,
		Destination:    destination,
		DepartureTime:  departureTime,
		ArrivalTime:    arrivalTime,
		AvailableSeats: make([]*Seat, 0),
	}
}
```


**flight_search.go**

```go
package airlinemanagementsystem

import (
	"strings"
	"sync"
	"time"
)

type FlightSearch struct {
	flights []*Flight
	mu      sync.RWMutex
}

func NewFlightSearch(flights []*Flight) *FlightSearch {
	return &FlightSearch{
		flights: flights,
	}
}

func (fs *FlightSearch) SearchFlights(source, destination string, date time.Time) []*Flight {
	fs.mu.RLock()
	defer fs.mu.RUnlock()

	var results []*Flight
	source = strings.ToLower(source)
	destination = strings.ToLower(destination)

	for _, flight := range fs.flights {
		if strings.ToLower(flight.Source) == source &&
			strings.ToLower(flight.Destination) == destination &&
			flight.DepartureTime.Year() == date.Year() &&
			flight.DepartureTime.Month() == date.Month() &&
			flight.DepartureTime.Day() == date.Day() {
			results = append(results, flight)
		}
	}
	return results
}
```


**passenger.go**

```go
package airlinemanagementsystem

type Passenger struct {
	ID    string
	Name  string
	Email string
	Phone string
}

func NewPassenger(id, name, email, phone string) *Passenger {
	return &Passenger{
		ID:    id,
		Name:  name,
		Email: email,
		Phone: phone,
	}
}
```


**payment.go**

```go
package airlinemanagementsystem

import "sync"

type Payment struct {
	PaymentID     string
	PaymentMethod string
	Amount        float64
	status        PaymentStatus
	mu            sync.RWMutex
}

func NewPayment(paymentID, paymentMethod string, amount float64) *Payment {
	return &Payment{
		PaymentID:     paymentID,
		PaymentMethod: paymentMethod,
		Amount:        amount,
		status:        PaymentStatusPending,
	}
}

func (p *Payment) ProcessPayment() {
	p.mu.Lock()
	defer p.mu.Unlock()
	p.status = PaymentStatusCompleted
}
```


**payment_processor.go**

```go
package airlinemanagementsystem

import "sync"

type PaymentProcessor struct {
	mu sync.Mutex
}

var (
	paymentProcessor *PaymentProcessor
	paymentOnce      sync.Once
)

func GetPaymentProcessor() *PaymentProcessor {
	paymentOnce.Do(func() {
		paymentProcessor = &PaymentProcessor{}
	})
	return paymentProcessor
}

func (p *PaymentProcessor) ProcessPayment(payment *Payment) {
	p.mu.Lock()
	defer p.mu.Unlock()
	payment.ProcessPayment()
}
```


**seat.go**

```go
package airlinemanagementsystem

import "sync"

type Seat struct {
	SeatNumber string
	Type       SeatType
	status     SeatStatus
	mu         sync.RWMutex
}

func NewSeat(seatNumber string, seatType SeatType) *Seat {
	return &Seat{
		SeatNumber: seatNumber,
		Type:       seatType,
		status:     SeatStatusAvailable,
	}
}

func (s *Seat) Reserve() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.status = SeatStatusReserved
}

func (s *Seat) Release() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.status = SeatStatusAvailable
}

func (s *Seat) GetStatus() SeatStatus {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.status
}
```


**types.go**

```go
package airlinemanagementsystem

type SeatType int
type SeatStatus int
type BookingStatus int
type PaymentStatus int

const (
	SeatTypeEconomy SeatType = iota
	SeatTypePremiumEconomy
	SeatTypeBusiness
	SeatTypeFirstClass
)

const (
	SeatStatusAvailable SeatStatus = iota
	SeatStatusReserved
	SeatStatusOccupied
)

const (
	BookingStatusConfirmed BookingStatus = iota
	BookingStatusCancelled
	BookingStatusPending
	BookingStatusExpired
)

const (
	PaymentStatusPending PaymentStatus = iota
	PaymentStatusCompleted
	PaymentStatusFailed
	PaymentStatusRefunded
)
```

</details>

<details><summary><b>csharp</b> (16 files)</summary>


**Aircraft.cs**

```cs
namespace AirlineManagementSystem
{
    public class Aircraft
    {
        public string TailNumber { get; }
        public string Model { get; }
        public int TotalSeats { get; }

        public Aircraft(string tailNumber, string model, int totalSeats)
        {
            TailNumber = tailNumber;
            Model = model;
            TotalSeats = totalSeats;
        }
    }
}
```


**AirlineManagementSystem.cs**

```cs
using System;
using System.Collections.Generic;
using System.Linq;

namespace AirlineManagementSystem
{
    public class AirlineManagementSystem
    {
        private readonly List<Flight> flights;
        private readonly List<Aircraft> aircrafts;
        private readonly FlightSearch flightSearch;
        private readonly BookingManager bookingManager;
        private readonly PaymentProcessor paymentProcessor;

        public AirlineManagementSystem()
        {
            flights = new List<Flight>();
            aircrafts = new List<Aircraft>();
            flightSearch = new FlightSearch(flights);
            bookingManager = BookingManager.Instance;
            paymentProcessor = PaymentProcessor.Instance;
        }

        public void AddFlight(Flight flight)
        {
            flights.Add(flight);
        }

        public void AddAircraft(Aircraft aircraft)
        {
            aircrafts.Add(aircraft);
        }

        public List<Flight> SearchFlights(string source, string destination, DateTime date)
        {
            return flightSearch.SearchFlights(source, destination, date);
        }

        public Booking BookFlight(Flight flight, Passenger passenger, Seat seat, double price)
        {
            return bookingManager.CreateBooking(flight, passenger, seat, price);
        }

        public void CancelBooking(string bookingNumber)
        {
            bookingManager.CancelBooking(bookingNumber);
        }

        public void ProcessPayment(Payment payment)
        {
            paymentProcessor.ProcessPayment(payment);
        }
    }
}
```


**AirlineManagementSystemDemo.cs**

```cs
using System;
using System.Collections.Generic;

namespace AirlineManagementSystem
{
    public class AirlineManagementSystemDemo
    {
        public static void Run()
        {
            var airlineManagementSystem = new AirlineManagementSystem();

            // Create users
            var passenger1 = new Passenger("U001", "John Doe", "john@example.com", "1234567890");

            // Create flights
            var departureTime1 = DateTime.Now.AddDays(1);
            var arrivalTime1 = departureTime1.AddHours(2);
            var flight1 = new Flight("F001", "New York", "London", departureTime1, arrivalTime1);

            var departureTime2 = DateTime.Now.AddDays(3);
            var arrivalTime2 = departureTime2.AddHours(5);
            var flight2 = new Flight("F002", "Paris", "Tokyo", departureTime2, arrivalTime2);

            airlineManagementSystem.AddFlight(flight1);
            airlineManagementSystem.AddFlight(flight2);

            // Create aircrafts
            var aircraft1 = new Aircraft("A001", "Boeing 747", 300);
            var aircraft2 = new Aircraft("A002", "Airbus A380", 500);
            airlineManagementSystem.AddAircraft(aircraft1);
            airlineManagementSystem.AddAircraft(aircraft2);

            // Search flights
            var searchResults = airlineManagementSystem.SearchFlights("New York", "London", DateTime.Now.AddDays(1));
            Console.WriteLine("Search Results:");
            foreach (var flight in searchResults)
            {
                Console.WriteLine($"Flight: {flight.FlightNumber} - {flight.Source} to {flight.Destination}");
            }

            var seat = new Seat("25A", SeatType.ECONOMY);

            // Book a flight
            var booking = airlineManagementSystem.BookFlight(flight1, passenger1, seat, 100);
            if (booking != null)
            {
                Console.WriteLine("Booking successful. Booking ID: " + booking.BookingNumber);
            }
            else
            {
                Console.WriteLine("Booking failed.");
            }

            // Cancel a booking
            airlineManagementSystem.CancelBooking(booking.BookingNumber);
            Console.WriteLine("Booking cancelled.");
        }
    }
}
```


**Booking.cs**

```cs
using System;

namespace AirlineManagementSystem
{
    public class Booking
    {
        public string BookingNumber { get; }
        public Flight Flight { get; }
        public Passenger Passenger { get; }
        public Seat Seat { get; }
        public double Price { get; }
        public BookingStatus Status { get; private set; }

        public Booking(string bookingNumber, Flight flight, Passenger passenger, Seat seat, double price)
        {
            BookingNumber = bookingNumber;
            Flight = flight;
            Passenger = passenger;
            Seat = seat;
            Price = price;
            Status = BookingStatus.CONFIRMED;
        }

        public void Cancel()
        {
            Status = BookingStatus.CANCELLED;
        }
    }
}
```


**BookingManager.cs**

```cs
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;

namespace AirlineManagementSystem
{
    public class BookingManager
    {
        private static BookingManager instance;
        private readonly Dictionary<string, Booking> bookings = new Dictionary<string, Booking>();
        private readonly object lockObject = new object();
        private static int bookingCounter = 0;

        private BookingManager() { }

        public static BookingManager Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new BookingManager();
                }
                return instance;
            }
        }

        public Booking CreateBooking(Flight flight, Passenger passenger, Seat seat, double price)
        {
            string bookingNumber = GenerateBookingNumber();
            var booking = new Booking(bookingNumber, flight, passenger, seat, price);
            lock (lockObject)
            {
                bookings[bookingNumber] = booking;
            }
            return booking;
        }

        public void CancelBooking(string bookingNumber)
        {
            lock (lockObject)
            {
                if (bookings.TryGetValue(bookingNumber, out var booking))
                {
                    booking.Cancel();
                }
            }
        }

        private string GenerateBookingNumber()
        {
            int bookingId = Interlocked.Increment(ref bookingCounter);
            string timestamp = DateTime.Now.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture);
            return $"BKG{timestamp}{bookingId:D6}";
        }
    }
}
```


**BookingStatus.cs**

```cs
namespace AirlineManagementSystem
{
    public enum BookingStatus
    {
        CONFIRMED,
        CANCELLED,
        PENDING,
        EXPIRED
    }
}
```


**Flight.cs**

```cs
using System;
using System.Collections.Generic;

namespace AirlineManagementSystem
{
    public class Flight
    {
        public string FlightNumber { get; }
        public string Source { get; }
        public string Destination { get; }
        public DateTime DepartureTime { get; }
        public DateTime ArrivalTime { get; }
        public List<Seat> AvailableSeats { get; }

        public Flight(string flightNumber, string source, string destination, DateTime departureTime, DateTime arrivalTime)
        {
            FlightNumber = flightNumber;
            Source = source;
            Destination = destination;
            DepartureTime = departureTime;
            ArrivalTime = arrivalTime;
            AvailableSeats = new List<Seat>();
        }
    }
}
```


**FlightSearch.cs**

```cs
using System;
using System.Collections.Generic;
using System.Linq;

namespace AirlineManagementSystem
{
    public class FlightSearch
    {
        private readonly List<Flight> flights;

        public FlightSearch(List<Flight> flights)
        {
            this.flights = flights;
        }

        public List<Flight> SearchFlights(string source, string destination, DateTime date)
        {
            return flights.Where(flight => flight.Source.Equals(source, StringComparison.OrdinalIgnoreCase)
                                           && flight.Destination.Equals(destination, StringComparison.OrdinalIgnoreCase)
                                           && flight.DepartureTime.Date == date.Date).ToList();
        }
    }
}
```


**Passenger.cs**

```cs
namespace AirlineManagementSystem
{
    public class Passenger
    {
        public string Id { get; }
        public string Name { get; }
        public string Email { get; }
        public string Phone { get; }

        public Passenger(string id, string name, string email, string phone)
        {
            Id = id;
            Name = name;
            Email = email;
            Phone = phone;
        }
    }
}
```


**Payment.cs**

```cs
namespace AirlineManagementSystem
{
    public class Payment
    {
        public string PaymentId { get; }
        public string PaymentMethod { get; }
        public double Amount { get; }
        public PaymentStatus Status { get; private set; }

        public Payment(string paymentId, string paymentMethod, double amount)
        {
            PaymentId = paymentId;
            PaymentMethod = paymentMethod;
            Amount = amount;
            Status = PaymentStatus.PENDING;
        }

        public void ProcessPayment()
        {
            // Process payment logic here
            Status = PaymentStatus.COMPLETED;
        }
    }
}
```


**PaymentProcessor.cs**

```cs
namespace AirlineManagementSystem
{
    public class PaymentProcessor
    {
        private static PaymentProcessor instance;

        private PaymentProcessor() { }

        public static PaymentProcessor Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new PaymentProcessor();
                }
                return instance;
            }
        }

        public void ProcessPayment(Payment payment)
        {
            payment.ProcessPayment();
        }
    }
}
```


**PaymentStatus.cs**

```cs
namespace AirlineManagementSystem
{
    public enum PaymentStatus
    {
        PENDING,
        COMPLETED,
        FAILED,
        REFUNDED
    }
}
```


**README.md**

```md
# Designing an Airline Management System

## Requirements
1. The airline management system should allow users to search for flights based on source, destination, and date.
2. Users should be able to book flights, select seats, and make payments.
3. The system should manage flight schedules, aircraft assignments, and crew assignments.
4. The system should handle passenger information, including personal details and baggage information.
5. The system should support different types of users, such as passengers, airline staff, and administrators.
6. The system should be able to handle cancellations, refunds, and flight changes.
7. The system should ensure data consistency and handle concurrent access to shared resources.
8. The system should be scalable and extensible to accommodate future enhancements and new features.

## Classes, Interfaces and Enumerations
1. The **Flight** class represents a flight in the airline management system, with properties such as flight number, source, destination, departure time, arrival time, and available seats.
2. The **Aircraft** class represents an aircraft, with properties like tail number, model, and total seats.
3. The **Passenger** class represents a passenger, with properties such as ID, name, email, and phone number.
4. The **Booking** class represents a booking made by a passenger for a specific flight and seat, with properties such as booking number, flight, passenger, seat, price, and booking status.
5. The **Seat** class represents a seat on a flight, with properties like seat number, seat type, and seat status.
6. The **Payment** class represents a payment made for a booking, with properties such as payment ID, payment method, amount, and payment status.
7. The **FlightSearch** class provides functionality to search for flights based on source, destination, and date.
8. The **BookingManager** class manages the creation and cancellation of bookings. It follows the Singleton pattern to ensure a single instance of the booking manager.
9. The **PaymentProcessor** class handles the processing of payments. It follows the Singleton pattern to ensure a single instance of the payment processor.
10. The **AirlineManagementSystem** class serves as the main entry point of the system, combining all the components and providing methods for flight management, booking, payment processing, and other operations.
```


**Seat.cs**

```cs
namespace AirlineManagementSystem
{
    public class Seat
    {
        public string SeatNumber { get; }
        public SeatType Type { get; }
        public SeatStatus Status { get; private set; }

        public Seat(string seatNumber, SeatType type)
        {
            SeatNumber = seatNumber;
            Type = type;
            Status = SeatStatus.AVAILABLE;
        }

        public void Reserve()
        {
            Status = SeatStatus.RESERVED;
        }

        public void Release()
        {
            Status = SeatStatus.AVAILABLE;
        }
    }
}
```


**SeatStatus.cs**

```cs
namespace AirlineManagementSystem
{
    public enum SeatStatus
    {
        AVAILABLE,
        RESERVED,
        OCCUPIED
    }
}
```


**SeatType.cs**

```cs
namespace AirlineManagementSystem
{
    public enum SeatType
    {
        ECONOMY,
        PREMIUM_ECONOMY,
        BUSINESS,
        FIRST_CLASS
    }
}
```

</details>
