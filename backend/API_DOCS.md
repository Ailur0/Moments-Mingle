# Moments-Mingle Backend API Documentation

Base URL: `http://localhost:4000`

## Endpoints

### Auth
- **POST** `/api/signup`
  - Body: `{ email: string, password: string, name: string }`
  - Response: `{ email: string, name: string }`

- **POST** `/api/login`
  - Body: `{ email: string, password: string }`
  - Response: `{ email: string, name: string }`

### Memories
- **GET** `/api/memories`
  - Query: Any field of Memory (see below)
  - Response: `Memory[]`
- **POST** `/api/memories`
  - Body: `Memory`
  - Response: `{ insertedId }`
- **PUT** `/api/memories/:id`
  - Body: Partial<Memory>
  - Response: Update result
- **DELETE** `/api/memories/:id`
  - Response: Delete result

### Memory Jars
- **GET** `/api/memoryjars`
  - Query: Any field of MemoryJar
  - Response: `MemoryJar[]`
- **POST** `/api/memoryjars`
  - Body: `MemoryJar`
  - Response: `{ insertedId }`
- **PUT** `/api/memoryjars/:id`
  - Body: Partial<MemoryJar>
  - Response: Update result
- **DELETE** `/api/memoryjars/:id`
  - Response: Delete result

### Activities
- **GET** `/api/activities`
  - Query: Any field of Activity
  - Response: `Activity[]`
- **POST** `/api/activities`
  - Body: `Activity`
  - Response: `{ insertedId }`
- **PUT** `/api/activities/:id`
  - Body: Partial<Activity>
  - Response: Update result
- **DELETE** `/api/activities/:id`
  - Response: Delete result

### Pairings
- **GET** `/api/pairings`
  - Query: Any field of Pairing
  - Response: `Pairing[]`
- **POST** `/api/pairings`
  - Body: `Pairing`
  - Response: `{ insertedId }`
- **PUT** `/api/pairings/:id`
  - Body: Partial<Pairing>
  - Response: Update result
- **DELETE** `/api/pairings/:id`
  - Response: Delete result

### Profile
- **GET** `/api/profile/:email`
  - Response: `UserProfile`
- **PUT** `/api/profile/:email`
  - Body: Partial<UserProfile>
  - Response: Update result
- **DELETE** `/api/profile/:email`
  - Response: Delete result

---

## Data Models

### Memory
```
{
  _id?: string,
  title: string,
  description: string,
  date: string,
  createdBy: string,
  createdAt?: string
}
```

### MemoryJar
```
{
  _id?: string,
  title: string,
  description: string,
  date: string,
  createdBy: string,
  createdAt?: string
}
```

### Activity
```
{
  _id?: string,
  title: string,
  description: string,
  date: string,
  createdBy: string,
  createdAt?: string
}
```

### Pairing
```
{
  _id?: string,
  user1: string,
  user2: string,
  status: string,
  createdAt?: string
}
```

### UserProfile
```
{
  _id?: string,
  email: string,
  name: string,
  bio?: string,
  avatarUrl?: string,
  createdAt?: string
}
```

---

## Error Handling
- All error responses will be in the form: `{ error: string }`

---

## Notes
- All endpoints are unauthenticated for now.
- For production, add authentication and request validation.
