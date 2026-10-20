# Low-level design problem: atm

> Copied from <https://github.com/ashishps1/awesome-low-level-design/blob/main/problems/atm.md> (GPL-3.0, by Ashish Pratap Singh). Questions and answers are the source's own; nothing was answered or rewritten here.


# Designing an ATM System

## Requirements
1. The ATM system should support basic operations such as balance inquiry, cash withdrawal, and cash deposit.
2. Users should be able to authenticate themselves using a card and a PIN (Personal Identification Number).
3. The system should interact with a bank's backend system to validate user accounts and perform transactions.
4. The ATM should have a cash dispenser to dispense cash to users.
5. The system should handle concurrent access and ensure data consistency.
6. The ATM should have a user-friendly interface for users to interact with.

## UML Class Diagram

![](images/awesome-low-level-design_class-diagrams_atm-class-diagram.png)

## Implementations
#### [Java Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/java/src/atm) 
#### [Python Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/python/atm)
#### [C++ Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/cpp/atm)
#### [C# Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/csharp/atm)
#### [Go Implementation](https://github.com/ashishps1/awesome-low-level-design/blob/main/solutions/golang/atm)

## Classes, Interfaces and Enumerations
1. The **Card** class represents an ATM card with a card number and PIN.
2. The **Account** class represents a bank account with an account number and balance. It provides methods to debit and credit the account balance.
3. The **Transaction** class is an abstract base class for different types of transactions, such as withdrawal and deposit. It is extended by WithdrawalTransaction and DepositTransaction classes.
4. The **BankingService** class manages the bank accounts and processes transactions. It uses a thread-safe ConcurrentHashMap to store and retrieve account information.
5. The **CashDispenser** class represents the ATM's cash dispenser and handles the dispensing of cash. It uses synchronization to ensure thread safety when dispensing cash.
6. The **ATM** class serves as the main interface for ATM operations. It interacts with the BankingService and CashDispenser to perform user authentication, balance inquiry, cash withdrawal, and cash deposit.
7. The **ATMDriver** class demonstrates the usage of the ATM system by creating sample accounts and performing ATM operations.

---

## Official solutions from the repository

<details><summary><b>java</b> (17 files)</summary>


**ATMDemo.java**

```java
package atm;

import atm.enums.OperationType;

public class ATMDemo {
    public static void main(String[] args) {
        ATMSystem atmSystem = ATMSystem.getInstance();

        // Perform Check Balance operation
        atmSystem.insertCard("1234-5678-9012-3456");
        atmSystem.enterPin("1234");
        atmSystem.selectOperation(OperationType.CHECK_BALANCE); // $1000

        // Perform Withdraw Cash operation
        atmSystem.insertCard("1234-5678-9012-3456");
        atmSystem.enterPin("1234");
        atmSystem.selectOperation(OperationType.WITHDRAW_CASH, 570);

        // Perform Deposit Cash operation
        atmSystem.insertCard("1234-5678-9012-3456");
        atmSystem.enterPin("1234");
        atmSystem.selectOperation(OperationType.DEPOSIT_CASH, 200);

        // Perform Check Balance operation
        atmSystem.insertCard("1234-5678-9012-3456");
        atmSystem.enterPin("1234");
        atmSystem.selectOperation(OperationType.CHECK_BALANCE); // $630

        // Perform Withdraw Cash more than balance
        atmSystem.insertCard("1234-5678-9012-3456");
        atmSystem.enterPin("1234");
        atmSystem.selectOperation(OperationType.WITHDRAW_CASH, 700); // Insufficient balance

        // Insert Incorrect PIN
        atmSystem.insertCard("1234-5678-9012-3456");
        atmSystem.enterPin("3425");
    }
}
```


**ATMSystem.java**

```java
package atm;

import atm.chainofresponsibility.DispenseChain;
import atm.chainofresponsibility.NoteDispenser100;
import atm.chainofresponsibility.NoteDispenser20;
import atm.chainofresponsibility.NoteDispenser50;
import atm.entities.BankService;
import atm.entities.Card;
import atm.entities.CashDispenser;
import atm.enums.OperationType;
import atm.state.ATMState;
import atm.state.IdleState;

import java.util.concurrent.atomic.AtomicLong;

public class ATMSystem {
    private static ATMSystem INSTANCE;
    private final BankService bankService;
    private final CashDispenser cashDispenser;
    private static final AtomicLong transactionCounter = new AtomicLong(0);
    private ATMState currentState;
    private Card currentCard;

    private ATMSystem() {
        this.currentState = new IdleState();
        this.bankService = new BankService();

        // Setup the dispenser chain
        DispenseChain c1 = new NoteDispenser100(10); // 10 x $100 notes
        DispenseChain c2 = new NoteDispenser50(20); // 20 x $50 notes
        DispenseChain c3 = new NoteDispenser20(30); // 30 x $20 notes
        c1.setNextChain(c2);
        c2.setNextChain(c3);
        this.cashDispenser = new CashDispenser(c1);
    }

    public static ATMSystem getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new ATMSystem();
        }
        return INSTANCE;
    }

    public void changeState(ATMState newState) { this.currentState = newState; }
    public void setCurrentCard(Card card) { this.currentCard = card; }

    public void insertCard(String cardNumber) {
        currentState.insertCard(this, cardNumber);
    }

    public void enterPin(String pin) {
        currentState.enterPin(this, pin);
    }

    public void selectOperation(OperationType op, int... args) { currentState.selectOperation(this, op, args); }

    public Card getCard(String cardNumber) {
        return bankService.getCard(cardNumber);
    }

    public boolean authenticate(String pin) {
        return bankService.authenticate(currentCard, pin);
    }

    public void checkBalance() {
        double balance = bankService.getBalance(currentCard);
        System.out.printf("Your current account balance is: $%.2f%n", balance);
    }

    public void withdrawCash(int amount) {
        if (!cashDispenser.canDispenseCash(amount)) {
            throw new IllegalStateException("Insufficient cash available in the ATM.");
        }

        bankService.withdrawMoney(currentCard, amount);

        try {
            cashDispenser.dispenseCash(amount);
        } catch (Exception e) {
            bankService.depositMoney(currentCard, amount); // Deposit back if dispensing fails
        }
    }

    public void depositCash(int amount) {
        bankService.depositMoney(currentCard, amount);
    }

    public Card getCurrentCard() {
        return currentCard;
    }

    public BankService getBankService() {
        return bankService;
    }
}
```


**README.md**

```md
# ATM System (LLD)

## Problem Statement

Design and implement an ATM (Automated Teller Machine) system that allows users to perform basic banking operations such as balance inquiry, cash withdrawal, and cash deposit, with secure authentication and proper cash management.

---

## Requirements

- **User Authentication:** Users must authenticate using a card and PIN.
- **Balance Inquiry:** Users can check their account balance.
- **Cash Withdrawal:** Users can withdraw cash if sufficient balance and cash are available.
- **Cash Deposit:** Users can deposit cash into their account.
- **Transaction Management:** The system records and processes transactions (withdrawal, deposit).
- **Banking Service Integration:** The ATM interacts with a backend banking service to validate accounts and perform transactions.
- **Cash Dispenser:** The ATM manages its own cash inventory and dispenses cash securely.
- **Concurrency & Consistency:** The system handles concurrent access and ensures data consistency.
- **User Interface:** The ATM provides a user-friendly interface for operations.
- **Extensibility:** Easy to add new features such as mini-statements, fund transfers, or multi-currency support.

---

## Core Entities

- **ATM:** Main class for ATM operations; interacts with `BankingService` and `CashDispenser`.
- **Card:** Represents an ATM card with card number and PIN.
- **Account:** Represents a bank account with account number and balance; supports debit and credit operations.
- **Transaction (abstract):** Base class for transactions; extended by `WithdrawalTransaction` and `DepositTransaction`.
- **WithdrawalTransaction / DepositTransaction:** Concrete transaction types for withdrawal and deposit.
- **BankingService:** Manages bank accounts and processes transactions; uses thread-safe data structures.
- **CashDispenser:** Manages the ATM's cash inventory and handles dispensing; ensures thread safety.
- **ATMDemo:** Demonstrates the usage of the ATM system with sample accounts and operations.

---

## Class Design

## UML Class Diagram

![](../../../../uml-diagrams/class-diagrams/atmSystem-class-diagram.png)

### 1. ATM
- **Fields:** BankingService bankService, CashDispenser cashDispenser
- **Methods:** authenticateUser(Card), checkBalance(String accountNumber), withdrawCash(String accountNumber, double amount), depositCash(String accountNumber, double amount)

### 2. Card
- **Fields:** String cardNumber, String pin

### 3. Account
- **Fields:** String accountNumber, double balance
- **Methods:** debit(double), credit(double), getBalance()

### 4. Transaction (abstract)
- **Fields:** String accountNumber, double amount, Date date
- **Methods:** process()

### 5. WithdrawalTransaction / DepositTransaction
- **Inherits:** Transaction
- **Methods:** process()

### 6. BankingService
- **Fields:** Map<String, Account> accounts
- **Methods:** createAccount(String, double), getAccount(String), processTransaction(Transaction)

### 7. CashDispenser
- **Fields:** double cashAvailable
- **Methods:** dispenseCash(double), addCash(double), getCashAvailable()

### 8. ATMDemo
- **Methods:** run() — demonstrates sample ATM operations

---

## Example Usage

```java
BankingService bankService = new BankingService();
CashDispenser cashDispenser = new CashDispenser(10000);
ATM atmSystem = new ATM(bankService, cashDispenser);

bankService.createAccount("1234567890", 1000.0);
Card card = new Card("1234567890", "1234");
atmSystem.authenticateUser(card);

double balance = atmSystem.checkBalance("1234567890");
atmSystem.withdrawCash("1234567890", 500.0);
atmSystem.depositCash("1234567890", 200.0);
```

---

## Demo

See `ATMDemo.java` for a sample usage and simulation of the ATM system.

---

## Extending the Framework

- **Add mini-statements:** Show recent transactions.
- **Add fund transfers:** Allow transfers between accounts.
- **Add multi-currency support:** Handle different currencies and conversions.

---
```


**chainofresponsibility/DispenseChain.java**

```java
package atm.chainofresponsibility;

// The chain interface
public interface DispenseChain {
    void setNextChain(DispenseChain nextChain);
    void dispense(int amount);
    boolean canDispense(int amount);
}
```


**chainofresponsibility/NoteDispenser.java**

```java
package atm.chainofresponsibility;

abstract class NoteDispenser implements DispenseChain {
    private DispenseChain nextChain;
    private final int noteValue;
    private int numNotes;

    public NoteDispenser(int noteValue, int numNotes) {
        this.noteValue = noteValue;
        this.numNotes = numNotes;
    }

    @Override
    public void setNextChain(DispenseChain nextChain) {
        this.nextChain = nextChain;
    }

    @Override
    public synchronized void dispense(int amount) {
        if (amount >= noteValue) {
            int numToDispense = Math.min(amount / noteValue, this.numNotes);
            int remainingAmount = amount - (numToDispense * noteValue);

            if (numToDispense > 0) {
                System.out.println("Dispensing " + numToDispense + " x $" + noteValue + " note(s)");
                this.numNotes -= numToDispense;
            }

            if (remainingAmount > 0 && this.nextChain != null) {
                this.nextChain.dispense(remainingAmount);
            }
        } else if (this.nextChain != null) {
            this.nextChain.dispense(amount);
        }
    }

    @Override
    public synchronized boolean canDispense(int amount) {
        if (amount < 0) return false;
        if (amount == 0) return true;

        int numToUse = Math.min(amount / noteValue, this.numNotes);
        int remainingAmount = amount - (numToUse * noteValue);

        if (remainingAmount == 0) return true;
        if (this.nextChain != null) {
            return this.nextChain.canDispense(remainingAmount);
        }
        return false;
    }
}
```


**chainofresponsibility/NoteDispenser100.java**

```java
package atm.chainofresponsibility;

public class NoteDispenser100 extends NoteDispenser{
    public NoteDispenser100(int numNotes) {
        super(100, numNotes);
    }
}
```


**chainofresponsibility/NoteDispenser20.java**

```java
package atm.chainofresponsibility;

public class NoteDispenser20 extends NoteDispenser{
    public NoteDispenser20(int numNotes) { super(20, numNotes); }
}
```


**chainofresponsibility/NoteDispenser50.java**

```java
package atm.chainofresponsibility;

public class NoteDispenser50 extends NoteDispenser{
    public NoteDispenser50(int numNotes) { super(50, numNotes); }
}
```


**entities/Account.java**

```java
package atm.entities;

import java.util.HashMap;
import java.util.Map;

public class Account {
    private final String accountNumber;
    private double balance;
    private Map<String, Card> cards;

    public Account(String accountNumber, double balance) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.cards = new HashMap<>();
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public double getBalance() {
        return balance;
    }

    public Map<String, Card> getCards() {
        return cards;
    }

    public synchronized void deposit(double amount) {
        balance += amount;
    }

    public synchronized boolean withdraw(double amount) {
        if (balance >= amount) {
            balance -= amount;
            return true;
        }
        return false;
    }
}
```


**entities/BankService.java**

```java
package atm.entities;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class BankService {
    private final Map<String, Account> accounts = new ConcurrentHashMap<>();
    private final Map<String, Card> cards = new ConcurrentHashMap<>();
    private final Map<Card, Account> cardAccountMap = new ConcurrentHashMap<>();

    public BankService() {
        // Create sample accounts and cards
        Account account1 = createAccount("1234567890", 1000.0);
        Card card1 = createCard("1234-5678-9012-3456", "1234");
        linkCardToAccount(card1, account1);

        Account account2 = createAccount("9876543210", 500.0);
        Card card2 = createCard("9876-5432-1098-7654", "4321");
        linkCardToAccount(card2, account2);
    }

    public Account createAccount(String accountNumber, double initialBalance) {
        Account account = new Account(accountNumber, initialBalance);
        accounts.put(accountNumber, account);
        return account;
    }

    public Card createCard(String cardNumber, String pin) {
        Card card = new Card(cardNumber, pin);
        cards.put(cardNumber, card);
        return card;
    }

    public boolean authenticate(Card card, String pin) {
        return card.getPin().equals(pin);
    }

    public Card getCard(String cardNumber) {
        return cards.getOrDefault(cardNumber, null);
    }

    public double getBalance(Card card) {
        return cardAccountMap.get(card).getBalance();
    }

    public void withdrawMoney(Card card, double amount) {
        cardAccountMap.get(card).withdraw(amount);
    }

    public void depositMoney(Card card, double amount) {
        cardAccountMap.get(card).deposit(amount);
    }

    public void linkCardToAccount(Card card, Account account) {
        account.getCards().put(card.getCardNumber(), card);
        cardAccountMap.put(card, account);
    }
}
```


**entities/Card.java**

```java
package atm.entities;

public class Card {
    private final String cardNumber;
    private final String pin;

    public Card(String cardNumber, String pin) {
        this.cardNumber = cardNumber;
        this.pin = pin;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public String getPin() {
        return pin;
    }
}
```


**entities/CashDispenser.java**

```java
package atm.entities;

import atm.chainofresponsibility.DispenseChain;

public class CashDispenser {
    private final DispenseChain chain;

    public CashDispenser(DispenseChain chain) {
        this.chain = chain;
    }

    public synchronized void dispenseCash(int amount) {
        chain.dispense(amount);
    }

    public synchronized boolean canDispenseCash(int amount) {
        if (amount % 10 != 0) {
            return false;
        }
        return chain.canDispense(amount);
    }
}
```


**enums/OperationType.java**

```java
package atm.enums;

public enum OperationType {
    CHECK_BALANCE,
    WITHDRAW_CASH,
    DEPOSIT_CASH
}
```


**state/ATMState.java**

```java
package atm.state;

import atm.ATMSystem;
import atm.enums.OperationType;

public interface ATMState {
    void insertCard(ATMSystem atmSystem, String cardNumber);
    void enterPin(ATMSystem atmSystem, String pin);
    void selectOperation(ATMSystem atmSystem, OperationType op, int... args);
    void ejectCard(ATMSystem atmSystem);
}
```


**state/AuthenticatedState.java**

```java
package atm.state;

import atm.ATMSystem;
import atm.enums.OperationType;

public class AuthenticatedState implements ATMState {
    @Override
    public void insertCard(ATMSystem atmSystem, String cardNumber) {
        System.out.println("Error: A card is already inserted and a session is active.");
    }

    @Override
    public void enterPin(ATMSystem atmSystem, String pin) {
        System.out.println("Error: PIN has already been entered and authenticated.");
    }

    @Override
    public void selectOperation(ATMSystem atmSystem, OperationType op, int... args) {
        // In a real UI, this would be a menu. Here we use a switch.
        switch (op) {
            case CHECK_BALANCE:
                atmSystem.checkBalance();
                break;

            case WITHDRAW_CASH:
                if (args.length == 0 || args[0] <= 0) {
                    System.out.println("Error: Invalid withdrawal amount specified.");
                    break;
                }
                int amountToWithdraw = args[0];

                double accountBalance = atmSystem.getBankService().getBalance(atmSystem.getCurrentCard());

                if (amountToWithdraw > accountBalance) {
                    System.out.println("Error: Insufficient balance.");
                    break;
                }

                System.out.println("Processing withdrawal for $" + amountToWithdraw);
                // Delegate the complex withdrawal logic to the ATM's dedicated method
                atmSystem.withdrawCash(amountToWithdraw);
                break;

            case DEPOSIT_CASH:
                if (args.length == 0 || args[0] <= 0) {
                    System.out.println("Error: Invalid withdrawal amount specified.");
                    break;
                }
                int amountToDeposit = args[0];
                System.out.println("Processing deposit for $" + amountToDeposit);
                atmSystem.depositCash(amountToDeposit);
                break;

            default:
                System.out.println("Error: Invalid operation selected.");
                break;
        }

        // End the session after one transaction
        System.out.println("Transaction complete.");
        ejectCard(atmSystem);
    }

    @Override
    public void ejectCard(ATMSystem atmSystem) {
        System.out.println("Ending session. Card has been ejected. Thank you for using our ATM.");
        atmSystem.setCurrentCard(null);
        atmSystem.changeState(new IdleState());
    }
}
```


**state/HasCardState.java**

```java
package atm.state;

import atm.ATMSystem;
import atm.enums.OperationType;

public class HasCardState implements ATMState {
    @Override
    public void insertCard(ATMSystem atmSystem, String cardNumber) {
        System.out.println("Error: A card is already inserted. Cannot insert another card.");
    }

    @Override
    public void enterPin(ATMSystem atmSystem, String pin) {
        System.out.println("Authenticating PIN...");
        boolean isAuthenticated = atmSystem.authenticate(pin);;

        if (isAuthenticated) {
            System.out.println("Authentication successful.");
            atmSystem.changeState(new AuthenticatedState());
        } else {
            System.out.println("Authentication failed: Incorrect PIN.");
            ejectCard(atmSystem);
        }
    }

    @Override
    public void selectOperation(ATMSystem atmSystem, OperationType op, int... args) {
        System.out.println("Error: Please enter your PIN first to select an operation.");
    }

    @Override
    public void ejectCard(ATMSystem atmSystem) {
        System.out.println("Card has been ejected. Thank you for using our ATM.");
        atmSystem.setCurrentCard(null);
        atmSystem.changeState(new IdleState());
    }
}
```


**state/IdleState.java**

```java
package atm.state;

import atm.ATMSystem;
import atm.entities.Card;
import atm.enums.OperationType;

public class IdleState implements ATMState {
    @Override
    public void insertCard(ATMSystem atmSystem, String cardNumber) {
        System.out.println("\nCard has been inserted.");
        Card card = atmSystem.getCard(cardNumber);

        if (card == null) {
            ejectCard(atmSystem);
        } else {
            atmSystem.setCurrentCard(card);
            atmSystem.changeState(new HasCardState());
        }
    }

    @Override
    public void enterPin(ATMSystem atmSystem, String pin) {
        System.out.println("Error: Please insert a card first.");
    }

    @Override
    public void selectOperation(ATMSystem atmSystem, OperationType op, int... args) {
        System.out.println("Error: Please insert a card first.");
    }

    @Override
    public void ejectCard(ATMSystem atmSystem) {
        System.out.println("Error: Card not found.");
        atmSystem.setCurrentCard(null);
    }
}
```

</details>

<details><summary><b>python</b> (11 files)</summary>


**README.md**

```md
# Designing an ATM System

## Requirements
1. The ATM system should support basic operations such as balance inquiry, cash withdrawal, and cash deposit.
2. Users should be able to authenticate themselves using a card and a PIN (Personal Identification Number).
3. The system should interact with a bank's backend system to validate user accounts and perform transactions.
4. The ATM should have a cash dispenser to dispense cash to users.
5. The system should handle concurrent access and ensure data consistency.
6. The ATM should have a user-friendly interface for users to interact with.

## Classes, Interfaces and Enumerations
1. The **Card** class represents an ATM card with a card number and PIN.
2. The **Account** class represents a bank account with an account number and balance. It provides methods to debit and credit the account balance.
3. The **Transaction** class is an abstract base class for different types of transactions, such as withdrawal and deposit. It is extended by WithdrawalTransaction and DepositTransaction classes.
4. The **BankingService** class manages the bank accounts and processes transactions. It uses a thread-safe ConcurrentHashMap to store and retrieve account information.
5. The **CashDispenser** class represents the ATM's cash dispenser and handles the dispensing of cash. It uses synchronization to ensure thread safety when dispensing cash.
6. The **ATM** class serves as the main interface for ATM operations. It interacts with the BankingService and CashDispenser to perform user authentication, balance inquiry, cash withdrawal, and cash deposit.
7. The **ATMDriver** class demonstrates the usage of the ATM system by creating sample accounts and performing ATM operations.
```


**account.py**

```py
import threading
from typing import Dict
from card import Card

class Account:
    def __init__(self, account_number: str, balance: float):
        self._account_number = account_number
        self._balance = balance
        self._cards: Dict[str, Card] = {}
        self._lock = threading.Lock()
    
    def get_account_number(self) -> str:
        return self._account_number
    
    def get_balance(self) -> float:
        return self._balance
    
    def get_cards(self) -> Dict[str, Card]:
        return self._cards
    
    def deposit(self, amount: float):
        with self._lock:
            self._balance += amount
    
    def withdraw(self, amount: float) -> bool:
        with self._lock:
            if self._balance >= amount:
                self._balance -= amount
                return True
            return False
```


**atm.py**

```py
import threading
from typing import Optional
from atm_state import ATMState, IdleState
from bank_service import BankService
from card import Card
from operation_type import OperationType
from note_dispenser import NoteDispenser100, NoteDispenser50, NoteDispenser20
from cash_dispenser import CashDispenser

class ATM:
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
            self._current_state = IdleState()
            self._bank_service = BankService()
            self._current_card: Optional[Card] = None
            self._transaction_counter = 0
            
            # Setup the dispenser chain
            c1 = NoteDispenser100(10)  # 10 x $100 notes
            c2 = NoteDispenser50(20)   # 20 x $50 notes
            c3 = NoteDispenser20(30)   # 30 x $20 notes
            c1.set_next_chain(c2)
            c2.set_next_chain(c3)
            self._cash_dispenser = CashDispenser(c1)
            self._initialized = True
    
    @classmethod
    def get_instance(cls):
        return cls()
    
    def change_state(self, new_state: ATMState):
        self._current_state = new_state
    
    def set_current_card(self, card: Optional[Card]):
        self._current_card = card
    
    def insert_card(self, card_number: str):
        self._current_state.insert_card(self, card_number)
    
    def enter_pin(self, pin: str):
        self._current_state.enter_pin(self, pin)
    
    def select_operation(self, op: OperationType, *args):
        self._current_state.select_operation(self, op, *args)
    
    def check_balance(self):
        balance = self._bank_service.get_balance(self._current_card)
        print(f"Your current account balance is: ${balance:.2f}")
    
    def withdraw_cash(self, amount: int):
        if not self._cash_dispenser.can_dispense_cash(amount):
            raise RuntimeError("Insufficient cash available in the ATM.")
        
        self._bank_service.withdraw_money(self._current_card, amount)
        
        try:
            self._cash_dispenser.dispense_cash(amount)
        except Exception as e:
            self._bank_service.deposit_money(self._current_card, amount)  # Deposit back if dispensing fails
            raise e
    
    def deposit_cash(self, amount: int):
        self._bank_service.deposit_money(self._current_card, amount)
    
    def get_current_card(self) -> Optional[Card]:
        return self._current_card
    
    def get_bank_service(self) -> BankService:
        return self._bank_service
```


**atm_demo.py**

```py
from atm import ATM
from operation_type import OperationType

class ATMDemo:
    @staticmethod
    def main():
        atm = ATM.get_instance()
        
        # Perform Check Balance operation
        atm.insert_card("1234-5678-9012-3456")
        atm.enter_pin("1234")
        atm.select_operation(OperationType.CHECK_BALANCE)  # $1000
        
        # Perform Withdraw Cash operation
        atm.insert_card("1234-5678-9012-3456")
        atm.enter_pin("1234")
        atm.select_operation(OperationType.WITHDRAW_CASH, 570)
        
        # Perform Deposit Cash operation
        atm.insert_card("1234-5678-9012-3456")
        atm.enter_pin("1234")
        atm.select_operation(OperationType.DEPOSIT_CASH, 200)
        
        # Perform Check Balance operation
        atm.insert_card("1234-5678-9012-3456")
        atm.enter_pin("1234")
        atm.select_operation(OperationType.CHECK_BALANCE)  # $630
        
        # Perform Withdraw Cash more than balance
        atm.insert_card("1234-5678-9012-3456")
        atm.enter_pin("1234")
        atm.select_operation(OperationType.WITHDRAW_CASH, 700)  # Insufficient balance
        
        # Insert Incorrect PIN
        atm.insert_card("1234-5678-9012-3456")
        atm.enter_pin("3425")

if __name__ == "__main__":
    ATMDemo.main()
```


**atm_state.py**

```py
from abc import ABC, abstractmethod
from operation_type import OperationType
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from atm import ATM

class ATMState(ABC):
    @abstractmethod
    def insert_card(self, atm: 'ATM', card_number: str):
        pass
    
    @abstractmethod
    def enter_pin(self, atm: 'ATM', pin: str):
        pass
    
    @abstractmethod
    def select_operation(self, atm: 'ATM', op: OperationType, *args):
        pass
    
    @abstractmethod
    def eject_card(self, atm: 'ATM'):
        pass

class IdleState(ATMState):
    def insert_card(self, atm: 'ATM', card_number: str):
        print("\nCard has been inserted.")
        card = atm.get_bank_service().authenticate_card(card_number)
        
        if card is None:
            self.eject_card(atm)
        else:
            atm.set_current_card(card)
            atm.change_state(HasCardState())
    
    def enter_pin(self, atm: 'ATM', pin: str):
        print("Error: Please insert a card first.")
    
    def select_operation(self, atm: 'ATM', op: OperationType, *args):
        print("Error: Please insert a card first.")
    
    def eject_card(self, atm: 'ATM'):
        print("Error: Card not found.")

class HasCardState(ATMState):
    def insert_card(self, atm: 'ATM', card_number: str):
        print("Error: A card is already inserted. Cannot insert another card.")
    
    def enter_pin(self, atm: 'ATM', pin: str):
        print("Authenticating PIN...")
        card = atm.get_current_card()
        is_authenticated = atm.get_bank_service().authenticate(card, pin)
        
        if is_authenticated:
            print("Authentication successful.")
            atm.change_state(AuthenticatedState())
        else:
            print("Authentication failed: Incorrect PIN.")
            self.eject_card(atm)
    
    def select_operation(self, atm: 'ATM', op: OperationType, *args):
        print("Error: Please enter your PIN first to select an operation.")
    
    def eject_card(self, atm: 'ATM'):
        print("Card has been ejected. Thank you for using our ATM.")
        atm.set_current_card(None)
        atm.change_state(IdleState())

class AuthenticatedState(ATMState):
    def insert_card(self, atm: 'ATM', card_number: str):
        print("Error: A card is already inserted and a session is active.")
    
    def enter_pin(self, atm: 'ATM', pin: str):
        print("Error: PIN has already been entered and authenticated.")
    
    def select_operation(self, atm: 'ATM', op: OperationType, *args):
        if op == OperationType.CHECK_BALANCE:
            atm.check_balance()
        elif op == OperationType.WITHDRAW_CASH:
            if len(args) == 0 or args[0] <= 0:
                print("Error: Invalid withdrawal amount specified.")
                return
            
            amount_to_withdraw = args[0]
            account_balance = atm.get_bank_service().get_balance(atm.get_current_card())
            
            if amount_to_withdraw > account_balance:
                print("Error: Insufficient balance.")
                return
            
            print(f"Processing withdrawal for ${amount_to_withdraw}")
            atm.withdraw_cash(amount_to_withdraw)
        elif op == OperationType.DEPOSIT_CASH:
            if len(args) == 0 or args[0] <= 0:
                print("Error: Invalid deposit amount specified.")
                return
            
            amount_to_deposit = args[0]
            print(f"Processing deposit for ${amount_to_deposit}")
            atm.deposit_cash(amount_to_deposit)
        else:
            print("Error: Invalid operation selected.")
            return
        
        # End the session after one transaction
        print("Transaction complete.")
        self.eject_card(atm)
    
    def eject_card(self, atm: 'ATM'):
        print("Ending session. Card has been ejected. Thank you for using our ATM.")
        atm.set_current_card(None)
        atm.change_state(IdleState())
```


**bank_service.py**

```py
from typing import Dict, Optional
from account import Account
from card import Card

class BankService:
    def __init__(self):
        self._accounts: Dict[str, Account] = {}
        self._cards: Dict[str, Card] = {}
        self._card_account_map: Dict[Card, Account] = {}
        
        # Create sample accounts and cards
        account1 = self.create_account("1234567890", 1000.0)
        card1 = self.create_card("1234-5678-9012-3456", "1234")
        self.link_card_to_account(card1, account1)
        
        account2 = self.create_account("9876543210", 500.0)
        card2 = self.create_card("9876-5432-1098-7654", "4321")
        self.link_card_to_account(card2, account2)
    
    def create_account(self, account_number: str, initial_balance: float) -> Account:
        account = Account(account_number, initial_balance)
        self._accounts[account_number] = account
        return account
    
    def create_card(self, card_number: str, pin: str) -> Card:
        card = Card(card_number, pin)
        self._cards[card_number] = card
        return card
    
    def authenticate(self, card: Card, pin: str) -> bool:
        return card.get_pin() == pin
    
    def authenticate_card(self, card_number: str) -> Optional[Card]:
        return self._cards.get(card_number)
    
    def get_balance(self, card: Card) -> float:
        return self._card_account_map[card].get_balance()
    
    def withdraw_money(self, card: Card, amount: float):
        self._card_account_map[card].withdraw(amount)
    
    def deposit_money(self, card: Card, amount: float):
        self._card_account_map[card].deposit(amount)
    
    def link_card_to_account(self, card: Card, account: Account):
        account.get_cards()[card.get_card_number()] = card
        self._card_account_map[card] = account
```


**card.py**

```py
class Card:
    def __init__(self, card_number: str, pin: str):
        self._card_number = card_number
        self._pin = pin
    
    def get_card_number(self) -> str:
        return self._card_number
    
    def get_pin(self) -> str:
        return self._pin
```


**cash_dispenser.py**

```py
import threading
from dispense_chain import DispenseChain

class CashDispenser:
    def __init__(self, chain: DispenseChain):
        self._chain = chain
        self._lock = threading.Lock()
    
    def dispense_cash(self, amount: int):
        with self._lock:
            self._chain.dispense(amount)
    
    def can_dispense_cash(self, amount: int) -> bool:
        with self._lock:
            if amount % 10 != 0:
                return False
            return self._chain.can_dispense(amount)
```


**dispense_chain.py**

```py
from abc import ABC, abstractmethod

class DispenseChain(ABC):
    @abstractmethod
    def set_next_chain(self, next_chain: 'DispenseChain'):
        pass
    
    @abstractmethod
    def dispense(self, amount: int):
        pass
    
    @abstractmethod
    def can_dispense(self, amount: int) -> bool:
        pass
```


**note_dispenser.py**

```py
import threading
from typing import Optional
from dispense_chain import DispenseChain

class NoteDispenser(DispenseChain):
    def __init__(self, note_value: int, num_notes: int):
        self._note_value = note_value
        self._num_notes = num_notes
        self._next_chain: Optional[DispenseChain] = None
        self._lock = threading.Lock()
    
    def set_next_chain(self, next_chain: DispenseChain):
        self._next_chain = next_chain
    
    def dispense(self, amount: int):
        with self._lock:
            if amount >= self._note_value:
                num_to_dispense = min(amount // self._note_value, self._num_notes)
                remaining_amount = amount - (num_to_dispense * self._note_value)
                
                if num_to_dispense > 0:
                    print(f"Dispensing {num_to_dispense} x ${self._note_value} note(s)")
                    self._num_notes -= num_to_dispense
                
                if remaining_amount > 0 and self._next_chain is not None:
                    self._next_chain.dispense(remaining_amount)
            elif self._next_chain is not None:
                self._next_chain.dispense(amount)
    
    def can_dispense(self, amount: int) -> bool:
        with self._lock:
            if amount < 0:
                return False
            if amount == 0:
                return True
            
            num_to_use = min(amount // self._note_value, self._num_notes)
            remaining_amount = amount - (num_to_use * self._note_value)
            
            if remaining_amount == 0:
                return True
            if self._next_chain is not None:
                return self._next_chain.can_dispense(remaining_amount)
            return False
        
class NoteDispenser20(NoteDispenser):
    def __init__(self, num_notes: int):
        super().__init__(20, num_notes)

class NoteDispenser50(NoteDispenser):
    def __init__(self, num_notes: int):
        super().__init__(50, num_notes)

class NoteDispenser100(NoteDispenser):
    def __init__(self, num_notes: int):
        super().__init__(100, num_notes)
```


**operation_type.py**

```py
from enum import Enum

class OperationType(Enum):
    CHECK_BALANCE = "CHECK_BALANCE"
    WITHDRAW_CASH = "WITHDRAW_CASH"
    DEPOSIT_CASH = "DEPOSIT_CASH"
```

</details>

<details><summary><b>cpp</b> (7 files)</summary>


**ATM.cpp**

```cpp
#include "ATM.hpp"
#include <iostream>
#include <limits>

ATM::ATM() : currentAccount(nullptr), isAuthenticated(false) {}

ATM::~ATM() {
    for (auto account : accounts) {
        delete account;
    }
}

void ATM::addAccount(Account* account) {
    accounts.push_back(account);
}

bool ATM::authenticate(const std::string& accountNumber, const std::string& pin) {
    for (auto account : accounts) {
        if (account->getAccountNumber() == accountNumber && account->validatePin(pin)) {
            currentAccount = account;
            isAuthenticated = true;
            return true;
        }
    }
    return false;
}

void ATM::logout() {
    currentAccount = nullptr;
    isAuthenticated = false;
}

bool ATM::deposit(double amount) {
    if (!isAuthenticated || !currentAccount) return false;
    return currentAccount->deposit(amount);
}

bool ATM::withdraw(double amount) {
    if (!isAuthenticated || !currentAccount) return false;
    return currentAccount->withdraw(amount);
}

void ATM::checkBalance() const {
    if (!isAuthenticated || !currentAccount) return;
    currentAccount->displayBalance();
}

void ATM::displayMenu() const {
    std::cout << "\nATM Menu:" << std::endl;
    std::cout << "1. Check Balance" << std::endl;
    std::cout << "2. Deposit" << std::endl;
    std::cout << "3. Withdraw" << std::endl;
    std::cout << "4. Logout" << std::endl;
    std::cout << "5. Exit" << std::endl;
    std::cout << "Enter your choice: ";
}

void ATM::start() {
    std::string accountNumber, pin;
    int choice;
    double amount;

    while (true) {
        if (!isAuthenticated) {
            std::cout << "\nWelcome to ATM" << std::endl;
            std::cout << "Enter account number: ";
            std::cin >> accountNumber;
            std::cout << "Enter PIN: ";
            std::cin >> pin;

            if (!authenticate(accountNumber, pin)) {
                std::cout << "Invalid account number or PIN" << std::endl;
                continue;
            }
            std::cout << "Authentication successful!" << std::endl;
        }

        displayMenu();
        std::cin >> choice;
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

        switch (choice) {
            case 1:
                checkBalance();
                break;

            case 2:
                std::cout << "Enter amount to deposit: $";
                std::cin >> amount;
                if (deposit(amount)) {
                    std::cout << "Deposit successful" << std::endl;
                    checkBalance();
                } else {
                    std::cout << "Invalid amount" << std::endl;
                }
                break;

            case 3:
                std::cout << "Enter amount to withdraw: $";
                std::cin >> amount;
                if (withdraw(amount)) {
                    std::cout << "Withdrawal successful" << std::endl;
                    checkBalance();
                } else {
                    std::cout << "Invalid amount or insufficient funds" << std::endl;
                }
                break;

            case 4:
                logout();
                std::cout << "Logged out successfully" << std::endl;
                break;

            case 5:
                std::cout << "Thank you for using ATM. Goodbye!" << std::endl;
                return;

            default:
                std::cout << "Invalid choice" << std::endl;
        }
    }
}
```


**ATM.hpp**

```hpp
#ifndef ATM_HPP
#define ATM_HPP

#include "Account.hpp"
#include <vector>
#include <string>

class ATM {
private:
    std::vector<Account*> accounts;
    Account* currentAccount;
    bool isAuthenticated;

public:
    ATM();
    ~ATM();
    
    void addAccount(Account* account);
    bool authenticate(const std::string& accountNumber, const std::string& pin);
    void logout();
    
    bool deposit(double amount);
    bool withdraw(double amount);
    void checkBalance() const;
    
    void displayMenu() const;
    void start();
};

#endif
```


**ATMDemo.cpp**

```cpp
#include "ATM.hpp"
#include <iostream>

int main() {
    ATM atm;
    
    // Create some test accounts
    Account* account1 = new Account("1234", "5678", 1000.0);
    Account* account2 = new Account("4321", "8765", 2000.0);
    
    // Add accounts to ATM
    atm.addAccount(account1);
    atm.addAccount(account2);
    
    // Start the ATM
    atm.start();
    
    return 0;
}
```


**Account.cpp**

```cpp
#include "Account.hpp"
#include <iostream>
#include <iomanip>

Account::Account(std::string accountNumber, std::string pin, double initialBalance)
    : accountNumber(accountNumber), pin(pin), balance(initialBalance) {}

std::string Account::getAccountNumber() const {
    return accountNumber;
}

bool Account::validatePin(const std::string& inputPin) const {
    return pin == inputPin;
}

double Account::getBalance() const {
    return balance;
}

bool Account::deposit(double amount) {
    if (amount <= 0) return false;
    
    balance += amount;
    return true;
}

bool Account::withdraw(double amount) {
    if (amount <= 0 || amount > balance) return false;
    
    balance -= amount;
    return true;
}

void Account::displayBalance() const {
    std::cout << "Current balance: $" << std::fixed << std::setprecision(2) << balance << std::endl;
}
```


**Account.hpp**

```hpp
#ifndef ACCOUNT_HPP
#define ACCOUNT_HPP

#include <string>

class Account {
private:
    std::string accountNumber;
    std::string pin;
    double balance;

public:
    Account(std::string accountNumber, std::string pin, double initialBalance = 0.0);
    
    std::string getAccountNumber() const;
    bool validatePin(const std::string& inputPin) const;
    double getBalance() const;
    
    bool deposit(double amount);
    bool withdraw(double amount);
    void displayBalance() const;
};

#endif
```


**README.md**

```md
# Designing an ATM System

## Requirements
1. The ATM system should support basic operations such as balance inquiry, cash withdrawal, and cash deposit.
2. Users should be able to authenticate themselves using a card and a PIN (Personal Identification Number).
3. The system should interact with a bank's backend system to validate user accounts and perform transactions.
4. The ATM should have a cash dispenser to dispense cash to users.
5. The system should handle concurrent access and ensure data consistency.
6. The ATM should have a user-friendly interface for users to interact with.

## Classes, Interfaces and Enumerations
1. The **Card** class represents an ATM card with a card number and PIN.
2. The **Account** class represents a bank account with an account number and balance. It provides methods to debit and credit the account balance.
3. The **Transaction** class is an abstract base class for different types of transactions, such as withdrawal and deposit. It is extended by WithdrawalTransaction and DepositTransaction classes.
4. The **BankingService** class manages the bank accounts and processes transactions. It uses a thread-safe ConcurrentHashMap to store and retrieve account information.
5. The **CashDispenser** class represents the ATM's cash dispenser and handles the dispensing of cash. It uses synchronization to ensure thread safety when dispensing cash.
6. The **ATM** class serves as the main interface for ATM operations. It interacts with the BankingService and CashDispenser to perform user authentication, balance inquiry, cash withdrawal, and cash deposit.
7. The **ATMDriver** class demonstrates the usage of the ATM system by creating sample accounts and performing ATM operations.
```


**atm**

```
����            �  ��!        H   __PAGEZERO                                                        (  __TEXT                  �               �                   __text          __TEXT          $-     �H      $-               �            __stubs         __TEXT          �u     L      �u              �           __const         __TEXT          �w            �w                             __gcc_except_tab__TEXT           x     �       x                             __cstring       __TEXT          �z     �      �z                             __unwind_info   __TEXT          �|     x      �|                                �   __DATA_CONST     �      @       �       @                  __got           __DATA_CONST     �     �       �                1              H   __LINKEDIT       �      �       �      `w                    4  �    �  0  3  �   0�  0        x�  <  ��  �L     P       �   �   &     *                           8�  k                             /usr/lib/dyld             5/��5���Y�����2                       �*              (  �   $-                 0          �@   /usr/lib/libc++.1.dylib    8           8   /usr/lib/libSystem.B.dylib      &      `�    )      x�            p4 �                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ����{������ �� �5 ��� �. � �ҏ �� �  ( �R  �9���!  �!�*��  �  ��!  �!�*��  �  �@������(  � �C�� �   �R  �9��0 ����. ��@��@�( � ��k �� �  ( �R  � 9��!  �!�*�f  �  � �!  �!+�a  �  �@���� �(  � �C�� �   �R  � 9� � ���
 ��@��@��/ �@��� �o �  �/@��� �k �  �� �� �  �@�5 ��� �X ��@� 5@��{N�����_֠������1  �������  �������  ���������� �  ���� �  �A9�  6  �@� �    �������  �������  �������� �� �  ��� �  �@9�  6  �@�  �    �� � �  �\�� ��� ��{��� ����� ���_�� ��@�  ��@��{B��� ��_����{��� ��������_�� ��G ѢK �  ��_�� ��_�� ��@�� ��@�� ��@�!  ��@��{C����_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� ��{��C �� ��@�;  �� �  �@��{A��� ��_�=  ��C �� ��C ��_����{��� ������� ���_�� �  ��@�
  ��@��{C����_��C �� ��@��C ��_��� ��{��� �� ��@�� �  ��@��{B��� ��_��� ��{��C �� ��@�� �  ��@��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@�� ��{A��� ��_��{��� �v ��� ��{��C �� ��@�� �  ��@� �� 9�{A��� ��_��� ��{��C �� ��@�� �) ��@��{A��� ��_��� ��{��C �� ��@�� ������@��{A��� ��_��C��{������_�� ���������^�$  �� ���^�-  �� �  �� ��c �4  �� 6  �� �=  � @�� ��@�� � ����  7  �@�9  ��@�4 �    �� �>  �����@�C  ���_��{D��C��_��� ��{��C �� ��@� @�� �� ��@��{A��� ��_��� ��{��C �� ��@�@�� �� ��@��{A��� ��_��� ��{��C �� �� ��@��@�� �  R  �{A��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�� �� ��@��{A��� ��_��C �� ��@� @�! �  ��C ��_��� ��{��C �� ��@�� � ��@��{A��� ��_��� ��{��C �� ��@�� ������@��{A��� ��_��� ��{��C ���� �� �� ��@�  ��{A��� ��_��� ��{��� ����� ���_�� �@�� �\ ��@�	 @�	����  7  �@��@�� �  �@��@�� �  �{B��� ��_�����{	��C���������_�� ������]�{�������]��������  �� ѡ� ы���� 6  �� є��� @����\��� �� �# ��@���^�4  � �R� �@ 6  �\��^�' �� �  �@�� �  �@�� ��� �? ��@�H 6  �@��\�(
 �( �R(� 9( �R  ��8  � ����/ ��� �- �    �� �v������ �R  ��8  ��_8  �{I�����_��@�� ��C��{���������_�b
 �� ��@�� ���^�]
 ��@� ����  7   �R  ��88  �_�f
 �� ���^�c
 �� ��_�j
 �� 6  �@��@��@�� �  q��  ��8$    �@� ���H 7  �@��9�@�)�9	k���  7   �R  ��8    �@� �� ��@� �� ��@� �� ����( �R  ��8  ��_8  �{D��C��_��C �� ��@�
 �� 9�C ��_��� ��{��� �� �� ��@�� ��@9 6  �@�
@� ����  7   �R  ��8	  �@� 
@��@�� �   ��8  ��_8  �{B��� ��_��� ��{��� �� �� ��@�� ��@9 6  �@�
@� ����  7   �R  ��8	  �@� 
@��@�� �   ��8  ��_8  �{B��� ��_��� ��{��C �� ��@�� ��@9 6  �@�
@� ���h  7    �@� 
@�� �  �{A��� ��_��� ��{��� �� �   � �@�� ����!  �! +�*  �  �!�(�� �8  ��@�!  �!L+�"  ��@�2  ��@�!  �!�+�  ��@�,  ��@�!  �!�+�  ��@�&  ��@�!  �!�+�  ��@�   ��@�!  �!,�
  ��@�  ��@�!  �!4,�  ��{B��� ��_��� ��{��� ����� ���_�� ��@�� ��@� ��@�� ��@�
 ��{B��� ��_��� ��{��C �� �� ��@��@� ?��{A��� ��_��� ��{��C �� ��@�� ��@�	@�)�^� 	�A�R� �� ��@�  ��@� ��@��{A��� ��_�����{����(  ��@��; �(  ��@���������_����� ��  ��� ��  �    �Z��@9	 7  �;@�!  �!�,������7 �  �7@�  �!�(�����  �;@�!  �!�,�����  ��Y��� ��  �  �;@�!  �! -�����  ��Y��� ��  �  �Z��� Ѣ� �\����g �  �g@�� 7  �;@�!  �!P-������/ �  �/@�  �!�(�����  ������������ Ѵ ��� Ѳ ��  �;@�!  �!�-�z����+ �  �+@�  �!�(�����    �Z�<���  ��Y��� ѫ �  s �� ���Y�B�R� �  �C\� q�' � �藟� 7�'@�
  �J!:�  Iy��	� ֠Z����  �  �;@�!  �!4.�P���  ��Y��#ш �  �Z���[������G �  �G@�( 6  �;@�!  �!�.�?���� �  �@�  �!�(�K���  �Z�����  
  �;@�!  �!�.�0���� �  �@�  �!�(�<���    Z  �;@�!  �!(/�#���  ��Y��#�[ �  �Z���[������/ �  �/@�( 6  �;@�!  �!�/����� �  �@�  �!�(����  �Z�����  
  �;@�!  �!�/����� �  �@�  �!�(����    -  �Z�b����;@�!  �!�0������ �  �@�  �!�(� ���    �;@�!  �!�0������ �  �@�  �!�(�����  �� � ��� � ��{N�����_��;@�!  �!l1������ �  �@�  �!�(�����    ���[��
 �       �   �  �  �� ��{��C �� ��@�� ��
 ��@��{A��� ��_��C��{�������� �R�����_��W �� � �
 ��@� �� 6  �_� ���_�	@�)�^� 	�#
 ����^� ��ן�  7  �_�1 ���  �^� ��ן�  7  �  ���  �����_�	@�)�^� 	��� є
 �  �� ќ
 �� �  �� ��
 ��@���  ��]��^�	�跟� 7  ��_�	@�)�^� 	�N
 �� �  �@�2 �� �  �@��; ��;@�� ��
 �� ��@�z
 �@ 6  ��^�2���D  �# ����? �  �# ����? ��� Ѷ
 �  �#@��
 ���^� 2�����_�	@�)�^� 	���^�l �  ��_�	@�)�^� 	� �� �  �@� r�� 7  �
 �F  �;@�T
 ��� 9�]����9 �R �� �  �@�h  6    �_����9[
 �  ��]� ������_�	@�)�^� 	��	 �� �  �@�" �  �����_�	@�)�^� 	� �Ҽ	 ���]� ����  7  ��^�2���    �# ����? ��
 �
  �
 �  ��_�	@�)�^� 	���^�v	 �    ��_��{H��C��_��#@�� �����   ��{��� �)  ��{���_��� ��{��� ����� ���_�  �� ��@�	  �� ��@� ���  �{B��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@�� � a �
 ��@�
 ��@��{A��� ��_�  ��_��� ��{��� ������_�� � � ��C �� � A ��? �
  �  �@�  �  �@��{B��� ��_֬����� ��{��� ����� �� ���_�� ��@��@�	  ��@��{B��� ��_��C �� ��C ��_����{��� ������� ���_�� ��_�  ��@�  ��@��{C����_��C �� �� ��@�  ��C ��_��� ��{��� �� ��@�� �  ��@��{B��� ��_��� ��{��C �� ��@�� �  ��@��{A��� ��_��C �� ��@��C ��_��� ��{��� ������_�� ��C �
  �  �C �  �  �@��{B��� ��_�V����� ��{��� ����� ���_�� ��@�,  ��@��{B��� ��_��� ��{��� ������_�� � @�(  ��@� @�S  ��@�@�@� ���� 7  �@� @�M  ��@� @�a  ��@�� �	@�)@�� � @�d  ��@�� ��@�I  �  �{B��� ��_��C �� �� ��@��@�  ��C ��_��C��{��������_���e  �� ��_�� �a  �� ��_�� �E  �� ��_�� �Y  �� ��_�� �_  �� ��_�� �Q  �� ��_����5  ��@��@��@��@��@���^�� ��_��

�C
�
	�9  ��{D��C��_��C �� ��C ��_��� ��{��C �� ��@� @�L  ��{A��� ��_��� ��{��� ����� �� ���_��@��@�r  ��{B��� ��_��� ��{��C �� ��@� A ��  ��{A��� ��_��� ��{��C �� ��@�� ��  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� �� �� �� �� �� ��� ��_��� ��{��C �� ��@� @�  ��{A��� ��_��C �� ��@�(@�)@�	�	�� 
ɚ�C ��_��C �� ��@��C ��_����{��� ��������_�� �@�� �  �_��@�	���� 7  �@������ ��@� ! �� ������ ��@�� �  ����@��_�( ��{C����_�s����� ��{��C �� �� ��@��@�  ��{A��� ��_��C �� �� ��C ��_��� ��{��� ����� �� ��@��@��}���  �  �{B��� ��_�S����� ��{��� ����� �� ���_��@�  ��{B��� ��_��� ��{��C �� �� ��@�  ��{A��� ��_��� ��{��C �� ��@�� ��{A��� ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��C �� ��@� A �  ��{A��� ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� �� �� ��@��@��# �  ���_��{B��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@�  ��� ��_��� ��{��C �� ��@� A �^  ��{A��� ��_�����{��C��������_�� �� �" ��_  ��@����� ��@�6���� ��@��_�, �  � ��@�! �� �l  ��{E�����_�� ���� �� �d  �  �@��
 ����{�����������_�� ������ ��@�������� ��@� �  �� ��@�� �����@�� ���^��� ��  ���^�� ��#@����� ��@��_��
 �  �@��� ��#@�! ��# ��  �  �� ��  ��{G����_�� ����' ��� ��  �  �@��
 ��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� ��{��� ����� �� ���_��@��@��
 ��{B��� ��_��� ��{��C �� ��@�� �   ��@��{A��� ��_��� �� �� �� ��@��@�  ��@�@� ��@�@��@�
	� ��� ��_��� �� �� �� ��@��@�@�( ��� ��_��C �� ��@�@�	 @�( ��C ��_��C��{���������_�� ��  �� ���^��@�	�臟�  7  �@��  ��@�T���� ��@��@�J ��)	ʚ	��'��  7  �@����  �@�H ��}	��C �� ��c щ  � @����  ��_��{D��C��_����{��� ������� �� ���_�� ��_��@��@�! ��@��{C����_����{�����������_�� ������@�����@�� �@��� �� ��@�@��� �� ��_�@��� �� ��@��]���]��@��@��@��@�� �� ��� Ѩ����� �� ��@��_�( ��_�! �� ��@��_� ! �A �� ��@������ ��_�F �� ��@�� ��@��_�@��_�( �
���� ��@�� ��@� ��{G����_��� ��{��C �� ��@�� �� ��@��{A��� ��_����{��� ������_�9  ��	 ��C �� �������� ��@��c �� �  �� �  �@� @��{C����_ֆ����� ��{��C �� �   � �1�_  ��� ��{��� ����� ���_��@��  ��{B��� ��_��� ��{��� ����� ���_��@�  ��{B��� ��_��� ��{��C �� ��@�0  ��{A��� ��_��� ��{��C �� ��@� A �+  ��{A��� ��_��� ��{��� �� �� ��@��@�� �
  ��  6  �@�� �  �@�� �  �@��{B��� ��_��� �� �� �� ��@�@��@�)@�	��'�  �� ��_��C �� �  ���C ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ���� �Ҝ	 �� ���_�  �  �@�  �!�@�  �B@��	 �� ��@�� ���� ��	 �  �@�	 ��� ��{��� ����� ���_�� ��@�  ��@��{B��� ��_��� ��{��� �  ��@�A �� ����� ���_�� ��@�	 ��@��@�  ��{B��� ��_��� ��{��� �� �� ��@��@�� џ����  6  �@�� �  �@�� �  �@��{B��� ��_�����{��C��������� ��_�� ������� �� ��@� a �&  ���^� ����  7  �@� �
  �@�;  ���^�)  ��@�� �� ��@�( ��@����  �@� @��^�
	� � � @���^�
	�� �0  ��@�  ���_��{E�����_��� ��{��� ����� �� ���_�� ��@��@�)  ��@��{B��� ��_��� ��{��� �� �� ��@��@�7  �� ��@�� ��@��@��{B��� ��_��� ��{��C �� ��@� a �^  ��{A��� ��_��� ��{��C �� ��@� a �d  ��{A��� ��_��� ��{��� ����� �� ���_�� ��@������@��@� ! �  ��@��{B��� ��_��C �� �� ��@��@�  ��C ��_��� ��{��� ����� ���_��@�� �� ��@� �臟h  7    ��@� �}���  ��{B��� ��_��� ��{��C � �ҷ �� �L ��@�  �!�@�  �B @�� ��� ��{��C �� �� ��@�  ��{A��� ��_��� ��{��C �� ��@�� ��{A��� ��_��� ��{��C �� ��@� ! �  ��{A��� ��_��C �� ��@� @��C ��_��� ��{��C �� ��@������{A��� ��_��C��{��������������# ��' �� ���<��=��<��=��=��=�@��@��@��@��@��@�Y  �������_���_��{H��C��_��� ��{��� ����� ���_�� ��@�� ��@��{B��� ��_��C �� ��@� @��C ��_��� �� �� ��@�@�� ��@�@��@�( ��@��@�( ��� ��_��C��{����������_�������� ���^�� ����� ���^�� ������ ���^�� � ���� ���^�� ������ ���^�� ������@��@��@��@��@�� ���^��_��

�C
�
	������{D��C��_��C �� ��C ��_�����{	��C������������������<��=��<��=��<��=�@��@��@��@��@��@��� �  ���=��<�_���_��{I�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����{��������������� �� ���<��=��<��=��=��=�@��@��@��@��@��@�  ��{F�����_�����o��{����� ������������������<��<��<��<�Y���Y��X���X����7  ���<�+�=��<�'�=��<��=�;@��?@�w  ��C ��G ��S@��W@��K@��O@��C@��G@���Ѡ��& ���<��=��<��=�+@��/@��#@��'@��  ���� ��3 ��7 ���<��=��<��=�@��@��@��@��  ��@�� ��@����� �� �� �_  ��{V��oU�����_����{����� �������������<��=�@��@�=  ��� �� ��������<��=�@��@�4  ��@�� ��@���� �� �� �=  ��{G����_�����{����� ������������ �� �� �  �C ѡ� �m  �@ 6  �C �� �z  � @�� ��� �� �  ��@�� ��@�( ��  ��@��  �����@��C ��� �  ��{F�����_����{��� �� �� ���=��=�@��@�y  �������_���_��{C����_��� ��{��� �� �� ��@����� ���_��@�p  ��{B��� ��_�����{��C������� �� ���<��=��=��=�@��@��@��@�  �������_���_��{E�����_�����{���������� �� ���<��=��=��=�@��@��@��@�b  �� �� �  �@��@�������_���_��{F�����_�\����� ��{��� ����� ���_����� ��@�|���� ��@� ���  �{B��� ��_��� ��{��C �� �  ��@�  ��{A��� ��_��C �� ��@�@�� ��@� ! �� ��C ��_��C �� ��@�@�! � ��C ��_��_��� �� �� ���=��=�@��@��� ��_��� ��{��� ����� �� ���_�� ��@��@�  ��@��{B��� ��_��� �� �� �� ��@��@� �=  �=�@� �= �=�� ��_��� �� �� �� �� ���=��=�@��@��� ��_��C �� �� ��@��@�  ��@� ��C ��_����{��� ����_�� �� ����  ��@�@� ���( 7  �@�d���� ��@�� � @�� �  �� �  �@��@��@�����  ��_��{C����_������� ��{��C �� ��@�@�  ��{A��� ��_��� ��{��C �� ��@�� �5  ��@� @�)@�	�	�� 
ɚ�{A��� ��_��� ��{��� ����� ���_��@�  ��{B��� ��_����{��� ���� ��_�� �  �@��@�)	@�	���� 7  �@�����@�� �		@� ! � 	 ������ ��@�� �  ����{C����_֋����� ��{��C �� ��@� a �  ��{A��� ��_��� ��{��C �� ��@�i����{A��� ��_��� ��{��� ������_�� �  ��  6  �@�>  �� �  �@�D  �� �  �@��{B��� ��_��� ��{��C �� ��@�X  �R  ��{A��� ��_��� ��{��C �� ��@�;  �\@9}S r��  �{A��� ��_����{��� ���� �� ��@� ����  7  ���
  �_��@��@�c  �� �  �@����  ��_��{C����_�0����� ��{��C �� ��@�  � @��{A��� ��_��� ��{��C �� ��@�  �\@9	 �	� @��{A��� ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��C �� ��@��C ��_��� ��{��� ������_�� ������  6  �@�  �� �  �@�  �� �  �@��{B��� ��_��� ��{��C �� ��@�����  @��{A��� ��_��� ��{��C �� ��@�����  ��{A��� ��_��C �� ��@��C ��_��� ��{��� ����� �� ���_��@��@�a ��{B��� ��_�����{	��C�����������_��� � �  �� �p  ��G �  �G@� 6  ��_��#��  ��_�� ���_�	@�)�^� 	� ��C �  �C@�	�R	
� q���  7  �_���^�	�� �  �_�� �  �@�� ��_���^�	�� ���_�	@�)�^�	�� ���_�	@�)�^� 	��  ��/ �  �/@��@��@��@��@��'@� =  �� �  �@��Ѩ��  �@ 6  ��_�	@�)�^� 	�� �R�  �    �������  ��������� �� �  �]�� ���_�	@�)�^� 	�� �  � �  ��_��{I�����_�  �� Ѯ ������������ �    �]�W �P����C �� ��@�@9  �C ��_�����{	��C���������������8�_� ����  7  �_����z  ��]���^�	���]��  ��' ��'@��\�	��ǟ�  7  �\��'@�	��' �  �' �  �^���^�	��# ��#@� ��ǟ 7  �_���^��#@��  ��#@� ����  7  ���_����P    �'@� ��ǟ� 7  �'@����8� �� ��  ��@��_�� ������ ��@��'@��  �� �  �@��'@�	���� 7  ���_����( �R� �	  � ���� �� �$ �-  � �  � � ��@� q��h  7      ��]��^�	��# ��#@� ��ǟ 7  �_��^��#@�]  ��#@� ����  7  ���_����    �]� ��n  ��_����  ��_��{I�����_��@�� ��� ��{��� ����� ���_�� ��@�|  ��@��{B��� ��_��C �� ��@� 	@��C ��_��� ��{��C �� ��@�� �� ��@��@�� �  6  �@��R�  ��@� (� �  �@��@�  �{A��� ��_��C �� ��@�@� ���  �C ��_��� ��{��C �� �� ��@��@��  ��{A��� ��_��C �� ��@� 
@��C ��_��� ��{��� ����� �� ���_��@��@� @�1@� ?��{B��� ��_��� ��{��� ����� ��? 9��_�� ��@��?�9  ��@��{B��� ��_��� �� �� ��@�(
@�� ��@�(
 ��@��� ��_��� ��{��� ����� ��? 9��_�� ��; ��7 ������@��@��?�9n ��@������@��{B��� ��_��� ��{��� ����� ���_�� ��@�	@�)�^� 	�
  �� �  �@��@�  ��{B��� ��_� ����� ��{��C �� ��@�  ��{A��� ��_��C �� ��@� @��C ��_��C �� �� ��@��@�	k��  �C ��_�  ��_��C��{�������s8��_��c �� � ��@�  �� �  �@��s�8  �� �  �c �W ��@�  �{D��C��_�� ���� ��c �M �  �@�� ��� ��{��C �� ��@�  �!�@�� ��{A��� ��_��� ��{��C �� �� 9�@���9 @�@� ?�  �{A��� ��_��� ��{��C �� �� ��@� @��@�	*3 ��{A��� ��_��� ��{��� ������_�� ��' Ѣ+ �]���  �@�v����@�  �  �@��{B��� ��_֪����� ��{��� ������_�� �� �� �  ���=  �=�@� ��{B��� ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_��C �� ��@�@9  �C ��_��� ��{��� ������_�� ��  �  �@�#���` 6  �@��  ��' ѿs8� ��@� ���  �
  �@��  ��+ ѿc8� ��@� ���  �  �{B��� ��_�c������{��� ����_� �� �� ��@�� � ��@�I ��	ɚ	�藟�  7  �@�A ��  �_ 9�_@9�  6  �@�A �� �  �@�I ��	ɚA �� �  �@����  ��_��{C����_��� ��{��� �� ��@�� �(
@�)@�	��� 7  �@� @�%@� ?֠��  �@�
@� �9@ ����  ��_��{B��� ��_��C �� ��@�  �C ��_��� ��{��� �����C��38��_�� ��3�8 �  q��h 7  �@�	@��3�8yi��C_�	j��� �   �R� �  �@�  �{B��� ��_��� ��{��� �� ��@�� �(
@�)@�	��� 7  �@� @�)@� ?֠��	  �@�H
@�	 �I
 � �9� ����  ��_��{B��� ��_��� �� �� ��@�� �@� ��� 7  �@��@�(!@�
*(! �  �@��@�
 2(!@�
*(! �  �� ��_��� ��{��C �� ��@��  ��{A��� ��_��C �� ��C ��_��C �� �� ��@�@9�@�( 9�C ��_��� ��{��C �� ��@����  @��{A��� ��_��� ��{��� ����� ���_��@�� ������@� ��{B��� ��_��� ��{��C �� ��@�����"  ��{A��� ��_����{��� ��������_�� ��_�� ������@�� ��@�(]@9��R���J a
*(] 9������^�\@9	
	 �R	*\ 9�{C����_��C �� ��@��C ��_��� ��{��C �� ��@�  ��{A��� ��_��� ��{��C �� ��@�  ��{A��� ��_��{��� �  ��{���_��C �� �  ���C ��_��� ��{��C �� ��@�  ��{A��� ��_��C �� ��@��C ��_�  ���_��C ��? 9�?@9�C ��_��C �� ��@���	j��  �C ��_��C �� ��@� %@��C ��_��C��{���� ������������ ���_�� �R ��@��@� a �N �  �@��@�  ��{D��C��_�� ��@�� ���� �D �  �@� ����{��� ����������� �� ���_�� ��@������@��{C����_��� ��{��� �� �� ��@�� ����� ��@�" ��{B��� ��_��� ��{��C �� �� ��@��@� a �����   �{A��� ��_��C �� ��@� @��C ��_��� �� �� ��@�� ��@� `藟�  7   �R  � 9  �@��@� @� (a  �( �R  � 9  �@9  �� ��_��� �� �� ��@�� ��@� `臟( 7  �@��@�@�  a�ǟ�  7   �R  � 9  �@��@� @� 8a  �( �R  � 9  �@9  �� ��_��� ��{��� ������_�� �   � �@�  �!�1�����  �!�"  �� �@ �R;  �� ��@��3 ѨC�
  ��@� @��  �����!�(������{B��� ��_��� ��{��C �� �� ��@�	@�)�^��@�A�� 	�b  ��@��{A��� ��_��� ��{��� ����� ���_�� ��@�*@�J�^� 
� ?��@��{B��� ��_��� ��{��C �� ��@�� �R� �R  ��@��{A��� ��_��� ��{��C �� ��@�� �&  ���_��{A��� ��_��� ��{��� �����C�� ���_�� �@�� ��@�  ��@��C_��@�


(	@�
*(	 ��@��{B��� ��_��C �� �� ��@��@�(	@�*
(	 ��C ��_��� ��{��� �����C���_�� ��C_�  ��@��{B��� ��_��C �� �� ��@��@�  ��C ��_��� �� �� ��@�(	@�� ��@�(	 ��@��� ��_�  �@� �  �@� �  �
@� �  �@� �  �@� �  �@� �  �@� �  �&@� �  �*@� �  �.@� �  �2@� �  �6@� �  �:@� �  �>@� �  �B@� �  �F@� �  �J@� �  �N@� �  �R@� �  �V@� �  �Z@� �  �^@� �  �b@� �  �f@� �  �j@� �  �n@� �  �r@� �  �v@� �  �z@� �  �~@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �  ��@� �     @�@     @�@��<     � @� T� h� �� �� �� �� �$� ��  ��
0      �� �  �� ��     ��X�� �   ��=4 �  ��������  �<� �`����L        ��
(T      ��
@      ��
d�     ��
$<      �� H  Hp LD  �� �  � � �8  ��
<\      ��     @ $@  ��
<p      ��
X�     ��
d|      ��
@h      ��1&�(���H  �� �8  ���          ��
0      �� �  �� ��     ��
(P      �� (  (d D@  ��
 L      ��
�     �� 8  8\ @@  ��
@h      ��1&�(���H  �� �8  ���          ��
0      �� �  �� ��     ��
(P      �� (  (d D@  1234 5678 4321 8765 
ATM Menu: 1. Check Balance 2. Deposit 3. Withdraw 4. Logout 5. Exit Enter your choice:  
Welcome to ATM Enter account number:  Enter PIN:  Invalid account number or PIN Authentication successful! Enter amount to deposit: $ Deposit successful Invalid amount Enter amount to withdraw: $ Withdrawal successful Invalid amount or insufficient funds Logged out successfully Thank you for using ATM. Goodbye! Invalid choice vector Current balance: $          8      <              T           0 ��  $-     `   �u                     $-   x  h0  @x  �4  Px  |:  hx  �>  xx  �B  �x  �C  �x  8G  �x  H  �x  J  �x  �J  y  O  y  Q  ,y  �[  <y  �]  Ly  �^  \y  d`  ly  db  |y  ld  �y  �h  �y  |i  �y  �j  �y  |k  z  �p  z      � P    t  D x �  � �  0 D  h t  H `  � �  � �  4
 P
  X
 d x  � �   $  \ d �  �   H d  � �   �   � �  � �  �  �  � �    � �    4  � �  � � X  | �  , � �  �! T"  h# �# �#  �# �# L$  ' ('  (( @(  ) () d)  *  *  `+ �,  �. �.  l/ �/ �/ �/  0 L0 x0 �0 ,1  �1 @2  @3 �3  ,4 T4  �4 5  @5 ,7 H7 �9  �9 �9  8: \:  �: �:  ; D;  �; �;  < P< X< �<  t= �=  (> X> �>  �? @  A lA  �A �A  �B �B  4C HC  lC �C �C �C XD  E  E $F  �G  H  4H TH                 �     �     �     �     �     �     �     �     �	     �
     �     �     �
     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �     �      �!     �"     �#     �$     �%     �&     �'     �(     �)     �*     �+     �,     �-     �.     �/     �0     �1     �2     �3     �4     �5     �6     �7     �8     �9      �                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        P   8  :                                        @  �               �"  �<  > � � � . p �� � �\ �� �� �D �� � �  � B � B � .	 �	 
 z
 �
 p �� �� �8
 � � � �  �B �� �  �T � �
 6 r �� �� � �  8 d � � � �  __Unwind_Resume __Z7isasciii __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIPP7AccountEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ __ZNKSt3__16locale9use_facetERNS0_2idE __ZNKSt3__18ios_base6getlocEv __ZNSt11logic_errorC2EPKc __ZNSt12length_errorD1Ev __ZNSt20bad_array_new_lengthC1Ev __ZNSt20bad_array_new_lengthD1Ev __ZNSt3__111char_traitsIcE11eq_int_typeEii __ZNSt3__111char_traitsIcE11to_int_typeEc __ZNSt3__111char_traitsIcE12to_char_typeEi __ZNSt3__111char_traitsIcE3eofEv __ZNSt3__111char_traitsIcE6assignERcRKc __ZNSt3__111char_traitsIcE6lengthEPKc __ZNSt3__111char_traitsIcE7compareEPKcS3_m __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEmc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED1Ev __ZNSt3__113basic_istreamIcNS_11char_traitsIcEEE6ignoreEli __ZNSt3__113basic_istreamIcNS_11char_traitsIcEEE6sentryC1ERS3_b __ZNSt3__113basic_istreamIcNS_11char_traitsIcEEErsERd __ZNSt3__113basic_istreamIcNS_11char_traitsIcEEErsERi __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryC1ERS3_ __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryD1Ev __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEd __ZNSt3__116allocator_traitsINS_9allocatorIP7AccountEEE7destroyB7v160006IS3_vEEvRS4_PT_ __ZNSt3__116allocator_traitsINS_9allocatorIP7AccountEEE8max_sizeB7v160006IS4_vEEmRKS4_ __ZNSt3__116allocator_traitsINS_9allocatorIP7AccountEEE9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ __ZNSt3__116allocator_traitsINS_9allocatorIcEEE8max_sizeB7v160006IS2_vEEmRKS2_ __ZNSt3__13cinE __ZNSt3__14coutE __ZNSt3__15ctypeIcE2idE __ZNSt3__16localeD1Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE21__push_back_slow_pathIRKS2_EEvOT_ __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE22__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ __ZNSt3__18ios_base33__set_badbit_and_consider_rethrowEv __ZNSt3__18ios_base5clearEj __ZNSt3__19allocatorIP7AccountE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ __ZSt9terminatev __ZTISt12length_error __ZTISt20bad_array_new_length __ZTVSt12length_error __ZdlPv __Znwm ___cxa_allocate_exception ___cxa_begin_catch ___cxa_end_catch ___cxa_free_exception ___cxa_rethrow ___cxa_throw ___gxx_personality_v0 _memcmp _strlen      _ �   ��  �h  �i  0addAccountEP7Account 2authenticateERKNSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES8_  �t  �n  �n  �o  �c  �c  1Ev �2Ev � �g  �d  1Ev �2Ev � 1 5startEv �6logoutEv �7depositEd �8withdrawEd �C �D � ��  ��  ��  ��  1ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_d �2ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_d � 7depositEd �8withdrawEd �C � �q  �q  1displayMenuEv �2checkBalanceEv � ��  ��  ��  ��  0getBalanceEv �1validatePinERKNSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE �4displayBalanceEv �6getAccountNumberEv ���  3ATM1 �7Account1 �St3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIPP7AccountEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ ��� ��  eq_int_typeEii �to_int_typeEc ���  1 �2to_char_typeEi ��� �� �`  assignERcRKc �lengthEPKc ���  1 �3eofEv �6 �7compareEPKcS3_m �ď � �  7destroyB7v160006IS3_vEEvRS4_PT_ �8max_sizeB7v160006IS4_vEEmRKS4_ �9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ ���  P7AccountEEE �cEEE8max_sizeB7v160006IS2_vEEmRKS2_ � 1char_traitsIcE �6allocator_traitsINS_9allocatorI ��� ��  1__push_back_slow_pathIRKS2_EEvOT_ �	2__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ �	��  1 �	6vectorIP7AccountNS_9allocatorIS2_EEE2 �	9allocatorIP7AccountE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ �
 3ATM �7Account �K �St3__1 �
 7isasciii 	N �    Z �mh_execute_header � �Z  _ �main �    �Z�4`<4<,,$4,,�004, ,,0l����\�H,X�,�H8X<@,,D4� �(4(@ ((�,@0($$($4<$(��$<4,D( �D�,`,,$(T4$d4LT�<@((H X4($($x4<�xdd���D8\tH(( $<4,(�(@,�($T(8l(4$T((4��4d$,<<,TT$(�,84P@$��p|xd$$(8(x$$$$�D84t�|@@0,\(4       �  � �/     #
  � �/     w
  � ,0     
  � �0     t  � �0       � �0     �  � �0     �  � (1       � T1     `  � h1     �  � �1     �  � �1     �  � �2     "  � 3     a  � 83     �  � l3     �  � �3     �  � �3       � �3     P  � X4     �  � 6     �  � �9     @  � �9     �  � $:     �  � �>     $  � �>     �  � �A     �  � �A     
  � 0B     ?  � HB     P  � �B     �  � �B     �  � �B     3  � C     �  � ,C     �  � lC     C  � �C     �  � �C     �  � �C     #  � �C     `  � 8D     �  � lD     �  � E     A  � (E     �  � �E     �  � �E     +  � F     �  � LF     �  � tF     
  � �F     r  � �F     �  � �F     �  � $G     (  � 8G     ~  � �G     �  � H     �  � DH       � tH     [  � �H     �  � �H     �  � �H     ;  � �H     �  �  I     �  � DI       � XI     d  � �I     �  � �I     �  � �I        � |K     c   � �K     �   � �K     !  � $L     W!  � PL     �!  � �L     "  � �L     L"  � �M     �"  � �M     �"  � �N     7#  � O     s#  � xO     �#  � �O     �#  � �O     $  � P     U$  � 8P     �$  � �P     �$  � �P     �$  � �P     ;%  � �P     �%  � Q     �%  � pQ     �%  � �Q     	&  � �Q     A&  � DR     �&  � S     �&  � TS     b'  � �S     �'  � �S     �'  � �S     V(  � ,T     �(  � LT     �(  � �T     )  � �T     >)  �  U     u)  � $U     �)  � LU     *  � dU     l*  � �U     �*  �  V     2+  � 4V     l+  � LV     �+  � �V     E,  � 4W     �,  � DW     �,  � �W     g-  �  X     .  � �X     �.  � �Y     @/  � �Z     �/  � [     c0  � P[     �0  � �[     +1  �  \     z1  � h\     ^2  � �\     �2  � �\     �2  � �\     D3  � �\     �3  �  ]     �3  � <]     O4  � p]     �4  � �]     �4  � �]     %5  � P^     p5  � x^     �5  � �^     6  � �^     �6  � d_     �6  � �_     37  � �_     �7  � `     �7  � ,`     .8  � �`     �8  � �`     �8  � ,a     `9  � Pa     �9  � da     :  � xa     h:  � �a     �:  � �a     +;  � b     e;  � 0b     �;  � db     <  � Pd     K<  � ld     �<  � �f     %=  � �f     K=  � �f     �=  � \g     �=  � �g     >  � �g     8>  � �g     >  �  h     �>  � <h     �>  � hh     B?  � �h     �?  � i     �?  � 4i     @  � |i     A@  �  j     �@  � ,j     �@  � dj     �@  � �j     A  � �j     xA  � (k     �A  � Lk     jB  � `k     �B  � |k     C  � l     YC  � �l     �C  � 8m     �C  � �m     D  � ,n     9D  � �n     }D  � �n     �D  � �n     ME  � o     �E  � Ho     F  � po     iF  � �o     �F  �  p     �F  � Dp     "G  � Xp     OG  � lp     �G  � �p     H  � �p     OH  � �p     {H  � �s     �H  � t     'I  � Dt     PI  � tt     tI  � �t     �I  � �t     �I  � $u     �I  � Xu     J  � xu     *J     x     <J    @x     NJ    Px     aJ    hx     tJ    xx     �J    �x     �J    �x     �J    �x     �J    �x     �J    �x     �J    y     �J    y     K    ,y     K    <y     3K    Ly     GK    \y     [K    ly     oK    |y     �K    �y     �K    �y     �K    �y     �K    �y     �K    �y     �K    z     �K    z     
L    (z      L    8z     3L    lz     FL    |z     YL    �z     lL    �z        � �p          (4     .     �4     �     |:     �     X7     �     t7     �     �7     �     �1     �     �1     �     �3     �     $2     	    Dr          �r     8    |q     �    �p     �    �8     �    �8         ,r     /    �q     �    Hs     �    �q     �  � 4Z     P  � Li     {  � �p     �  �  m     �  � ti     �  � �n       � h0     ?  � d`     j  � �G     �  � �O       � �K     �  � �o     �  � �J     "  � J     �  � �L     �          �    $-     �            �                        <            V            o            �            �            �            I            �            �            $	            _	            �	            �	            
            B
            {
            �
            �
            +            ;            L            d            z            �            �            �            �                        *            2            9            S            f            w            �            �            �            �            �              �                                            !  "  #  $  %  &  	  
      *  
    +  ,    -  1  2  3  4  5  6  7  8  :  ;    �                                                !  "  #  $  %  &  	  
      '  (  )  *  
    +  ,    -  .  /  0  1  2  3  4  5  6  7  8  9  :  ;        __Z7isasciii __ZN3ATM10addAccountEP7Account __ZN3ATM12authenticateERKNSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES8_ __ZN3ATM5startEv __ZN3ATM6logoutEv __ZN3ATM7depositEd __ZN3ATM8withdrawEd __ZN3ATMC1Ev __ZN3ATMC2Ev __ZN3ATMD1Ev __ZN3ATMD2Ev __ZN7Account7depositEd __ZN7Account8withdrawEd __ZN7AccountC1ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_d __ZN7AccountC2ENSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEES6_d __ZNK3ATM11displayMenuEv __ZNK3ATM12checkBalanceEv __ZNK7Account10getBalanceEv __ZNK7Account11validatePinERKNSt3__112basic_stringIcNS0_11char_traitsIcEENS0_9allocatorIcEEEE __ZNK7Account14displayBalanceEv __ZNK7Account16getAccountNumberEv __ZNKSt3__111__move_loopINS_17_ClassicAlgPolicyEEclB7v160006INS_16reverse_iteratorIPP7AccountEES8_S8_EENS_4pairIT_T1_EESA_T0_SB_ __ZNSt3__111char_traitsIcE11eq_int_typeEii __ZNSt3__111char_traitsIcE11to_int_typeEc __ZNSt3__111char_traitsIcE12to_char_typeEi __ZNSt3__111char_traitsIcE3eofEv __ZNSt3__111char_traitsIcE6assignERcRKc __ZNSt3__111char_traitsIcE6lengthEPKc __ZNSt3__111char_traitsIcE7compareEPKcS3_m __ZNSt3__116allocator_traitsINS_9allocatorIP7AccountEEE7destroyB7v160006IS3_vEEvRS4_PT_ __ZNSt3__116allocator_traitsINS_9allocatorIP7AccountEEE8max_sizeB7v160006IS4_vEEmRKS4_ __ZNSt3__116allocator_traitsINS_9allocatorIP7AccountEEE9constructB7v160006IS3_JRKS3_EvEEvRS4_PT_DpOT0_ __ZNSt3__116allocator_traitsINS_9allocatorIcEEE8max_sizeB7v160006IS2_vEEmRKS2_ __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE21__push_back_slow_pathIRKS2_EEvOT_ __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE22__construct_one_at_endB7v160006IJRKS2_EEEvDpOT_ __ZNSt3__19allocatorIP7AccountE9constructB7v160006IS2_JRKS2_EEEvPT_DpOT0_ __mh_execute_header _main __Unwind_Resume __ZNKSt3__16locale9use_facetERNS0_2idE __ZNKSt3__18ios_base6getlocEv __ZNSt11logic_errorC2EPKc __ZNSt12length_errorD1Ev __ZNSt20bad_array_new_lengthC1Ev __ZNSt20bad_array_new_lengthD1Ev __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEmc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED1Ev __ZNSt3__113basic_istreamIcNS_11char_traitsIcEEE6ignoreEli __ZNSt3__113basic_istreamIcNS_11char_traitsIcEEE6sentryC1ERS3_b __ZNSt3__113basic_istreamIcNS_11char_traitsIcEEErsERd __ZNSt3__113basic_istreamIcNS_11char_traitsIcEEErsERi __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE3putEc __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE5flushEv __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryC1ERS3_ __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentryD1Ev __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsEd __ZNSt3__13cinE __ZNSt3__14coutE __ZNSt3__15ctypeIcE2idE __ZNSt3__16localeD1Ev __ZNSt3__18ios_base33__set_badbit_and_consider_rethrowEv __ZNSt3__18ios_base5clearEj __ZSt9terminatev __ZTISt12length_error __ZTISt20bad_array_new_length __ZTVSt12length_error __ZdlPv __Znwm ___cxa_allocate_exception ___cxa_begin_catch ___cxa_end_catch ___cxa_free_exception ___cxa_rethrow ___cxa_throw ___gxx_personality_v0 _memcmp _strlen __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1B7v160006IDnEEPKc __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2B7v160006IDnEEPKc __ZNSt3__117__compressed_pairINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repES5_EC1B7v160006INS_18__default_init_tagESA_EEOT_OT0_ __ZNSt3__119__debug_db_insert_cB7v160006INS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEvPT_ __ZNSt3__117__compressed_pairINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repES5_EC2B7v160006INS_18__default_init_tagESA_EEOT_OT0_ __ZNSt3__122__compressed_pair_elemINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repELi0ELb0EEC2B7v160006ENS_18__default_init_tagE __ZNSt3__122__compressed_pair_elemINS_9allocatorIcEELi1ELb1EEC2B7v160006ENS_18__default_init_tagE __ZNSt3__19allocatorIcEC2B7v160006Ev __ZNSt3__116__non_trivial_ifILb1ENS_9allocatorIcEEEC2B7v160006Ev __ZNSt3__118__constexpr_strlenB7v160006EPKc ___clang_call_terminate __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEEC1B7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE5beginB7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE3endB7v160006Ev __ZNSt3__1neB7v160006IPP7AccountEEbRKNS_11__wrap_iterIT_EES8_ __ZNKSt3__111__wrap_iterIPP7AccountEdeB7v160006Ev __ZN7AccountD1Ev __ZNSt3__111__wrap_iterIPP7AccountEppB7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEED1B7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE9push_backB7v160006ERKS2_ __ZNSt3__1eqB7v160006INS_9allocatorIcEEEEbRKNS_12basic_stringIcNS_11char_traitsIcEET_EES9_ __ZNSt3__1lsB7v160006INS_11char_traitsIcEEEERNS_13basic_ostreamIcT_EES6_PKc __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsB7v160006EPFRS3_S4_E __ZNSt3__14endlB7v160006IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_ __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1B7v160006Ev __ZNSt3__1rsB7v160006IcNS_11char_traitsIcEENS_9allocatorIcEEEERNS_13basic_istreamIT_T0_EES9_RNS_12basic_stringIS6_S7_T1_EE __ZNSt3__114numeric_limitsIlE3maxB7v160006Ev __ZNSt3__1eqB7v160006IPP7AccountEEbRKNS_11__wrap_iterIT_EES8_ __ZNKSt3__111__wrap_iterIPP7AccountE4baseB7v160006Ev __ZN7AccountD2Ev __ZNSt3__123__libcpp_numeric_limitsIlLb1EE3maxB7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEEC2B7v160006Ev __ZNSt3__117__compressed_pairIPP7AccountNS_9allocatorIS2_EEEC1B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__119__debug_db_insert_cB7v160006INS_6vectorIP7AccountNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__117__compressed_pairIPP7AccountNS_9allocatorIS2_EEEC2B7v160006IDnNS_18__default_init_tagEEEOT_OT0_ __ZNSt3__122__compressed_pair_elemIPP7AccountLi0ELb0EEC2B7v160006IDnvEEOT_ __ZNSt3__122__compressed_pair_elemINS_9allocatorIP7AccountEELi1ELb1EEC2B7v160006ENS_18__default_init_tagE __ZNSt3__19allocatorIP7AccountEC2B7v160006Ev __ZNSt3__116__non_trivial_ifILb1ENS_9allocatorIP7AccountEEEC2B7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEED2B7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE16__destroy_vectorC1ERS5_ __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE16__destroy_vectorclB7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE16__destroy_vectorC2ERS5_ __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE17__annotate_deleteB7v160006Ev __ZNSt3__118__debug_db_erase_cB7v160006INS_6vectorIP7AccountNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE7__clearB7v160006Ev __ZNSt3__116allocator_traitsINS_9allocatorIP7AccountEEE10deallocateB7v160006ERS4_PS3_m __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE8capacityB7v160006Ev __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE31__annotate_contiguous_containerB7v160006EPKvS7_S7_S7_ __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE4dataB7v160006Ev __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE4sizeB7v160006Ev __ZNSt3__112__to_addressB7v160006IP7AccountEEPT_S4_ __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE22__base_destruct_at_endB7v160006EPS2_ __ZNSt3__19allocatorIP7AccountE7destroyB7v160006EPS2_ __ZNSt3__19allocatorIP7AccountE10deallocateB7v160006EPS2_m __ZNSt3__119__libcpp_deallocateB7v160006EPvmm __ZNSt3__127__do_deallocate_handle_sizeB7v160006IJEEEvPvmDpT_ __ZNSt3__124__libcpp_operator_deleteB7v160006IJPvEEEvDpT_ __ZNSt3__117__compressed_pairIPP7AccountNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemINS_9allocatorIP7AccountEELi1ELb1EE5__getB7v160006Ev __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIPP7AccountNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNKSt3__122__compressed_pair_elemIPP7AccountLi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE11__make_iterB7v160006EPS2_ __ZNSt3__111__wrap_iterIPP7AccountEC1B7v160006EPKvS3_ __ZNSt3__111__wrap_iterIPP7AccountEC2B7v160006EPKvS3_ __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIPP7AccountNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__122__compressed_pair_elemIPP7AccountLi0ELb0EE5__getB7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE21_ConstructTransactionC1B7v160006ERS5_m __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE21_ConstructTransactionD1B7v160006Ev __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE21_ConstructTransactionC2B7v160006ERS5_m __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE21_ConstructTransactionD2B7v160006Ev __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE11__recommendB7v160006Em __ZNSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEEC1EmmS5_ __ZNSt3__16vectorIP7AccountNS_9allocatorIS2_EEE26__swap_out_circular_bufferERNS_14__split_bufferIS2_RS4_EE __ZNSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEED1Ev __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE8max_sizeEv __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE20__throw_length_errorB7v160006Ev __ZNSt3__13maxB7v160006ImEERKT_S3_S3_ __ZNSt3__13minB7v160006ImEERKT_S3_S3_ __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNSt3__13minB7v160006ImNS_6__lessImmEEEERKT_S5_S5_T0_ __ZNKSt3__16__lessImmEclB7v160006ERKmS3_ __ZNKSt3__19allocatorIP7AccountE8max_sizeB7v160006Ev __ZNKSt3__117__compressed_pairIPP7AccountNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNKSt3__122__compressed_pair_elemINS_9allocatorIP7AccountEELi1ELb1EE5__getB7v160006Ev __ZNSt3__120__throw_length_errorB7v160006EPKc __ZNSt12length_errorC1B7v160006EPKc __ZNSt12length_errorC2B7v160006EPKc __ZNSt3__13maxB7v160006ImNS_6__lessImmEEEERKT_S5_S5_T0_ __ZNSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEEC2EmmS5_ __ZNSt3__117__compressed_pairIPP7AccountRNS_9allocatorIS2_EEEC1B7v160006IDnS6_EEOT_OT0_ __ZNSt3__119__allocate_at_leastB7v160006INS_9allocatorIP7AccountEEEENS_19__allocation_resultINS_16allocator_traitsIT_E7pointerEEERS7_m __ZNSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEE7__allocB7v160006Ev __ZNSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNSt3__117__compressed_pairIPP7AccountRNS_9allocatorIS2_EEEC2B7v160006IDnS6_EEOT_OT0_ __ZNSt3__122__compressed_pair_elemIRNS_9allocatorIP7AccountEELi1ELb0EEC2B7v160006IS5_vEEOT_ __ZNSt3__19allocatorIP7AccountE8allocateB7v160006Em __ZSt28__throw_bad_array_new_lengthB7v160006v __ZNSt3__117__libcpp_allocateB7v160006Emm __ZNSt3__121__libcpp_operator_newB7v160006IJmEEEPvDpT_ __ZNSt3__117__compressed_pairIPP7AccountRNS_9allocatorIS2_EEE6secondB7v160006Ev __ZNSt3__122__compressed_pair_elemIRNS_9allocatorIP7AccountEELi1ELb0EE5__getB7v160006Ev __ZNSt3__117__compressed_pairIPP7AccountRNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNSt3__142__uninitialized_allocator_move_if_noexceptB7v160006INS_9allocatorIP7AccountEENS_16reverse_iteratorIPS3_EES7_S3_vEET1_RT_T0_SB_S8_ __ZNSt3__116reverse_iteratorIPP7AccountEC1B7v160006ES3_ __ZNKSt3__116reverse_iteratorIPP7AccountE4baseB7v160006Ev __ZNSt3__14swapB7v160006IPP7AccountEENS_9enable_ifIXaasr21is_move_constructibleIT_EE5valuesr18is_move_assignableIS5_EE5valueEvE4typeERS5_S8_ __ZNKSt3__16vectorIP7AccountNS_9allocatorIS2_EEE14__annotate_newB7v160006Em __ZNSt3__125__debug_db_invalidate_allB7v160006INS_6vectorIP7AccountNS_9allocatorIS3_EEEEEEvPT_ __ZNSt3__14moveB7v160006INS_16reverse_iteratorIPP7AccountEES5_EET0_T_S7_S6_ __ZNSt3__16__moveB7v160006INS_17_ClassicAlgPolicyENS_16reverse_iteratorIPP7AccountEES6_S6_EENS_4pairIT0_T2_EES8_T1_S9_ __ZNSt3__123__dispatch_copy_or_moveB7v160006INS_17_ClassicAlgPolicyENS_11__move_loopIS1_EENS_14__move_trivialENS_16reverse_iteratorIPP7AccountEES9_S9_EENS_4pairIT2_T4_EESB_T3_SC_ __ZNSt3__121__unwrap_and_dispatchB7v160006INS_10__overloadINS_11__move_loopINS_17_ClassicAlgPolicyEEENS_14__move_trivialEEENS_16reverse_iteratorIPP7AccountEESB_SB_Li0EEENS_4pairIT0_T2_EESD_T1_SE_ __ZNSt3__114__unwrap_rangeB7v160006INS_16reverse_iteratorIPP7AccountEES5_EENS_4pairIT0_S7_EET_S9_ __ZNSt3__113__unwrap_iterB7v160006INS_16reverse_iteratorIPP7AccountEENS_18__unwrap_iter_implIS5_Lb0EEELi0EEEDTclsrT0_8__unwrapclsr3stdE7declvalIT_EEEES9_ __ZNSt3__19make_pairB7v160006INS_16reverse_iteratorIPP7AccountEES5_EENS_4pairINS_18__unwrap_ref_decayIT_E4typeENS7_IT0_E4typeEEEOS8_OSB_ __ZNSt3__114__rewrap_rangeB7v160006INS_16reverse_iteratorIPP7AccountEES5_EET_S6_T0_ __ZNSt3__113__rewrap_iterB7v160006INS_16reverse_iteratorIPP7AccountEES5_NS_18__unwrap_iter_implIS5_Lb0EEEEET_S8_T0_ __ZNSt3__1neB7v160006IPP7AccountS3_EEbRKNS_16reverse_iteratorIT_EERKNS4_IT0_EE __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE11__iter_moveB7v160006IRNS_16reverse_iteratorIPP7AccountEEEENS_9enable_ifIXsr12is_referenceIDTdeclsr3stdE7declvalIRT_EEEEE5valueEDTclsr3stdE4movedeclsr3stdE7declvalISC_EEEEE4typeEOSB_ __ZNKSt3__116reverse_iteratorIPP7AccountEdeB7v160006Ev __ZNSt3__116reverse_iteratorIPP7AccountEppB7v160006Ev __ZNSt3__18_IterOpsINS_17_ClassicAlgPolicyEE25__validate_iter_referenceB7v160006IRNS_16reverse_iteratorIPP7AccountEEEEvv __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIPP7AccountEELb0EE8__unwrapB7v160006ES5_ __ZNSt3__14pairINS_16reverse_iteratorIPP7AccountEES5_EC1B7v160006IS5_S5_LPv0EEEOT_OT0_ __ZNSt3__14pairINS_16reverse_iteratorIPP7AccountEES5_EC2B7v160006IS5_S5_LPv0EEEOT_OT0_ __ZNSt3__118__unwrap_iter_implINS_16reverse_iteratorIPP7AccountEELb0EE8__rewrapB7v160006ES5_S5_ __ZNSt3__116reverse_iteratorIPP7AccountEC2B7v160006ES3_ __ZNSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEED2Ev __ZNSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEE5clearB7v160006Ev __ZNKSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEE8capacityB7v160006Ev __ZNSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEE17__destruct_at_endB7v160006EPS2_ __ZNSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEE17__destruct_at_endB7v160006EPS2_NS_17integral_constantIbLb0EEE __ZNKSt3__114__split_bufferIP7AccountRNS_9allocatorIS2_EEE9__end_capB7v160006Ev __ZNKSt3__117__compressed_pairIPP7AccountRNS_9allocatorIS2_EEE5firstB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4sizeB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4dataB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__is_longB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE15__get_long_sizeB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE16__get_short_sizeB7v160006Ev __ZNKSt3__117__compressed_pairINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repES5_E5firstB7v160006Ev __ZNKSt3__122__compressed_pair_elemINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repELi0ELb0EE5__getB7v160006Ev __ZNSt3__112__to_addressB7v160006IKcEEPT_S3_ __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE13__get_pointerB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE18__get_long_pointerB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE19__get_short_pointerB7v160006Ev __ZNSt3__114pointer_traitsIPKcE10pointer_toB7v160006ERS1_ __ZNSt3__118__constexpr_memcmpB7v160006IcEEiPKT_S3_m __ZNSt3__124__put_character_sequenceB7v160006IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_PKS4_m __ZNKSt3__113basic_ostreamIcNS_11char_traitsIcEEE6sentrycvbB7v160006Ev __ZNSt3__116__pad_and_outputB7v160006IcNS_11char_traitsIcEEEENS_19ostreambuf_iteratorIT_T0_EES6_PKS4_S8_S8_RNS_8ios_baseES4_ __ZNSt3__119ostreambuf_iteratorIcNS_11char_traitsIcEEEC1B7v160006ERNS_13basic_ostreamIcS2_EE __ZNKSt3__18ios_base5flagsB7v160006Ev __ZNKSt3__19basic_iosIcNS_11char_traitsIcEEE4fillB7v160006Ev __ZNKSt3__119ostreambuf_iteratorIcNS_11char_traitsIcEEE6failedB7v160006Ev __ZNSt3__19basic_iosIcNS_11char_traitsIcEEE8setstateB7v160006Ej __ZNKSt3__18ios_base5widthB7v160006Ev __ZNSt3__115basic_streambufIcNS_11char_traitsIcEEE5sputnB7v160006EPKcl __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1B7v160006Emc __ZNSt3__18ios_base5widthB7v160006El __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2B7v160006Emc __ZNSt3__119ostreambuf_iteratorIcNS_11char_traitsIcEEEC2B7v160006ERNS_13basic_ostreamIcS2_EE __ZNKSt3__19basic_iosIcNS_11char_traitsIcEEE5rdbufB7v160006Ev __ZNKSt3__18ios_base5rdbufB7v160006Ev __ZNKSt3__19basic_iosIcNS_11char_traitsIcEEE5widenB7v160006Ec __ZNSt3__19use_facetB7v160006INS_5ctypeIcEEEERKT_RKNS_6localeE __ZNKSt3__15ctypeIcE5widenB7v160006Ec __ZNSt3__18ios_base8setstateB7v160006Ej __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC2B7v160006Ev __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE14__default_initB7v160006Ev __ZNSt3__117__compressed_pairINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repES5_E5firstB7v160006Ev __ZNSt3__122__compressed_pair_elemINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repELi0ELb0EE5__getB7v160006Ev __ZNKSt3__113basic_istreamIcNS_11char_traitsIcEEE6sentrycvbB7v160006Ev __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5clearB7v160006Ev __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE8max_sizeB7v160006Ev __ZNSt3__115basic_streambufIcNS_11char_traitsIcEEE5sgetcB7v160006Ev __ZNKSt3__15ctypeIcE2isB7v160006Ejc __ZNSt3__115basic_streambufIcNS_11char_traitsIcEEE6sbumpcB7v160006Ev __ZNSt3__18ios_base18__setstate_nothrowB7v160006Ej __ZNKSt3__19basic_iosIcNS_11char_traitsIcEEE10exceptionsB7v160006Ev __ZNSt3__125__debug_db_invalidate_allB7v160006INS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEEEEvPT_ __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE18__get_long_pointerB7v160006Ev __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE15__set_long_sizeB7v160006Em __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE19__get_short_pointerB7v160006Ev __ZNSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE16__set_short_sizeB7v160006Em __ZNSt3__114pointer_traitsIPcE10pointer_toB7v160006ERc __ZNKSt3__112basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7__allocB7v160006Ev __ZNSt3__114numeric_limitsImE3maxB7v160006Ev __ZNKSt3__19allocatorIcE8max_sizeB7v160006Ev __ZNKSt3__117__compressed_pairINS_12basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE5__repES5_E6secondB7v160006Ev __ZNKSt3__122__compressed_pair_elemINS_9allocatorIcEELi1ELb1EE5__getB7v160006Ev __ZNSt3__123__libcpp_numeric_limitsImLb1EE3maxB7v160006Ev __ZNKSt3__18ios_base10exceptionsB7v160006Ev __ZNSt3__1lsB7v160006IcNS_11char_traitsIcEEEERNS_13basic_ostreamIT_T0_EES7_RKNS_8__iom_t5E __ZNSt3__113basic_ostreamIcNS_11char_traitsIcEEElsB7v160006EPFRNS_8ios_baseES5_E __ZNSt3__15fixedB7v160006ERNS_8ios_baseE __ZNSt3__112setprecisionB7v160006Ei __ZNSt3__18ios_base4setfB7v160006Ejj __ZNSt3__18ios_base6unsetfB7v160006Ej __ZNSt3__18__iom_t5C1B7v160006Ei __ZNSt3__18__iom_t5C2B7v160006Ei __ZNSt3__18ios_base9precisionB7v160006El GCC_except_table0 GCC_except_table4 GCC_except_table14 GCC_except_table24 GCC_except_table26 GCC_except_table32 GCC_except_table41 GCC_except_table55 GCC_except_table58 GCC_except_table71 GCC_except_table72 GCC_except_table85 GCC_except_table96 GCC_except_table129 GCC_except_table140 GCC_except_table144 GCC_except_table150 GCC_except_table161 GCC_except_table162 GCC_except_table164 GCC_except_table182 GCC_except_table187 GCC_except_table192 GCC_except_table197 GCC_except_table0 GCC_except_table23 GCC_except_table35 GCC_except_table36 GCC_except_table38 GCC_except_table56 GCC_except_table61          ���  �          ��  �       \   X        4p                                        H�       atm ��Z�ɷ)"�5 s�9L%�է�����R4�q�&���Xo��f����kOX�|�|z�ڽ�H�,�4׻�I��@�炀���8�|t�D���[��e��J�#�[΍�
�8��0\� �w ������s�\Juq�slPUү���������6�=	x ߤ'~�e��2P�c�NH	}�!j�M��CY�f(��ʓak�C��$��|�)���%���(�۶r��;0�&-(���L˲T<B�a�����r<�
:�jz-j����L1���ފ������z��
�'���Xo��f����kOX�|�|z�ڽ�H�,����Xo��f����kOX�|�|z�ڽ�H�,����Xo��f����kOX�|�|z�ڽ�H�,�:0;I?
����HP����Nv$�R5N� �����5�y��}��ρ�R��e����N�\(�@��n���|��вk���v��l�X5���K�`�&�c�L��~l�[�:!�*�.�<P.�bġ;=.�5��� �~�Kd�g*��H{(�3����]L@�*��yo�YS�Z�@��C��ؖ��!�Jy�WC�����m���Q�Ϟ�8��Vτ.����Կs�5svX�J]�zX[%k��x�ƺ
```

</details>

<details><summary><b>golang</b> (11 files)</summary>


**README.md**

```md
# Designing an ATM System

## Requirements
1. The ATM system should support basic operations such as balance inquiry, cash withdrawal, and cash deposit.
2. Users should be able to authenticate themselves using a card and a PIN (Personal Identification Number).
3. The system should interact with a bank's backend system to validate user accounts and perform transactions.
4. The ATM should have a cash dispenser to dispense cash to users.
5. The system should handle concurrent access and ensure data consistency.
6. The ATM should have a user-friendly interface for users to interact with.

## Classes, Interfaces and Enumerations
1. The **Card** class represents an ATM card with a card number and PIN.
2. The **Account** class represents a bank account with an account number and balance. It provides methods to debit and credit the account balance.
3. The **Transaction** class is an abstract base class for different types of transactions, such as withdrawal and deposit. It is extended by WithdrawalTransaction and DepositTransaction classes.
4. The **BankingService** class manages the bank accounts and processes transactions. It uses a thread-safe ConcurrentHashMap to store and retrieve account information.
5. The **CashDispenser** class represents the ATM's cash dispenser and handles the dispensing of cash. It uses synchronization to ensure thread safety when dispensing cash.
6. The **ATM** class serves as the main interface for ATM operations. It interacts with the BankingService and CashDispenser to perform user authentication, balance inquiry, cash withdrawal, and cash deposit.
7. The **ATMDriver** class demonstrates the usage of the ATM system by creating sample accounts and performing ATM operations.
```


**account.go**

```go
package atm

import "sync"

type Account struct {
	accountNumber string
	balance       float64
	mu            sync.Mutex
}

func NewAccount(accountNumber string, balance float64) *Account {
	return &Account{
		accountNumber: accountNumber,
		balance:       balance,
	}
}

func (a *Account) GetAccountNumber() string {
	return a.accountNumber
}

func (a *Account) GetBalance() float64 {
	a.mu.Lock()
	defer a.mu.Unlock()
	return a.balance
}

func (a *Account) Debit(amount float64) error {
	a.mu.Lock()
	defer a.mu.Unlock()
	if a.balance < amount {
		return ErrInsufficientFunds
	}
	a.balance -= amount
	return nil
}

func (a *Account) Credit(amount float64) error {
	a.mu.Lock()
	defer a.mu.Unlock()
	a.balance += amount
	return nil
}
```


**atm.go**

```go
package atm

import (
	"errors"
	"fmt"
	"sync/atomic"
	"time"
)

type ATM struct {
	bankingService *BankingService
	cashDispenser  *CashDispenser
	txnCounter     int64
}

func NewATM(bankingService *BankingService, cashDispenser *CashDispenser) *ATM {
	return &ATM{
		bankingService: bankingService,
		cashDispenser:  cashDispenser,
	}
}

func (a *ATM) AuthenticateUser(card *Card) error {
	// Authentication logic would go here
	return nil
}

func (a *ATM) CheckBalance(accountNumber string) (float64, error) {
	account := a.bankingService.GetAccount(accountNumber)
	if account == nil {
		return 0, errors.New("account not found")
	}
	return account.GetBalance(), nil
}

func (a *ATM) WithdrawCash(accountNumber string, amount float64) error {
	account := a.bankingService.GetAccount(accountNumber)
	if account == nil {
		return errors.New("account not found")
	}

	transaction := NewWithdrawalTransaction(a.generateTransactionID(), account, amount)
	if err := a.bankingService.ProcessTransaction(transaction); err != nil {
		return err
	}

	return a.cashDispenser.DispenseCash(int(amount))
}

func (a *ATM) DepositCash(accountNumber string, amount float64) error {
	account := a.bankingService.GetAccount(accountNumber)
	if account == nil {
		return errors.New("account not found")
	}

	transaction := NewDepositTransaction(a.generateTransactionID(), account, amount)
	return a.bankingService.ProcessTransaction(transaction)
}

func (a *ATM) generateTransactionID() string {
	txnNumber := atomic.AddInt64(&a.txnCounter, 1)
	timestamp := time.Now().Format("20060102150405")
	return fmt.Sprintf("TXN%s%010d", timestamp, txnNumber)
}
```


**atm_demo.go**

```go
package atm

import (
	"fmt"
)

func Run() {
	bankingService := NewBankingService()
	cashDispenser := NewCashDispenser(10000)
	atmMachine := NewATM(bankingService, cashDispenser)

	// Create sample accounts
	bankingService.CreateAccount("1234567890", 1000.0)
	bankingService.CreateAccount("9876543210", 500.0)

	// Create card and authenticate
	card := NewCard("1234567890", "1234")
	if err := atmMachine.AuthenticateUser(card); err != nil {
		fmt.Printf("Authentication failed: %v\n", err)
		return
	}

	// Check balance
	if balance, err := atmMachine.CheckBalance("1234567890"); err == nil {
		fmt.Printf("Account balance: %.2f\n", balance)
	} else {
		fmt.Printf("Error checking balance: %v\n", err)
	}

	// Withdraw cash
	if err := atmMachine.WithdrawCash("1234567890", 500.0); err == nil {
		fmt.Println("Successfully withdrew $500")
	} else {
		fmt.Printf("Error withdrawing cash: %v\n", err)
	}

	// Deposit cash
	if err := atmMachine.DepositCash("9876543210", 200.0); err == nil {
		fmt.Println("Successfully deposited $200")
	} else {
		fmt.Printf("Error depositing cash: %v\n", err)
	}

	// Check updated balance
	if balance, err := atmMachine.CheckBalance("1234567890"); err == nil {
		fmt.Printf("Updated account balance: %.2f\n", balance)
	} else {
		fmt.Printf("Error checking balance: %v\n", err)
	}
}
```


**banking_service.go**

```go
package atm

import (
	"sync"
)

type BankingService struct {
	accounts map[string]*Account
	mu       sync.RWMutex
}

func NewBankingService() *BankingService {
	return &BankingService{
		accounts: make(map[string]*Account),
	}
}

func (bs *BankingService) CreateAccount(accountNumber string, initialBalance float64) {
	bs.mu.Lock()
	defer bs.mu.Unlock()
	bs.accounts[accountNumber] = NewAccount(accountNumber, initialBalance)
}

func (bs *BankingService) GetAccount(accountNumber string) *Account {
	bs.mu.RLock()
	defer bs.mu.RUnlock()
	return bs.accounts[accountNumber]
}

func (bs *BankingService) ProcessTransaction(transaction Transaction) error {
	return transaction.Execute()
}
```


**card.go**

```go
package atm

type Card struct {
	CardNumber string
	PIN        string
}

func NewCard(cardNumber, pin string) *Card {
	return &Card{
		CardNumber: cardNumber,
		PIN:        pin,
	}
}
```


**cash_dispenser.go**

```go
package atm

import (
	"sync"
)

type CashDispenser struct {
	cashAvailable int
	mu            sync.Mutex
}

func NewCashDispenser(initialCash int) *CashDispenser {
	return &CashDispenser{
		cashAvailable: initialCash,
	}
}

func (cd *CashDispenser) DispenseCash(amount int) error {
	cd.mu.Lock()
	defer cd.mu.Unlock()

	if amount > cd.cashAvailable {
		return ErrInsufficientCashInATM
	}
	cd.cashAvailable -= amount
	return nil
}
```


**deposit_transaction.go**

```go
package atm

type DepositTransaction struct {
	BaseTransaction
}

func NewDepositTransaction(transactionID string, account *Account, amount float64) *DepositTransaction {
	return &DepositTransaction{
		BaseTransaction: BaseTransaction{
			TransactionID: transactionID,
			Account:       account,
			Amount:        amount,
		},
	}
}

func (t *DepositTransaction) Execute() error {
	return t.Account.Credit(t.Amount)
}
```


**errors.go**

```go
package atm

import "errors"

var (
	ErrInsufficientFunds     = errors.New("insufficient funds in account")
	ErrInsufficientCashInATM = errors.New("insufficient cash available in ATM")
	ErrInvalidCard           = errors.New("invalid card")
	ErrInvalidPIN            = errors.New("invalid PIN")
)
```


**transaction.go**

```go
package atm

type Transaction interface {
	Execute() error
}

type BaseTransaction struct {
	TransactionID string
	Account       *Account
	Amount        float64
}
```


**withdrawal_transaction.go**

```go
package atm

type WithdrawalTransaction struct {
	BaseTransaction
}

func NewWithdrawalTransaction(transactionID string, account *Account, amount float64) *WithdrawalTransaction {
	return &WithdrawalTransaction{
		BaseTransaction: BaseTransaction{
			TransactionID: transactionID,
			Account:       account,
			Amount:        amount,
		},
	}
}

func (t *WithdrawalTransaction) Execute() error {
	return t.Account.Debit(t.Amount)
}
```

</details>

<details><summary><b>csharp</b> (18 files)</summary>


**ATM.cs**

```cs
class ATM
{
    private static ATM instance;
    private static readonly object lockObject = new object();
    private readonly BankService bankService;
    private readonly CashDispenser cashDispenser;
    private static long transactionCounter = 0;
    private IATMState currentState;
    private Card currentCard;

    private ATM()
    {
        currentState = new IdleState();
        bankService = new BankService();

        // Setup the dispenser chain
        IDispenseChain c1 = new NoteDispenser100(10); // 10 x $100 notes
        IDispenseChain c2 = new NoteDispenser50(20);  // 20 x $50 notes
        IDispenseChain c3 = new NoteDispenser20(30);  // 30 x $20 notes
        c1.SetNextChain(c2);
        c2.SetNextChain(c3);
        cashDispenser = new CashDispenser(c1);
    }

    public static ATM GetInstance()
    {
        if (instance == null)
        {
            lock (lockObject)
            {
                if (instance == null)
                {
                    instance = new ATM();
                }
            }
        }
        return instance;
    }

    public void ChangeState(IATMState newState)
    {
        currentState = newState;
    }

    public void SetCurrentCard(Card card)
    {
        currentCard = card;
    }

    public void InsertCard(string cardNumber)
    {
        currentState.InsertCard(this, cardNumber);
    }

    public void EnterPin(string pin)
    {
        currentState.EnterPin(this, pin);
    }

    public void SelectOperation(OperationType op, int amount = 0)
    {
        currentState.SelectOperation(this, op, amount);
    }

    public void CheckBalance()
    {
        double balance = bankService.GetBalance(currentCard);
        Console.WriteLine($"Your current account balance is: ${balance:F2}");
    }

    public void WithdrawCash(int amount)
    {
        if (!cashDispenser.CanDispenseCash(amount))
        {
            throw new InvalidOperationException("Insufficient cash available in the ATM.");
        }

        bankService.WithdrawMoney(currentCard, amount);

        try
        {
            cashDispenser.DispenseCash(amount);
        }
        catch (Exception)
        {
            bankService.DepositMoney(currentCard, amount); // Deposit back if dispensing fails
            throw;
        }
    }

    public void DepositCash(int amount)
    {
        bankService.DepositMoney(currentCard, amount);
    }

    public Card GetCurrentCard() => currentCard;
    public BankService GetBankService() => bankService;
}
```


**ATMDemo.cs**

```cs
using System;
using System.Collections.Generic;
using System.Threading;

public class ATMDemo
{
    public static void Main(string[] args)
    {
        ATM atm = ATM.GetInstance();

        // Perform Check Balance operation
        atm.InsertCard("1234-5678-9012-3456");
        atm.EnterPin("1234");
        atm.SelectOperation(OperationType.CHECK_BALANCE); // $1000

        // Perform Withdraw Cash operation
        atm.InsertCard("1234-5678-9012-3456");
        atm.EnterPin("1234");
        atm.SelectOperation(OperationType.WITHDRAW_CASH, 570);

        // Perform Deposit Cash operation
        atm.InsertCard("1234-5678-9012-3456");
        atm.EnterPin("1234");
        atm.SelectOperation(OperationType.DEPOSIT_CASH, 200);

        // Perform Check Balance operation
        atm.InsertCard("1234-5678-9012-3456");
        atm.EnterPin("1234");
        atm.SelectOperation(OperationType.CHECK_BALANCE); // $630

        // Perform Withdraw Cash more than balance
        atm.InsertCard("1234-5678-9012-3456");
        atm.EnterPin("1234");
        atm.SelectOperation(OperationType.WITHDRAW_CASH, 700); // Insufficient balance

        // Insert Incorrect PIN
        atm.InsertCard("1234-5678-9012-3456");
        atm.EnterPin("3425");
    }
}
```


**DispenserChain/CashDispenser.cs**

```cs
class CashDispenser
{
    private readonly IDispenseChain chain;
    private readonly object dispenserLock = new object();

    public CashDispenser(IDispenseChain chain)
    {
        this.chain = chain;
    }

    public void DispenseCash(int amount)
    {
        lock (dispenserLock)
        {
            chain.Dispense(amount);
        }
    }

    public bool CanDispenseCash(int amount)
    {
        lock (dispenserLock)
        {
            if (amount % 10 != 0)
            {
                return false;
            }
            return chain.CanDispense(amount);
        }
    }
}
```


**DispenserChain/IDispenseChain.cs**

```cs
interface IDispenseChain
{
    void SetNextChain(IDispenseChain nextChain);
    void Dispense(int amount);
    bool CanDispense(int amount);
}
```


**DispenserChain/NoteDispenser.cs**

```cs
abstract class NoteDispenser : IDispenseChain
{
    private IDispenseChain nextChain;
    private readonly int noteValue;
    private int numNotes;
    private readonly object dispenserLock = new object();

    public NoteDispenser(int noteValue, int numNotes)
    {
        this.noteValue = noteValue;
        this.numNotes = numNotes;
    }

    public void SetNextChain(IDispenseChain nextChain)
    {
        this.nextChain = nextChain;
    }

    public void Dispense(int amount)
    {
        lock (dispenserLock)
        {
            if (amount >= noteValue)
            {
                int numToDispense = Math.Min(amount / noteValue, numNotes);
                int remainingAmount = amount - (numToDispense * noteValue);

                if (numToDispense > 0)
                {
                    Console.WriteLine($"Dispensing {numToDispense} x ${noteValue} note(s)");
                    numNotes -= numToDispense;
                }

                if (remainingAmount > 0 && nextChain != null)
                {
                    nextChain.Dispense(remainingAmount);
                }
            }
            else if (nextChain != null)
            {
                nextChain.Dispense(amount);
            }
        }
    }

    public bool CanDispense(int amount)
    {
        lock (dispenserLock)
        {
            if (amount < 0) return false;
            if (amount == 0) return true;

            int numToUse = Math.Min(amount / noteValue, numNotes);
            int remainingAmount = amount - (numToUse * noteValue);

            if (remainingAmount == 0) return true;
            if (nextChain != null)
            {
                return nextChain.CanDispense(remainingAmount);
            }
            return false;
        }
    }
}
```


**DispenserChain/NoteDispenser100.cs**

```cs
class NoteDispenser100 : NoteDispenser
{
    public NoteDispenser100(int numNotes) : base(100, numNotes) { }
}
```


**DispenserChain/NoteDispenser20.cs**

```cs
class NoteDispenser20 : NoteDispenser
{
    public NoteDispenser20(int numNotes) : base(20, numNotes) { }
}
```


**DispenserChain/NoteDispenser50.cs**

```cs
class NoteDispenser50 : NoteDispenser
{
    public NoteDispenser50(int numNotes) : base(50, numNotes) { }
}
```


**Enums/OperationType.cs**

```cs
enum OperationType
{
    CHECK_BALANCE,
    WITHDRAW_CASH,
    DEPOSIT_CASH
}
```


**Models/Account.cs**

```cs
class Account
{
    private readonly string accountNumber;
    private double balance;
    private readonly Dictionary<string, Card> cards;
    private readonly object accountLock = new object();

    public Account(string accountNumber, double balance)
    {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.cards = new Dictionary<string, Card>();
    }

    public string GetAccountNumber() => accountNumber;
    public double GetBalance() => balance;
    public Dictionary<string, Card> GetCards() => cards;

    public void Deposit(double amount)
    {
        lock (accountLock)
        {
            balance += amount;
        }
    }

    public bool Withdraw(double amount)
    {
        lock (accountLock)
        {
            if (balance >= amount)
            {
                balance -= amount;
                return true;
            }
            return false;
        }
    }
}
```


**Models/Card.cs**

```cs
class Card
{
    private readonly string cardNumber;
    private readonly string pin;

    public Card(string cardNumber, string pin)
    {
        this.cardNumber = cardNumber;
        this.pin = pin;
    }

    public string GetCardNumber() => cardNumber;
    public string GetPin() => pin;
}
```


**README.md**

```md
# Designing an ATM System

## Requirements
1. The ATM system should support basic operations such as balance inquiry, cash withdrawal, and cash deposit.
2. Users should be able to authenticate themselves using a card and a PIN (Personal Identification Number).
3. The system should interact with a bank's backend system to validate user accounts and perform transactions.
4. The ATM should have a cash dispenser to dispense cash to users.
5. The system should handle concurrent access and ensure data consistency.
6. The ATM should have a user-friendly interface for users to interact with.

## Classes, Interfaces and Enumerations
1. The **Card** class represents an ATM card with a card number and PIN.
2. The **Account** class represents a bank account with an account number and balance. It provides methods to debit and credit the account balance.
3. The **Transaction** class is an abstract base class for different types of transactions, such as withdrawal and deposit. It is extended by WithdrawalTransaction and DepositTransaction classes.
4. The **BankingService** class manages the bank accounts and processes transactions. It uses a thread-safe ConcurrentHashMap to store and retrieve account information.
5. The **CashDispenser** class represents the ATM's cash dispenser and handles the dispensing of cash. It uses synchronization to ensure thread safety when dispensing cash.
6. The **ATM** class serves as the main interface for ATM operations. It interacts with the BankingService and CashDispenser to perform user authentication, balance inquiry, cash withdrawal, and cash deposit.
7. The **ATMDriver** class demonstrates the usage of the ATM system by creating sample accounts and performing ATM operations.
```


**Service/BankService.cs**

```cs
class BankService
{
    private readonly Dictionary<string, Account> accounts = new Dictionary<string, Account>();
    private readonly Dictionary<string, Card> cards = new Dictionary<string, Card>();
    private readonly Dictionary<Card, Account> cardAccountMap = new Dictionary<Card, Account>();

    public BankService()
    {
        // Create sample accounts and cards
        Account account1 = CreateAccount("1234567890", 1000.0);
        Card card1 = CreateCard("1234-5678-9012-3456", "1234");
        LinkCardToAccount(card1, account1);

        Account account2 = CreateAccount("9876543210", 500.0);
        Card card2 = CreateCard("9876-5432-1098-7654", "4321");
        LinkCardToAccount(card2, account2);
    }

    public Account CreateAccount(string accountNumber, double initialBalance)
    {
        Account account = new Account(accountNumber, initialBalance);
        accounts[accountNumber] = account;
        return account;
    }

    public Card CreateCard(string cardNumber, string pin)
    {
        Card card = new Card(cardNumber, pin);
        cards[cardNumber] = card;
        return card;
    }

    public bool Authenticate(Card card, string pin)
    {
        return card.GetPin() == pin;
    }

    public Card AuthenticateCard(string cardNumber)
    {
        return cards.TryGetValue(cardNumber, out Card card) ? card : null;
    }

    public double GetBalance(Card card)
    {
        return cardAccountMap[card].GetBalance();
    }

    public void WithdrawMoney(Card card, double amount)
    {
        cardAccountMap[card].Withdraw(amount);
    }

    public void DepositMoney(Card card, double amount)
    {
        cardAccountMap[card].Deposit(amount);
    }

    public void LinkCardToAccount(Card card, Account account)
    {
        account.GetCards()[card.GetCardNumber()] = card;
        cardAccountMap[card] = account;
    }
}
```


**State/AuthenticatedState.cs**

```cs
class AuthenticatedState : IATMState
{
    public void InsertCard(ATM atm, string cardNumber)
    {
        Console.WriteLine("Error: A card is already inserted and a session is active.");
    }

    public void EnterPin(ATM atm, string pin)
    {
        Console.WriteLine("Error: PIN has already been entered and authenticated.");
    }

    public void SelectOperation(ATM atm, OperationType op, int amount = 0)
    {
        switch (op)
        {
            case OperationType.CHECK_BALANCE:
                atm.CheckBalance();
                break;

            case OperationType.WITHDRAW_CASH:
                if (amount <= 0)
                {
                    Console.WriteLine("Error: Invalid withdrawal amount specified.");
                    break;
                }

                double accountBalance = atm.GetBankService().GetBalance(atm.GetCurrentCard());
                if (amount > accountBalance)
                {
                    Console.WriteLine("Error: Insufficient balance.");
                    break;
                }

                Console.WriteLine($"Processing withdrawal for ${amount}");
                atm.WithdrawCash(amount);
                break;

            case OperationType.DEPOSIT_CASH:
                if (amount <= 0)
                {
                    Console.WriteLine("Error: Invalid deposit amount specified.");
                    break;
                }
                Console.WriteLine($"Processing deposit for ${amount}");
                atm.DepositCash(amount);
                break;

            default:
                Console.WriteLine("Error: Invalid operation selected.");
                break;
        }

        // End the session after one transaction
        Console.WriteLine("Transaction complete.");
        EjectCard(atm);
    }

    public void EjectCard(ATM atm)
    {
        Console.WriteLine("Ending session. Card has been ejected. Thank you for using our ATM.");
        atm.SetCurrentCard(null);
        atm.ChangeState(new IdleState());
    }
}
```


**State/HasCardState.cs**

```cs
class HasCardState : IATMState
{
    public void InsertCard(ATM atm, string cardNumber)
    {
        Console.WriteLine("Error: A card is already inserted. Cannot insert another card.");
    }

    public void EnterPin(ATM atm, string pin)
    {
        Console.WriteLine("Authenticating PIN...");
        Card card = atm.GetCurrentCard();
        bool isAuthenticated = atm.GetBankService().Authenticate(card, pin);

        if (isAuthenticated)
        {
            Console.WriteLine("Authentication successful.");
            atm.ChangeState(new AuthenticatedState());
        }
        else
        {
            Console.WriteLine("Authentication failed: Incorrect PIN.");
            EjectCard(atm);
        }
    }

    public void SelectOperation(ATM atm, OperationType op, int amount = 0)
    {
        Console.WriteLine("Error: Please enter your PIN first to select an operation.");
    }

    public void EjectCard(ATM atm)
    {
        Console.WriteLine("Card has been ejected. Thank you for using our ATM.");
        atm.SetCurrentCard(null);
        atm.ChangeState(new IdleState());
    }
}
```


**State/IATMState.cs**

```cs
interface IATMState
{
    void InsertCard(ATM atm, string cardNumber);
    void EnterPin(ATM atm, string pin);
    void SelectOperation(ATM atm, OperationType op, int amount = 0);
    void EjectCard(ATM atm);
}
```


**State/IdleState.cs**

```cs
class IdleState : IATMState
{
    public void InsertCard(ATM atm, string cardNumber)
    {
        Console.WriteLine("\nCard has been inserted.");
        Card card = atm.GetBankService().AuthenticateCard(cardNumber);

        if (card == null)
        {
            EjectCard(atm);
        }
        else
        {
            atm.SetCurrentCard(card);
            atm.ChangeState(new HasCardState());
        }
    }

    public void EnterPin(ATM atm, string pin)
    {
        Console.WriteLine("Error: Please insert a card first.");
    }

    public void SelectOperation(ATM atm, OperationType op, int amount = 0)
    {
        Console.WriteLine("Error: Please insert a card first.");
    }

    public void EjectCard(ATM atm)
    {
        Console.WriteLine("Error: Card not found.");
        atm.SetCurrentCard(null);
    }
}
```


**atm.csproj**

```csproj
﻿<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>
```

</details>
