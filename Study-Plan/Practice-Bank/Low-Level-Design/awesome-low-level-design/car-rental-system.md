# Low-level design problem: car rental system

> Copied from <https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/car-rental-system.md> (GPL-3.0, by Ashish Pratap Singh). Questions and answers are the source's own; nothing was answered or rewritten here.


# Designing a Car Rental System

## Requirements
1. The car rental system should allow customers to browse and reserve available cars for specific dates.
2. Each car should have details such as make, model, year, license plate number, and rental price per day.
3. Customers should be able to search for cars based on various criteria, such as car type, price range, and availability.
4. The system should handle reservations, including creating, modifying, and canceling reservations.
5. The system should keep track of the availability of cars and update their status accordingly.
6. The system should handle customer information, including name, contact details, and driver's license information.
7. The system should handle payment processing for reservations.
8. The system should be able to handle concurrent reservations and ensure data consistency.

## UML Class Diagram

![](images/awesome-low-level-design_class-diagrams_carrentalsystem-class-diagram.png)

## Implementations
#### [Java Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/java/src/carrentalsystem) 
#### [Python Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/python/carrentalsystem)
#### [C++ Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/cpp/carrentalsystem)
#### [C# Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/csharp/carrentalsystem)
#### [Go Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/golang/carrentalsystem)

## Classes, Interfaces and Enumerations
1. The **Car** class represents a car in the rental system, with properties such as make, model, year, license plate number, rental price per day, and availability status.
2. The **Customer** class represents a customer, with properties like name, contact information, and driver's license number.
3. The **Reservation** class represents a reservation made by a customer for a specific car and date range. It includes properties such as reservation ID, customer, car, start date, end date, and total price.
4. The **PaymentProcessor** interface defines the contract for payment processing, and the CreditCardPaymentProcessor and PayPalPaymentProcessor classes are concrete implementations of the payment processor.
5. The **RentalSystem** class is the core of the car rental system and follows the Singleton pattern to ensure a single instance of the rental system.
6. The RentalSystem class uses concurrent data structures (ConcurrentHashMap) to handle concurrent access to cars and reservations.
7. The **RentalSystem** class provides methods for adding and removing cars, searching for available cars based on criteria, making reservations, canceling reservations, and processing payments.
8. The **CarRentalSystem** class serves as the entry point of the application and demonstrates the usage of the car rental system.

---

## Official solutions from the repository

<details><summary><b>java</b> (11 files)</summary>


**Car.java**

```java
package carrentalsystem;

public class Car {
    private final String make;
    private final String model;
    private final int year;
    private final String licensePlate;
    private final double rentalPricePerDay;
    private boolean available;

    public Car(String make, String model, int year, String licensePlate, double rentalPricePerDay) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.licensePlate = licensePlate;
        this.rentalPricePerDay = rentalPricePerDay;
        this.available = true;
    }

    public double getRentalPricePerDay() {
        return rentalPricePerDay;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
```


**CarRentalSystem.java**

```java
package carrentalsystem;

import carrentalsystem.payment.CreditCardPaymentProcessor;
import carrentalsystem.payment.PaymentProcessor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class CarRentalSystem {
    private static CarRentalSystem instance = new CarRentalSystem();
    private final Map<String, Car> cars;
    private final Map<String, Reservation> reservations;
    private final PaymentProcessor paymentProcessor;

    private CarRentalSystem() {
        cars = new ConcurrentHashMap<>();
        reservations = new ConcurrentHashMap<>();
        paymentProcessor = new CreditCardPaymentProcessor();
    }

    public static CarRentalSystem getInstance() {
        return instance;
    }

    public void addCar(Car car) {
        cars.put(car.getLicensePlate(), car);
    }

    public void removeCar(String licensePlate) {
        cars.remove(licensePlate);
    }

    public List<Car> searchCars(String make, String model, LocalDate startDate, LocalDate endDate) {
        List<Car> availableCars = new ArrayList<>();
        for (Car car : cars.values()) {
            if (car.getMake().equalsIgnoreCase(make) && car.getModel().equalsIgnoreCase(model) && car.isAvailable()) {
                if (isCarAvailable(car, startDate, endDate)) {
                    availableCars.add(car);
                }
            }
        }
        return availableCars;
    }

    private boolean isCarAvailable(Car car, LocalDate startDate, LocalDate endDate) {
        for (Reservation reservation : reservations.values()) {
            if (reservation.getCar().equals(car)) {
                if (startDate.isBefore(reservation.getEndDate()) && endDate.isAfter(reservation.getStartDate())) {
                    return false;
                }
            }
        }
        return true;
    }

    public synchronized Reservation makeReservation(Customer customer, Car car, LocalDate startDate, LocalDate endDate) {
        if (isCarAvailable(car, startDate, endDate)) {
            String reservationId = generateReservationId();
            Reservation reservation = new Reservation(reservationId, customer, car, startDate, endDate);
            reservations.put(reservationId, reservation);
            car.setAvailable(false);
            return reservation;
        }
        return null;
    }

    public synchronized void cancelReservation(String reservationId) {
        Reservation reservation = reservations.remove(reservationId);
        if (reservation != null) {
            reservation.getCar().setAvailable(true);
        }
    }

    public boolean processPayment(Reservation reservation) {
        return paymentProcessor.processPayment(reservation.getTotalPrice());
    }

    private String generateReservationId() {
        return "RES" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
```


**CarRentalSystemDemo.java**

```java
package carrentalsystem;

import java.time.LocalDate;
import java.util.List;

public class CarRentalSystemDemo {
    public static void run() {
        CarRentalSystem carRentalSystem = CarRentalSystem.getInstance();

        // Add cars to the rental system
        carRentalSystem.addCar(new Car("Toyota", "Camry", 2022, "ABC123", 50.0));
        carRentalSystem.addCar(new Car("Honda", "Civic", 2021, "XYZ789", 45.0));
        carRentalSystem.addCar(new Car("Ford", "Mustang", 2023, "DEF456", 80.0));

        // Create customers
        Customer customer1 = new Customer("John Doe", "john@example.com", "DL1234");

        // Make reservations
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(3);
        List<Car> availableCars = carRentalSystem.searchCars("Toyota", "Camry", startDate, endDate);
        if (!availableCars.isEmpty()) {
            Car selectedCar = availableCars.getFirst();
            Reservation reservation = carRentalSystem.makeReservation(customer1, selectedCar, startDate, endDate);
            if (reservation != null) {
                boolean paymentSuccess = carRentalSystem.processPayment(reservation);
                if (paymentSuccess) {
                    System.out.println("Reservation successful. Reservation ID: " + reservation.getReservationId());
                } else {
                    System.out.println("Payment failed. Reservation canceled.");
                    carRentalSystem.cancelReservation(reservation.getReservationId());
                }
            } else {
                System.out.println("Selected car is not available for the given dates.");
            }
        } else {
            System.out.println("No available cars found for the given criteria.");
        }
    }
}
```


**CarStatus.java**

```java
package carrentalsystem;

public enum CarStatus {
    AVAILABLE, BOOKED, MAINTENANCE
}
```


**CarType.java**

```java
package carrentalsystem;

public enum CarType {
    SUV, SEDAN, HATCHBACK
}
```


**Customer.java**

```java
package carrentalsystem;

public class Customer {
    private final String name;
    private final String contactInfo;
    private final String driversLicenseNumber;

    public Customer(String name, String contactInfo, String driversLicenseNumber) {
        this.name = name;
        this.contactInfo = contactInfo;
        this.driversLicenseNumber = driversLicenseNumber;
    }
}
```


**README.md**

```md
# Designing a Car Rental System

## Requirements
1. The car rental system should allow customers to browse and reserve available cars for specific dates.
2. Each car should have details such as make, model, year, license plate number, and rental price per day.
3. Customers should be able to search for cars based on various criteria, such as car type, price range, and availability.
4. The system should handle reservations, including creating, modifying, and canceling reservations.
5. The system should keep track of the availability of cars and update their status accordingly.
6. The system should handle customer information, including name, contact details, and driver's license information.
7. The system should handle payment processing for reservations.
8. The system should be able to handle concurrent reservations and ensure data consistency.

## UML Class Diagram

![](../../../../uml-diagrams/class-diagrams/carrentalsystem-class-diagram.png)

## Classes, Interfaces and Enumerations
1. The **Car** class represents a car in the rental system, with properties such as make, model, year, license plate number, rental price per day, and availability status.
2. The **Customer** class represents a customer, with properties like name, contact information, and driver's license number.
3. The **Reservation** class represents a reservation made by a customer for a specific car and date range. It includes properties such as reservation ID, customer, car, start date, end date, and total price.
4. The **PaymentProcessor** interface defines the contract for payment processing, and the CreditCardPaymentProcessor and PayPalPaymentProcessor classes are concrete implementations of the payment processor.
5. The **RentalSystem** class is the core of the car rental system and follows the Singleton pattern to ensure a single instance of the rental system.
6. The RentalSystem class uses concurrent data structures (ConcurrentHashMap) to handle concurrent access to cars and reservations.
7. The **RentalSystem** class provides methods for adding and removing cars, searching for available cars based on criteria, making reservations, canceling reservations, and processing payments.
8. The **CarRentalSystem** class serves as the entry point of the application and demonstrates the usage of the car rental system.
```


**Reservation.java**

```java
package carrentalsystem;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Reservation {
    private final String reservationId;
    private final Customer customer;
    private final Car car;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final double totalPrice;

    public Reservation(String reservationId, Customer customer, Car car, LocalDate startDate, LocalDate endDate) {
        this.reservationId = reservationId;
        this.customer = customer;
        this.car = car;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalPrice = calculateTotalPrice();
    }

    private double calculateTotalPrice() {
        long daysRented = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        return car.getRentalPricePerDay() * daysRented;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Car getCar() {
        return car;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public String getReservationId() {
        return reservationId;
    }
}
```


**payment/CreditCardPaymentProcessor.java**

```java
package carrentalsystem.payment;

public class CreditCardPaymentProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        // Process credit card payment
        // ...
        return true;
    }
}
```


**payment/PayPalPaymentProcessor.java**

```java
package carrentalsystem.payment;

public class PayPalPaymentProcessor implements PaymentProcessor {
    @Override
    public boolean processPayment(double amount) {
        // Process PayPal payment
        // ...
        return true;
    }
}
```


**payment/PaymentProcessor.java**

```java
package carrentalsystem.payment;

public interface PaymentProcessor {
    boolean processPayment(double amount);
}
```

</details>

<details><summary><b>python</b> (9 files)</summary>


**README.md**

```md
# Designing a Car Rental System

## Requirements
1. The car rental system should allow customers to browse and reserve available cars for specific dates.
2. Each car should have details such as make, model, year, license plate number, and rental price per day.
3. Customers should be able to search for cars based on various criteria, such as car type, price range, and availability.
4. The system should handle reservations, including creating, modifying, and canceling reservations.
5. The system should keep track of the availability of cars and update their status accordingly.
6. The system should handle customer information, including name, contact details, and driver's license information.
7. The system should handle payment processing for reservations.
8. The system should be able to handle concurrent reservations and ensure data consistency.

## Classes, Interfaces and Enumerations
1. The **Car** class represents a car in the rental system, with properties such as make, model, year, license plate number, rental price per day, and availability status.
2. The **Customer** class represents a customer, with properties like name, contact information, and driver's license number.
3. The **Reservation** class represents a reservation made by a customer for a specific car and date range. It includes properties such as reservation ID, customer, car, start date, end date, and total price.
4. The **PaymentProcessor** interface defines the contract for payment processing, and the CreditCardPaymentProcessor and PayPalPaymentProcessor classes are concrete implementations of the payment processor.
5. The **RentalSystem** class is the core of the car rental system and follows the Singleton pattern to ensure a single instance of the rental system.
6. The RentalSystem class uses concurrent data structures (ConcurrentHashMap) to handle concurrent access to cars and reservations.
7. The **RentalSystem** class provides methods for adding and removing cars, searching for available cars based on criteria, making reservations, canceling reservations, and processing payments.
8. The **CarRentalSystem** class serves as the entry point of the application and demonstrates the usage of the car rental system.
```


**car.py**

```py
class Car:
    def __init__(self, make, model, year, license_plate, rental_price_per_day):
        self.make = make
        self.model = model
        self.year = year
        self.license_plate = license_plate
        self.rental_price_per_day = rental_price_per_day
        self.available = True

    def get_rental_price_per_day(self):
        return self.rental_price_per_day

    def get_license_plate(self):
        return self.license_plate

    def get_make(self):
        return self.make

    def get_model(self):
        return self.model

    def is_available(self):
        return self.available

    def set_available(self, available):
        self.available = available
```


**car_rental_system_demo.py**

```py

from rental_system import RentalSystem
from car import Car
from customer import Customer
from datetime import date, timedelta

class CarRentalSystemDemo:
    @staticmethod
    def run():
            rental_system = RentalSystem.get_instance()

            # Add cars to the rental system
            rental_system.add_car(Car("Toyota", "Camry", 2022, "ABC123", 50.0))
            rental_system.add_car(Car("Honda", "Civic", 2021, "XYZ789", 45.0))
            rental_system.add_car(Car("Ford", "Mustang", 2023, "DEF456", 80.0))

            # Create customers
            customer1 = Customer("John Doe", "john@example.com", "DL1234")
            customer2 = Customer("Jane Smith", "jane@example.com", "DL5678")

            # Make reservations
            start_date = date.today()
            end_date = start_date + timedelta(days=3)
            available_cars = rental_system.search_cars("Toyota", "Camry", start_date, end_date)

            if available_cars:
                selected_car = available_cars[0]
                reservation = rental_system.make_reservation(customer1, selected_car, start_date, end_date)
                if reservation is not None:
                    payment_success = rental_system.process_payment(reservation)
                    if payment_success:
                        print(f"Reservation successful. Reservation ID: {reservation.get_reservation_id()}")
                    else:
                        print("Payment failed. Reservation canceled.")
                        rental_system.cancel_reservation(reservation.get_reservation_id())
                else:
                    print("Selected car is not available for the given dates.")
            else:
                print("No available cars found for the given criteria.")

if __name__ == "__main__":
    CarRentalSystemDemo.run()
```


**credit_card_payment_processor.py**

```py
from payment_processor import PaymentProcessor

class CreditCardPaymentProcessor(PaymentProcessor):
    def process_payment(self, amount):
        # Process credit card payment
        # ...
        return True
```


**customer.py**

```py
class Customer:
    def __init__(self, name, contact_info, drivers_license_number):
        self.name = name
        self.contact_info = contact_info
        self.drivers_license_number = drivers_license_number
```


**payment_processor.py**

```py
from abc import ABC, abstractmethod

class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount):
        pass
```


**paypal_payment_processor.py**

```py
from payment_processor import PaymentProcessor

class PayPalPaymentProcessor(PaymentProcessor):
    def process_payment(self, amount):
        # Process PayPal payment
        # ...
        return True
```


**rental_system.py**

```py
import uuid
from credit_card_payment_processor import CreditCardPaymentProcessor
from reservation import Reservation

class RentalSystem:
    _instance = None

    def __init__(self):
        if RentalSystem._instance is not None:
            raise Exception("This class is a singleton!")
        else:
            RentalSystem._instance = self
            self.cars = {}
            self.reservations = {}
            self.payment_processor = CreditCardPaymentProcessor()

    @staticmethod
    def get_instance():
        if RentalSystem._instance is None:
            RentalSystem()
        return RentalSystem._instance

    def add_car(self, car):
        self.cars[car.license_plate] = car

    def remove_car(self, license_plate):
        self.cars.pop(license_plate, None)

    def search_cars(self, make, model, start_date, end_date):
        available_cars = []
        for car in self.cars.values():
            if car.make.lower() == make.lower() and car.model.lower() == model.lower() and car.available:
                if self.is_car_available(car, start_date, end_date):
                    available_cars.append(car)
        return available_cars

    def is_car_available(self, car, start_date, end_date):
        for reservation in self.reservations.values():
            if reservation.get_car() == car:
                if start_date < reservation.get_end_date() and end_date > reservation.get_start_date():
                    return False
        return True

    def make_reservation(self, customer, car, start_date, end_date):
        if self.is_car_available(car, start_date, end_date):
            reservation_id = self.generate_reservation_id()
            reservation = Reservation(reservation_id, customer, car, start_date, end_date)
            self.reservations[reservation_id] = reservation
            car.set_available(False)
            return reservation
        return None

    def cancel_reservation(self, reservation_id):
        reservation = self.reservations.pop(reservation_id, None)
        if reservation is not None:
            reservation.get_car().set_available(True)

    def process_payment(self, reservation):
        return self.payment_processor.process_payment(reservation.get_total_price())

    def generate_reservation_id(self):
        return "RES" + str(uuid.uuid4())[:8].upper()
```


**reservation.py**

```py
from datetime import date, timedelta

class Reservation:
    def __init__(self, reservation_id, customer, car, start_date, end_date):
        self.reservation_id = reservation_id
        self.customer = customer
        self.car = car
        self.start_date = start_date
        self.end_date = end_date
        self.total_price = self.calculate_total_price()

    def calculate_total_price(self):
        days_rented = (self.end_date - self.start_date).days + 1
        return self.car.rental_price_per_day * days_rented

    def get_start_date(self):
        return self.start_date

    def get_end_date(self):
        return self.end_date

    def get_car(self):
        return self.car

    def get_total_price(self):
        return self.total_price

    def get_reservation_id(self):
        return self.reservation_id
```

</details>

<details><summary><b>cpp</b> (10 files)</summary>


**Car.cpp**

```cpp
#include "Car.hpp"
#include <iostream>
#include <iomanip>

Car::Car(std::string carId, std::string brand, std::string model, double basePrice)
    : carId(carId), brand(brand), model(model), basePrice(basePrice), available(true) {}

std::string Car::getCarId() const { return carId; }
std::string Car::getBrand() const { return brand; }
std::string Car::getModel() const { return model; }
double Car::getBasePrice() const { return basePrice; }
bool Car::isAvailable() const { return available; }

void Car::setAvailable(bool status) {
    available = status;
}

void Car::displayInfo() const {
    std::cout << "Car ID: " << carId << std::endl;
    std::cout << "Brand: " << brand << std::endl;
    std::cout << "Model: " << model << std::endl;
    std::cout << "Base Price per Day: $" << std::fixed << std::setprecision(2) << basePrice << std::endl;
    std::cout << "Status: " << (available ? "Available" : "Rented") << std::endl;
}
```


**Car.hpp**

```hpp
#ifndef CAR_HPP
#define CAR_HPP

#include <string>

class Car {
private:
    std::string carId;
    std::string brand;
    std::string model;
    double basePrice;
    bool available;

public:
    Car(std::string carId, std::string brand, std::string model, double basePrice);
    
    std::string getCarId() const;
    std::string getBrand() const;
    std::string getModel() const;
    double getBasePrice() const;
    bool isAvailable() const;
    
    void setAvailable(bool status);
    void displayInfo() const;
};

#endif
```


**CarRentalSystem.cpp**

```cpp
#include "CarRentalSystem.hpp"
#include <iostream>
#include <algorithm>

CarRentalSystem::CarRentalSystem() : rentalIdCounter(1) {}

CarRentalSystem::~CarRentalSystem() {
    for (auto car : cars) delete car;
    for (auto customer : customers) delete customer;
    for (auto rental : rentals) delete rental;
}

void CarRentalSystem::addCar(Car* car) {
    cars.push_back(car);
}

void CarRentalSystem::addCustomer(Customer* customer) {
    customers.push_back(customer);
}

std::string CarRentalSystem::rentCar(Car* car, Customer* customer, 
                                   std::string startDate, int days) {
    if (!car->isAvailable()) return "";
    
    std::string rentalId = "R" + std::to_string(rentalIdCounter++);
    Rental* rental = new Rental(rentalId, car, customer, startDate, days);
    rentals.push_back(rental);
    car->setAvailable(false);
    return rentalId;
}

bool CarRentalSystem::returnCar(std::string rentalId) {
    Rental* rental = findRental(rentalId);
    if (!rental) return false;
    
    rental->getCar()->setAvailable(true);
    
    auto it = std::find(rentals.begin(), rentals.end(), rental);
    if (it != rentals.end()) {
        rentals.erase(it);
        delete rental;
        return true;
    }
    return false;
}

void CarRentalSystem::displayAvailableCars() const {
    std::cout << "\nAvailable Cars:" << std::endl;
    for (const auto& car : cars) {
        if (car->isAvailable()) {
            car->displayInfo();
            std::cout << "------------------------" << std::endl;
        }
    }
}

void CarRentalSystem::displayRentals() const {
    std::cout << "\nCurrent Rentals:" << std::endl;
    for (const auto& rental : rentals) {
        rental->displayInfo();
        std::cout << "------------------------" << std::endl;
    }
}

void CarRentalSystem::displayCustomers() const {
    std::cout << "\nRegistered Customers:" << std::endl;
    for (const auto& customer : customers) {
        customer->displayInfo();
        std::cout << "------------------------" << std::endl;
    }
}

Car* CarRentalSystem::findCar(std::string carId) const {
    for (auto car : cars) {
        if (car->getCarId() == carId) return car;
    }
    return nullptr;
}

Customer* CarRentalSystem::findCustomer(std::string customerId) const {
    for (auto customer : customers) {
        if (customer->getCustomerId() == customerId) return customer;
    }
    return nullptr;
}

Rental* CarRentalSystem::findRental(std::string rentalId) const {
    for (auto rental : rentals) {
        if (rental->getRentalId() == rentalId) return rental;
    }
    return nullptr;
}
```


**CarRentalSystem.hpp**

```hpp
#ifndef CAR_RENTAL_SYSTEM_HPP
#define CAR_RENTAL_SYSTEM_HPP

#include <vector>
#include <string>
#include "Car.hpp"
#include "Customer.hpp"
#include "Rental.hpp"

class CarRentalSystem {
private:
    std::vector<Car*> cars;
    std::vector<Customer*> customers;
    std::vector<Rental*> rentals;
    int rentalIdCounter;

public:
    CarRentalSystem();
    ~CarRentalSystem();
    
    void addCar(Car* car);
    void addCustomer(Customer* customer);
    std::string rentCar(Car* car, Customer* customer, std::string startDate, int days);
    bool returnCar(std::string rentalId);
    
    void displayAvailableCars() const;
    void displayRentals() const;
    void displayCustomers() const;
    
    Car* findCar(std::string carId) const;
    Customer* findCustomer(std::string customerId) const;
    Rental* findRental(std::string rentalId) const;
};

#endif
```


**CarRentalSystemDemo.cpp**

```cpp
#include "CarRentalSystem.hpp"
#include <iostream>

int main() {
    CarRentalSystem rentalSystem;
    
    // Add some cars
    Car* car1 = new Car("C001", "Toyota", "Camry", 60.0);
    Car* car2 = new Car("C002", "Honda", "Accord", 70.0);
    Car* car3 = new Car("C003", "BMW", "3 Series", 100.0);
    
    rentalSystem.addCar(car1);
    rentalSystem.addCar(car2);
    rentalSystem.addCar(car3);
    
    // Add some customers
    Customer* customer1 = new Customer("CUST001", "John Doe", "+1-555-0123");
    Customer* customer2 = new Customer("CUST002", "Jane Smith", "+1-555-0124");
    
    rentalSystem.addCustomer(customer1);
    rentalSystem.addCustomer(customer2);
    
    // Display available cars
    rentalSystem.displayAvailableCars();
    
    // Rent some cars
    std::string rental1 = rentalSystem.rentCar(car1, customer1, "2024-03-20", 3);
    std::string rental2 = rentalSystem.rentCar(car2, customer2, "2024-03-21", 5);
    
    if (!rental1.empty()) {
        std::cout << "\nRental created successfully: " << rental1 << std::endl;
    }
    if (!rental2.empty()) {
        std::cout << "Rental created successfully: " << rental2 << std::endl;
    }
    
    // Display all rentals
    rentalSystem.displayRentals();
    
    // Display available cars after rentals
    rentalSystem.displayAvailableCars();
    
    // Return a car
    if (rentalSystem.returnCar(rental1)) {
        std::cout << "\nCar returned successfully for rental: " << rental1 << std::endl;
    }
    
    // Display available cars after return
    rentalSystem.displayAvailableCars();
    
    return 0;
}
```


**Customer.cpp**

```cpp
#include "Customer.hpp"
#include <iostream>

Customer::Customer(std::string customerId, std::string name, std::string contactNumber)
    : customerId(customerId), name(name), contactNumber(contactNumber) {}

std::string Customer::getCustomerId() const { return customerId; }
std::string Customer::getName() const { return name; }
std::string Customer::getContactNumber() const { return contactNumber; }

void Customer::displayInfo() const {
    std::cout << "Customer ID: " << customerId << std::endl;
    std::cout << "Name: " << name << std::endl;
    std::cout << "Contact Number: " << contactNumber << std::endl;
}
```


**Customer.hpp**

```hpp
#ifndef CUSTOMER_HPP
#define CUSTOMER_HPP

#include <string>

class Customer {
private:
    std::string customerId;
    std::string name;
    std::string contactNumber;

public:
    Customer(std::string customerId, std::string name, std::string contactNumber);
    
    std::string getCustomerId() const;
    std::string getName() const;
    std::string getContactNumber() const;
    void displayInfo() const;
};

#endif
```


**README.md**

```md
# Designing a Car Rental System

## Requirements
1. The car rental system should allow customers to browse and reserve available cars for specific dates.
2. Each car should have details such as make, model, year, license plate number, and rental price per day.
3. Customers should be able to search for cars based on various criteria, such as car type, price range, and availability.
4. The system should handle reservations, including creating, modifying, and canceling reservations.
5. The system should keep track of the availability of cars and update their status accordingly.
6. The system should handle customer information, including name, contact details, and driver's license information.
7. The system should handle payment processing for reservations.
8. The system should be able to handle concurrent reservations and ensure data consistency.

## Classes, Interfaces and Enumerations
1. The **Car** class represents a car in the rental system, with properties such as make, model, year, license plate number, rental price per day, and availability status.
2. The **Customer** class represents a customer, with properties like name, contact information, and driver's license number.
3. The **Reservation** class represents a reservation made by a customer for a specific car and date range. It includes properties such as reservation ID, customer, car, start date, end date, and total price.
4. The **PaymentProcessor** interface defines the contract for payment processing, and the CreditCardPaymentProcessor and PayPalPaymentProcessor classes are concrete implementations of the payment processor.
5. The **RentalSystem** class is the core of the car rental system and follows the Singleton pattern to ensure a single instance of the rental system.
6. The RentalSystem class uses concurrent data structures (ConcurrentHashMap) to handle concurrent access to cars and reservations.
7. The **RentalSystem** class provides methods for adding and removing cars, searching for available cars based on criteria, making reservations, canceling reservations, and processing payments.
8. The **CarRentalSystem** class serves as the entry point of the application and demonstrates the usage of the car rental system.
```


**Rental.cpp**

```cpp
#include "Rental.hpp"
#include <iostream>
#include <iomanip>

Rental::Rental(std::string rentalId, Car* car, Customer* customer, 
               std::string startDate, int days)
    : rentalId(rentalId), car(car), customer(customer), 
      startDate(startDate), days(days) {
    totalPrice = car->getBasePrice() * days;
}

std::string Rental::getRentalId() const { return rentalId; }
Car* Rental::getCar() const { return car; }
Customer* Rental::getCustomer() const { return customer; }
std::string Rental::getStartDate() const { return startDate; }
int Rental::getDays() const { return days; }
double Rental::getTotalPrice() const { return totalPrice; }

void Rental::displayInfo() const {
    std::cout << "\nRental Details:" << std::endl;
    std::cout << "Rental ID: " << rentalId << std::endl;
    std::cout << "Start Date: " << startDate << std::endl;
    std::cout << "Duration: " << days << " days" << std::endl;
    std::cout << "Total Price: $" << std::fixed << std::setprecision(2) << totalPrice << std::endl;
    std::cout << "\nCustomer Information:" << std::endl;
    customer->displayInfo();
    std::cout << "\nCar Information:" << std::endl;
    car->displayInfo();
}
```


**Rental.hpp**

```hpp
#ifndef RENTAL_HPP
#define RENTAL_HPP

#include "Car.hpp"
#include "Customer.hpp"
#include <string>

class Rental {
private:
    std::string rentalId;
    Car* car;
    Customer* customer;
    std::string startDate;
    int days;
    double totalPrice;

public:
    Rental(std::string rentalId, Car* car, Customer* customer, 
           std::string startDate, int days);
    
    std::string getRentalId() const;
    Car* getCar() const;
    Customer* getCustomer() const;
    std::string getStartDate() const;
    int getDays() const;
    double getTotalPrice() const;
    
    void displayInfo() const;
};

#endif
```

</details>

<details><summary><b>golang</b> (9 files)</summary>


**README.md**

```md
# Designing a Car Rental System

## Requirements
1. The car rental system should allow customers to browse and reserve available cars for specific dates.
2. Each car should have details such as make, model, year, license plate number, and rental price per day.
3. Customers should be able to search for cars based on various criteria, such as car type, price range, and availability.
4. The system should handle reservations, including creating, modifying, and canceling reservations.
5. The system should keep track of the availability of cars and update their status accordingly.
6. The system should handle customer information, including name, contact details, and driver's license information.
7. The system should handle payment processing for reservations.
8. The system should be able to handle concurrent reservations and ensure data consistency.

## Classes, Interfaces and Enumerations
1. The **Car** class represents a car in the rental system, with properties such as make, model, year, license plate number, rental price per day, and availability status.
2. The **Customer** class represents a customer, with properties like name, contact information, and driver's license number.
3. The **Reservation** class represents a reservation made by a customer for a specific car and date range. It includes properties such as reservation ID, customer, car, start date, end date, and total price.
4. The **PaymentProcessor** interface defines the contract for payment processing, and the CreditCardPaymentProcessor and PayPalPaymentProcessor classes are concrete implementations of the payment processor.
5. The **RentalSystem** class is the core of the car rental system and follows the Singleton pattern to ensure a single instance of the rental system.
6. The RentalSystem class uses concurrent data structures (ConcurrentHashMap) to handle concurrent access to cars and reservations.
7. The **RentalSystem** class provides methods for adding and removing cars, searching for available cars based on criteria, making reservations, canceling reservations, and processing payments.
8. The **CarRentalSystem** class serves as the entry point of the application and demonstrates the usage of the car rental system.
```


**car.go**

```go
package carrentalsystem

import "sync"

type Car struct {
	Make              string
	Model             string
	Year              int
	LicensePlate      string
	RentalPricePerDay float64
	available         bool
	mu                sync.Mutex
}

func NewCar(make, model string, year int, licensePlate string, rentalPricePerDay float64) *Car {
	return &Car{
		Make:              make,
		Model:             model,
		Year:              year,
		LicensePlate:      licensePlate,
		RentalPricePerDay: rentalPricePerDay,
		available:         true,
	}
}

func (c *Car) IsAvailable() bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.available
}

func (c *Car) SetAvailable(available bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.available = available
}
```


**car_rental_system_demo.go**

```go
package carrentalsystem

import (
	"fmt"
	"time"
)

func Run() {
	rentalSystem := GetRentalSystem()

	// Add cars to the rental system
	rentalSystem.AddCar(NewCar("Toyota", "Camry", 2022, "ABC123", 50.0))
	rentalSystem.AddCar(NewCar("Honda", "Civic", 2021, "XYZ789", 45.0))
	rentalSystem.AddCar(NewCar("Ford", "Mustang", 2023, "DEF456", 80.0))

	// Create customer
	customer := NewCustomer("John Doe", "john@example.com", "DL1234")

	// Make reservation
	startDate := time.Now()
	endDate := startDate.AddDate(0, 0, 3)

	availableCars := rentalSystem.SearchCars("Toyota", "Camry", startDate, endDate)
	if len(availableCars) > 0 {
		selectedCar := availableCars[0]
		reservation, err := rentalSystem.MakeReservation(customer, selectedCar, startDate, endDate)
		if err == nil {
			if rentalSystem.ProcessPayment(reservation) {
				fmt.Printf("Reservation successful. Reservation ID: %s\n", reservation.ReservationID)
			} else {
				fmt.Println("Payment failed. Reservation canceled.")
				rentalSystem.CancelReservation(reservation.ReservationID)
			}
		} else {
			fmt.Printf("Reservation failed: %v\n", err)
		}
	} else {
		fmt.Println("No available cars found for the given criteria.")
	}
}
```


**credit_card_processor.go**

```go
package carrentalsystem

type CreditCardPaymentProcessor struct{}

func NewCreditCardPaymentProcessor() *CreditCardPaymentProcessor {
	return &CreditCardPaymentProcessor{}
}

func (p *CreditCardPaymentProcessor) ProcessPayment(amount float64) bool {
	// Process credit card payment
	return true
}
```


**customer.go**

```go
package carrentalsystem

type Customer struct {
	Name                 string
	ContactInfo          string
	DriversLicenseNumber string
}

func NewCustomer(name, contactInfo, driversLicenseNumber string) *Customer {
	return &Customer{
		Name:                 name,
		ContactInfo:          contactInfo,
		DriversLicenseNumber: driversLicenseNumber,
	}
}
```


**payment_processor.go**

```go
package carrentalsystem

type PaymentProcessor interface {
	ProcessPayment(amount float64) bool
}
```


**paypal_processor.go**

```go
package carrentalsystem

type PayPalPaymentProcessor struct{}

func NewPayPalPaymentProcessor() *PayPalPaymentProcessor {
	return &PayPalPaymentProcessor{}
}

func (p *PayPalPaymentProcessor) ProcessPayment(amount float64) bool {
	// Process PayPal payment
	return true
}
```


**rental_system.go**

```go
package carrentalsystem

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"
	"sync"
	"time"
)

type RentalSystem struct {
	cars         map[string]*Car
	reservations map[string]*Reservation
	processor    PaymentProcessor
	mu           sync.RWMutex
}

var (
	instance *RentalSystem
	once     sync.Once
)

func GetRentalSystem() *RentalSystem {
	once.Do(func() {
		instance = &RentalSystem{
			cars:         make(map[string]*Car),
			reservations: make(map[string]*Reservation),
			processor:    NewCreditCardPaymentProcessor(),
		}
	})
	return instance
}

func (rs *RentalSystem) AddCar(car *Car) {
	rs.mu.Lock()
	defer rs.mu.Unlock()
	rs.cars[car.LicensePlate] = car
}

func (rs *RentalSystem) RemoveCar(licensePlate string) {
	rs.mu.Lock()
	defer rs.mu.Unlock()
	delete(rs.cars, licensePlate)
}

func (rs *RentalSystem) SearchCars(make, model string, startDate, endDate time.Time) []*Car {
	rs.mu.RLock()
	defer rs.mu.RUnlock()

	var availableCars []*Car
	for _, car := range rs.cars {
		if strings.EqualFold(car.Make, make) &&
			strings.EqualFold(car.Model, model) &&
			car.IsAvailable() &&
			rs.isCarAvailable(car, startDate, endDate) {
			availableCars = append(availableCars, car)
		}
	}
	return availableCars
}

func (rs *RentalSystem) isCarAvailable(car *Car, startDate, endDate time.Time) bool {
	for _, reservation := range rs.reservations {
		if reservation.Car == car {
			if !startDate.After(reservation.EndDate) && !endDate.Before(reservation.StartDate) {
				return false
			}
		}
	}
	return true
}

func (rs *RentalSystem) MakeReservation(customer *Customer, car *Car, startDate, endDate time.Time) (*Reservation, error) {
	rs.mu.Lock()
	defer rs.mu.Unlock()

	if !rs.isCarAvailable(car, startDate, endDate) {
		return nil, fmt.Errorf("car is not available for the selected dates")
	}

	reservationID := rs.generateReservationID()
	reservation := NewReservation(reservationID, customer, car, startDate, endDate)
	rs.reservations[reservationID] = reservation
	car.SetAvailable(false)

	return reservation, nil
}

func (rs *RentalSystem) CancelReservation(reservationID string) {
	rs.mu.Lock()
	defer rs.mu.Unlock()

	if reservation, exists := rs.reservations[reservationID]; exists {
		reservation.Car.SetAvailable(true)
		delete(rs.reservations, reservationID)
	}
}

func (rs *RentalSystem) ProcessPayment(reservation *Reservation) bool {
	return rs.processor.ProcessPayment(reservation.TotalPrice)
}

func (rs *RentalSystem) generateReservationID() string {
	bytes := make([]byte, 4)
	rand.Read(bytes)
	return fmt.Sprintf("RES%s", hex.EncodeToString(bytes))
}
```


**reservation.go**

```go
package carrentalsystem

import (
	"time"
)

type Reservation struct {
	ReservationID string
	Customer      *Customer
	Car           *Car
	StartDate     time.Time
	EndDate       time.Time
	TotalPrice    float64
}

func NewReservation(reservationID string, customer *Customer, car *Car, startDate, endDate time.Time) *Reservation {
	res := &Reservation{
		ReservationID: reservationID,
		Customer:      customer,
		Car:           car,
		StartDate:     startDate,
		EndDate:       endDate,
	}
	res.TotalPrice = res.calculateTotalPrice()
	return res
}

func (r *Reservation) calculateTotalPrice() float64 {
	days := r.EndDate.Sub(r.StartDate).Hours() / 24
	return r.Car.RentalPricePerDay * days
}
```

</details>

<details><summary><b>csharp</b> (9 files)</summary>


**Car.cs**

```cs
namespace CarRentalSystem
{
    public class Car
    {
        public string Make { get; }
        public string Model { get; }
        public int Year { get; }
        public string LicensePlate { get; }
        public double RentalPricePerDay { get; }
        public bool Available { get; private set; }

        public Car(string make, string model, int year, string licensePlate, double rentalPricePerDay)
        {
            Make = make;
            Model = model;
            Year = year;
            LicensePlate = licensePlate;
            RentalPricePerDay = rentalPricePerDay;
            Available = true;
        }

        public void SetAvailable(bool available)
        {
            Available = available;
        }
    }
}
```


**CarRentalSystemDemo.cs**

```cs
using System;
using System.Collections.Generic;

namespace CarRentalSystem
{
    public class CarRentalSystemDemo
    {
        public static void Run()
        {
            var rentalSystem = RentalSystem.Instance;

            // Add cars to the rental system
            rentalSystem.AddCar(new Car("Toyota", "Camry", 2022, "ABC123", 50.0));
            rentalSystem.AddCar(new Car("Honda", "Civic", 2021, "XYZ789", 45.0));
            rentalSystem.AddCar(new Car("Ford", "Mustang", 2023, "DEF456", 80.0));

            // Create customers
            var customer1 = new Customer("John Doe", "john@example.com", "DL1234");

            // Make reservations
            var startDate = DateTime.Now;
            var endDate = startDate.AddDays(3);
            List<Car> availableCars = rentalSystem.SearchCars("Toyota", "Camry", startDate, endDate);
            if (availableCars.Count > 0)
            {
                Car selectedCar = availableCars[0];
                var reservation = rentalSystem.MakeReservation(customer1, selectedCar, startDate, endDate);
                if (reservation != null)
                {
                    bool paymentSuccess = rentalSystem.ProcessPayment(reservation);
                    if (paymentSuccess)
                    {
                        Console.WriteLine("Reservation successful. Reservation ID: " + reservation.ReservationId);
                    }
                    else
                    {
                        Console.WriteLine("Payment failed. Reservation canceled.");
                        rentalSystem.CancelReservation(reservation.ReservationId);
                    }
                }
                else
                {
                    Console.WriteLine("Selected car is not available for the given dates.");
                }
            }
            else
            {
                Console.WriteLine("No available cars found for the given criteria.");
            }
        }
    }
}
```


**CreditCardPaymentProcessor.cs**

```cs
namespace CarRentalSystem
{
    public class CreditCardPaymentProcessor : IPaymentProcessor
    {
        public bool ProcessPayment(double amount)
        {
            // Simulate processing payment
            // Actual implementation would involve integrating with a payment gateway
            return true;
        }
    }
}
```


**Customer.cs**

```cs
namespace CarRentalSystem
{
    public class Customer
    {
        public string Name { get; }
        public string ContactInfo { get; }
        public string DriversLicenseNumber { get; }

        public Customer(string name, string contactInfo, string driversLicenseNumber)
        {
            Name = name;
            ContactInfo = contactInfo;
            DriversLicenseNumber = driversLicenseNumber;
        }
    }
}
```


**IPaymentProcessor.cs**

```cs
namespace CarRentalSystem
{
    public interface IPaymentProcessor
    {
        bool ProcessPayment(double amount);
    }
}
```


**PayPalPaymentProcessor.cs**

```cs
namespace CarRentalSystem
{
    public class PayPalPaymentProcessor : IPaymentProcessor
    {
        public bool ProcessPayment(double amount)
        {
            // Simulate processing PayPal payment
            return true;
        }
    }
}
```


**README.md**

```md
# Designing a Car Rental System

## Requirements
1. The car rental system should allow customers to browse and reserve available cars for specific dates.
2. Each car should have details such as make, model, year, license plate number, and rental price per day.
3. Customers should be able to search for cars based on various criteria, such as car type, price range, and availability.
4. The system should handle reservations, including creating, modifying, and canceling reservations.
5. The system should keep track of the availability of cars and update their status accordingly.
6. The system should handle customer information, including name, contact details, and driver's license information.
7. The system should handle payment processing for reservations.
8. The system should be able to handle concurrent reservations and ensure data consistency.

## Classes, Interfaces and Enumerations
1. The **Car** class represents a car in the rental system, with properties such as make, model, year, license plate number, rental price per day, and availability status.
2. The **Customer** class represents a customer, with properties like name, contact information, and driver's license number.
3. The **Reservation** class represents a reservation made by a customer for a specific car and date range. It includes properties such as reservation ID, customer, car, start date, end date, and total price.
4. The **PaymentProcessor** interface defines the contract for payment processing, and the CreditCardPaymentProcessor and PayPalPaymentProcessor classes are concrete implementations of the payment processor.
5. The **RentalSystem** class is the core of the car rental system and follows the Singleton pattern to ensure a single instance of the rental system.
6. The RentalSystem class uses concurrent data structures (ConcurrentHashMap) to handle concurrent access to cars and reservations.
7. The **RentalSystem** class provides methods for adding and removing cars, searching for available cars based on criteria, making reservations, canceling reservations, and processing payments.
8. The **CarRentalSystem** class serves as the entry point of the application and demonstrates the usage of the car rental system.
```


**RentalSystem.cs**

```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace CarRentalSystem
{
    public class RentalSystem
    {
        private static RentalSystem instance;
        private readonly Dictionary<string, Car> cars;
        private readonly Dictionary<string, Reservation> reservations;
        private readonly IPaymentProcessor paymentProcessor;

        private RentalSystem()
        {
            cars = new Dictionary<string, Car>();
            reservations = new Dictionary<string, Reservation>();
            paymentProcessor = new CreditCardPaymentProcessor();  // Default to credit card payment processor
        }

        public static RentalSystem Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new RentalSystem();
                }
                return instance;
            }
        }

        public void AddCar(Car car)
        {
            cars[car.LicensePlate] = car;
        }

        public void RemoveCar(string licensePlate)
        {
            cars.Remove(licensePlate);
        }

        public List<Car> SearchCars(string make, string model, DateTime startDate, DateTime endDate)
        {
            return cars.Values
                .Where(car => car.Make.Equals(make, StringComparison.OrdinalIgnoreCase)
                              && car.Model.Equals(model, StringComparison.OrdinalIgnoreCase)
                              && car.Available && IsCarAvailable(car, startDate, endDate))
                .ToList();
        }

        private bool IsCarAvailable(Car car, DateTime startDate, DateTime endDate)
        {
            return reservations.Values
                .Where(reservation => reservation.Car == car)
                .All(reservation => endDate < reservation.StartDate || startDate > reservation.EndDate);
        }

        public Reservation MakeReservation(Customer customer, Car car, DateTime startDate, DateTime endDate)
        {
            if (IsCarAvailable(car, startDate, endDate))
            {
                var reservationId = GenerateReservationId();
                var reservation = new Reservation(reservationId, customer, car, startDate, endDate);
                reservations[reservationId] = reservation;
                car.SetAvailable(false);
                return reservation;
            }
            return null;
        }

        public void CancelReservation(string reservationId)
        {
            if (reservations.TryGetValue(reservationId, out var reservation))
            {
                reservations.Remove(reservationId);
                reservation.Car.SetAvailable(true);
            }
        }

        public bool ProcessPayment(Reservation reservation)
        {
            return paymentProcessor.ProcessPayment(reservation.TotalPrice);
        }

        private string GenerateReservationId()
        {
            return "RES" + Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
        }
    }
}
```


**Reservation.cs**

```cs
using System;

namespace CarRentalSystem
{
    public class Reservation
    {
        public string ReservationId { get; }
        public Customer Customer { get; }
        public Car Car { get; }
        public DateTime StartDate { get; }
        public DateTime EndDate { get; }
        public double TotalPrice { get; }

        public Reservation(string reservationId, Customer customer, Car car, DateTime startDate, DateTime endDate)
        {
            ReservationId = reservationId;
            Customer = customer;
            Car = car;
            StartDate = startDate;
            EndDate = endDate;
            TotalPrice = CalculateTotalPrice();
        }

        private double CalculateTotalPrice()
        {
            int daysRented = (EndDate - StartDate).Days + 1;
            return Car.RentalPricePerDay * daysRented;
        }
    }
}
```

</details>
