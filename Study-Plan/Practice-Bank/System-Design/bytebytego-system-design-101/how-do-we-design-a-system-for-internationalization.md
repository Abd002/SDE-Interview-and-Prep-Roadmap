# ByteByteGo System Design 101: How to Design a System for Internationalization

> Copied from <https://github.com/ByteByteGoHq/system-design-101> (CC BY-NC-ND 4.0, by ByteByteGo). Questions and answers are the source's own; nothing was answered or rewritten here.


![](images/0235-internationalization.webp)

The diagram below shows how we can internationalize a simple e-commerce website.

Different countries have differing cultures, values, and habits. When we design an application for international markets, we need to localize the application in several ways:

## Language

*   Extract and maintain all texts in a separate system. For example:

    *   We shouldn’t put any prompts in the source code.
    *   We should avoid string concatenation in the code.
    *   We should remove text from graphics.

*   Use complete sentences and avoid dynamic text elements.
*   Display business data such as currencies in different languages.

## Layout

*   Describe text length and reserve enough space around the text for different languages.
*   Plan for line wrap and truncation.
*   Keep text labels short on buttons.
*   Adjust the display for numerals, dates, timestamps, and addresses.

## Time zone

The time display should be segregated from timestamp storage.

Common practice is to use the UTC (Coordinated Universal Time) timestamp for the database and backend services and to use the local time zone for the frontend display.

## Currency

We need to define the displayed currencies and settlement currency. We also need to design a foreign exchange service for quoting prices.

## Company entity and accounting

Since we need to set up different entities for individual countries, and these entities follow different regulations and accounting standards, the system needs to support multiple bookkeeping methods. Company-level treasury management is often needed. We also need to extract business logic to account for different usage habits in different countries or regions.
