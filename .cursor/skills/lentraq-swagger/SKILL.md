---
name: lentraq-swagger
description: >-
  LenTraq-style OpenAPI docs with darkaonline/l5-swagger: PHP 8 attributes in
  app/Swagger/ (not on controllers), one operation per file, bearerAuth Sanctum,
  schemas under Schemas/. Use when adding or changing API endpoints, writing
  Swagger/OpenAPI docs, or running l5-swagger:generate.
---

# LenTraq Swagger (l5-swagger)

## Stack

| Item | Detail |
|------|--------|
| Package | `darkaonline/l5-swagger` |
| Annotations | PHP 8 attributes only (`use OpenApi\Attributes as OA;`) |
| Scan path | `app/Swagger` only (never controllers) |
| UI | `GET /docs` |
| Generate | `php artisan l5-swagger:generate` |

Do **not** put `@OA\` PHPDoc or `OA\` attributes on controllers.

## Layout

```
app/Swagger/
  ApiDocs.php              # OA\Info
  Security.php             # OA\SecurityScheme bearerAuth
  Schemas/
    User.php               # OA\Schema
  Endpoints/
    System/Health.php
    Authentications/Login.php
    Users/ListUsers.php
```

One file ≈ one operation. Name files by action (`Login.php`, `CreateUser.php`).

## Conventions

1. Paths include the full prefix: `/api/v1/...`
2. Set `summary`, optional `description`, and domain `tags`
3. Protected routes: `security: [['bearerAuth' => []]]`
4. Request bodies via `OA\RequestBody` + `OA\JsonContent`
5. Explicit `responses` for success and expected errors (401, 404, 422, …)
6. Reuse schemas with `ref: '#/components/schemas/User'`
7. After adding/changing docs: run `php artisan l5-swagger:generate`

## Checklist (new endpoint)

1. Invokable controller + FormRequest + route
2. OpenAPI class under `app/Swagger/Endpoints/{Domain}/`
3. Schema under `app/Swagger/Schemas/` if a new response shape is needed
4. `php artisan l5-swagger:generate`

## Examples

**Info + security:**

```php
#[OA\Info(version: '1.0.0', title: 'Koda Ops Assessment API', description: '...')]
class ApiDocs {}

#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    description: 'Enter your Sanctum token in the format: Bearer {token}'
)]
class Security {}
```

**Public login:**

```php
#[OA\Post(
    path: '/api/v1/login',
    summary: 'User login',
    tags: ['Authentication'],
    requestBody: new OA\RequestBody(/* email, password */),
    responses: [/* 200, 401, 422 */]
)]
class Login {}
```

**Protected endpoint:**

```php
#[OA\Get(
    path: '/api/v1/me',
    tags: ['Authentication'],
    security: [['bearerAuth' => []]],
    responses: [/* 200, 401 */]
)]
class Me {}
```
