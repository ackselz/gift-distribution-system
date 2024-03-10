# Gift Redemption System

## Get Started

### Prerequisites:

- Node.js (version 20.11.0 or later)
- pnpm (version X or later)

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
   - The provided `staff-id-to-team-mapping-long.csv` and `staff-id-to-team-mapping.csv` are loaded by default
   - Rename your desired mapping file to `staff-id-to-team-mapping-long.csv`

### Running the development server:

The development server runs at `localhost:3000`

```bash
pnpm dev
```

### Views

A simple redemption form is available at `localhost:3000`

### API Reference

#### Staff Lookup

<details>
 <summary><code>GET</code> <code><b>/{staff_pass_id}</b></code> <code>(gets staff details by a staff pass id)</code></summary>

##### Parameters

> | name            | type     | data type | description                |
> | --------------- | -------- | --------- | -------------------------- |
> | `staff_pass_id` | required | string    | The specific staff pass id |

##### Responses

> | http code | content-type               | response                                 |
> | --------- | -------------------------- | ---------------------------------------- |
> | `201`     | `text/plain;charset=UTF-8` | `Configuration created successfully`     |
> | `400`     | `application/json`         | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8`  | None                                     |

##### Example cURL

> ```bash
>  curl http://localhost:3000/api/staffs/{staff_pass_id}
> ```

</details>

#### Redeem

<details>
 <summary><code>POST</code> <code><b>/redeem</b></code> <code>(records redemptions)</code></summary>

##### Parameters

> | name            | type     | data type | description               |
> | --------------- | -------- | --------- | ------------------------- |
> | `staff_pass_id` | required | string    | Staff pass id of redeemer |

##### Responses

> | http code | content-type               | response                                 |
> | --------- | -------------------------- | ---------------------------------------- |
> | `201`     | `text/plain;charset=UTF-8` | `Configuration created successfully`     |
> | `400`     | `application/json`         | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8`  | None                                     |

##### Example cURL

> ```bash
> curl -H "Content-Type: application/json" -d '{"staff_pass_id": "{staff_pass_id}"}' http://localhost:3000/api/redeem
> ```

</details>

### Running unit tests:

```bash
pnpm test
```

## Assumptions

- Each staff pass is a unique ID (given)
- No data anomalies in the mapping data (`staff-id-to-team-mapping-long.csv` and `staff-id-to-team-mapping-long.csv`)
  - The system does not provide explicit handling of data anomalies
  - Errors will be thrown in the dev console
- Only a single user interacts with the system at a time
-

## Design Decisions

> It's the Christmas season and you've been given the honorable task of distributing gifts to the teams in your department. Each team can send any representative to redeem their teams' gift.

I approached this assignment from the perspective of building a simple system that prioritises:

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

Admittedly, if the context demanded a system with greater scalability, a SQL database with an ORM would be the better solution to manage data. However, as the gift distribution appears to be a one-time event within my department (of just 5000 staff members), a local data store should be sufficient. It avoids the overhead of setting up and managing a database server. Nevertheless, the system was designed such that the core data mutations live inside the controllers: `redemptionController` and `staffController`, allowing for easy adaptability should a proper database be required.

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
