import type { HttpMethod } from "~/lib/utils";

export interface Param {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface CodeExample {
  label: string;
  lang: "bash" | "javascript" | "json";
  code: string;
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  title: string;
  description: string;
  auth: boolean;
  pathParams?: Param[];
  queryParams?: Param[];
  bodyParams?: Param[];
  examples: CodeExample[];
  responses: {
    success: { status: number; description: string; body: object };
    errors: { status: number; description: string }[];
  };
}

const BASE = "http://localhost:3000";

// ─── Authentication ───────────────────────────────────────────────────────────

export const authEndpoints: ApiEndpoint[] = [
  {
    id: "register",
    method: "POST",
    path: "/api/auth/register",
    title: "Register",
    description:
      "Create a new user account. Returns an access token in both the response body and as an HttpOnly cookie. No prior authentication required.",
    auth: false,
    bodyParams: [
      { name: "name", type: "string", required: true, description: "Full display name.", example: "Jane Doe" },
      { name: "email", type: "string", required: true, description: "Unique email address.", example: "jane@example.com" },
      { name: "password", type: "string", required: true, description: "Minimum 8 characters.", example: "s3cret!23" },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request POST \\
  --url '${BASE}/api/auth/register' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "s3cret!23"
  }'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 's3cret!23',
  }),
});
const data = await res.json();`,
      },
    ],
    responses: {
      success: {
        status: 201,
        description: "User created",
        body: {
          success: true,
          message: "Registration successful",
          result: {
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…",
            user: {
              _id: "6650a1b2c3d4e5f607a8b9c0",
              name: "Jane Doe",
              email: "jane@example.com",
              avatar: "https://www.gravatar.com/avatar/abc123?d=identicon",
              role: "user",
              createdAt: "2025-01-15T10:30:00.000Z",
            },
          },
        },
      },
      errors: [
        { status: 400, description: "Missing required fields (name, email, or password)." },
        { status: 409, description: "An account with this email already exists." },
      ],
    },
  },
  {
    id: "login",
    method: "POST",
    path: "/api/auth/login",
    title: "Login",
    description:
      "Authenticate with email and password. Returns a short-lived access token (30 min) in the response body and sets it as an HttpOnly cookie.",
    auth: false,
    bodyParams: [
      { name: "email", type: "string", required: true, description: "Registered email address." },
      { name: "password", type: "string", required: true, description: "Account password." },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request POST \\
  --url '${BASE}/api/auth/login' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "email": "jane@example.com",
    "password": "s3cret!23"
  }'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'jane@example.com',
    password: 's3cret!23',
  }),
});
const { result } = await res.json();
const token = result.accessToken;`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "Authenticated",
        body: {
          success: true,
          message: "Login successful",
          result: {
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…",
            user: {
              _id: "6650a1b2c3d4e5f607a8b9c0",
              name: "Jane Doe",
              email: "jane@example.com",
              avatar: "https://www.gravatar.com/avatar/abc123?d=identicon",
              role: "user",
            },
          },
        },
      },
      errors: [
        { status: 400, description: "Email or password missing from request body." },
        { status: 401, description: "Invalid email or password combination." },
      ],
    },
  },
  {
    id: "logout",
    method: "POST",
    path: "/api/auth/logout",
    title: "Logout",
    description:
      "Invalidate the current access token by adding it to a server-side blacklist. Clears the accessToken cookie. The token is auto-removed from the blacklist once it expires.",
    auth: true,
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request POST \\
  --url '${BASE}/api/auth/logout' \\
  --header 'Authorization: Bearer <token>'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `await fetch('${BASE}/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Authorization': 'Bearer ' + token },
});`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "Token blacklisted",
        body: { success: true, message: "Logout successful" },
      },
      errors: [
        { status: 401, description: "No valid token provided." },
      ],
    },
  },
  {
    id: "get-profile",
    method: "GET",
    path: "/api/users/profile",
    title: "Get Profile",
    description: "Retrieve the authenticated user's profile. Password is never included in the response.",
    auth: true,
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request GET \\
  --url '${BASE}/api/users/profile' \\
  --header 'Authorization: Bearer <token>'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/users/profile', {
  credentials: 'include',
  headers: { 'Authorization': 'Bearer ' + token },
});
const { result } = await res.json();`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "User profile",
        body: {
          success: true,
          message: "Profile retrieved successfully",
          result: {
            _id: "6650a1b2c3d4e5f607a8b9c0",
            name: "Jane Doe",
            email: "jane@example.com",
            avatar: "https://www.gravatar.com/avatar/abc123?d=identicon",
            role: "user",
            createdAt: "2025-01-15T10:30:00.000Z",
            updatedAt: "2025-01-15T10:30:00.000Z",
          },
        },
      },
      errors: [
        { status: 401, description: "Missing or expired access token." },
        { status: 404, description: "User account no longer exists." },
      ],
    },
  },
  {
    id: "update-profile",
    method: "PATCH",
    path: "/api/users/profile",
    title: "Update Profile",
    description: "Update one or more profile fields. Only include fields you want to change — all fields are optional.",
    auth: true,
    bodyParams: [
      { name: "name", type: "string", required: false, description: "New display name.", example: "Jane Smith" },
      { name: "avatar", type: "string", required: false, description: "URL to a profile picture." },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request PATCH \\
  --url '${BASE}/api/users/profile' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '{"name": "Jane Smith"}'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/users/profile', {
  method: 'PATCH',
  credentials: 'include',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'Jane Smith' }),
});`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "Updated profile",
        body: {
          success: true,
          message: "Profile updated successfully",
          result: {
            _id: "6650a1b2c3d4e5f607a8b9c0",
            name: "Jane Smith",
            email: "jane@example.com",
            avatar: "https://www.gravatar.com/avatar/abc123?d=identicon",
            role: "user",
          },
        },
      },
      errors: [
        { status: 401, description: "Missing or expired access token." },
        { status: 404, description: "User account no longer exists." },
      ],
    },
  },
];

// ─── Links ────────────────────────────────────────────────────────────────────

export const linksEndpoints: ApiEndpoint[] = [
  {
    id: "list-links",
    method: "GET",
    path: "/api/links",
    title: "List Links",
    description: "Returns all shortened links owned by the authenticated user, sorted by creation date (newest first).",
    auth: true,
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request GET \\
  --url '${BASE}/api/links' \\
  --header 'Authorization: Bearer <token>'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/links', {
  credentials: 'include',
  headers: { 'Authorization': 'Bearer ' + token },
});
const { result } = await res.json(); // result is Link[]`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "Array of links",
        body: {
          success: true,
          message: "Links retrieved successfully",
          result: [
            {
              _id: "6650b2c3d4e5f6a7b8c9d0e1",
              slug: "aBc1234",
              originalUrl: "https://example.com/very/long/path",
              title: "Example Page",
              tags: ["marketing", "q1"],
              isActive: true,
              expiresAt: "2025-02-15T10:30:00.000Z",
              createdAt: "2025-01-15T10:30:00.000Z",
            },
          ],
        },
      },
      errors: [
        { status: 401, description: "Missing or expired access token." },
      ],
    },
  },
  {
    id: "create-link",
    method: "POST",
    path: "/api/links",
    title: "Create Link",
    description:
      "Shorten a URL. A 7-character slug is generated automatically using nanoid. The link is published to analytics and redirect services via RabbitMQ immediately after creation.",
    auth: true,
    bodyParams: [
      { name: "originalUrl", type: "string", required: true, description: "The long URL to shorten.", example: "https://example.com/blog/post-title" },
      { name: "title", type: "string", required: false, description: "Human-readable label for the link." },
      { name: "tags", type: "string[]", required: false, description: "Array of tag strings for organisation.", example: '["campaign","social"]' },
      { name: "expiresAt", type: "ISO 8601", required: false, description: "Expiry datetime. Defaults to 30 days from now." },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request POST \\
  --url '${BASE}/api/links' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "originalUrl": "https://example.com/blog/post-title",
    "title": "Blog Post",
    "tags": ["blog", "seo"]
  }'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/links', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    originalUrl: 'https://example.com/blog/post-title',
    title: 'Blog Post',
    tags: ['blog', 'seo'],
  }),
});
const { result } = await res.json();
console.log('Short URL:', 'http://localhost:3000/' + result.slug);`,
      },
    ],
    responses: {
      success: {
        status: 201,
        description: "Link created",
        body: {
          success: true,
          message: "Link created successfully",
          result: {
            _id: "6650b2c3d4e5f6a7b8c9d0e1",
            slug: "aBc1234",
            user: "6650a1b2c3d4e5f607a8b9c0",
            originalUrl: "https://example.com/blog/post-title",
            title: "Blog Post",
            tags: ["blog", "seo"],
            isActive: true,
            expiresAt: "2025-02-15T10:30:00.000Z",
            createdAt: "2025-01-15T10:30:00.000Z",
          },
        },
      },
      errors: [
        { status: 400, description: "originalUrl is missing or not a valid URL." },
        { status: 401, description: "Missing or expired access token." },
      ],
    },
  },
  {
    id: "get-link",
    method: "GET",
    path: "/api/links/:slug",
    title: "Get Link",
    description: "Retrieve a single link by slug. Only the authenticated owner can access the link.",
    auth: true,
    pathParams: [
      { name: "slug", type: "string", required: true, description: "The 7-character slug identifier.", example: "aBc1234" },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request GET \\
  --url '${BASE}/api/links/aBc1234' \\
  --header 'Authorization: Bearer <token>'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/links/aBc1234', {
  credentials: 'include',
  headers: { 'Authorization': 'Bearer ' + token },
});
const { result } = await res.json();`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "Link object",
        body: {
          success: true,
          message: "Link retrieved successfully",
          result: {
            _id: "6650b2c3d4e5f6a7b8c9d0e1",
            slug: "aBc1234",
            originalUrl: "https://example.com/blog/post-title",
            title: "Blog Post",
            tags: ["blog", "seo"],
            isActive: true,
            expiresAt: "2025-02-15T10:30:00.000Z",
            createdAt: "2025-01-15T10:30:00.000Z",
          },
        },
      },
      errors: [
        { status: 401, description: "Missing or expired access token." },
        { status: 404, description: "No link found with this slug for the authenticated user." },
      ],
    },
  },
  {
    id: "update-link",
    method: "PATCH",
    path: "/api/links/:slug",
    title: "Update Link",
    description: "Update link properties. Only the authenticated owner may update their links. Changes are propagated to the redirect service via RabbitMQ.",
    auth: true,
    pathParams: [
      { name: "slug", type: "string", required: true, description: "The 7-character slug identifier.", example: "aBc1234" },
    ],
    bodyParams: [
      { name: "originalUrl", type: "string", required: false, description: "New destination URL." },
      { name: "title", type: "string", required: false, description: "New title." },
      { name: "tags", type: "string[]", required: false, description: "Replacement tag array." },
      { name: "isActive", type: "boolean", required: false, description: "Set to false to disable the short link without deleting it." },
      { name: "expiresAt", type: "ISO 8601", required: false, description: "New expiry date." },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request PATCH \\
  --url '${BASE}/api/links/aBc1234' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '{"isActive": false}'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/links/aBc1234', {
  method: 'PATCH',
  credentials: 'include',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ isActive: false }),
});`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "Updated link",
        body: {
          success: true,
          message: "Link updated successfully",
          result: {
            slug: "aBc1234",
            originalUrl: "https://example.com/blog/post-title",
            isActive: false,
            updatedAt: "2025-01-16T08:00:00.000Z",
          },
        },
      },
      errors: [
        { status: 401, description: "Missing or expired access token." },
        { status: 404, description: "Link not found or not owned by the authenticated user." },
      ],
    },
  },
  {
    id: "delete-link",
    method: "DELETE",
    path: "/api/links/:slug",
    title: "Delete Link",
    description: "Permanently delete a shortened link. The mapping is removed from the redirect service and stats are purged from the analytics service via RabbitMQ.",
    auth: true,
    pathParams: [
      { name: "slug", type: "string", required: true, description: "The 7-character slug identifier.", example: "aBc1234" },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request DELETE \\
  --url '${BASE}/api/links/aBc1234' \\
  --header 'Authorization: Bearer <token>'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `await fetch('${BASE}/api/links/aBc1234', {
  method: 'DELETE',
  credentials: 'include',
  headers: { 'Authorization': 'Bearer ' + token },
});`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "Deleted",
        body: { success: true, message: "Link deleted successfully" },
      },
      errors: [
        { status: 401, description: "Missing or expired access token." },
        { status: 404, description: "Link not found or not owned by the authenticated user." },
      ],
    },
  },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

export const analyticsEndpoints: ApiEndpoint[] = [
  {
    id: "link-stats",
    method: "GET",
    path: "/api/analytics/:slug",
    title: "Link Stats",
    description:
      "Aggregated statistics for a shortened link — total clicks, daily breakdown, top referrers, top countries, device/browser/OS splits. Stats are updated asynchronously after each redirect.",
    auth: true,
    pathParams: [
      { name: "slug", type: "string", required: true, description: "The slug to retrieve stats for.", example: "aBc1234" },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request GET \\
  --url '${BASE}/api/analytics/aBc1234' \\
  --header 'Authorization: Bearer <token>'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/analytics/aBc1234', {
  credentials: 'include',
  headers: { 'Authorization': 'Bearer ' + token },
});
const { result } = await res.json();`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "Aggregated stats",
        body: {
          success: true,
          result: {
            slug: "aBc1234",
            totalClicks: 1482,
            dailyClicks: [
              { date: "2025-01-14", count: 320 },
              { date: "2025-01-15", count: 410 },
            ],
            topReferrers: [
              { referrer: "twitter.com", count: 620 },
              { referrer: "direct", count: 412 },
            ],
            topCountries: [
              { country: "US", count: 710 },
              { country: "GB", count: 290 },
            ],
            devices: { mobile: 840, desktop: 530, tablet: 112 },
            browsers: { Chrome: 760, Safari: 480, Firefox: 242 },
            operatingSystems: { iOS: 640, Android: 310, Windows: 420 },
            lastUpdated: "2025-01-15T10:30:00.000Z",
          },
        },
      },
      errors: [
        { status: 401, description: "Missing or expired access token." },
        { status: 404, description: "No stats recorded yet for this slug." },
      ],
    },
  },
  {
    id: "click-history",
    method: "GET",
    path: "/api/clicks/:slug",
    title: "Click History",
    description:
      "Returns raw click events for a slug from the time-series collection. Each event captures IP, user-agent, referrer, geo, device, browser and OS enriched at the time of the redirect.",
    auth: true,
    pathParams: [
      { name: "slug", type: "string", required: true, description: "The slug to query clicks for.", example: "aBc1234" },
    ],
    queryParams: [
      { name: "limit", type: "number", required: false, description: "Max records to return (default 50).", example: "100" },
      { name: "skip", type: "number", required: false, description: "Number of records to skip for pagination.", example: "50" },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request GET \\
  --url '${BASE}/api/clicks/aBc1234?limit=10' \\
  --header 'Authorization: Bearer <token>'`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `const res = await fetch('${BASE}/api/clicks/aBc1234?limit=10', {
  credentials: 'include',
  headers: { 'Authorization': 'Bearer ' + token },
});
const { result } = await res.json();`,
      },
    ],
    responses: {
      success: {
        status: 200,
        description: "Click events",
        body: {
          success: true,
          result: {
            clicks: [
              {
                slug: "aBc1234",
                timestamp: "2025-01-15T10:31:42.000Z",
                country: "US",
                city: "New York",
                deviceType: "mobile",
                browser: "Chrome",
                os: "iOS",
                referrer: "twitter.com",
              },
            ],
            count: 1482,
          },
        },
      },
      errors: [
        { status: 401, description: "Missing or expired access token." },
      ],
    },
  },
];

// ─── Redirect ─────────────────────────────────────────────────────────────────

export const redirectEndpoints: ApiEndpoint[] = [
  {
    id: "resolve",
    method: "GET",
    path: "/:slug",
    title: "Resolve Short URL",
    description:
      "The primary URL resolution endpoint. Issues a 301 permanent redirect to the original URL. A click event is published asynchronously to the analytics service via RabbitMQ — the redirect itself is never blocked by analytics. Returns 404 if the slug is unknown or 410 if the link has expired.",
    auth: false,
    pathParams: [
      { name: "slug", type: "string", required: true, description: "The 7-character slug.", example: "aBc1234" },
    ],
    examples: [
      {
        label: "cURL",
        lang: "bash",
        code: `curl --request GET \\
  --url '${BASE}/aBc1234' \\
  --location`,
      },
      {
        label: "JavaScript",
        lang: "javascript",
        code: `// In a browser, simply navigate to the short URL.
// The server issues a 301 redirect to the original URL.
window.location.href = '${BASE}/aBc1234';

// Or to inspect the redirect without following it:
const res = await fetch('${BASE}/aBc1234', { redirect: 'manual' });
const destination = res.headers.get('Location');`,
      },
    ],
    responses: {
      success: {
        status: 301,
        description: "Redirect to original URL",
        body: { location: "https://example.com/blog/post-title" },
      },
      errors: [
        { status: 404, description: "No mapping found for this slug." },
        { status: 410, description: "The link existed but has passed its expiry date." },
      ],
    },
  },
];
