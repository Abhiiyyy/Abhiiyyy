![Abhishek Kumar — Java and Spring Boot backend engineering](assets/header.svg)

# Hi, I'm Abhishek Kumar

**Systems Architect at Pega Systems India · Java & Spring Boot · Bengaluru, India**

I focus on backend engineering: APIs, data ingestion, and the reliability work that keeps a service understandable when something fails.

[Project walkthrough](docs/api-ingestion-service.md) · [Technical overview](docs/api-ingestion-service.md#architecture) · [GitHub profile](https://github.com/Abhiiyyy)

<details>
<summary><strong>The 30-second overview</strong></summary>

- **Direction:** Java / Spring Boot backend roles, building on my enterprise application experience.
- **Featured work:** a personal API ingestion service with background jobs, retries, request idempotency, scheduling, and an operations dashboard.
- **Engineering depth:** PostgreSQL persistence, transactional Kafka delivery, Redis caching, Docker, and automated verification.
- **Start here:** the [project walkthrough](docs/api-ingestion-service.md) explains the problem, design decisions, verification, and current boundaries.

</details>

## Featured project

### API ingestion service

A Spring Boot service that imports product data from two external APIs, normalizes it, and stores it for paginated reads. Its dashboard makes import progress, retry waits, saved jobs, event delivery, and cache behavior visible.

| Engineering question | What the project implements |
| --- | --- |
| What if an upstream API fails or rate-limits requests? | Bounded retries, exponential backoff with jitter, and `Retry-After` handling. |
| What if a client resends an import? | User-scoped idempotency keys; changed settings with the same key return a conflict. |
| What if dependencies become unavailable? | A persisted Kafka outbox retains events; Redis failures fall back to database reads. |
| What survives a restart? | PostgreSQL stores products and jobs; Docker checks verify persistence after container recreation. |

**Stack:** Java 21 · Spring Boot · Spring Security · Spring Data JPA · PostgreSQL · Flyway · Kafka · Redis · Docker · JUnit · Testcontainers

**[Read the case study →](docs/api-ingestion-service.md)**

The source repository is currently private. This public walkthrough explains the project without requiring repository access or a running demo.

## Working toolkit

| Area | Technologies |
| --- | --- |
| Languages | Java, Python |
| Backend | Spring Boot, Spring Security, REST APIs, Spring Data JPA |
| Data & messaging | PostgreSQL, Flyway, Kafka, Redis |
| Verification & delivery | JUnit, Testcontainers, Docker Compose, GitHub Actions |

<details>
<summary><strong>What I'm developing next</strong></summary>

My backend project roadmap includes production identity and TLS, distributed worker coordination, request budgets, record retention, and dead-letter replay. These are future work rather than claims of completed features.

</details>

---

The walkthrough is stored with this profile, so it stays readable even when the demo is offline. [Profile checks](https://github.com/Abhiiyyy/Abhiiyyy/actions/workflows/profile-health.yml) verify local links and public destinations. [Maintenance notes](docs/maintenance.md) explain how to keep it current.
