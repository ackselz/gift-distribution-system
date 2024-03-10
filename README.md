# Gift Redemption System

## Get Started

### Prerequisites:

- Node.js (version 21.3.0 or later)
- pnpm (version 8.15.4 or later)

### Installation

1. ```bash
   git clone https://github.com/ackselz/gift-redemption-system.git
   ```
2. ```bash
   cd gift-redemption-system
   ```
3. ```bash
   pnpm install
   ```
4. Add your mapping file to the `/src/data` directory
   - The provided `staff-id-to-team-mapping-long.csv` (for `dev`) and `staff-id-to-team-mapping.csv` (for `test`) are loaded by default
   - Rename your desired mapping file to `staff-id-to-team-mapping-long.csv`

### Running the development server:

The development server runs at `localhost:3000`. Please restart the server you make changes to the data files.

```bash
pnpm dev
```

### Views

A simple redemption form is available at `localhost:3000`. An internet connection is required for this interface to function properly (loading styles and scripts via CDN).

### API Reference

#### Staff Lookup

<details>
 <summary><code>GET</code> <code><b>/{staff_pass_id}</b></code> <code>(gets staff details by a staff pass id)</code></summary>

##### Parameters

| name            | type     | data type | description                |
| --------------- | -------- | --------- | -------------------------- |
| `staff_pass_id` | required | string    | The specific staff pass id |

##### Responses

| http code | content-type               | response                      |
| --------- | -------------------------- | ----------------------------- |
| `200`     | `application/json`         | `Staff Object`                |
| `400`     | `text/plain;charset=UTF-8` | `"staff_pass_id is required"` |
| `404`     | `text/plain;charset=UTF-8` | `"Staff not found"`           |
| `500`     | `text/plain;charset=UTF-8` | `"Internal server error"`     |

##### Example cURL

```bash
curl http://localhost:3000/api/staffs/{staff_pass_id}
```

</details>

#### Redeem

<details>
 <summary><code>POST</code> <code><b>/redeem</b></code> <code>(records redemptions)</code></summary>

##### Parameters

| name            | type     | data type | description               |
| --------------- | -------- | --------- | ------------------------- |
| `staff_pass_id` | required | string    | Staff pass id of redeemer |

##### Responses

| http code | content-type               | response                                         |
| --------- | -------------------------- | ------------------------------------------------ |
| `201`     | `text/plain;charset=UTF-8` | `"Redemption successful"`                        |
| `400`     | `text/plain;charset=UTF-8` | `"staff_pass_id is required"`                    |
| `404`     | `text/plain;charset=UTF-8` | `"Staff not found"`                              |
| `409`     | `text/plain;charset=UTF-8` | `"Redemption failed. Team has already redeemed"` |
| `500`     | `text/plain;charset=UTF-8` | `"Internal server error"`                        |

##### Example cURL

```bash
curl -H "Content-Type: application/json" -d '{"staff_pass_id": "{staff_pass_id}"}' http://localhost:3000/api/redeem
```

</details>

### Running unit tests:

The tests uses the short version of the provided mapping file `staff-id-to-team-mapping.csv`.

```bash
pnpm test
```

## Assumptions

Some assumptions I have made about the task:

- Each staff pass is a unique ID (given)
- Staff who do not appear on the mapping file are not eligible for redemption
- No data anomalies in the mapping data (`staff-id-to-team-mapping-long.csv` and `staff-id-to-team-mapping-long.csv`)
  - The system does not provide explicit handling of data anomalies
  - Errors are thrown in the dev console to assist in debugging
- There is no requirement to add staff to the mapping file
  - if there is, the original mapping file can be edited directly

Just trying to cover all bases here:

- The user knows how to set up the system
  - The system, as is, is only available through hosting a local development server
- Only a single user interacts with the system at a time

## Design Decisions

> It's the Christmas season and you've been given the honorable task of distributing gifts to the teams in your department. Each team can send any representative to redeem their teams' gift.

I approached this assignment from the perspective of building a simple system that prioritises the following characteristics:

- plug and play
  - drop the `.csv` files in and start using
- local, persistent, portable data
  - Changes are immediately reflected in local CSV files
  - CSV files are inherently portable, ensuring easy transfer if needed
- extensability (in terms of interfacing/interacting with the system)
  - exposing a simple REST API allows for options such as
    - a web interface
    - an API client (Postman, etc.)
    - cURL from a command-line interface
- fast enough
  - continuously deserializing and serializing CSV data is not the most performant
  - the static data is loaded into memory on initialization

Admittedly, if the context demanded a system with greater scalability, a SQL database with an ORM would be the better solution to manage data. However, as the gift distribution appears to be a one-time event within my department (of just 5000 staff members), a local data store should be sufficient. It avoids the overhead of setting up and managing a database server.

Nevertheless, the system was designed such that the core data mutations live inside the controllers: `redemptionController` and `staffController`, facilitating easy code changes should a proper database be required.

## Tech Stack

- Frontend
  - HTMX
  - TailwindCSS
- Backend
  - Node.js
  - Express.js
  - node-csv
- Tooling
  - TypeScript
  - Prettier
  - ESLint
