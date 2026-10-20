# Low-level design problem: coffee vending machine

> Copied from <https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/coffee-vending-machine.md> (GPL-3.0, by Ashish Pratap Singh). Questions and answers are the source's own; nothing was answered or rewritten here.


# Designing a Coffee Vending Machine

## Requirements
1. The coffee vending machine should support different types of coffee, such as espresso, cappuccino, and latte.
2. Each type of coffee should have a specific price and recipe (ingredients and their quantities).
3. The machine should have a menu to display the available coffee options and their prices.
4. Users should be able to select a coffee type and make a payment.
5. The machine should dispense the selected coffee and provide change if necessary.
6. The machine should track the inventory of ingredients and notify when they are running low.
7. The machine should handle multiple user requests concurrently and ensure thread safety.

## UML Class Diagram

![](images/awesome-low-level-design_class-diagrams_coffeevendingmachine-class-diagram.png)

## Implementations
#### [Java Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/java/src/coffeevendingmachine) 
#### [Python Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/python/coffeevendingmachine)
#### [C++ Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/cpp/coffeevendingmachine)
#### [C# Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/csharp/coffeevendingmachine)
#### [Go Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/golang/coffeevendingmachine)
#### [TypeScript Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/typescript/src/CoffeeVendingMachine)

## Classes, Interfaces and Enumerations
1. The **Coffee** class represents a coffee type with its name, price, and recipe (ingredients and their quantities).
2. The **Ingredient** class represents an ingredient used in making coffee, with its name and quantity. It provides a synchronized method to update the quantity.
3. The **Payment** class represents a payment made by a user, with the amount paid.
4. The **CoffeeMachine** class is the main class that manages the coffee vending machine. It follows the Singleton pattern to ensure a single instance of the machine.
5. The **CoffeeMachine** class initializes the coffee menu and ingredients in its constructor. It provides methods to display the menu, select a coffee, dispense coffee, and update ingredient quantities.
6. The hasEnoughIngredients method checks if there are sufficient ingredients to make a selected coffee, while the updateIngredients method updates the ingredient quantities after dispensing a coffee.
7. The **CoffeeVendingMachine** class is the entry point of the application and demonstrates the usage of the coffee vending machine. It creates an instance of the machine, displays the menu, and simulates concurrent user requests using an ExecutorService.

---

## Official solutions from the repository

<details><summary><b>java</b> (20 files)</summary>


**CoffeeVendingMachine.java**

```java
package coffeevendingmachine;


import coffeevendingmachine.decorator.CaramelSyrupDecorator;
import coffeevendingmachine.decorator.ExtraSugarDecorator;
import coffeevendingmachine.enums.CoffeeType;
import coffeevendingmachine.enums.ToppingType;
import coffeevendingmachine.factory.CoffeeFactory;
import coffeevendingmachine.state.ReadyState;
import coffeevendingmachine.state.VendingMachineState;
import coffeevendingmachine.decorator.Coffee;

import java.util.List;

public class CoffeeVendingMachine {
    private static final CoffeeVendingMachine INSTANCE = new CoffeeVendingMachine();
    private VendingMachineState state;
    private Coffee selectedCoffee;
    private int moneyInserted;

    private CoffeeVendingMachine() {
        this.state = new ReadyState();
        this.moneyInserted = 0;
    }

    public static CoffeeVendingMachine getInstance() {
        return INSTANCE;
    }

    // --- Actions delegated to the current state ---
    public void selectCoffee(CoffeeType type, List<ToppingType> toppings) {
        // 1. Create the base coffee using the factory
        Coffee coffee = CoffeeFactory.createCoffee(type);

        // 2. Wrap it with decorators
        for (ToppingType topping : toppings) {
            switch (topping) {
                case EXTRA_SUGAR:
                    coffee = new ExtraSugarDecorator(coffee);
                    break;
                case CARAMEL_SYRUP:
                    coffee = new CaramelSyrupDecorator(coffee);
                    break;
            }
        }
        // Let the state handle the rest
        this.state.selectCoffee(this, coffee);
    }

    public void insertMoney(int amount) { state.insertMoney(this, amount); }
    public void dispenseCoffee() { state.dispenseCoffee(this); }
    public void cancel() { state.cancel(this); }

    // --- Getters and Setters used by State objects ---
    public void setState(VendingMachineState state) { this.state = state; }
    public VendingMachineState getState() { return state; }
    public void setSelectedCoffee(Coffee selectedCoffee) { this.selectedCoffee = selectedCoffee; }
    public Coffee getSelectedCoffee() { return selectedCoffee; }
    public void setMoneyInserted(int moneyInserted) { this.moneyInserted = moneyInserted; }
    public int getMoneyInserted() { return moneyInserted; }

    public void reset() {
        this.selectedCoffee = null;
        this.moneyInserted = 0;
    }

    public Map<String, Integer> showIngredientsMap() {
        return ingredientStore.getAllIngredients();
    }
}
```


**CoffeeVendingMachineDemo.java**

```java
package coffeevendingmachine;

import coffeevendingmachine.enums.CoffeeType;
import coffeevendingmachine.enums.Ingredient;
import coffeevendingmachine.enums.ToppingType;

import java.util.List;

public class CoffeeVendingMachineDemo {
    public static void main(String[] args) {
        CoffeeVendingMachine machine = CoffeeVendingMachine.getInstance();
        Inventory inventory = Inventory.getInstance();

        // --- Initial setup: Refill inventory ---
        System.out.println("=== Initializing Vending Machine ===");
        inventory.addStock(Ingredient.COFFEE_BEANS, 50);
        inventory.addStock(Ingredient.WATER, 500);
        inventory.addStock(Ingredient.MILK, 200);
        inventory.addStock(Ingredient.SUGAR, 100);
        inventory.addStock(Ingredient.CARAMEL_SYRUP, 50);
        inventory.printInventory();

        // --- Scenario 1: Successful Purchase of a Latte ---
        System.out.println("\n--- SCENARIO 1: Buy a Latte (Success) ---");
        machine.selectCoffee(CoffeeType.LATTE, List.of());
        machine.insertMoney(200);
        machine.insertMoney(50); // Total 250, price is 220
        machine.dispenseCoffee();
        inventory.printInventory();

        // --- Scenario 2: Purchase with Insufficient Funds & Cancellation ---
        System.out.println("\n--- SCENARIO 2: Buy Espresso (Insufficient Funds & Cancel) ---");
        machine.selectCoffee(CoffeeType.ESPRESSO, List.of());
        machine.insertMoney(100); // Price is 150
        machine.dispenseCoffee(); // Should fail
        machine.cancel(); // Should refund 100
        inventory.printInventory(); // Should be unchanged

        // --- Scenario 3: Attempt to Buy with Insufficient Ingredients ---
        System.out.println("\n--- SCENARIO 3: Buy Cappuccino (Out of Milk) ---");
        inventory.printInventory();
        machine.selectCoffee(CoffeeType.CAPPUCCINO, List.of(ToppingType.CARAMEL_SYRUP, ToppingType.EXTRA_SUGAR));
        machine.insertMoney(300);
        machine.dispenseCoffee(); // Should fail and refund
        inventory.printInventory();

        // --- Refill and final test ---
        System.out.println("\n--- REFILLING AND FINAL TEST ---");
        inventory.addStock(Ingredient.MILK, 200);
        inventory.printInventory();
        machine.selectCoffee(CoffeeType.LATTE, List.of(ToppingType.CARAMEL_SYRUP));
        machine.insertMoney(250);
        machine.dispenseCoffee();
        inventory.printInventory();
    }
}
```


**Inventory.java**

```java
package coffeevendingmachine;

import coffeevendingmachine.enums.Ingredient;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Inventory {
    private static final Inventory INSTANCE = new Inventory();
    private final Map<Ingredient, Integer> stock = new ConcurrentHashMap<>();

    private Inventory() {
        // Private constructor to prevent instantiation
    }

    public static Inventory getInstance() {
        return INSTANCE;
    }

    public void addStock(Ingredient ingredient, int quantity) {
        stock.put(ingredient, stock.getOrDefault(ingredient, 0) + quantity);
    }

    public boolean hasIngredients(Map<Ingredient, Integer> recipe) {
        return recipe.entrySet().stream()
                .allMatch(entry -> stock.getOrDefault(entry.getKey(), 0) >= entry.getValue());
    }

    public synchronized void deductIngredients(Map<Ingredient, Integer> recipe) {
        if (!hasIngredients(recipe)) {
            System.err.println("Not enough ingredients to make coffee.");
            return;
        }
        recipe.forEach((ingredient, quantity) ->
                stock.put(ingredient, stock.get(ingredient) - quantity));
    }

    public void printInventory() {
        System.out.println("--- Current Inventory ---");
        stock.forEach((key, value) -> System.out.println(key + ": " + value));
        System.out.println("-------------------------");
    }
}
```


**README.md**

```md
# Coffee Vending Machine (LLD)

## Problem Statement

Design and implement a Coffee Vending Machine system that can serve different types of coffee, manage ingredient inventory, process payments, and handle user interactions such as selecting coffee and refilling ingredients.

---

## Requirements

- **Multiple Coffee Types:** The machine should support multiple coffee recipes (e.g., Espresso, Latte, Cappuccino).
- **Ingredient Management:** The machine should track and manage ingredient levels, and prevent dispensing if ingredients are insufficient.
- **Payment Processing:** The machine should process payments before dispensing coffee.
- **Refill Ingredients:** The machine should allow refilling of ingredients.
- **Extensibility:** Easy to add new coffee types or payment methods.

---

## Core Entities

- **CoffeeVendingMachine:** Main class that manages the overall operation, user interaction, and coordinates other components.
- **CoffeeRecipe:** Represents a coffee recipe, including required ingredients and their quantities.
- **IngredientStore:** Manages the inventory of ingredients, supports checking and refilling.
- **Dispenser:** Handles the dispensing of coffee after successful payment and ingredient check.
- **PaymentProcessor:** Handles payment logic and validation.
- **Payment:** Represents a payment transaction.

---

## Class Design

## UML Class Diagram

![](../../../../uml-diagrams/class-diagrams/coffeevendingmachine-class-diagram.png)

### 1. CoffeeVendingMachine
- **Fields:** ingredientStore, paymentProcessor, Map<String, CoffeeRecipe> recipes, Dispenser
- **Methods:** selectCoffee(String), makeCoffee(String, Payment), refillIngredient(String, int), addRecipe(CoffeeRecipe), etc.

### 2. CoffeeRecipe
- **Fields:** name, Map<String, Integer> ingredients
- **Methods:** getName(), getIngredients()

### 3. IngredientStore
- **Fields:** Map<String, Integer> ingredientLevels
- **Methods:** hasIngredients(Map<String, Integer>), useIngredients(Map<String, Integer>), refill(String, int), getLevel(String)

### 4. Dispenser
- **Methods:** dispense(String)

### 5. PaymentProcessor
- **Methods:** processPayment(Payment)

### 6. Payment
- **Fields:** amount, paymentType, etc.

---

## Design Patterns Used

- **Strategy Pattern:** (Conceptually) for supporting different payment methods or coffee recipes.
- **Separation of Concerns:** Each class has a single responsibility (inventory, payment, dispensing, etc.).

---

## Example Usage

```java
CoffeeVendingMachine machine = new CoffeeVendingMachine();
machine.addRecipe(new CoffeeRecipe("Espresso", Map.of("CoffeeBeans", 10, "Water", 30)));
machine.refillIngredient("CoffeeBeans", 100);
machine.refillIngredient("Water", 200);

Payment payment = new Payment(50, "CASH");
machine.makeCoffee("Espresso", payment);
```

---

## Demo

See `CoffeeVendingMachineDemo.java` for a sample usage and simulation of the coffee vending machine.

---

## Extending the Framework

- **Add new coffee types:** Create new `CoffeeRecipe` instances and add them to the machine.
- **Add new payment methods:** Extend `PaymentProcessor` to support new payment types.
- **Add new ingredients:** Update `IngredientStore` and recipes as needed.

---
```


**decorator/CaramelSyrupDecorator.java**

```java
package coffeevendingmachine.decorator;

import coffeevendingmachine.enums.Ingredient;

import java.util.HashMap;
import java.util.Map;

public class CaramelSyrupDecorator extends CoffeeDecorator {
    private static final int COST = 30;
    private static final Map<Ingredient, Integer> RECIPE_ADDITION = Map.of(Ingredient.CARAMEL_SYRUP, 10);

    public CaramelSyrupDecorator(Coffee coffee) {
        super(coffee);
    }

    @Override
    public String getCoffeeType() {
        return decoratedCoffee.getCoffeeType() + ", Caramel Syrup";
    }

    @Override
    public int getPrice() {
        return decoratedCoffee.getPrice() + COST;
    }

    @Override
    public Map<Ingredient, Integer> getRecipe() {
        Map<Ingredient, Integer> newRecipe = new HashMap<>(decoratedCoffee.getRecipe());
        RECIPE_ADDITION.forEach((ingredient, qty) ->
                newRecipe.merge(ingredient, qty, Integer::sum));
        return newRecipe;
    }

    @Override
    public void prepare() {
        // First, prepare the underlying coffee (e.g., the Latte with Sugar)
        super.prepare();
        // Then, add the specific step for this decorator
        System.out.println("- Drizzling Caramel Syrup on top.");
    }
}
```


**decorator/Coffee.java**

```java
package coffeevendingmachine.decorator;

import coffeevendingmachine.enums.Ingredient;

import java.util.Map;

public abstract class Coffee {
    protected String coffeeType = "Unknown Coffee";

    public String getCoffeeType() {
        return coffeeType;
    }

    // The Template Method
    public void prepare() {
        System.out.println("\nPreparing your " + this.getCoffeeType() + "...");
        grindBeans();
        brew();
        addCondiments(); // The "hook" for base coffee types
        pourIntoCup();
        System.out.println(this.getCoffeeType() + " is ready!");
    }

    // Common steps
    private void grindBeans() { System.out.println("- Grinding fresh coffee beans."); }
    private void brew() { System.out.println("- Brewing coffee with hot water."); }
    private void pourIntoCup() { System.out.println("- Pouring into a cup."); }

    // Abstract step to be implemented by subclasses
    protected abstract void addCondiments();

    public abstract int getPrice();
    public abstract Map<Ingredient, Integer> getRecipe();
}
```


**decorator/CoffeeDecorator.java**

```java
package coffeevendingmachine.decorator;

import coffeevendingmachine.enums.Ingredient;

import java.util.Map;

public abstract class CoffeeDecorator extends Coffee {
    protected Coffee decoratedCoffee;

    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }

    // Delegate calls to the wrapped object.
    // Concrete decorators will override these to add their own logic.
    @Override
    public int getPrice() {
        return decoratedCoffee.getPrice();
    }

    @Override
    public Map<Ingredient, Integer> getRecipe() {
        return decoratedCoffee.getRecipe();
    }

    @Override
    protected void addCondiments() {
        decoratedCoffee.addCondiments();
    }

    @Override
    public void prepare() {
        decoratedCoffee.prepare();
    }
}
```


**decorator/ExtraSugarDecorator.java**

```java
package coffeevendingmachine.decorator;

import coffeevendingmachine.enums.Ingredient;

import java.util.HashMap;
import java.util.Map;

public class ExtraSugarDecorator extends CoffeeDecorator {
    private static final int COST = 10;
    private static final Map<Ingredient, Integer> RECIPE_ADDITION = Map.of(Ingredient.SUGAR, 1);

    public ExtraSugarDecorator(Coffee coffee) {
        super(coffee);
    }

    @Override
    public String getCoffeeType() {
        return decoratedCoffee.getCoffeeType() + ", Extra Sugar";
    }

    @Override
    public int getPrice() {
        return decoratedCoffee.getPrice() + COST;
    }

    @Override
    public Map<Ingredient, Integer> getRecipe() {
        // Merge the recipes
        Map<Ingredient, Integer> newRecipe = new HashMap<>(decoratedCoffee.getRecipe());
        RECIPE_ADDITION.forEach((ingredient, qty) ->
                newRecipe.merge(ingredient, qty, Integer::sum));
        return newRecipe;
    }

    @Override
    public void prepare() {
        super.prepare();
        System.out.println("- Stirring in Extra Sugar.");
    }
}
```


**enums/CoffeeType.java**

```java
package coffeevendingmachine.enums;

public enum CoffeeType {
    ESPRESSO,
    LATTE,
    CAPPUCCINO;
}
```


**enums/Ingredient.java**

```java
package coffeevendingmachine.enums;

public enum Ingredient {
    COFFEE_BEANS,
    MILK,
    SUGAR,
    WATER,
    CARAMEL_SYRUP
}
```


**enums/ToppingType.java**

```java
package coffeevendingmachine.enums;

public enum ToppingType {
    EXTRA_SUGAR,
    CARAMEL_SYRUP
}
```


**factory/CoffeeFactory.java**

```java
package coffeevendingmachine.factory;

import coffeevendingmachine.enums.CoffeeType;
import coffeevendingmachine.templatemethod.Cappuccino;
import coffeevendingmachine.decorator.Coffee;
import coffeevendingmachine.templatemethod.Espresso;
import coffeevendingmachine.templatemethod.Latte;

public class CoffeeFactory {
    public static Coffee createCoffee(CoffeeType type) {
        switch (type) {
            case ESPRESSO:
                return new Espresso();
            case LATTE:
                return new Latte();
            case CAPPUCCINO:
                return new Cappuccino();
            default:
                throw new IllegalArgumentException("Unsupported coffee type: " + type);
        }
    }
}
```


**state/OutOfIngredientState.java**

```java
package coffeevendingmachine.state;

import coffeevendingmachine.CoffeeVendingMachine;
import coffeevendingmachine.decorator.Coffee;

public class OutOfIngredientState implements VendingMachineState {
    @Override
    public void selectCoffee(CoffeeVendingMachine m, Coffee c) {
        System.out.println("Sorry, the machine is out of ingredients.");
    }

    @Override
    public void insertMoney(CoffeeVendingMachine m, int a) {
        System.out.println("Sorry, the machine is out of ingredients. Money refunded.");
    }

    @Override
    public void dispenseCoffee(CoffeeVendingMachine m) {
        System.out.println("Sorry, the machine is out of ingredients.");
    }

    @Override
    public void cancel(CoffeeVendingMachine machine) {
        System.out.println("Refunding " + machine.getMoneyInserted());
        machine.reset();
        machine.setState(new ReadyState());
    }
}
```


**state/PaidState.java**

```java
package coffeevendingmachine.state;

import coffeevendingmachine.CoffeeVendingMachine;
import coffeevendingmachine.Inventory;
import coffeevendingmachine.decorator.Coffee;

public class PaidState implements VendingMachineState {
    @Override
    public void selectCoffee(CoffeeVendingMachine m, Coffee c) {
        System.out.println("Cannot select another coffee now.");
    }

    @Override
    public void insertMoney(CoffeeVendingMachine m, int a) {
        System.out.println("Already paid. Please wait for your coffee.");
    }

    @Override
    public void dispenseCoffee(CoffeeVendingMachine machine) {
        Inventory inventory = Inventory.getInstance();
        Coffee coffeeToDispense = machine.getSelectedCoffee();

        if (!inventory.hasIngredients(machine.getSelectedCoffee().getRecipe())) {
            System.out.println("Sorry, out of ingredients for " + machine.getSelectedCoffee().getCoffeeType());
            machine.setState(new OutOfIngredientState());
            machine.getState().cancel(machine);
            return;
        }
        inventory.deductIngredients(machine.getSelectedCoffee().getRecipe());

        coffeeToDispense.prepare();

        int change = machine.getMoneyInserted() - machine.getSelectedCoffee().getPrice();
        if (change > 0)
            System.out.println("Returning change: " + change);

        machine.reset();
        machine.setState(new ReadyState());
    }

    @Override
    public void cancel(CoffeeVendingMachine m) {
        new SelectingState().cancel(m); // Same as in SelectingState
    }
}
```


**state/ReadyState.java**

```java
package coffeevendingmachine.state;

import coffeevendingmachine.CoffeeVendingMachine;
import coffeevendingmachine.decorator.Coffee;

public class ReadyState implements VendingMachineState {
    @Override
    public void selectCoffee(CoffeeVendingMachine machine, Coffee coffee) {
        machine.setSelectedCoffee(coffee);
        machine.setState(new SelectingState());
        System.out.println(coffee.getCoffeeType() + " selected. Price: " + coffee.getPrice());
    }

    @Override
    public void insertMoney(CoffeeVendingMachine m, int a) {
        System.out.println("Please select a coffee first.");
    }

    @Override
    public void dispenseCoffee(CoffeeVendingMachine m) {
        System.out.println("Please select and pay first.");
    }

    @Override
    public void cancel(CoffeeVendingMachine m) {
        System.out.println("Nothing to cancel.");
    }
}
```


**state/SelectingState.java**

```java
package coffeevendingmachine.state;

import coffeevendingmachine.CoffeeVendingMachine;
import coffeevendingmachine.decorator.Coffee;

public class SelectingState implements VendingMachineState {
    @Override
    public void selectCoffee(CoffeeVendingMachine m, Coffee c) {
        System.out.println("Already selected. Please pay or cancel.");
    }

    @Override
    public void insertMoney(CoffeeVendingMachine machine, int amount) {
        machine.setMoneyInserted(machine.getMoneyInserted() + amount);
        System.out.println("Inserted " + amount + ". Total: " + machine.getMoneyInserted());
        if (machine.getMoneyInserted() >= machine.getSelectedCoffee().getPrice()) {
            machine.setState(new PaidState());
        }
    }

    @Override
    public void dispenseCoffee(CoffeeVendingMachine m) {
        System.out.println("Please insert enough money first.");
    }

    @Override public void cancel(CoffeeVendingMachine machine) {
        System.out.println("Transaction cancelled. Refunding " + machine.getMoneyInserted());
        machine.reset();
        machine.setState(new ReadyState());
    }
}
```


**state/VendingMachineState.java**

```java
package coffeevendingmachine.state;

import coffeevendingmachine.CoffeeVendingMachine;
import coffeevendingmachine.decorator.Coffee;

public interface VendingMachineState {
    void selectCoffee(CoffeeVendingMachine machine, Coffee coffee);
    void insertMoney(CoffeeVendingMachine machine, int amount);
    void dispenseCoffee(CoffeeVendingMachine machine);
    void cancel(CoffeeVendingMachine machine);
}
```


**templatemethod/Cappuccino.java**

```java
package coffeevendingmachine.templatemethod;

import coffeevendingmachine.decorator.Coffee;
import coffeevendingmachine.enums.Ingredient;

import java.util.Map;

public class Cappuccino extends Coffee {
    public Cappuccino() {
        this.coffeeType = "Cappuccino";
    }

    @Override
    protected void addCondiments() {
        System.out.println("- Adding steamed milk and foam.");
    }

    @Override
    public int getPrice() {
        return 250;
    }

    @Override
    public Map<Ingredient, Integer> getRecipe() {
        return Map.of(Ingredient.COFFEE_BEANS, 7, Ingredient.WATER, 30, Ingredient.MILK, 100);
    }
}
```


**templatemethod/Espresso.java**

```java
package coffeevendingmachine.templatemethod;

import coffeevendingmachine.decorator.Coffee;
import coffeevendingmachine.enums.Ingredient;

import java.util.Map;

public class Espresso extends Coffee {
    public Espresso() {
        this.coffeeType = "Espresso";
    }

    @Override
    protected void addCondiments() { /* No extra condiments for espresso */ }

    @Override
    public int getPrice() {
        return 150;
    }

    @Override
    public Map<Ingredient, Integer> getRecipe() {
        return Map.of(Ingredient.COFFEE_BEANS, 7, Ingredient.WATER, 30);
    }
}
```


**templatemethod/Latte.java**

```java
package coffeevendingmachine.templatemethod;

import coffeevendingmachine.decorator.Coffee;
import coffeevendingmachine.enums.Ingredient;

import java.util.Map;

public class Latte extends Coffee {
    public Latte() {
        this.coffeeType = "Latte";
    }

    // Latte's implementation of the template hook
    @Override
    protected void addCondiments() {
        System.out.println("- Adding steamed milk.");
    }

    @Override
    public int getPrice() {
        return 220;
    }

    @Override
    public Map<Ingredient, Integer> getRecipe() {
        return Map.of(Ingredient.COFFEE_BEANS, 7, Ingredient.WATER, 30, Ingredient.MILK, 150);
    }
}
```

</details>

<details><summary><b>python</b> (9 files)</summary>


**README.md**

```md
# Designing a Coffee Vending Machine

## Requirements
1. The coffee vending machine should support different types of coffee, such as espresso, cappuccino, and latte.
2. Each type of coffee should have a specific price and recipe (ingredients and their quantities).
3. The machine should have a menu to display the available coffee options and their prices.
4. Users should be able to select a coffee type and make a payment.
5. The machine should dispense the selected coffee and provide change if necessary.
6. The machine should track the inventory of ingredients and notify when they are running low.
7. The machine should handle multiple user requests concurrently and ensure thread safety.

## Classes, Interfaces and Enumerations
1. The **Coffee** class represents a coffee type with its name, price, and recipe (ingredients and their quantities).
2. The **Ingredient** class represents an ingredient used in making coffee, with its name and quantity. It provides a synchronized method to update the quantity.
3. The **Payment** class represents a payment made by a user, with the amount paid.
4. The **CoffeeMachine** class is the main class that manages the coffee vending machine. It follows the Singleton pattern to ensure a single instance of the machine.
5. The **CoffeeMachine** class initializes the coffee menu and ingredients in its constructor. It provides methods to display the menu, select a coffee, dispense coffee, and update ingredient quantities.
6. The hasEnoughIngredients method checks if there are sufficient ingredients to make a selected coffee, while the updateIngredients method updates the ingredient quantities after dispensing a coffee.
7. The **CoffeeVendingMachine** class is the entry point of the application and demonstrates the usage of the coffee vending machine. It creates an instance of the machine, displays the menu, and simulates concurrent user requests using an ExecutorService.
```


**coffee.py**

```py
from abc import ABC, abstractmethod
from typing import Dict
from enums import Ingredient

class Coffee(ABC):
    def __init__(self):
        self.coffee_type = "Unknown Coffee"
    
    def get_coffee_type(self) -> str:
        return self.coffee_type
    
    # The Template Method
    def prepare(self):
        print(f"\nPreparing your {self.get_coffee_type()}...")
        self._grind_beans()
        self._brew()
        self.add_condiments()  # The "hook" for base coffee types
        self._pour_into_cup()
        print(f"{self.get_coffee_type()} is ready!")
    
    # Common steps
    def _grind_beans(self):
        print("- Grinding fresh coffee beans.")
    
    def _brew(self):
        print("- Brewing coffee with hot water.")
    
    def _pour_into_cup(self):
        print("- Pouring into a cup.")
    
    # Abstract step to be implemented by subclasses
    @abstractmethod
    def add_condiments(self):
        pass
    
    @abstractmethod
    def get_price(self) -> int:
        pass
    
    @abstractmethod
    def get_recipe(self) -> Dict[Ingredient, int]:
        pass

class Espresso(Coffee):
    def __init__(self):
        super().__init__()
        self.coffee_type = "Espresso"
    
    def add_condiments(self):
        pass  # No extra condiments for espresso
    
    def get_price(self) -> int:
        return 150
    
    def get_recipe(self) -> Dict[Ingredient, int]:
        return {Ingredient.COFFEE_BEANS: 7, Ingredient.WATER: 30}

class Cappuccino(Coffee):
    def __init__(self):
        super().__init__()
        self.coffee_type = "Cappuccino"
    
    def add_condiments(self):
        print("- Adding steamed milk and foam.")
    
    def get_price(self) -> int:
        return 250
    
    def get_recipe(self) -> Dict[Ingredient, int]:
        return {Ingredient.COFFEE_BEANS: 7, Ingredient.WATER: 30, Ingredient.MILK: 100}

class Latte(Coffee):
    def __init__(self):
        super().__init__()
        self.coffee_type = "Latte"
    
    def add_condiments(self):
        print("- Adding steamed milk.")
    
    def get_price(self) -> int:
        return 220
    
    def get_recipe(self) -> Dict[Ingredient, int]:
        return {Ingredient.COFFEE_BEANS: 7, Ingredient.WATER: 30, Ingredient.MILK: 150}
```


**coffee_factory.py**

```py
from enums import CoffeeType
from coffee import Coffee, Espresso, Latte, Cappuccino

class CoffeeFactory:
    @staticmethod
    def create_coffee(coffee_type: CoffeeType) -> Coffee:
        if coffee_type == CoffeeType.ESPRESSO:
            return Espresso()
        elif coffee_type == CoffeeType.LATTE:
            return Latte()
        elif coffee_type == CoffeeType.CAPPUCCINO:
            return Cappuccino()
        else:
            raise ValueError(f"Unsupported coffee type: {coffee_type}")
```


**coffee_vending_machine.py**

```py
from typing import List
from enums import CoffeeType, ToppingType
from coffee import Coffee
from coffee_factory import CoffeeFactory
from decorators import ExtraSugarDecorator, CaramelSyrupDecorator
from states import VendingMachineState, ReadyState
import threading

class CoffeeVendingMachine:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self._state = ReadyState()
            self._selected_coffee: Coffee = None
            self._money_inserted = 0
            self._initialized = True
    
    @classmethod
    def get_instance(cls):
        return cls()
    
    def select_coffee(self, coffee_type: CoffeeType, toppings: List[ToppingType]):
        # 1. Create the base coffee using the factory
        coffee = CoffeeFactory.create_coffee(coffee_type)
        
        # 2. Wrap it with decorators
        for topping in toppings:
            if topping == ToppingType.EXTRA_SUGAR:
                coffee = ExtraSugarDecorator(coffee)
            elif topping == ToppingType.CARAMEL_SYRUP:
                coffee = CaramelSyrupDecorator(coffee)
        
        # Let the state handle the rest
        self._state.select_coffee(self, coffee)
    
    def insert_money(self, amount: int):
        self._state.insert_money(self, amount)
    
    def dispense_coffee(self):
        self._state.dispense_coffee(self)
    
    def cancel(self):
        self._state.cancel(self)
    
    # Getters and Setters used by State objects
    def set_state(self, state: VendingMachineState):
        self._state = state
    
    def get_state(self) -> VendingMachineState:
        return self._state
    
    def set_selected_coffee(self, coffee: Coffee):
        self._selected_coffee = coffee
    
    def get_selected_coffee(self) -> Coffee:
        return self._selected_coffee
    
    def set_money_inserted(self, amount: int):
        self._money_inserted = amount
    
    def get_money_inserted(self) -> int:
        return self._money_inserted
    
    def reset(self):
        self._selected_coffee = None
        self._money_inserted = 0
```


**coffee_vending_machine_demo.py**

```py
from coffee_vending_machine import CoffeeVendingMachine
from inventory import Inventory
from enums import CoffeeType, ToppingType, Ingredient

class CoffeeVendingMachineDemo:
    @staticmethod
    def main():
        machine = CoffeeVendingMachine.get_instance()
        inventory = Inventory.get_instance()
        
        # Initial setup: Refill inventory
        print("=== Initializing Vending Machine ===")
        inventory.add_stock(Ingredient.COFFEE_BEANS, 50)
        inventory.add_stock(Ingredient.WATER, 500)
        inventory.add_stock(Ingredient.MILK, 200)
        inventory.add_stock(Ingredient.SUGAR, 100)
        inventory.add_stock(Ingredient.CARAMEL_SYRUP, 50)
        inventory.print_inventory()
        
        # Scenario 1: Successful Purchase of a Latte
        print("\n--- SCENARIO 1: Buy a Latte (Success) ---")
        machine.select_coffee(CoffeeType.LATTE, [])
        machine.insert_money(200)
        machine.insert_money(50)  # Total 250, price is 220
        machine.dispense_coffee()
        inventory.print_inventory()
        
        # Scenario 2: Purchase with Insufficient Funds & Cancellation
        print("\n--- SCENARIO 2: Buy Espresso (Insufficient Funds & Cancel) ---")
        machine.select_coffee(CoffeeType.ESPRESSO, [])
        machine.insert_money(100)  # Price is 150
        machine.dispense_coffee()  # Should fail
        machine.cancel()  # Should refund 100
        inventory.print_inventory()  # Should be unchanged
        
        # Scenario 3: Attempt to Buy with Insufficient Ingredients
        print("\n--- SCENARIO 3: Buy Cappuccino (Out of Milk) ---")
        inventory.print_inventory()
        machine.select_coffee(CoffeeType.CAPPUCCINO, [ToppingType.CARAMEL_SYRUP, ToppingType.EXTRA_SUGAR])
        machine.insert_money(300)
        machine.dispense_coffee()  # Should fail and refund
        inventory.print_inventory()
        
        # Refill and final test
        print("\n--- REFILLING AND FINAL TEST ---")
        inventory.add_stock(Ingredient.MILK, 200)
        inventory.print_inventory()
        machine.select_coffee(CoffeeType.LATTE, [ToppingType.CARAMEL_SYRUP])
        machine.insert_money(250)
        machine.dispense_coffee()
        inventory.print_inventory()

if __name__ == "__main__":
    CoffeeVendingMachineDemo.main()
```


**decorators.py**

```py
from coffee import Coffee
from typing import Dict
from enums import Ingredient

class CoffeeDecorator(Coffee):
    def __init__(self, coffee: Coffee):
        super().__init__()
        self.decorated_coffee = coffee
    
    def get_price(self) -> int:
        return self.decorated_coffee.get_price()
    
    def get_recipe(self) -> Dict[Ingredient, int]:
        return self.decorated_coffee.get_recipe()
    
    def add_condiments(self):
        self.decorated_coffee.add_condiments()
    
    def prepare(self):
        self.decorated_coffee.prepare()

class CaramelSyrupDecorator(CoffeeDecorator):
    COST = 30
    RECIPE_ADDITION = {Ingredient.CARAMEL_SYRUP: 10}
    
    def __init__(self, coffee: Coffee):
        super().__init__(coffee)
    
    def get_coffee_type(self) -> str:
        return self.decorated_coffee.get_coffee_type() + ", Caramel Syrup"
    
    def get_price(self) -> int:
        return self.decorated_coffee.get_price() + self.COST
    
    def get_recipe(self) -> Dict[Ingredient, int]:
        new_recipe = self.decorated_coffee.get_recipe().copy()
        for ingredient, qty in self.RECIPE_ADDITION.items():
            new_recipe[ingredient] = new_recipe.get(ingredient, 0) + qty
        return new_recipe
    
    def prepare(self):
        # First, prepare the underlying coffee
        super().prepare()
        # Then, add the specific step for this decorator
        print("- Drizzling Caramel Syrup on top.")

class ExtraSugarDecorator(CoffeeDecorator):
    COST = 10
    RECIPE_ADDITION = {Ingredient.SUGAR: 1}
    
    def __init__(self, coffee: Coffee):
        super().__init__(coffee)
    
    def get_coffee_type(self) -> str:
        return self.decorated_coffee.get_coffee_type() + ", Extra Sugar"
    
    def get_price(self) -> int:
        return self.decorated_coffee.get_price() + self.COST
    
    def get_recipe(self) -> Dict[Ingredient, int]:
        new_recipe = self.decorated_coffee.get_recipe().copy()
        for ingredient, qty in self.RECIPE_ADDITION.items():
            new_recipe[ingredient] = new_recipe.get(ingredient, 0) + qty
        return new_recipe
    
    def prepare(self):
        super().prepare()
        print("- Stirring in Extra Sugar.")
```


**enums.py**

```py
from enum import Enum

class CoffeeType(Enum):
    ESPRESSO = "ESPRESSO"
    LATTE = "LATTE"
    CAPPUCCINO = "CAPPUCCINO"

class Ingredient(Enum):
    COFFEE_BEANS = "COFFEE_BEANS"
    MILK = "MILK"
    SUGAR = "SUGAR"
    WATER = "WATER"
    CARAMEL_SYRUP = "CARAMEL_SYRUP"

class ToppingType(Enum):
    EXTRA_SUGAR = "EXTRA_SUGAR"
    CARAMEL_SYRUP = "CARAMEL_SYRUP"
```


**inventory.py**

```py
from typing import Dict
from enums import Ingredient
import threading

class Inventory:
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self._stock: Dict[Ingredient, int] = {}
            self._lock = threading.Lock()
            self._initialized = True
    
    @classmethod
    def get_instance(cls):
        return cls()
    
    def add_stock(self, ingredient: Ingredient, quantity: int):
        self._stock[ingredient] = self._stock.get(ingredient, 0) + quantity
    
    def has_ingredients(self, recipe: Dict[Ingredient, int]) -> bool:
        return all(self._stock.get(ingredient, 0) >= quantity 
                  for ingredient, quantity in recipe.items())
    
    def deduct_ingredients(self, recipe: Dict[Ingredient, int]):
        with self._lock:
            if not self.has_ingredients(recipe):
                print("Not enough ingredients to make coffee.")
                return
            
            for ingredient, quantity in recipe.items():
                self._stock[ingredient] -= quantity
    
    def print_inventory(self):
        print("--- Current Inventory ---")
        for ingredient, quantity in self._stock.items():
            print(f"{ingredient.value}: {quantity}")
        print("-------------------------")
```


**states.py**

```py
from abc import ABC, abstractmethod
from inventory import Inventory
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from coffee_vending_machine import CoffeeVendingMachine
    from coffee import Coffee

class VendingMachineState(ABC):
    @abstractmethod
    def select_coffee(self, machine: 'CoffeeVendingMachine', coffee: 'Coffee'):
        pass
    
    @abstractmethod
    def insert_money(self, machine: 'CoffeeVendingMachine', amount: int):
        pass
    
    @abstractmethod
    def dispense_coffee(self, machine: 'CoffeeVendingMachine'):
        pass
    
    @abstractmethod
    def cancel(self, machine: 'CoffeeVendingMachine'):
        pass

class ReadyState(VendingMachineState):
    def select_coffee(self, machine: 'CoffeeVendingMachine', coffee: 'Coffee'):
        machine.set_selected_coffee(coffee)
        machine.set_state(SelectingState())
        print(f"{coffee.get_coffee_type()} selected. Price: {coffee.get_price()}")
    
    def insert_money(self, machine: 'CoffeeVendingMachine', amount: int):
        print("Please select a coffee first.")
    
    def dispense_coffee(self, machine: 'CoffeeVendingMachine'):
        print("Please select and pay first.")
    
    def cancel(self, machine: 'CoffeeVendingMachine'):
        print("Nothing to cancel.")

class SelectingState(VendingMachineState):
    def select_coffee(self, machine: 'CoffeeVendingMachine', coffee: 'Coffee'):
        print("Already selected. Please pay or cancel.")
    
    def insert_money(self, machine: 'CoffeeVendingMachine', amount: int):
        machine.set_money_inserted(machine.get_money_inserted() + amount)
        print(f"Inserted {amount}. Total: {machine.get_money_inserted()}")
        if machine.get_money_inserted() >= machine.get_selected_coffee().get_price():
            machine.set_state(PaidState())
    
    def dispense_coffee(self, machine: 'CoffeeVendingMachine'):
        print("Please insert enough money first.")
    
    def cancel(self, machine: 'CoffeeVendingMachine'):
        print(f"Transaction cancelled. Refunding {machine.get_money_inserted()}")
        machine.reset()
        machine.set_state(ReadyState())

class PaidState(VendingMachineState):
    def select_coffee(self, machine: 'CoffeeVendingMachine', coffee: 'Coffee'):
        print("Already paid. Please dispense or cancel.")
    
    def insert_money(self, machine: 'CoffeeVendingMachine', amount: int):
        machine.set_money_inserted(machine.get_money_inserted() + amount)
        print(f"Additional {amount} inserted. Total: {machine.get_money_inserted()}")
    
    def dispense_coffee(self, machine: 'CoffeeVendingMachine'):
        inventory = Inventory.get_instance()
        coffee = machine.get_selected_coffee()
        
        if not inventory.has_ingredients(coffee.get_recipe()):
            print("Sorry, we are out of ingredients. Refunding your money.")
            print(f"Refunding {machine.get_money_inserted()}")
            machine.reset()
            machine.set_state(OutOfIngredientState())
            return
        
        # Deduct ingredients and prepare coffee
        inventory.deduct_ingredients(coffee.get_recipe())
        coffee.prepare()
        
        # Calculate change
        change = machine.get_money_inserted() - coffee.get_price()
        if change > 0:
            print(f"Here's your change: {change}")
        
        machine.reset()
        machine.set_state(ReadyState())
    
    def cancel(self, machine: 'CoffeeVendingMachine'):
        print(f"Transaction cancelled. Refunding {machine.get_money_inserted()}")
        machine.reset()
        machine.set_state(ReadyState())


class OutOfIngredientState(VendingMachineState):
    def select_coffee(self, machine: 'CoffeeVendingMachine', coffee: 'Coffee'):
        print("Sorry, we are sold out.")
    
    def insert_money(self, machine: 'CoffeeVendingMachine', amount: int):
        print("Sorry, we are sold out. Money refunded.")
    
    def dispense_coffee(self, machine: 'CoffeeVendingMachine'):
        print("Sorry, we are sold out.")
    
    def cancel(self, machine: 'CoffeeVendingMachine'):
        print(f"Refunding {machine.get_money_inserted()}")
        machine.reset()
        machine.set_state(ReadyState())
```

</details>

<details><summary><b>cpp</b> (9 files)</summary>


**Coffee.cpp**

```cpp
#include "Coffee.hpp"

Coffee::Coffee(CoffeeType type, double price, std::string description)
    : type(type), price(price), description(description) {}

CoffeeType Coffee::getType() const { return type; }
double Coffee::getPrice() const { return price; }
std::string Coffee::getDescription() const { return description; }
```


**Coffee.hpp**

```hpp
#ifndef COFFEE_HPP
#define COFFEE_HPP

#include <string>
#include "CoffeeType.hpp"

class Coffee {
private:
    CoffeeType type;
    double price;
    std::string description;

public:
    Coffee(CoffeeType type, double price, std::string description);
    
    CoffeeType getType() const;
    double getPrice() const;
    std::string getDescription() const;
};

#endif
```


**CoffeeType.hpp**

```hpp
#ifndef COFFEE_TYPE_HPP
#define COFFEE_TYPE_HPP

enum class CoffeeType {
    ESPRESSO,
    LATTE,
    CAPPUCCINO,
    AMERICANO
};

#endif
```


**CoffeeVendingMachine.cpp**

```cpp
#include "CoffeeVendingMachine.hpp"
#include <iostream>
#include <iomanip>

CoffeeVendingMachine::CoffeeVendingMachine() : moneyCollected(0.0) {
    initializeMenu();
}

void CoffeeVendingMachine::initializeMenu() {
    coffeeMenu.push_back(Coffee(CoffeeType::ESPRESSO, 2.50, "Strong black coffee"));
    coffeeMenu.push_back(Coffee(CoffeeType::LATTE, 3.50, "Coffee with steamed milk"));
    coffeeMenu.push_back(Coffee(CoffeeType::CAPPUCCINO, 3.00, "Coffee topped with foamy milk"));
    coffeeMenu.push_back(Coffee(CoffeeType::AMERICANO, 2.00, "Diluted espresso"));
}

void CoffeeVendingMachine::displayMenu() const {
    std::cout << "\nCoffee Menu:" << std::endl;
    std::cout << std::fixed << std::setprecision(2);
    
    for (const auto& coffee : coffeeMenu) {
        std::cout << "Type: ";
        switch (coffee.getType()) {
            case CoffeeType::ESPRESSO: std::cout << "Espresso"; break;
            case CoffeeType::LATTE: std::cout << "Latte"; break;
            case CoffeeType::CAPPUCCINO: std::cout << "Cappuccino"; break;
            case CoffeeType::AMERICANO: std::cout << "Americano"; break;
        }
        std::cout << " - $" << coffee.getPrice() << std::endl;
        std::cout << "Description: " << coffee.getDescription() << std::endl;
        std::cout << "Available: " << inventory.getQuantity(coffee.getType()) << std::endl;
        std::cout << "------------------------" << std::endl;
    }
}

bool CoffeeVendingMachine::selectCoffee(CoffeeType type, double payment) {
    Coffee* coffee = findCoffee(type);
    if (!coffee) {
        std::cout << "Invalid coffee selection!" << std::endl;
        return false;
    }
    
    if (!inventory.hasItem(type)) {
        std::cout << "Sorry, this coffee is out of stock!" << std::endl;
        return false;
    }
    
    if (payment < coffee->getPrice()) {
        std::cout << "Insufficient payment! Price is $" << coffee->getPrice() << std::endl;
        return false;
    }
    
    inventory.deductItem(type);
    moneyCollected += coffee->getPrice();
    double change = payment - coffee->getPrice();
    
    std::cout << "\nDispensing " << coffee->getDescription() << std::endl;
    if (change > 0) {
        std::cout << "Change: $" << std::fixed << std::setprecision(2) << change << std::endl;
    }
    
    return true;
}

void CoffeeVendingMachine::refillInventory(CoffeeType type, int quantity) {
    inventory.addItem(type, quantity);
    std::cout << "Inventory refilled successfully!" << std::endl;
}

double CoffeeVendingMachine::getMoneyCollected() const {
    return moneyCollected;
}

void CoffeeVendingMachine::displayInventory() const {
    inventory.display();
}

Coffee* CoffeeVendingMachine::findCoffee(CoffeeType type) {
    for (auto& coffee : coffeeMenu) {
        if (coffee.getType() == type) {
            return &coffee;
        }
    }
    return nullptr;
}
```


**CoffeeVendingMachine.hpp**

```hpp
#ifndef COFFEE_VENDING_MACHINE_HPP
#define COFFEE_VENDING_MACHINE_HPP

#include <vector>
#include "Coffee.hpp"
#include "Inventory.hpp"

class CoffeeVendingMachine {
private:
    std::vector<Coffee> coffeeMenu;
    Inventory inventory;
    double moneyCollected;

public:
    CoffeeVendingMachine();
    
    void initializeMenu();
    void displayMenu() const;
    bool selectCoffee(CoffeeType type, double payment);
    void refillInventory(CoffeeType type, int quantity);
    double getMoneyCollected() const;
    void displayInventory() const;
    
private:
    Coffee* findCoffee(CoffeeType type);
};

#endif
```


**CoffeeVendingMachineDemo.cpp**

```cpp
#include "CoffeeVendingMachine.hpp"
#include <iostream>

int main() {
    CoffeeVendingMachine machine;
    
    // Refill inventory
    machine.refillInventory(CoffeeType::ESPRESSO, 5);
    machine.refillInventory(CoffeeType::LATTE, 5);
    machine.refillInventory(CoffeeType::CAPPUCCINO, 5);
    machine.refillInventory(CoffeeType::AMERICANO, 5);
    
    // Display menu and inventory
    machine.displayMenu();
    machine.displayInventory();
    
    // Make some purchases
    std::cout << "\nMaking purchases:" << std::endl;
    
    if (machine.selectCoffee(CoffeeType::ESPRESSO, 3.00)) {
        std::cout << "Espresso purchased successfully!" << std::endl;
    }
    
    if (machine.selectCoffee(CoffeeType::LATTE, 3.50)) {
        std::cout << "Latte purchased successfully!" << std::endl;
    }
    
    // Try insufficient payment
    if (!machine.selectCoffee(CoffeeType::CAPPUCCINO, 2.00)) {
        std::cout << "Cappuccino purchase failed - insufficient payment" << std::endl;
    }
    
    // Display updated inventory and money collected
    machine.displayInventory();
    std::cout << "\nTotal money collected: $" << machine.getMoneyCollected() << std::endl;
    
    return 0;
}
```


**Inventory.cpp**

```cpp
#include "Inventory.hpp"
#include <iostream>

Inventory::Inventory() {
    // Initialize inventory with zero quantity for all coffee types
    items[CoffeeType::ESPRESSO] = 0;
    items[CoffeeType::LATTE] = 0;
    items[CoffeeType::CAPPUCCINO] = 0;
    items[CoffeeType::AMERICANO] = 0;
}

void Inventory::addItem(CoffeeType type, int quantity) {
    items[type] += quantity;
}

bool Inventory::hasItem(CoffeeType type) {
    return items[type] > 0;
}

void Inventory::deductItem(CoffeeType type) {
    if (items[type] > 0) {
        items[type]--;
    }
}

int Inventory::getQuantity(CoffeeType type) const {
    auto it = items.find(type);
    return it != items.end() ? it->second : 0;
}

void Inventory::display() const {
    std::cout << "\nCurrent Inventory:" << std::endl;
    std::cout << "Espresso: " << items.at(CoffeeType::ESPRESSO) << std::endl;
    std::cout << "Latte: " << items.at(CoffeeType::LATTE) << std::endl;
    std::cout << "Cappuccino: " << items.at(CoffeeType::CAPPUCCINO) << std::endl;
    std::cout << "Americano: " << items.at(CoffeeType::AMERICANO) << std::endl;
}
```


**Inventory.hpp**

```hpp
#ifndef INVENTORY_HPP
#define INVENTORY_HPP

#include <map>
#include "CoffeeType.hpp"

class Inventory {
private:
    std::map<CoffeeType, int> items;

public:
    Inventory();
    
    void addItem(CoffeeType type, int quantity);
    bool hasItem(CoffeeType type);
    void deductItem(CoffeeType type);
    int getQuantity(CoffeeType type) const;
    void display() const;
};

#endif
```


**README.md**

```md
# Designing a Coffee Vending Machine

## Requirements
1. The coffee vending machine should support different types of coffee, such as espresso, cappuccino, and latte.
2. Each type of coffee should have a specific price and recipe (ingredients and their quantities).
3. The machine should have a menu to display the available coffee options and their prices.
4. Users should be able to select a coffee type and make a payment.
5. The machine should dispense the selected coffee and provide change if necessary.
6. The machine should track the inventory of ingredients and notify when they are running low.
7. The machine should handle multiple user requests concurrently and ensure thread safety.

## Classes, Interfaces and Enumerations
1. The **Coffee** class represents a coffee type with its name, price, and recipe (ingredients and their quantities).
2. The **Ingredient** class represents an ingredient used in making coffee, with its name and quantity. It provides a synchronized method to update the quantity.
3. The **Payment** class represents a payment made by a user, with the amount paid.
4. The **CoffeeMachine** class is the main class that manages the coffee vending machine. It follows the Singleton pattern to ensure a single instance of the machine.
5. The **CoffeeMachine** class initializes the coffee menu and ingredients in its constructor. It provides methods to display the menu, select a coffee, dispense coffee, and update ingredient quantities.
6. The hasEnoughIngredients method checks if there are sufficient ingredients to make a selected coffee, while the updateIngredients method updates the ingredient quantities after dispensing a coffee.
7. The **CoffeeVendingMachine** class is the entry point of the application and demonstrates the usage of the coffee vending machine. It creates an instance of the machine, displays the menu, and simulates concurrent user requests using an ExecutorService.
```

</details>

<details><summary><b>golang</b> (6 files)</summary>


**README.md**

```md
# Designing a Coffee Vending Machine

## Requirements
1. The coffee vending machine should support different types of coffee, such as espresso, cappuccino, and latte.
2. Each type of coffee should have a specific price and recipe (ingredients and their quantities).
3. The machine should have a menu to display the available coffee options and their prices.
4. Users should be able to select a coffee type and make a payment.
5. The machine should dispense the selected coffee and provide change if necessary.
6. The machine should track the inventory of ingredients and notify when they are running low.
7. The machine should handle multiple user requests concurrently and ensure thread safety.

## Classes, Interfaces and Enumerations
1. The **Coffee** class represents a coffee type with its name, price, and recipe (ingredients and their quantities).
2. The **Ingredient** class represents an ingredient used in making coffee, with its name and quantity. It provides a synchronized method to update the quantity.
3. The **Payment** class represents a payment made by a user, with the amount paid.
4. The **CoffeeMachine** class is the main class that manages the coffee vending machine. It follows the Singleton pattern to ensure a single instance of the machine.
5. The **CoffeeMachine** class initializes the coffee menu and ingredients in its constructor. It provides methods to display the menu, select a coffee, dispense coffee, and update ingredient quantities.
6. The hasEnoughIngredients method checks if there are sufficient ingredients to make a selected coffee, while the updateIngredients method updates the ingredient quantities after dispensing a coffee.
7. The **CoffeeVendingMachine** class is the entry point of the application and demonstrates the usage of the coffee vending machine. It creates an instance of the machine, displays the menu, and simulates concurrent user requests using an ExecutorService.
```


**coffee.go**

```go
package coffeevendingmachine

type Coffee struct {
	name   string
	price  float64
	recipe map[*Ingredient]int
}

func NewCoffee(name string, price float64, recipe map[*Ingredient]int) *Coffee {
	return &Coffee{
		name:   name,
		price:  price,
		recipe: recipe,
	}
}

func (c *Coffee) GetName() string {
	return c.name
}

func (c *Coffee) GetPrice() float64 {
	return c.price
}

func (c *Coffee) GetRecipe() map[*Ingredient]int {
	return c.recipe
}
```


**coffee_machine.go**

```go
package coffeevendingmachine

import (
    "fmt"
    "sync"
)

type CoffeeMachine struct {
    coffeeMenu   []*Coffee
    ingredients  map[string]*Ingredient
    mu          sync.Mutex
}

var (
    instance *CoffeeMachine
    once     sync.Once
)

func GetCoffeeMachine() *CoffeeMachine {
    once.Do(func() {
        instance = &CoffeeMachine{
            coffeeMenu:  make([]*Coffee, 0),
            ingredients: make(map[string]*Ingredient),
        }
        instance.initializeIngredients()
        instance.initializeCoffeeMenu()
    })
    return instance
}

func (cm *CoffeeMachine) initializeIngredients() {
    cm.ingredients["Coffee"] = NewIngredient("Coffee", 10)
    cm.ingredients["Water"] = NewIngredient("Water", 10)
    cm.ingredients["Milk"] = NewIngredient("Milk", 10)
}

func (cm *CoffeeMachine) initializeCoffeeMenu() {
    // Espresso Recipe
    espressoRecipe := make(map[*Ingredient]int)
    espressoRecipe[cm.ingredients["Coffee"]] = 1
    espressoRecipe[cm.ingredients["Water"]] = 1
    cm.coffeeMenu = append(cm.coffeeMenu, NewCoffee("Espresso", 2.5, espressoRecipe))

    // Cappuccino Recipe
    cappuccinoRecipe := make(map[*Ingredient]int)
    cappuccinoRecipe[cm.ingredients["Coffee"]] = 1
    cappuccinoRecipe[cm.ingredients["Water"]] = 1
    cappuccinoRecipe[cm.ingredients["Milk"]] = 1
    cm.coffeeMenu = append(cm.coffeeMenu, NewCoffee("Cappuccino", 3.5, cappuccinoRecipe))

    // Latte Recipe
    latteRecipe := make(map[*Ingredient]int)
    latteRecipe[cm.ingredients["Coffee"]] = 1
    latteRecipe[cm.ingredients["Water"]] = 1
    latteRecipe[cm.ingredients["Milk"]] = 2
    cm.coffeeMenu = append(cm.coffeeMenu, NewCoffee("Latte", 4.0, latteRecipe))
}

func (cm *CoffeeMachine) DisplayMenu() {
    fmt.Println("Coffee Menu:")
    for _, coffee := range cm.coffeeMenu {
        fmt.Printf("%s - $%.2f\n", coffee.GetName(), coffee.GetPrice())
    }
}

func (cm *CoffeeMachine) SelectCoffee(coffeeName string) *Coffee {
    cm.mu.Lock()
    defer cm.mu.Unlock()

    for _, coffee := range cm.coffeeMenu {
        if coffee.GetName() == coffeeName {
            return coffee
        }
    }
    return nil
}

func (cm *CoffeeMachine) DispenseCoffee(coffee *Coffee, payment *Payment) error {
    cm.mu.Lock()
    defer cm.mu.Unlock()

    if coffee == nil {
        return fmt.Errorf("invalid coffee selection")
    }

    if payment.amount < coffee.GetPrice() {
        return fmt.Errorf("insufficient payment for %s", coffee.GetName())
    }

    if !cm.hasEnoughIngredients(coffee) {
        return fmt.Errorf("insufficient ingredients to make %s", coffee.GetName())
    }

    cm.updateIngredients(coffee)
    fmt.Printf("Dispensing %s...\n", coffee.GetName())

    change := payment.amount - coffee.GetPrice()
    if change > 0 {
        fmt.Printf("Please collect your change: $%.2f\n", change)
    }

    return nil
}

func (cm *CoffeeMachine) hasEnoughIngredients(coffee *Coffee) bool {
    for ingredient, requiredQuantity := range coffee.GetRecipe() {
        if ingredient.GetQuantity() < requiredQuantity {
            return false
        }
    }
    return true
}

func (cm *CoffeeMachine) updateIngredients(coffee *Coffee) {
    for ingredient, requiredQuantity := range coffee.GetRecipe() {
        ingredient.UpdateQuantity(-requiredQuantity)
        if ingredient.GetQuantity() < 3 {
            fmt.Printf("Low inventory alert: %s\n", ingredient.GetName())
        }
    }
}
```


**coffee_vending_machine_demo.go**

```go
package coffeevendingmachine

import (
	"fmt"
)

func Run() {
	coffeeMachine := GetCoffeeMachine()

	// Display coffee menu
	coffeeMachine.DisplayMenu()

	// Simulate user requests
	coffeeTypes := []string{"Espresso", "Cappuccino", "Latte"}
	payments := []float64{3.0, 3.5, 4.0}

	for i, coffeeType := range coffeeTypes {
		selectedCoffee := coffeeMachine.SelectCoffee(coffeeType)
		payment := NewPayment(payments[i])

		fmt.Printf("\nOrdering %s...\n", coffeeType)
		if err := coffeeMachine.DispenseCoffee(selectedCoffee, payment); err != nil {
			fmt.Printf("Error: %v\n", err)
		}
	}
}
```


**ingredient.go**

```go
package coffeevendingmachine

import "sync"

type Ingredient struct {
	name     string
	quantity int
	mu       sync.Mutex
}

func NewIngredient(name string, quantity int) *Ingredient {
	return &Ingredient{
		name:     name,
		quantity: quantity,
	}
}

func (i *Ingredient) GetName() string {
	return i.name
}

func (i *Ingredient) GetQuantity() int {
	i.mu.Lock()
	defer i.mu.Unlock()
	return i.quantity
}

func (i *Ingredient) UpdateQuantity(amount int) {
	i.mu.Lock()
	defer i.mu.Unlock()
	i.quantity += amount
}
```


**payment.go**

```go
package coffeevendingmachine

type Payment struct {
	amount float64
}

func NewPayment(amount float64) *Payment {
	return &Payment{amount: amount}
}
```

</details>

<details><summary><b>csharp</b> (20 files)</summary>


**CoffeeVendingMachine.cs**

```cs
class CoffeeVendingMachine
{
    private static CoffeeVendingMachine instance;
    private static readonly object lockObject = new object();
    private IVendingMachineState state;
    private Coffee selectedCoffee;
    private int moneyInserted;

    private CoffeeVendingMachine()
    {
        state = new ReadyState();
        moneyInserted = 0;
    }

    public static CoffeeVendingMachine GetInstance()
    {
        if (instance == null)
        {
            lock (lockObject)
            {
                if (instance == null)
                {
                    instance = new CoffeeVendingMachine();
                }
            }
        }
        return instance;
    }

    public void SelectCoffee(CoffeeType type, List<ToppingType> toppings)
    {
        // 1. Create the base coffee using the factory
        Coffee coffee = CoffeeFactory.CreateCoffee(type);

        // 2. Wrap it with decorators
        foreach (ToppingType topping in toppings)
        {
            switch (topping)
            {
                case ToppingType.EXTRA_SUGAR:
                    coffee = new ExtraSugarDecorator(coffee);
                    break;
                case ToppingType.CARAMEL_SYRUP:
                    coffee = new CaramelSyrupDecorator(coffee);
                    break;
            }
        }
        // Let the state handle the rest
        state.SelectCoffee(this, coffee);
    }

    public void InsertMoney(int amount) { state.InsertMoney(this, amount); }
    public void DispenseCoffee() { state.DispenseCoffee(this); }
    public void Cancel() { state.Cancel(this); }

    // Getters and Setters used by State objects
    public void SetState(IVendingMachineState state) { this.state = state; }
    public IVendingMachineState GetState() { return state; }
    public void SetSelectedCoffee(Coffee selectedCoffee) { this.selectedCoffee = selectedCoffee; }
    public Coffee GetSelectedCoffee() { return selectedCoffee; }
    public void SetMoneyInserted(int moneyInserted) { this.moneyInserted = moneyInserted; }
    public int GetMoneyInserted() { return moneyInserted; }

    public void Reset()
    {
        selectedCoffee = null;
        moneyInserted = 0;
    }
}
```


**CoffeeVendingMachineDemo.cs**

```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

public class CoffeeVendingMachineDemo
{
    public static void Main(string[] args)
    {
        CoffeeVendingMachine machine = CoffeeVendingMachine.GetInstance();
        Inventory inventory = Inventory.GetInstance();

        // Initial setup: Refill inventory
        Console.WriteLine("=== Initializing Vending Machine ===");
        inventory.AddStock(Ingredient.COFFEE_BEANS, 50);
        inventory.AddStock(Ingredient.WATER, 500);
        inventory.AddStock(Ingredient.MILK, 200);
        inventory.AddStock(Ingredient.SUGAR, 100);
        inventory.AddStock(Ingredient.CARAMEL_SYRUP, 50);
        inventory.PrintInventory();

        // Scenario 1: Successful Purchase of a Latte
        Console.WriteLine("\n--- SCENARIO 1: Buy a Latte (Success) ---");
        machine.SelectCoffee(CoffeeType.LATTE, new List<ToppingType>());
        machine.InsertMoney(200);
        machine.InsertMoney(50); // Total 250, price is 220
        machine.DispenseCoffee();
        inventory.PrintInventory();

        // Scenario 2: Purchase with Insufficient Funds & Cancellation
        Console.WriteLine("\n--- SCENARIO 2: Buy Espresso (Insufficient Funds & Cancel) ---");
        machine.SelectCoffee(CoffeeType.ESPRESSO, new List<ToppingType>());
        machine.InsertMoney(100); // Price is 150
        machine.DispenseCoffee(); // Should fail
        machine.Cancel(); // Should refund 100
        inventory.PrintInventory(); // Should be unchanged

        // Scenario 3: Attempt to Buy with Insufficient Ingredients
        Console.WriteLine("\n--- SCENARIO 3: Buy Cappuccino (Out of Milk) ---");
        inventory.PrintInventory();
        machine.SelectCoffee(CoffeeType.CAPPUCCINO, new List<ToppingType> { ToppingType.CARAMEL_SYRUP, ToppingType.EXTRA_SUGAR });
        machine.InsertMoney(300);
        machine.DispenseCoffee(); // Should fail and refund
        inventory.PrintInventory();

        // Refill and final test
        Console.WriteLine("\n--- REFILLING AND FINAL TEST ---");
        inventory.AddStock(Ingredient.MILK, 200);
        inventory.PrintInventory();
        machine.SelectCoffee(CoffeeType.LATTE, new List<ToppingType> { ToppingType.CARAMEL_SYRUP });
        machine.InsertMoney(250);
        machine.DispenseCoffee();
        inventory.PrintInventory();
    }
}
```


**Decorator/CaramelSyrupDecorator.cs**

```cs
class CaramelSyrupDecorator : CoffeeDecorator
{
    private const int COST = 30;
    private static readonly Dictionary<Ingredient, int> RECIPE_ADDITION = 
        new Dictionary<Ingredient, int> { { Ingredient.CARAMEL_SYRUP, 10 } };

    public CaramelSyrupDecorator(Coffee coffee) : base(coffee) { }

    public override string GetCoffeeType()
    {
        return decoratedCoffee.GetCoffeeType() + ", Caramel Syrup";
    }

    public override int GetPrice()
    {
        return decoratedCoffee.GetPrice() + COST;
    }

    public override Dictionary<Ingredient, int> GetRecipe()
    {
        var newRecipe = new Dictionary<Ingredient, int>(decoratedCoffee.GetRecipe());
        foreach (var pair in RECIPE_ADDITION)
        {
            if (newRecipe.ContainsKey(pair.Key))
                newRecipe[pair.Key] += pair.Value;
            else
                newRecipe[pair.Key] = pair.Value;
        }
        return newRecipe;
    }

    public override void Prepare()
    {
        base.Prepare();
        Console.WriteLine("- Drizzling Caramel Syrup on top.");
    }
}
```


**Decorator/CoffeeDecorator.cs**

```cs
abstract class CoffeeDecorator : Coffee
{
    protected Coffee decoratedCoffee;

    public CoffeeDecorator(Coffee coffee)
    {
        decoratedCoffee = coffee;
    }

    public override int GetPrice()
    {
        return decoratedCoffee.GetPrice();
    }

    public override Dictionary<Ingredient, int> GetRecipe()
    {
        return decoratedCoffee.GetRecipe();
    }

    public override void AddCondiments()
    {
        decoratedCoffee.AddCondiments();
    }

    public override void Prepare()
    {
        decoratedCoffee.Prepare();
    }
}
```


**Decorator/ExtraSugarDecorator.cs**

```cs
class ExtraSugarDecorator : CoffeeDecorator
{
    private const int COST = 10;
    private static readonly Dictionary<Ingredient, int> RECIPE_ADDITION = 
        new Dictionary<Ingredient, int> { { Ingredient.SUGAR, 1 } };

    public ExtraSugarDecorator(Coffee coffee) : base(coffee) { }

    public override string GetCoffeeType()
    {
        return decoratedCoffee.GetCoffeeType() + ", Extra Sugar";
    }

    public override int GetPrice()
    {
        return decoratedCoffee.GetPrice() + COST;
    }

    public override Dictionary<Ingredient, int> GetRecipe()
    {
        var newRecipe = new Dictionary<Ingredient, int>(decoratedCoffee.GetRecipe());
        foreach (var pair in RECIPE_ADDITION)
        {
            if (newRecipe.ContainsKey(pair.Key))
                newRecipe[pair.Key] += pair.Value;
            else
                newRecipe[pair.Key] = pair.Value;
        }
        return newRecipe;
    }

    public override void Prepare()
    {
        base.Prepare();
        Console.WriteLine("- Stirring in Extra Sugar.");
    }
}
```


**Enums/CoffeeType.cs**

```cs
enum CoffeeType
{
    ESPRESSO,
    LATTE,
    CAPPUCCINO
}
```


**Enums/Ingredient.cs**

```cs
enum Ingredient
{
    COFFEE_BEANS,
    MILK,
    SUGAR,
    WATER,
    CARAMEL_SYRUP
}
```


**Enums/ToppingType.cs**

```cs
enum ToppingType
{
    EXTRA_SUGAR,
    CARAMEL_SYRUP
}
```


**Factory/CoffeeFactory.cs**

```cs
class CoffeeFactory
{
    public static Coffee CreateCoffee(CoffeeType type)
    {
        switch (type)
        {
            case CoffeeType.ESPRESSO:
                return new Espresso();
            case CoffeeType.LATTE:
                return new Latte();
            case CoffeeType.CAPPUCCINO:
                return new Cappuccino();
            default:
                throw new ArgumentException($"Unsupported coffee type: {type}");
        }
    }
}
```


**Inventory.cs**

```cs
class Inventory
{
    private static Inventory instance;
    private static readonly object lockObject = new object();
    private readonly Dictionary<Ingredient, int> stock = new Dictionary<Ingredient, int>();
    private readonly object inventoryLock = new object();

    private Inventory() { }

    public static Inventory GetInstance()
    {
        if (instance == null)
        {
            lock (lockObject)
            {
                if (instance == null)
                {
                    instance = new Inventory();
                }
            }
        }
        return instance;
    }

    public void AddStock(Ingredient ingredient, int quantity)
    {
        if (stock.ContainsKey(ingredient))
            stock[ingredient] += quantity;
        else
            stock[ingredient] = quantity;
    }

    public bool HasIngredients(Dictionary<Ingredient, int> recipe)
    {
        return recipe.All(pair => stock.GetValueOrDefault(pair.Key, 0) >= pair.Value);
    }

    public void DeductIngredients(Dictionary<Ingredient, int> recipe)
    {
        lock (inventoryLock)
        {
            if (!HasIngredients(recipe))
            {
                Console.WriteLine("Not enough ingredients to make coffee.");
                return;
            }
            foreach (var pair in recipe)
            {
                stock[pair.Key] -= pair.Value;
            }
        }
    }

    public void PrintInventory()
    {
        Console.WriteLine("--- Current Inventory ---");
        foreach (var pair in stock)
        {
            Console.WriteLine($"{pair.Key}: {pair.Value}");
        }
        Console.WriteLine("-------------------------");
    }
}
```


**README.md**

```md
# Designing a Coffee Vending Machine

## Requirements
1. The coffee vending machine should support different types of coffee, such as espresso, cappuccino, and latte.
2. Each type of coffee should have a specific price and recipe (ingredients and their quantities).
3. The machine should have a menu to display the available coffee options and their prices.
4. Users should be able to select a coffee type and make a payment.
5. The machine should dispense the selected coffee and provide change if necessary.
6. The machine should track the inventory of ingredients and notify when they are running low.
7. The machine should handle multiple user requests concurrently and ensure thread safety.

## Classes, Interfaces and Enumerations
1. The **Coffee** class represents a coffee type with its name, price, and recipe (ingredients and their quantities).
2. The **Ingredient** class represents an ingredient used in making coffee, with its name and quantity. It provides a synchronized method to update the quantity.
3. The **Payment** class represents a payment made by a user, with the amount paid.
4. The **CoffeeMachine** class is the main class that manages the coffee vending machine. It follows the Singleton pattern to ensure a single instance of the machine.
5. The **CoffeeMachine** class initializes the coffee menu and ingredients in its constructor. It provides methods to display the menu, select a coffee, dispense coffee, and update ingredient quantities.
6. The hasEnoughIngredients method checks if there are sufficient ingredients to make a selected coffee, while the updateIngredients method updates the ingredient quantities after dispensing a coffee.
7. The **CoffeeVendingMachine** class is the entry point of the application and demonstrates the usage of the coffee vending machine. It creates an instance of the machine, displays the menu, and simulates concurrent user requests using an ExecutorService.
```


**States/IVendingMachineState.cs**

```cs
interface IVendingMachineState
{
    void SelectCoffee(CoffeeVendingMachine machine, Coffee coffee);
    void InsertMoney(CoffeeVendingMachine machine, int amount);
    void DispenseCoffee(CoffeeVendingMachine machine);
    void Cancel(CoffeeVendingMachine machine);
}
```


**States/OutOfIngredientState.cs**

```cs
class OutOfIngredientState : IVendingMachineState
{
    public void SelectCoffee(CoffeeVendingMachine machine, Coffee coffee)
    {
        Console.WriteLine("Sorry, we are sold out.");
    }

    public void InsertMoney(CoffeeVendingMachine machine, int amount)
    {
        Console.WriteLine("Sorry, we are sold out. Money refunded.");
    }

    public void DispenseCoffee(CoffeeVendingMachine machine)
    {
        Console.WriteLine("Sorry, we are sold out.");
    }

    public void Cancel(CoffeeVendingMachine machine)
    {
        Console.WriteLine($"Refunding {machine.GetMoneyInserted()}");
        machine.Reset();
        machine.SetState(new ReadyState());
    }
}
```


**States/PaidState.cs**

```cs
class PaidState : IVendingMachineState
{
    public void SelectCoffee(CoffeeVendingMachine machine, Coffee coffee)
    {
        Console.WriteLine("Already paid. Please dispense or cancel.");
    }

    public void InsertMoney(CoffeeVendingMachine machine, int amount)
    {
        machine.SetMoneyInserted(machine.GetMoneyInserted() + amount);
        Console.WriteLine($"Additional {amount} inserted. Total: {machine.GetMoneyInserted()}");
    }

    public void DispenseCoffee(CoffeeVendingMachine machine)
    {
        Inventory inventory = Inventory.GetInstance();
        Coffee coffee = machine.GetSelectedCoffee();

        if (!inventory.HasIngredients(coffee.GetRecipe()))
        {
            Console.WriteLine("Sorry, we are out of ingredients. Refunding your money.");
            Console.WriteLine($"Refunding {machine.GetMoneyInserted()}");
            machine.Reset();
            machine.SetState(new OutOfIngredientState());
            return;
        }

        // Deduct ingredients and prepare coffee
        inventory.DeductIngredients(coffee.GetRecipe());
        coffee.Prepare();

        // Calculate change
        int change = machine.GetMoneyInserted() - coffee.GetPrice();
        if (change > 0)
        {
            Console.WriteLine($"Here's your change: {change}");
        }

        machine.Reset();
        machine.SetState(new ReadyState());
    }

    public void Cancel(CoffeeVendingMachine machine)
    {
        Console.WriteLine($"Transaction cancelled. Refunding {machine.GetMoneyInserted()}");
        machine.Reset();
        machine.SetState(new ReadyState());
    }
}
```


**States/ReadyState.cs**

```cs
class ReadyState : IVendingMachineState
{
    public void SelectCoffee(CoffeeVendingMachine machine, Coffee coffee)
    {
        machine.SetSelectedCoffee(coffee);
        machine.SetState(new SelectingState());
        Console.WriteLine($"{coffee.GetCoffeeType()} selected. Price: {coffee.GetPrice()}");
    }

    public void InsertMoney(CoffeeVendingMachine machine, int amount)
    {
        Console.WriteLine("Please select a coffee first.");
    }

    public void DispenseCoffee(CoffeeVendingMachine machine)
    {
        Console.WriteLine("Please select and pay first.");
    }

    public void Cancel(CoffeeVendingMachine machine)
    {
        Console.WriteLine("Nothing to cancel.");
    }
}
```


**States/SelectingState.cs**

```cs
class SelectingState : IVendingMachineState
{
    public void SelectCoffee(CoffeeVendingMachine machine, Coffee coffee)
    {
        Console.WriteLine("Already selected. Please pay or cancel.");
    }

    public void InsertMoney(CoffeeVendingMachine machine, int amount)
    {
        machine.SetMoneyInserted(machine.GetMoneyInserted() + amount);
        Console.WriteLine($"Inserted {amount}. Total: {machine.GetMoneyInserted()}");
        if (machine.GetMoneyInserted() >= machine.GetSelectedCoffee().GetPrice())
        {
            machine.SetState(new PaidState());
        }
    }

    public void DispenseCoffee(CoffeeVendingMachine machine)
    {
        Console.WriteLine("Please insert enough money first.");
    }

    public void Cancel(CoffeeVendingMachine machine)
    {
        Console.WriteLine($"Transaction cancelled. Refunding {machine.GetMoneyInserted()}");
        machine.Reset();
        machine.SetState(new ReadyState());
    }
}
```


**TemplateMethod/Cappuccino.cs**

```cs
class Cappuccino : Coffee
{
    public Cappuccino()
    {
        coffeeType = "Cappuccino";
    }

    public override void AddCondiments()
    {
        Console.WriteLine("- Adding steamed milk and foam.");
    }

    public override int GetPrice()
    {
        return 250;
    }

    public override Dictionary<Ingredient, int> GetRecipe()
    {
        return new Dictionary<Ingredient, int>
        {
            { Ingredient.COFFEE_BEANS, 7 },
            { Ingredient.WATER, 30 },
            { Ingredient.MILK, 100 }
        };
    }
}
```


**TemplateMethod/Coffee.cs**

```cs
abstract class Coffee
{
    protected string coffeeType = "Unknown Coffee";

    public virtual string GetCoffeeType()
    {
        return coffeeType;
    }

    // The Template Method
    public virtual void Prepare()
    {
        Console.WriteLine($"\nPreparing your {GetCoffeeType()}...");
        GrindBeans();
        Brew();
        AddCondiments(); // The "hook" for base coffee types
        PourIntoCup();
        Console.WriteLine($"{GetCoffeeType()} is ready!");
    }

    // Common steps
    private void GrindBeans() { Console.WriteLine("- Grinding fresh coffee beans."); }
    private void Brew() { Console.WriteLine("- Brewing coffee with hot water."); }
    private void PourIntoCup() { Console.WriteLine("- Pouring into a cup."); }

    // Abstract step to be implemented by subclasses
    public abstract void AddCondiments();

    public abstract int GetPrice();
    public abstract Dictionary<Ingredient, int> GetRecipe();
}
```


**TemplateMethod/Espresso.cs**

```cs
class Espresso : Coffee
{
    public Espresso()
    {
        coffeeType = "Espresso";
    }

    public override void AddCondiments()
    {
        // No extra condiments for espresso
    }

    public override int GetPrice()
    {
        return 150;
    }

    public override Dictionary<Ingredient, int> GetRecipe()
    {
        return new Dictionary<Ingredient, int>
        {
            { Ingredient.COFFEE_BEANS, 7 },
            { Ingredient.WATER, 30 }
        };
    }
}
```


**TemplateMethod/Latte.cs**

```cs
class Latte : Coffee
{
    public Latte()
    {
        coffeeType = "Latte";
    }

    public override void AddCondiments()
    {
        Console.WriteLine("- Adding steamed milk.");
    }

    public override int GetPrice()
    {
        return 220;
    }

    public override Dictionary<Ingredient, int> GetRecipe()
    {
        return new Dictionary<Ingredient, int>
        {
            { Ingredient.COFFEE_BEANS, 7 },
            { Ingredient.WATER, 30 },
            { Ingredient.MILK, 150 }
        };
    }
}
```

</details>

<details><summary><b>typescript</b> (8 files)</summary>


**CoffeeRecipe.ts**

```ts
class CoffeeRecipe {
  private name: string;
  private price: number;
  private recipe: Map<string, number>;

  constructor(name: string, price: number, recipe: Map<string, number>) {
    this.name = name;
    this.price = price;
    this.recipe = recipe;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  public getRecipe() {
    return this.recipe;
  }
}
export default CoffeeRecipe;
```


**CoffeeVendingMachine.ts**

```ts
import CoffeeRecipe from "./CoffeeRecipe";
import Dispenser from "./Dispenser";
import IngredientStore from "./IngredientStore";
import Payment from "./Payment";
import PaymentProcessor from "./PaymentProcessor";

class CoffeeVendingMachine {
  private static instance: CoffeeVendingMachine | null;
  private recipes: Map<string, CoffeeRecipe>;
  private ingredientStore: IngredientStore;
  private dispenser: Dispenser;
  private paymentProcessor: PaymentProcessor;

  private constructor() {
    this.ingredientStore = new IngredientStore();
    this.dispenser = new Dispenser();
    this.paymentProcessor = new PaymentProcessor();
    this.recipes = new Map();
    this.addDefaultRecipes();
  }

  private addDefaultRecipes(): void {
    this.recipes.set(
      "Latte",
      new CoffeeRecipe(
        "Latte",
        3.0,
        new Map([
          ["Water", 50],
          ["Coffee", 20],
          ["Milk", 30],
        ]),
      ),
    );
    this.recipes.set(
      "Espresso",
      new CoffeeRecipe(
        "Espresso",
        3.5,
        new Map([
          ["Water", 50],
          ["Coffee", 20],
        ]),
      ),
    );
    this.recipes.set(
      "Cappuccino",
      new CoffeeRecipe(
        "Cappuccino",
        3.5,
        new Map([
          ["Water", 50],
          ["Coffee", 20],
          ["Milk", 40],
        ]),
      ),
    );
  }

  public static getInstance(): CoffeeVendingMachine {
    if (!CoffeeVendingMachine.instance) {
      CoffeeVendingMachine.instance = new CoffeeVendingMachine();
    }
    return CoffeeVendingMachine.instance;
  }

  public displayMenu(): void {
    console.log("Coffee Menu:");
    for (const recipe of this.recipes.keys()) {
        console.log(recipe + " - $" + this.recipes.get(recipe)?.getPrice());
    }
  }

  public selectCoffee(coffeeName: string): CoffeeRecipe {
    const recipe = this.recipes.get(coffeeName);
    if (!recipe) throw new Error(`Invalid coffee recipe: ${coffeeName}`);
    console.log('Selected Coffee : ',coffeeName)
    return recipe;
  }

  public dispenseCoffee(recipe: CoffeeRecipe, payment: Payment): void {
    if (payment.getAmount() < recipe.getPrice()) {
      console.error(
        `Insufficient payment for ${recipe.getName()}. Required: ${recipe.getPrice()}`,
      );
      return;
    }

    if (!this.ingredientStore.hasEnoughIngredient(recipe.getRecipe())) {
      console.error(`Insufficient ingredients to make ${recipe.getName()}`);
      return;
    }

    this.ingredientStore.consume(recipe.getRecipe());
    this.dispenser.prepareDrink(recipe);

    const change = this.paymentProcessor.process(
      recipe.getPrice(),
      payment.getAmount(),
    );
    if (change > 0) {
      console.log(`Please collect your change: $${change}`);
    }
  }

  public refillIngredient(ingredient: string, quantity: number): void {
    this.ingredientStore.refill(ingredient, quantity);
  }

  public showIngredients(): void {
    console.log("Ingredient Levels:");
    const ingredients = this.ingredientStore.getAllIngredients();
    for (const [name, quantity] of Object.entries(ingredients)) {
      console.log(`${name}: ${quantity}`);
    }
  }
}
export default CoffeeVendingMachine;
```


**CoffeeVendingMachineDemo.ts**

```ts
import CoffeeVendingMachine from "./CoffeeVendingMachine";
import Payment from "./Payment";

export default class CoffeeVendingMachineDemo {
  static run() {
    const coffeeVendingMachine = CoffeeVendingMachine.getInstance();

    coffeeVendingMachine.refillIngredient("Water", 120);
    coffeeVendingMachine.refillIngredient("Milk", 70);
    coffeeVendingMachine.refillIngredient("Coffee", 150);

    coffeeVendingMachine.displayMenu();

    const espresso = coffeeVendingMachine.selectCoffee("Espresso");
    coffeeVendingMachine.dispenseCoffee(espresso, new Payment(3.0));

    const cappuccino = coffeeVendingMachine.selectCoffee("Cappuccino");
    coffeeVendingMachine.dispenseCoffee(cappuccino, new Payment(3.5));

    const latte = coffeeVendingMachine.selectCoffee("Latte");
    coffeeVendingMachine.dispenseCoffee(latte, new Payment(4.0));
  }
}
```


**Dispenser.ts**

```ts
import CoffeeRecipe from "./CoffeeRecipe";

class Dispenser {
  public prepareDrink(recipe: CoffeeRecipe): void {
    console.log(`Dispensing: ${recipe.getName()}`);
  }
}
export default Dispenser;
```


**IngredientStore.ts**

```ts
class IngredientStore {
  private inventory: Map<string, number>;

  constructor() {
    this.inventory = new Map();
  }

  public refill(ingredient: string, quantity: number): void {
    this.inventory.set(
      ingredient,
      (this.inventory.get(ingredient) || 0) + quantity,
    );
  }

  public hasEnoughIngredient(required: Map<string, number>): boolean {
    for (const [ingredient, quantity] of required) {
      if ((this.inventory.get(ingredient) || 0) < quantity) return false;
    }
    return true;
  }

  public consume(required: Map<string, number>): void {
    for (const [ingredient, quantity] of required) {
      const currentStock = this.inventory.get(ingredient) || 0;
      if (currentStock < quantity) {
        throw new Error(`Not enough ${ingredient} to consume`);
      }
      this.inventory.set(ingredient, currentStock - quantity);
    }
  }

  public getLevel(ingredient: string): number {
    return this.inventory.get(ingredient) || 0;
  }

  public getAllIngredients(): Map<string, number> {
    return { ...this.inventory };
  }
}
export default IngredientStore;
```


**Payment.ts**

```ts
export default class Payment {
  private amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  public getAmount(): number {
    return this.amount;
  }
}
```


**PaymentProcessor.ts**

```ts
class PaymentProcessor {
  public process(price: number, paid: number): number {
    console.log("Processing Payment...");
    return paid - price;
  }
}
export default PaymentProcessor;
```


**README.md**

```md
# Coffee Vending Machine (LLD)

## Problem Statement

Design and implement a Coffee Vending Machine system that can serve different types of coffee, manage ingredient inventory, process payments, and handle user interactions such as selecting coffee and refilling ingredients.

---

## Requirements

- **Multiple Coffee Types:** The machine should support multiple coffee recipes (e.g., Espresso, Latte, Cappuccino).
- **Ingredient Management:** The machine should track and manage ingredient levels, and prevent dispensing if ingredients are insufficient.
- **Payment Processing:** The machine should process payments before dispensing coffee.
- **Refill Ingredients:** The machine should allow refilling of ingredients.
- **Extensibility:** Easy to add new coffee types or payment methods.

---

## Core Entities

- **CoffeeVendingMachine:** Main class that manages the overall operation, user interaction, and coordinates other components.
- **CoffeeRecipe:** Represents a coffee recipe, including required ingredients and their quantities.
- **IngredientStore:** Manages the inventory of ingredients, supports checking and refilling.
- **Dispenser:** Handles the dispensing of coffee after successful payment and ingredient check.
- **PaymentProcessor:** Handles payment logic and validation.
- **Payment:** Represents a payment transaction.

---

## Class Design

## UML Class Diagram

![](../../../../uml-diagrams/class-diagrams/coffeevendingmachine-class-diagram.png)

### 1. CoffeeVendingMachine
- **Fields:** ingredientStore, paymentProcessor, Map<String, CoffeeRecipe> recipes, Dispenser
- **Methods:** selectCoffee(String), makeCoffee(String, Payment), refillIngredient(String, int), addRecipe(CoffeeRecipe), etc.

### 2. CoffeeRecipe
- **Fields:** name, Map<String, Integer> ingredients
- **Methods:** getName(), getIngredients()

### 3. IngredientStore
- **Fields:** Map<String, Integer> ingredientLevels
- **Methods:** hasIngredients(Map<String, Integer>), useIngredients(Map<String, Integer>), refill(String, int), getLevel(String)

### 4. Dispenser
- **Methods:** dispense(String)

### 5. PaymentProcessor
- **Methods:** processPayment(Payment)

### 6. Payment
- **Fields:** amount, paymentType, etc.

---

## Design Patterns Used

- **Strategy Pattern:** (Conceptually) for supporting different payment methods or coffee recipes.
- **Separation of Concerns:** Each class has a single responsibility (inventory, payment, dispensing, etc.).

---

## Example Usage

```ts
const coffeeVendingMachine = CoffeeVendingMachine.getInstance();

coffeeVendingMachine.refillIngredient("Milk", 70);
coffeeVendingMachine.refillIngredient("Coffee", 150);

coffeeVendingMachine.displayMenu();

const espresso = coffeeVendingMachine.selectCoffee("Espresso");
coffeeVendingMachine.dispenseCoffee(espresso, new Payment(3.0));
```

---

## Demo

See `CoffeeVendingMachineDemo.ts` for a sample usage and simulation of the coffee vending machine.

---

## Extending the Framework

- **Add new coffee types:** Create new `CoffeeRecipe` instances and add them to the machine.
- **Add new payment methods:** Extend `PaymentProcessor` to support new payment types.
- **Add new ingredients:** Update `IngredientStore` and recipes as needed.

---
```

</details>
