## Getting Started

Before running the development server, make sure you have the following prerequisites installed:

1. Node.js (v18.17.0 or higher)
2. npm (v9.0.0 or higher) or Yarn (v1.22.0 or higher)

Then follow these steps:

1. Clone this repository
2. Navigate to the project directory:
   ```bash
   cd hut8-takehome-frontend
   ```
3. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

To run the development server:

```bash
npm run dev
# or
yarn dev
```

## UI Design Approach

### Key Decisions
1. **Clarity & Ease-of-use**
   - Clarity and ease of use is paramount for a tool like this. I tried to keep it as simple and straightforward as possible.
   - The Minerset example site has a very confusing UI, while the Crypto Buddy site is functional but utilitarian (to put it kindly). Having plain text with an easy-to-parse layout in the results panel makes it quickly understandable for users.
   - If we were to include more features in future iterations, keeping this UI clear and uncrowded would be a key focus and potential challenge.

2. **Additional Useful Information**
   - Bitcoin price updates - used the CoinGecko API to get the current Bitcoin price every 2 minutes. This is an important reference point for the user as they consider their costs and profitability.
   - Added a historical price chart for Bitcoin (also using the CoinGecko API) in order for the user to get a quick idea as to the performance of BTC over the last month. Gives a quick reference as to whether the current price is high or low, an important factor for ongoing profitability expectations.

3. **Other UI considerations**
   - Added a bit of styling to bring the app in line with Hut8's design language.
   - Added dark mode (that's mostly just for fun, but also because I talked about it with Hunter earlier this week :)
   - Theme choice persists with local storage
   - Calculate Profitability button is throttled, so it won't make another API call unless 15 seconds has passed OR the user has changed values in the form