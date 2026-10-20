# Low-level design problem: concert ticket booking system

> Copied from <https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/concert-ticket-booking-system.md> (GPL-3.0, by Ashish Pratap Singh). Questions and answers are the source's own; nothing was answered or rewritten here.


# Designing a Concert Ticket Booking System

## Requirements
1. The concert ticket booking system should allow users to view available concerts and their seating arrangements.
2. Users should be able to search for concerts based on various criteria such as artist, venue, date, and time.
3. Users should be able to select seats and purchase tickets for a specific concert.
4. The system should handle concurrent booking requests to avoid double-booking of seats.
5. The system should ensure fair booking opportunities for all users.
6. The system should handle payment processing securely.
7. The system should generate booking confirmations and send them to users via email or SMS.
8. The system should provide a waiting list functionality for sold-out concerts.

## UML Class Diagram

![](images/awesome-low-level-design_class-diagrams_concertticketbookingsystem-class-diagram.png)

## Implementations
#### [Java Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/java/src/concertticketbookingsystem) 
#### [Python Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/python/concertticketbookingsystem)
#### [C++ Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/cpp/concertticketbookingsystem)
#### [C# Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/csharp/concertticketbookingsystem)
#### [Go Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/golang/concertticketbookingsystem)

## Classes, Interfaces and Enumerations
1. The **Concert** class represents a concert event, with properties such as ID, artist, venue, date and time, and a list of seats.
2. The **Seat** class represents a seat in a concert, with properties like ID, seat number, seat type, price, and status. It provides methods to book and release a seat.
3. The **SeatType** enum represents the different types of seats available, such as regular, premium, and VIP.
4. The **SeatStatus** enum represents the status of a seat, which can be available, booked, or reserved.
5. The **Booking** class represents a booking made by a user for a specific concert and seats. It contains properties such as ID, user, concert, seats, total price, and status. It provides methods to confirm and cancel a booking.
6. The **BookingStatus** enum represents the status of a booking, which can be pending, confirmed, or cancelled.
7. The **User** class represents a user of the concert ticket booking system, with properties like ID, name, and email.
8. The **ConcertTicketBookingSystem** class is the central component of the system. It follows the Singleton pattern to ensure a single instance of the system. It manages concerts, bookings, and provides methods to add concerts, search concerts, book tickets, and cancel bookings.
9. The **SeatNotAvailableException** is a custom exception used to handle cases where a seat is not available for booking.

---

## Official solutions from the repository

<details><summary><b>java</b> (11 files)</summary>


**Booking.java**

```java
package concertticketbookingsystem;

import java.util.List;

public class Booking {
    private final String id;
    private final User user;
    private final Concert concert;
    private final List<Seat> seats;
    private final double totalPrice;
    private BookingStatus status;

    public Booking(String id, User user, Concert concert, List<Seat> seats) {
        this.id = id;
        this.user = user;
        this.concert = concert;
        this.seats = seats;
        this.totalPrice = calculateTotalPrice();
        this.status = BookingStatus.PENDING;
    }

    private double calculateTotalPrice() {
        return seats.stream().mapToDouble(Seat::getPrice).sum();
    }

    public void confirmBooking() {
        if (status == BookingStatus.PENDING) {
            status = BookingStatus.CONFIRMED;
            // Send booking confirmation to the user
            // ...
        }
    }

    public void cancelBooking() {
        if (status == BookingStatus.CONFIRMED) {
            status = BookingStatus.CANCELLED;
            seats.forEach(Seat::release);
            System.out.printf("Booking %s cancelled\n", id);
            // Send booking cancellation notification to the user
            // ...
        }
    }

    public String getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Concert getConcert() {
        return concert;
    }

    public List<Seat> getSeats() {
        return seats;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public BookingStatus getStatus() {
        return status;
    }
}
```


**BookingStatus.java**

```java
package concertticketbookingsystem;

public enum BookingStatus {
    PENDING,
    CONFIRMED,
    CANCELLED
}
```


**Concert.java**

```java
package concertticketbookingsystem;

import java.time.LocalDateTime;
import java.util.List;

public class Concert {
    private final String id;
    private final String artist;
    private final String venue;
    private final LocalDateTime dateTime;
    private final List<Seat> seats;

    public Concert(String id, String artist, String venue, LocalDateTime dateTime, List<Seat> seats) {
        this.id = id;
        this.artist = artist;
        this.venue = venue;
        this.dateTime = dateTime;
        this.seats = seats;
    }

    public String getId() {
        return id;
    }

    public String getArtist() {
        return artist;
    }

    public String getVenue() {
        return venue;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public List<Seat> getSeats() {
        return seats;
    }
}
```


**ConcertTicketBookingSystem.java**

```java
package concertticketbookingsystem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class ConcertTicketBookingSystem {
    private static ConcertTicketBookingSystem instance;
    private final Map<String, Concert> concerts;
    private final Map<String, Booking> bookings;
    private final Object lock = new Object();

    private ConcertTicketBookingSystem() {
        concerts = new ConcurrentHashMap<>();
        bookings = new ConcurrentHashMap<>();
    }

    public static synchronized ConcertTicketBookingSystem getInstance() {
        if (instance == null) {
            instance = new ConcertTicketBookingSystem();
        }
        return instance;
    }

    public void addConcert(Concert concert) {
        concerts.put(concert.getId(), concert);
    }

    public Concert getConcert(String concertId) {
        return concerts.get(concertId);
    }

    public List<Concert> searchConcerts(String artist, String venue, LocalDateTime dateTime) {
        return concerts.values().stream()
                .filter(concert -> concert.getArtist().equalsIgnoreCase(artist) &&
                        concert.getVenue().equalsIgnoreCase(venue) &&
                        concert.getDateTime().equals(dateTime))
                .collect(Collectors.toList());
    }

    public Booking bookTickets(User user, Concert concert, List<Seat> seats) {
        synchronized (lock) {
            // Check seat availability and book seats
            for (Seat seat : seats) {
                if (seat.getStatus() != SeatStatus.AVAILABLE) {
                    throw new SeatNotAvailableException("Seat " + seat.getSeatNumber() + " is not available.");
                }
            }
            seats.forEach(Seat::book);

            // Create booking
            String bookingId = generateBookingId();
            Booking booking = new Booking(bookingId, user, concert, seats);
            bookings.put(bookingId, booking);

            // Process payment
            processPayment(booking);

            // Confirm booking
            booking.confirmBooking();

            System.out.println("Booking " + booking.getId() + " - " + booking.getSeats().size() + " seats booked");

            return booking;
        }
    }

    public void cancelBooking(String bookingId) {
        Booking booking = bookings.get(bookingId);
        if (booking != null) {
            booking.cancelBooking();
            bookings.remove(bookingId);
        }
    }

    private void processPayment(Booking booking) {
        // Process payment for the booking
        // ...
    }

    private String generateBookingId() {
        return "BKG" + UUID.randomUUID();
    }
}
```


**ConcertTicketBookingSystemDemo.java**

```java
package concertticketbookingsystem;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ConcertTicketBookingSystemDemo {
    public static void run() {
        // Create concert ticket booking system instance
        ConcertTicketBookingSystem bookingSystem = ConcertTicketBookingSystem.getInstance();

        // Create concerts
        List<Seat> concert1Seats = generateSeats(100);
        Concert concert1 = new Concert("C001", "Artist 1", "Venue 1", LocalDateTime.now().plusDays(30), concert1Seats);
        bookingSystem.addConcert(concert1);

        List<Seat> concert2Seats = generateSeats(50);
        Concert concert2 = new Concert("C002", "Artist 2", "Venue 2", LocalDateTime.now().plusDays(60), concert2Seats);
        bookingSystem.addConcert(concert2);

        // Create users
        User user1 = new User("U001", "John Doe", "john@example.com");
        User user2 = new User("U002", "Jane Smith", "jane@example.com");

        // Search concerts
        List<Concert> searchResults = bookingSystem.searchConcerts("Artist 1", "Venue 1", LocalDateTime.now().plusDays(30));
        System.out.println("Search Results:");
        for (Concert concert : searchResults) {
            System.out.println("Concert: " + concert.getArtist() + " at " + concert.getVenue());
        }

        // Book tickets
        List<Seat> selectedSeats1 = selectSeats(concert1, 3);
        Booking booking1 = bookingSystem.bookTickets(user1, concert1, selectedSeats1);

        List<Seat> selectedSeats2 = selectSeats(concert2, 2);
        Booking booking2 = bookingSystem.bookTickets(user2, concert2, selectedSeats2);

        // Cancel booking
        bookingSystem.cancelBooking(booking1.getId());

        // Book tickets again
        List<Seat> selectedSeats3 = selectSeats(concert1, 2);
        Booking booking3 = bookingSystem.bookTickets(user2, concert1, selectedSeats3);
    }

    private static List<Seat> generateSeats(int numberOfSeats) {
        List<Seat> seats = new ArrayList<>();
        for (int i = 1; i <= numberOfSeats; i++) {
            String seatNumber = "S" + i;
            SeatType seatType = (i <= 10) ? SeatType.VIP : (i <= 30) ? SeatType.PREMIUM : SeatType.REGULAR;
            double price = (seatType == SeatType.VIP) ? 100.0 : (seatType == SeatType.PREMIUM) ? 75.0 : 50.0;
            seats.add(new Seat(seatNumber, seatNumber, seatType, price));
        }
        return seats;
    }

    private static List<Seat> selectSeats(Concert concert, int numberOfSeats) {
        List<Seat> selectedSeats = new ArrayList<>();
        List<Seat> availableSeats = concert.getSeats().stream()
                .filter(seat -> seat.getStatus() == SeatStatus.AVAILABLE)
                .limit(numberOfSeats)
                .toList();
        selectedSeats.addAll(availableSeats);
        return selectedSeats;
    }
}
```


**README.md**

```md
# Concert Ticket Booking System (LLD)

## Problem Statement

Design and implement a Concert Ticket Booking System that allows users to book seats for concerts. The system should manage concert details, seat availability, and handle bookings with proper validation.

---

## Requirements

- **Concert Management:** The system manages concert details including name, date, venue, and available seats.
- **Seat Management:** The system tracks different types of seats (VIP, STANDARD, ECONOMY) and their availability.
- **Booking Management:** Users can book seats, and the system handles booking status (CONFIRMED, CANCELLED).
- **User Management:** The system maintains user information for bookings.
- **Validation:** The system prevents double bookings and handles seat availability checks.

---

## Core Entities

- **ConcertTicketBookingSystem:** Main class that manages concerts, bookings, and seat allocation.
- **Concert:** Represents a concert with its details and seat management.
- **Seat:** Represents a seat with its type, status, and booking information.
- **User:** Represents a user who can book tickets.
- **Booking:** Represents a booking with its status and associated details.
- **SeatType:** Enum for different seat categories (VIP, STANDARD, ECONOMY).
- **SeatStatus:** Enum for seat states (AVAILABLE, BOOKED).
- **BookingStatus:** Enum for booking states (CONFIRMED, CANCELLED).

---

## Class Design

## UML Class Diagram

![](../../../../uml-diagrams/class-diagrams/concertticketbookingsystem-class-diagram.png)

### 1. ConcertTicketBookingSystem
- **Fields:** List<Concert> concerts, List<Booking> bookings
- **Methods:** addConcert(), bookSeat(), cancelBooking(), getAvailableSeats(), etc.

### 2. Concert
- **Fields:** String name, String date, String venue, List<Seat> seats
- **Methods:** addSeat(), getAvailableSeats(), bookSeat(), etc.

### 3. Seat
- **Fields:** String seatNumber, SeatType type, SeatStatus status, Booking booking
- **Methods:** isAvailable(), book(), cancel(), etc.

### 4. User
- **Fields:** String name, String email

### 5. Booking
- **Fields:** String bookingId, User user, Concert concert, Seat seat, BookingStatus status
- **Methods:** confirm(), cancel(), etc.

### 6. Enums
- **SeatType:** VIP, STANDARD, ECONOMY
- **SeatStatus:** AVAILABLE, BOOKED
- **BookingStatus:** CONFIRMED, CANCELLED

---

## Example Usage

```java
ConcertTicketBookingSystem system = new ConcertTicketBookingSystem();

// Add a concert
Concert concert = system.addConcert("Rock Concert", "2024-12-31", "Stadium");

// Book a seat
User user = new User("John Doe", "john@example.com");
Booking booking = system.bookSeat(concert, "A1", user);

// Cancel booking
system.cancelBooking(booking);
```

---

## Demo

See `ConcertTicketBookingSystemDemo.java` for a sample usage and simulation of the booking system.

---

## Extending the Framework

- **Add payment processing:** Integrate payment gateway for parkingTicket purchases
- **Add waitlist functionality:** Handle seat waitlist when fully booked
- **Add discount management:** Support for different pricing tiers and discounts
- **Add notification system:** Send booking confirmations and updates

---

## Design Patterns Used

- **Singleton Pattern:** For managing the booking system instance
- **Factory Pattern:** For creating different types of seats
- **Observer Pattern:** For notifying users about booking status changes

---
```


**Seat.java**

```java
package concertticketbookingsystem;

public class Seat {
    private final String id;
    private final String seatNumber;
    private final SeatType seatType;
    private final double price;
    private SeatStatus status;

    public Seat(String id, String seatNumber, SeatType seatType, double price) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.price = price;
        this.status = SeatStatus.AVAILABLE;
    }

    public synchronized void book() {
        if (status == SeatStatus.AVAILABLE) {
            status = SeatStatus.BOOKED;
        } else {
            throw new SeatNotAvailableException("Seat is already booked or reserved.");
        }
    }

    public synchronized void release() {
        if (status == SeatStatus.BOOKED) {
            status = SeatStatus.AVAILABLE;
        }
    }

    public double getPrice() {
        return price;
    }

    public String getId() {
        return id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public SeatType getSeatType() {
        return seatType;
    }

    public SeatStatus getStatus() {
        return status;
    }
}
```


**SeatNotAvailableException.java**

```java
package concertticketbookingsystem;

public class SeatNotAvailableException extends RuntimeException {
    public SeatNotAvailableException(String message) {
        super(message);
    }
}
```


**SeatStatus.java**

```java
package concertticketbookingsystem;

public enum SeatStatus {
    AVAILABLE,
    BOOKED,
    RESERVED
}
```


**SeatType.java**

```java
package concertticketbookingsystem;

public enum SeatType {
    REGULAR,
    PREMIUM,
    VIP
}
```


**User.java**

```java
package concertticketbookingsystem;

public class User {
    private final String id;
    private final String name;
    private final String email;

    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
```

</details>

<details><summary><b>python</b> (1 files)</summary>


**README.md**

```md
# Designing a Concert Ticket Booking System

## Requirements
1. The concert ticket booking system should allow users to view available concerts and their seating arrangements.
2. Users should be able to search for concerts based on various criteria such as artist, venue, date, and time.
3. Users should be able to select seats and purchase tickets for a specific concert.
4. The system should handle concurrent booking requests to avoid double-booking of seats.
5. The system should ensure fair booking opportunities for all users.
6. The system should handle payment processing securely.
7. The system should generate booking confirmations and send them to users via email or SMS.
8. The system should provide a waiting list functionality for sold-out concerts.

## Classes, Interfaces and Enumerations
1. The **Concert** class represents a concert event, with properties such as ID, artist, venue, date and time, and a list of seats.
2. The **Seat** class represents a seat in a concert, with properties like ID, seat number, seat type, price, and status. It provides methods to book and release a seat.
3. The **SeatType** enum represents the different types of seats available, such as regular, premium, and VIP.
4. The **SeatStatus** enum represents the status of a seat, which can be available, booked, or reserved.
5. The **Booking** class represents a booking made by a user for a specific concert and seats. It contains properties such as ID, user, concert, seats, total price, and status. It provides methods to confirm and cancel a booking.
6. The **BookingStatus** enum represents the status of a booking, which can be pending, confirmed, or cancelled.
7. The **User** class represents a user of the concert ticket booking system, with properties like ID, name, and email.
8. The **ConcertTicketBookingSystem** class is the central component of the system. It follows the Singleton pattern to ensure a single instance of the system. It manages concerts, bookings, and provides methods to add concerts, search concerts, book tickets, and cancel bookings.
9. The **SeatNotAvailableException** is a custom exception used to handle cases where a seat is not available for booking.
```

</details>

<details><summary><b>cpp</b> (10 files)</summary>


**Booking.cpp**

```cpp
#include "Booking.hpp"
#include <iostream>
#include <iomanip>

Booking::Booking(std::string bookingId, std::string customerName, Concert* concert, 
                int seatNumber, double totalPrice)
    : bookingId(bookingId), customerName(customerName), concert(concert), 
      seatNumber(seatNumber), totalPrice(totalPrice) {}

std::string Booking::getBookingId() const { return bookingId; }
std::string Booking::getCustomerName() const { return customerName; }
Concert* Booking::getConcert() const { return concert; }
int Booking::getSeatNumber() const { return seatNumber; }
double Booking::getTotalPrice() const { return totalPrice; }

void Booking::displayInfo() const {
    std::cout << "\nBooking Details:" << std::endl;
    std::cout << "Booking ID: " << bookingId << std::endl;
    std::cout << "Customer Name: " << customerName << std::endl;
    std::cout << "Seat Number: " << seatNumber << std::endl;
    std::cout << "Total Price: $" << std::fixed << std::setprecision(2) << totalPrice << std::endl;
    std::cout << "\nConcert Information:" << std::endl;
    concert->displayInfo();
}
```


**Booking.hpp**

```hpp
#ifndef BOOKING_HPP
#define BOOKING_HPP

#include <string>
#include "Concert.hpp"

class Booking {
private:
    std::string bookingId;
    std::string customerName;
    Concert* concert;
    int seatNumber;
    double totalPrice;

public:
    Booking(std::string bookingId, std::string customerName, Concert* concert, 
            int seatNumber, double totalPrice);
    
    std::string getBookingId() const;
    std::string getCustomerName() const;
    Concert* getConcert() const;
    int getSeatNumber() const;
    double getTotalPrice() const;
    void displayInfo() const;
};

#endif
```


**BookingSystem.cpp**

```cpp
#include "BookingSystem.hpp"
#include <iostream>
#include <algorithm>

BookingSystem::BookingSystem() : bookingIdCounter(1) {}

BookingSystem::~BookingSystem() {
    for (auto concert : concerts) delete concert;
    for (auto booking : bookings) delete booking;
}

void BookingSystem::addConcert(Concert* concert) {
    concerts.push_back(concert);
}

std::string BookingSystem::createBooking(std::string customerName, Concert* concert, int seatNumber) {
    if (!concert->bookSeat(seatNumber)) {
        std::cout << "Failed to book seat: Seat " << seatNumber << " is not available" << std::endl;
        return "";
    }
    
    std::string bookingId = "B" + std::to_string(bookingIdCounter++);
    double totalPrice = concert->getBasePrice();  // Could add premium pricing logic here
    
    Booking* booking = new Booking(bookingId, customerName, concert, seatNumber, totalPrice);
    bookings.push_back(booking);
    return bookingId;
}

bool BookingSystem::cancelBooking(std::string bookingId) {
    Booking* booking = findBooking(bookingId);
    if (!booking) return false;
    
    booking->getConcert()->cancelSeat(booking->getSeatNumber());
    
    auto it = std::find(bookings.begin(), bookings.end(), booking);
    if (it != bookings.end()) {
        bookings.erase(it);
        delete booking;
        return true;
    }
    return false;
}

void BookingSystem::displayAllConcerts() const {
    std::cout << "\nAvailable Concerts:" << std::endl;
    for (const auto& concert : concerts) {
        concert->displayInfo();
        std::cout << "------------------------" << std::endl;
    }
}

void BookingSystem::displayAllBookings() const {
    std::cout << "\nCurrent Bookings:" << std::endl;
    for (const auto& booking : bookings) {
        booking->displayInfo();
        std::cout << "------------------------" << std::endl;
    }
}

void BookingSystem::displayAvailableSeats(Concert* concert) const {
    std::cout << "\nAvailable seats for concert " << concert->getName() << ":" << std::endl;
    for (int i = 1; i <= concert->getTotalSeats(); i++) {
        if (concert->isSeatAvailable(i)) {
            std::cout << i << " ";
        }
    }
    std::cout << std::endl;
}

Concert* BookingSystem::findConcert(std::string concertId) const {
    for (auto concert : concerts) {
        if (concert->getConcertId() == concertId) return concert;
    }
    return nullptr;
}

Booking* BookingSystem::findBooking(std::string bookingId) const {
    for (auto booking : bookings) {
        if (booking->getBookingId() == bookingId) return booking;
    }
    return nullptr;
}
```


**BookingSystem.hpp**

```hpp
#ifndef BOOKING_SYSTEM_HPP
#define BOOKING_SYSTEM_HPP

#include <vector>
#include <string>
#include "Concert.hpp"
#include "Booking.hpp"

class BookingSystem {
private:
    std::vector<Concert*> concerts;
    std::vector<Booking*> bookings;
    int bookingIdCounter;

public:
    BookingSystem();
    ~BookingSystem();
    
    void addConcert(Concert* concert);
    std::string createBooking(std::string customerName, Concert* concert, int seatNumber);
    bool cancelBooking(std::string bookingId);
    
    void displayAllConcerts() const;
    void displayAllBookings() const;
    void displayAvailableSeats(Concert* concert) const;
    
    Concert* findConcert(std::string concertId) const;
    Booking* findBooking(std::string bookingId) const;
};

#endif
```


**Concert.cpp**

```cpp
#include "Concert.hpp"
#include <iostream>
#include <iomanip>

Concert::Concert(std::string concertId, std::string name, std::string venue, 
                std::string date, double basePrice, int totalSeats)
    : concertId(concertId), name(name), venue(venue), date(date), 
      basePrice(basePrice), totalSeats(totalSeats) {
    
    // Initialize seats
    for (int i = 1; i <= totalSeats; i++) {
        seats.push_back(Seat(i));
    }
}

std::string Concert::getConcertId() const { return concertId; }
std::string Concert::getName() const { return name; }
std::string Concert::getVenue() const { return venue; }
std::string Concert::getDate() const { return date; }
double Concert::getBasePrice() const { return basePrice; }
int Concert::getTotalSeats() const { return totalSeats; }

int Concert::getAvailableSeats() const {
    int available = 0;
    for (const auto& seat : seats) {
        if (!seat.isBooked()) available++;
    }
    return available;
}

bool Concert::bookSeat(int seatNumber) {
    if (seatNumber < 1 || seatNumber > totalSeats) return false;
    if (seats[seatNumber - 1].isBooked()) return false;
    
    seats[seatNumber - 1].book();
    return true;
}

bool Concert::cancelSeat(int seatNumber) {
    if (seatNumber < 1 || seatNumber > totalSeats) return false;
    if (!seats[seatNumber - 1].isBooked()) return false;
    
    seats[seatNumber - 1].cancel();
    return true;
}

bool Concert::isSeatAvailable(int seatNumber) const {
    if (seatNumber < 1 || seatNumber > totalSeats) return false;
    return !seats[seatNumber - 1].isBooked();
}

void Concert::displayInfo() const {
    std::cout << "Concert: " << name << std::endl;
    std::cout << "ID: " << concertId << std::endl;
    std::cout << "Venue: " << venue << std::endl;
    std::cout << "Date: " << date << std::endl;
    std::cout << "Price: $" << std::fixed << std::setprecision(2) << basePrice << std::endl;
    std::cout << "Available Seats: " << getAvailableSeats() << "/" << totalSeats << std::endl;
}
```


**Concert.hpp**

```hpp
#ifndef CONCERT_HPP
#define CONCERT_HPP

#include <string>
#include <vector>
#include "Seat.hpp"

class Concert {
private:
    std::string concertId;
    std::string name;
    std::string venue;
    std::string date;
    double basePrice;
    std::vector<Seat> seats;
    int totalSeats;

public:
    Concert(std::string concertId, std::string name, std::string venue, 
            std::string date, double basePrice, int totalSeats);
    
    std::string getConcertId() const;
    std::string getName() const;
    std::string getVenue() const;
    std::string getDate() const;
    double getBasePrice() const;
    int getTotalSeats() const;
    int getAvailableSeats() const;
    
    bool bookSeat(int seatNumber);
    bool cancelSeat(int seatNumber);
    bool isSeatAvailable(int seatNumber) const;
    void displayInfo() const;
};

#endif
```


**ConcertBookingDemo.cpp**

```cpp
#include "BookingSystem.hpp"
#include <iostream>

int main() {
    BookingSystem bookingSystem;
    
    // Create some concerts
    Concert* concert1 = new Concert("C001", "Rock Festival", "Stadium A", "2024-07-15", 100.0, 50);
    Concert* concert2 = new Concert("C002", "Jazz Night", "Hall B", "2024-07-20", 75.0, 30);
    
    bookingSystem.addConcert(concert1);
    bookingSystem.addConcert(concert2);
    
    // Display all concerts
    bookingSystem.displayAllConcerts();
    
    // Make some bookings
    std::string booking1 = bookingSystem.createBooking("John Doe", concert1, 1);
    std::string booking2 = bookingSystem.createBooking("Jane Smith", concert1, 2);
    std::string booking3 = bookingSystem.createBooking("Alice Johnson", concert2, 1);
    
    if (!booking1.empty()) {
        std::cout << "\nBooking created successfully: " << booking1 << std::endl;
    }
    if (!booking2.empty()) {
        std::cout << "Booking created successfully: " << booking2 << std::endl;
    }
    if (!booking3.empty()) {
        std::cout << "Booking created successfully: " << booking3 << std::endl;
    }
    
    // Display all bookings
    bookingSystem.displayAllBookings();
    
    // Display available seats for concert1
    bookingSystem.displayAvailableSeats(concert1);
    
    // Cancel a booking
    if (bookingSystem.cancelBooking(booking1)) {
        std::cout << "\nBooking " << booking1 << " cancelled successfully" << std::endl;
    }
    
    // Display updated available seats
    bookingSystem.displayAvailableSeats(concert1);
    
    return 0;
}
```


**README.md**

```md
# Designing a Concert Ticket Booking System

## Requirements
1. The concert ticket booking system should allow users to view available concerts and their seating arrangements.
2. Users should be able to search for concerts based on various criteria such as artist, venue, date, and time.
3. Users should be able to select seats and purchase tickets for a specific concert.
4. The system should handle concurrent booking requests to avoid double-booking of seats.
5. The system should ensure fair booking opportunities for all users.
6. The system should handle payment processing securely.
7. The system should generate booking confirmations and send them to users via email or SMS.
8. The system should provide a waiting list functionality for sold-out concerts.

## Classes, Interfaces and Enumerations
1. The **Concert** class represents a concert event, with properties such as ID, artist, venue, date and time, and a list of seats.
2. The **Seat** class represents a seat in a concert, with properties like ID, seat number, seat type, price, and status. It provides methods to book and release a seat.
3. The **SeatType** enum represents the different types of seats available, such as regular, premium, and VIP.
4. The **SeatStatus** enum represents the status of a seat, which can be available, booked, or reserved.
5. The **Booking** class represents a booking made by a user for a specific concert and seats. It contains properties such as ID, user, concert, seats, total price, and status. It provides methods to confirm and cancel a booking.
6. The **BookingStatus** enum represents the status of a booking, which can be pending, confirmed, or cancelled.
7. The **User** class represents a user of the concert ticket booking system, with properties like ID, name, and email.
8. The **ConcertTicketBookingSystem** class is the central component of the system. It follows the Singleton pattern to ensure a single instance of the system. It manages concerts, bookings, and provides methods to add concerts, search concerts, book tickets, and cancel bookings.
9. The **SeatNotAvailableException** is a custom exception used to handle cases where a seat is not available for booking.
```


**Seat.cpp**

```cpp
#include "Seat.hpp"

Seat::Seat(int number) : seatNumber(number), booked(false) {}

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
    Seat(int number);
    
    int getSeatNumber() const;
    bool isBooked() const;
    void book();
    void cancel();
};

#endif
```

</details>

<details><summary><b>golang</b> (10 files)</summary>


**README.md**

```md
# Designing a Concert Ticket Booking System

## Requirements
1. The concert ticket booking system should allow users to view available concerts and their seating arrangements.
2. Users should be able to search for concerts based on various criteria such as artist, venue, date, and time.
3. Users should be able to select seats and purchase tickets for a specific concert.
4. The system should handle concurrent booking requests to avoid double-booking of seats.
5. The system should ensure fair booking opportunities for all users.
6. The system should handle payment processing securely.
7. The system should generate booking confirmations and send them to users via email or SMS.
8. The system should provide a waiting list functionality for sold-out concerts.

## Classes, Interfaces and Enumerations
1. The **Concert** class represents a concert event, with properties such as ID, artist, venue, date and time, and a list of seats.
2. The **Seat** class represents a seat in a concert, with properties like ID, seat number, seat type, price, and status. It provides methods to book and release a seat.
3. The **SeatType** enum represents the different types of seats available, such as regular, premium, and VIP.
4. The **SeatStatus** enum represents the status of a seat, which can be available, booked, or reserved.
5. The **Booking** class represents a booking made by a user for a specific concert and seats. It contains properties such as ID, user, concert, seats, total price, and status. It provides methods to confirm and cancel a booking.
6. The **BookingStatus** enum represents the status of a booking, which can be pending, confirmed, or cancelled.
7. The **User** class represents a user of the concert ticket booking system, with properties like ID, name, and email.
8. The **ConcertTicketBookingSystem** class is the central component of the system. It follows the Singleton pattern to ensure a single instance of the system. It manages concerts, bookings, and provides methods to add concerts, search concerts, book tickets, and cancel bookings.
9. The **SeatNotAvailableException** is a custom exception used to handle cases where a seat is not available for booking.
```


**booking.go**

```go
package concertbookingsystem

type Booking struct {
	ID         string
	User       *User
	Concert    *Concert
	Seats      []*Seat
	TotalPrice float64
	Status     BookingStatus
}

func NewBooking(id string, user *User, concert *Concert, seats []*Seat) *Booking {
	totalPrice := calculateTotalPrice(seats)
	return &Booking{
		ID:         id,
		User:       user,
		Concert:    concert,
		Seats:      seats,
		TotalPrice: totalPrice,
		Status:     BookingStatusPending,
	}
}

func (b *Booking) ConfirmBooking() {
	if b.Status == BookingStatusPending {
		b.Status = BookingStatusConfirmed
		// TODO: Send booking confirmation to user
	}
}

func (b *Booking) CancelBooking() {
	if b.Status == BookingStatusConfirmed {
		b.Status = BookingStatusCancelled
		for _, seat := range b.Seats {
			seat.Release()
		}
		// TODO: Send cancellation notification to user
	}
}

func calculateTotalPrice(seats []*Seat) float64 {
	var total float64
	for _, seat := range seats {
		total += seat.Price
	}
	return total
}
```


**concert.go**

```go
package concertbookingsystem

import "time"

type Concert struct {
	ID       string
	Artist   string
	Venue    string
	DateTime time.Time
	Seats    []*Seat
}

func NewConcert(id, artist, venue string, dateTime time.Time, seats []*Seat) *Concert {
	return &Concert{
		ID:       id,
		Artist:   artist,
		Venue:    venue,
		DateTime: dateTime,
		Seats:    seats,
	}
}
```


**concert_booking_system.go**

```go
package concertbookingsystem

import (
	"fmt"
	"sync"
	"time"
)

type ConcertTicketBookingSystem struct {
	concerts map[string]*Concert
	bookings map[string]*Booking
	mu       sync.Mutex
}

var (
	instance *ConcertTicketBookingSystem
	once     sync.Once
)

func GetBookingSystem() *ConcertTicketBookingSystem {
	once.Do(func() {
		instance = &ConcertTicketBookingSystem{
			concerts: make(map[string]*Concert),
			bookings: make(map[string]*Booking),
		}
	})
	return instance
}

func (bs *ConcertTicketBookingSystem) AddConcert(concert *Concert) {
	bs.mu.Lock()
	defer bs.mu.Unlock()
	bs.concerts[concert.ID] = concert
}

func (bs *ConcertTicketBookingSystem) GetConcert(concertID string) *Concert {
	bs.mu.Lock()
	defer bs.mu.Unlock()
	return bs.concerts[concertID]
}

func (bs *ConcertTicketBookingSystem) SearchConcerts(artist, venue string, dateTime time.Time) []*Concert {
	bs.mu.Lock()
	defer bs.mu.Unlock()

	var results []*Concert
	for _, concert := range bs.concerts {
		if concert.Artist == artist &&
			concert.Venue == venue &&
			concert.DateTime.Equal(dateTime) {
			results = append(results, concert)
		}
	}
	return results
}

func (bs *ConcertTicketBookingSystem) BookTickets(user *User, concert *Concert, seats []*Seat) (*Booking, error) {
	bs.mu.Lock()
	defer bs.mu.Unlock()

	// Check seat availability
	for _, seat := range seats {
		if seat.GetStatus() != StatusAvailable {
			return nil, NewSeatNotAvailableError(fmt.Sprintf("Seat %s is not available", seat.SeatNumber))
		}
	}

	// Book seats
	for _, seat := range seats {
		if err := seat.Book(); err != nil {
			// Rollback previous bookings
			for _, s := range seats {
				if s == seat {
					break
				}
				s.Release()
			}
			return nil, err
		}
	}

	// Create booking
	bookingID := fmt.Sprintf("BKG-%d", time.Now().UnixNano())
	booking := NewBooking(bookingID, user, concert, seats)

	// Process payment (mock)
	bs.processPayment(booking)

	// Confirm booking
	booking.ConfirmBooking()
	bs.bookings[bookingID] = booking

	fmt.Printf("Booking %s - %d seats booked\n", booking.ID, len(booking.Seats))
	return booking, nil
}

func (bs *ConcertTicketBookingSystem) CancelBooking(bookingID string) {
	bs.mu.Lock()
	defer bs.mu.Unlock()

	if booking, exists := bs.bookings[bookingID]; exists {
		booking.CancelBooking()
		delete(bs.bookings, bookingID)
		fmt.Printf("Booking %s cancelled\n", bookingID)
	}
}

func (bs *ConcertTicketBookingSystem) processPayment(booking *Booking) {
	// Mock payment processing
}
```


**concert_booking_system_demo.go**

```go
package concertbookingsystem

import (
	"fmt"
	"time"
)

func Run() {
	bookingSystem := GetBookingSystem()

	// Create concerts
	concert1Seats := GenerateSeats(100)
	concert1 := NewConcert("C001", "Artist 1", "Venue 1",
		time.Now().Add(30*24*time.Hour), concert1Seats)
	bookingSystem.AddConcert(concert1)

	concert2Seats := GenerateSeats(50)
	concert2 := NewConcert("C002", "Artist 2", "Venue 2",
		time.Now().Add(60*24*time.Hour), concert2Seats)
	bookingSystem.AddConcert(concert2)

	// Create users
	user1 := NewUser("U001", "John Doe", "john@example.com")
	user2 := NewUser("U002", "Jane Smith", "jane@example.com")

	// Search concerts
	searchResults := bookingSystem.SearchConcerts("Artist 1", "Venue 1",
		time.Now().Add(30*24*time.Hour))

	fmt.Println("Search Results:")
	for _, concert := range searchResults {
		fmt.Printf("Concert: %s at %s\n", concert.Artist, concert.Venue)
	}

	// Book tickets
	selectedSeats1 := concert1.Seats[:3] // Select first 3 seats
	booking1, err := bookingSystem.BookTickets(user1, concert1, selectedSeats1)
	if err != nil {
		fmt.Printf("Booking error: %v\n", err)
	}

	selectedSeats2 := concert2.Seats[:2] // Select first 2 seats
	booking2, err := bookingSystem.BookTickets(user2, concert2, selectedSeats2)
	if err != nil {
		fmt.Printf("Booking error: %v\n", err)
	}

	if booking2 != nil {
		fmt.Printf("Booking Successful\n")
	}

	// Cancel booking
	if booking1 != nil {
		bookingSystem.CancelBooking(booking1.ID)
	}

	// Book tickets again
	selectedSeats3 := concert1.Seats[3:5] // Select next 2 seats
	booking3, err := bookingSystem.BookTickets(user2, concert1, selectedSeats3)
	if err != nil {
		fmt.Printf("Booking error: %v\n", err)
	}

	if booking3 != nil {
		fmt.Printf("Booking Successful\n")
	}
}
```


**errors.go**

```go
package concertbookingsystem

type SeatNotAvailableError struct {
	message string
}

func NewSeatNotAvailableError(message string) *SeatNotAvailableError {
	return &SeatNotAvailableError{message: message}
}

func (e *SeatNotAvailableError) Error() string {
	return e.message
}
```


**seat.go**

```go
package concertbookingsystem

import "sync"

type Seat struct {
	ID         string
	SeatNumber string
	Type       SeatType
	Price      float64
	status     SeatStatus
	mu         sync.Mutex
}

func NewSeat(id, seatNumber string, seatType SeatType, price float64) *Seat {
	return &Seat{
		ID:         id,
		SeatNumber: seatNumber,
		Type:       seatType,
		Price:      price,
		status:     StatusAvailable,
	}
}

func (s *Seat) Book() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.status != StatusAvailable {
		return NewSeatNotAvailableError("Seat is already booked or reserved")
	}
	s.status = StatusBooked
	return nil
}

func (s *Seat) Release() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.status == StatusBooked {
		s.status = StatusAvailable
	}
}

func (s *Seat) GetStatus() SeatStatus {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.status
}
```


**types.go**

```go
package concertbookingsystem

type SeatType int
type SeatStatus int
type BookingStatus int

const (
	SeatTypeRegular SeatType = iota
	SeatTypePremium
	SeatTypeVIP
)

const (
	StatusAvailable SeatStatus = iota
	StatusBooked
	StatusReserved
)

const (
	BookingStatusPending BookingStatus = iota
	BookingStatusConfirmed
	BookingStatusCancelled
)
```


**user.go**

```go
package concertbookingsystem

type User struct {
	ID    string
	Name  string
	Email string
}

func NewUser(id, name, email string) *User {
	return &User{
		ID:    id,
		Name:  name,
		Email: email,
	}
}
```


**utils.go**

```go
package concertbookingsystem

import "fmt"

func GenerateSeats(numberOfSeats int) []*Seat {
	seats := make([]*Seat, 0, numberOfSeats)
	for i := 1; i <= numberOfSeats; i++ {
		seatNumber := fmt.Sprintf("S%d", i)
		var seatType SeatType
		var price float64

		switch {
		case i <= 10:
			seatType = SeatTypeVIP
			price = 100.0
		case i <= 30:
			seatType = SeatTypePremium
			price = 75.0
		default:
			seatType = SeatTypeRegular
			price = 50.0
		}

		seats = append(seats, NewSeat(seatNumber, seatNumber, seatType, price))
	}
	return seats
}
```

</details>

<details><summary><b>csharp</b> (11 files)</summary>


**Booking.cs**

```cs
using System;
using System.Collections.Generic;

namespace ConcertBookingSystem
{
    public class Booking
    {
        public string Id { get; }
        public User User { get; }
        public Concert Concert { get; }
        public List<Seat> Seats { get; }
        public double TotalPrice { get; }
        public BookingStatus Status { get; private set; }

        public Booking(string id, User user, Concert concert, List<Seat> seats)
        {
            Id = id;
            User = user;
            Concert = concert;
            Seats = seats;
            TotalPrice = CalculateTotalPrice();
            Status = BookingStatus.PENDING;
        }

        private double CalculateTotalPrice()
        {
            return Seats.Sum(seat => seat.Price);
        }

        public void ConfirmBooking()
        {
            if (Status == BookingStatus.PENDING)
            {
                Status = BookingStatus.CONFIRMED;
                // Send booking confirmation
            }
        }

        public void CancelBooking()
        {
            if (Status == BookingStatus.CONFIRMED)
            {
                Status = BookingStatus.CANCELLED;
                Seats.ForEach(seat => seat.Release());
                Console.WriteLine($"Booking {Id} cancelled");
            }
        }
    }
}
```


**BookingStatus.cs**

```cs
namespace ConcertBookingSystem
{
    public enum BookingStatus
    {
        PENDING,
        CONFIRMED,
        CANCELLED
    }
}
```


**Concert.cs**

```cs
using System;
using System.Collections.Generic;

namespace ConcertBookingSystem
{
    public class Concert
    {
        public string Id { get; }
        public string Artist { get; }
        public string Venue { get; }
        public DateTime DateTime { get; }
        public List<Seat> Seats { get; }

        public Concert(string id, string artist, string venue, DateTime dateTime, List<Seat> seats)
        {
            Id = id;
            Artist = artist;
            Venue = venue;
            DateTime = dateTime;
            Seats = seats;
        }
    }
}
```


**ConcertTicketBookingSystem.cs**

```cs
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace ConcertBookingSystem
{
    public class ConcertTicketBookingSystem
    {
        private static ConcertTicketBookingSystem _instance;
        private readonly ConcurrentDictionary<string, Concert> concerts;
        private readonly ConcurrentDictionary<string, Booking> bookings;
        private readonly object lockObject = new object();

        private ConcertTicketBookingSystem()
        {
            concerts = new ConcurrentDictionary<string, Concert>();
            bookings = new ConcurrentDictionary<string, Booking>();
        }

        public static ConcertTicketBookingSystem Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new ConcertTicketBookingSystem();
                }
                return _instance;
            }
        }

        public void AddConcert(Concert concert)
        {
            concerts.TryAdd(concert.Id, concert);
        }

        public Concert GetConcert(string concertId)
        {
            concerts.TryGetValue(concertId, out var concert);
            return concert;
        }

        public List<Concert> SearchConcerts(string artist, string venue, DateTime dateTime)
        {
            return concerts.Values.Where(concert =>
                concert.Artist.Equals(artist, StringComparison.OrdinalIgnoreCase) &&
                concert.Venue.Equals(venue, StringComparison.OrdinalIgnoreCase) &&
                concert.DateTime == dateTime).ToList();
        }

        public Booking BookTickets(User user, Concert concert, List<Seat> seats)
        {
            lock (lockObject)
            {
                foreach (var seat in seats)
                {
                    if (seat.Status != SeatStatus.AVAILABLE)
                    {
                        throw new SeatNotAvailableException($"Seat {seat.SeatNumber} is not available.");
                    }
                }

                seats.ForEach(seat => seat.Book());

                string bookingId = GenerateBookingId();
                var booking = new Booking(bookingId, user, concert, seats);
                bookings.TryAdd(bookingId, booking);

                ProcessPayment(booking);
                booking.ConfirmBooking();

                Console.WriteLine($"Booking {booking.Id} - {booking.Seats.Count} seats booked");

                return booking;
            }
        }

        public void CancelBooking(string bookingId)
        {
            bookings.TryRemove(bookingId, out var booking);
            booking?.CancelBooking();
        }

        private void ProcessPayment(Booking booking)
        {
            // Simulate payment processing logic here
        }

        private string GenerateBookingId()
        {
            return "BKG" + Guid.NewGuid();
        }
    }
}
```


**ConcertTicketBookingSystemDemo.cs**

```cs
using System;
using System.Collections.Generic;
using System.Linq;

namespace ConcertBookingSystem
{
    public class ConcertTicketBookingSystemDemo
    {
        public static void Run()
        {
            // Create concert ticket booking system instance
            var bookingSystem = ConcertTicketBookingSystem.Instance;

            // Create concerts
            var concert1Seats = GenerateSeats(100);
            var concert1 = new Concert("C001", "Artist 1", "Venue 1", DateTime.Now.AddDays(30), concert1Seats);
            bookingSystem.AddConcert(concert1);

            var concert2Seats = GenerateSeats(50);
            var concert2 = new Concert("C002", "Artist 2", "Venue 2", DateTime.Now.AddDays(60), concert2Seats);
            bookingSystem.AddConcert(concert2);

            // Create users
            var user1 = new User("U001", "John Doe", "john@example.com");
            var user2 = new User("U002", "Jane Smith", "jane@example.com");

            // Search concerts
            var searchResults = bookingSystem.SearchConcerts("Artist 1", "Venue 1", DateTime.Now.AddDays(30));
            Console.WriteLine("Search Results:");
            foreach (var concert in searchResults)
            {
                Console.WriteLine($"Concert: {concert.Artist} at {concert.Venue}");
            }

            // Book tickets
            var selectedSeats1 = SelectSeats(concert1, 3);
            var booking1 = bookingSystem.BookTickets(user1, concert1, selectedSeats1);

            var selectedSeats2 = SelectSeats(concert2, 2);
            var booking2 = bookingSystem.BookTickets(user2, concert2, selectedSeats2);

            // Cancel booking
            bookingSystem.CancelBooking(booking1.Id);

            // Book tickets again
            var selectedSeats3 = SelectSeats(concert1, 2);
            var booking3 = bookingSystem.BookTickets(user2, concert1, selectedSeats3);
        }

        private static List<Seat> GenerateSeats(int numberOfSeats)
        {
            var seats = new List<Seat>();
            for (int i = 1; i <= numberOfSeats; i++)
            {
                string seatNumber = "S" + i;
                SeatType seatType = (i <= 10) ? SeatType.VIP : (i <= 30) ? SeatType.PREMIUM : SeatType.REGULAR;
                double price = seatType switch
                {
                    SeatType.VIP => 100.0,
                    SeatType.PREMIUM => 75.0,
                    _ => 50.0,
                };
                seats.Add(new Seat(seatNumber, seatNumber, seatType, price));
            }
            return seats;
        }

        private static List<Seat> SelectSeats(Concert concert, int numberOfSeats)
        {
            var availableSeats = concert.Seats
                .Where(seat => seat.Status == SeatStatus.AVAILABLE)
                .Take(numberOfSeats)
                .ToList();
            return availableSeats;
        }
    }
}
```


**README.md**

```md
# Designing a Concert Ticket Booking System

## Requirements
1. The concert ticket booking system should allow users to view available concerts and their seating arrangements.
2. Users should be able to search for concerts based on various criteria such as artist, venue, date, and time.
3. Users should be able to select seats and purchase tickets for a specific concert.
4. The system should handle concurrent booking requests to avoid double-booking of seats.
5. The system should ensure fair booking opportunities for all users.
6. The system should handle payment processing securely.
7. The system should generate booking confirmations and send them to users via email or SMS.
8. The system should provide a waiting list functionality for sold-out concerts.

## Classes, Interfaces and Enumerations
1. The **Concert** class represents a concert event, with properties such as ID, artist, venue, date and time, and a list of seats.
2. The **Seat** class represents a seat in a concert, with properties like ID, seat number, seat type, price, and status. It provides methods to book and release a seat.
3. The **SeatType** enum represents the different types of seats available, such as regular, premium, and VIP.
4. The **SeatStatus** enum represents the status of a seat, which can be available, booked, or reserved.
5. The **Booking** class represents a booking made by a user for a specific concert and seats. It contains properties such as ID, user, concert, seats, total price, and status. It provides methods to confirm and cancel a booking.
6. The **BookingStatus** enum represents the status of a booking, which can be pending, confirmed, or cancelled.
7. The **User** class represents a user of the concert ticket booking system, with properties like ID, name, and email.
8. The **ConcertTicketBookingSystem** class is the central component of the system. It follows the Singleton pattern to ensure a single instance of the system. It manages concerts, bookings, and provides methods to add concerts, search concerts, book tickets, and cancel bookings.
9. The **SeatNotAvailableException** is a custom exception used to handle cases where a seat is not available for booking.
```


**Seat.cs**

```cs
namespace ConcertBookingSystem
{
    public class Seat
    {
        public string Id { get; }
        public string SeatNumber { get; }
        public SeatType SeatType { get; }
        public double Price { get; }
        public SeatStatus Status { get; private set; }

        public Seat(string id, string seatNumber, SeatType seatType, double price)
        {
            Id = id;
            SeatNumber = seatNumber;
            SeatType = seatType;
            Price = price;
            Status = SeatStatus.AVAILABLE;
        }

        public void Book()
        {
            if (Status == SeatStatus.AVAILABLE)
            {
                Status = SeatStatus.BOOKED;
            }
            else
            {
                throw new SeatNotAvailableException("Seat is already booked or reserved.");
            }
        }

        public void Release()
        {
            if (Status == SeatStatus.BOOKED)
            {
                Status = SeatStatus.AVAILABLE;
            }
        }
    }
}
```


**SeatNotAvailableException.cs**

```cs
using System;

namespace ConcertBookingSystem
{
    public class SeatNotAvailableException : Exception
    {
        public SeatNotAvailableException(string message) : base(message)
        {
        }
    }
}
```


**SeatStatus.cs**

```cs
namespace ConcertBookingSystem
{
    public enum SeatStatus
    {
        AVAILABLE,
        BOOKED,
        RESERVED
    }
}
```


**SeatType.cs**

```cs
namespace ConcertBookingSystem
{
    public enum SeatType
    {
        REGULAR,
        PREMIUM,
        VIP
    }
}
```


**User.cs**

```cs
namespace ConcertBookingSystem
{
    public class User
    {
        public string Id { get; }
        public string Name { get; }
        public string Email { get; }

        public User(string id, string name, string email)
        {
            Id = id;
            Name = name;
            Email = email;
        }
    }
}
```

</details>
