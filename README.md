# Gift Redemption System

## Get Started

### Prerequisites:

- Node.js (version 20.11.0 or later)
- pnpm (version X or later)

### Installation

```bash
git clone https://github.com/ackselz/gift-redemption-system.git
cd gift-redemption-system
pnpm install
```

### Running the development server:

```bash
pnpm dev
```

### Example API Calls

#### Retrieve staff data

```bash
curl http://localhost:3000/api/staffs/BOSS_DNLHLUFFJ7E9
```

#### Redeem a Gift

```bash
curl -H "Content-Type: application/json" -d '{"staff_pass_id": "STAFF_AZ5HS58J5NA6"}' http://localhost:3000/api/redeem
```

## Design Decisions

> It's the Christmas season and you've been given the honorable task of distributing gifts to the teams in your department. Each team can send any representative to redeem their teams' gift.

I approached this assignment from the perspective of building a simple system that prioritises:

- plug and play
  - drop the `.csv` files in and start using
- local, persistent, portable data
  - Changes are immediately reflected in local CSV files
  - CSV files are inherently portable, ensuring easy transfer if needed

Admittedly, if the context demanded a system with greater scalability, a SQL database with an ORM would be the better solution to manage data. However, as the gift distribution appears to be a one-time event within my department (of just 5000 staff members), a local data store should be sufficient. It avoids the overhead of setting up and managing a database server.

Furthermore, as a single user (me) is responsible for managing the gift distribution process, the typical concerns regarding low concurrency with this design can be reasonably neglected. This streamlines the solution and avoids the complexities of handling multiple simultaneous requests.

## Assumptions

- No data anomalies in the mapping data (`staff-id-to-team-mapping-long.csv` and `staff-id-to-team-mapping-long.csv`)
  - The system does not provide explicit handling of data anomalies
  - Errors will be thrown in the dev console
- Each staff pass is a unique ID

## Tech Stack

- Frameworks
  - Node.js
  - Express.js
  - node-csv
- Tooling
- TypeScript
- ESBuild
