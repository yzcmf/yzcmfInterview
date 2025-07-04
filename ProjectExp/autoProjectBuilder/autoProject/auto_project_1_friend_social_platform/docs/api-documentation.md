# 社交平台 API 文档

## 📋 概述

本文档描述了社交平台的后端API接口，包括认证、用户管理、匹配系统和聊天功能。

**基础URL**: `http://localhost:8000`

**API版本**: `v1`

## 🔐 认证

所有需要认证的API都需要在请求头中包含JWT token：

```
Authorization: Bearer <your-jwt-token>
```

## 📊 响应格式

所有API响应都遵循以下格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

错误响应：

```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔑 认证 API

### 用户注册

**POST** `/api/auth/register`

注册新用户账户。

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "firstName": "John",
  "lastName": "Doe",
  "birthDate": "1990-01-01",
  "gender": "male"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  },
  "message": "注册成功"
}
```

### 用户登录

**POST** `/api/auth/login`

用户登录获取访问令牌。

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "username"
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  },
  "message": "登录成功"
}
```

### 刷新令牌

**POST** `/api/auth/refresh`

使用刷新令牌获取新的访问令牌。

**请求体**:
```json
{
  "refreshToken": "refresh-token"
}
```

### 用户登出

**POST** `/api/auth/logout`

用户登出，使当前令牌失效。

**请求头**: `Authorization: Bearer <token>`

---

## 👤 用户管理 API

### 获取用户资料

**GET** `/api/users/profile`

获取当前用户的详细资料。

**请求头**: `Authorization: Bearer <token>`

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "username": "username",
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Hello world!",
      "avatar": "https://example.com/avatar.jpg",
      "location": "New York",
      "birthDate": "1990-01-01",
      "gender": "male",
      "interests": ["music", "travel", "sports"],
      "preferences": {
        "ageRange": {"min": 25, "max": 35},
        "distance": 50,
        "genderPreference": ["female"]
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### 更新用户资料

**PUT** `/api/users/profile`

更新当前用户的资料。

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Hello world!",
  "location": "New York",
  "birthDate": "1990-01-01",
  "gender": "male",
  "interests": ["music", "travel", "sports"]
}
```

### 上传头像

**POST** `/api/users/avatar`

上传用户头像。

**请求头**: `Authorization: Bearer <token>`

**请求体**: `multipart/form-data`
- `avatar`: 图片文件 (JPG, PNG, max 5MB)

### 获取用户列表

**GET** `/api/users/discover`

获取推荐用户列表（用于匹配）。

**请求头**: `Authorization: Bearer <token>`

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `distance`: 距离范围 (km)
- `ageMin`: 最小年龄
- `ageMax`: 最大年龄

**响应**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-id",
        "username": "username",
        "firstName": "Jane",
        "lastName": "Doe",
        "bio": "Hello!",
        "avatar": "https://example.com/avatar.jpg",
        "age": 25,
        "location": "New York",
        "distance": 5.2,
        "interests": ["music", "travel"],
        "compatibilityScore": 0.85
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### 获取用户详情

**GET** `/api/users/:userId`

获取指定用户的详细信息。

**请求头**: `Authorization: Bearer <token>`

### 更新用户偏好

**PUT** `/api/users/preferences`

更新用户的匹配偏好设置。

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
  "ageRange": {
    "min": 25,
    "max": 35
  },
  "distance": 50,
  "interests": ["music", "travel", "sports"],
  "genderPreference": ["female"]
}
```

---

## 💕 匹配系统 API

### 获取推荐用户

**GET** `/api/matches/suggestions`

获取AI推荐的用户列表。

**请求头**: `Authorization: Bearer <token>`

**查询参数**:
- `limit`: 推荐数量 (默认: 10)

**响应**:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "user": {
          "id": "user-id",
          "username": "username",
          "firstName": "Jane",
          "lastName": "Doe",
          "bio": "Hello!",
          "avatar": "https://example.com/avatar.jpg",
          "age": 25,
          "location": "New York",
          "interests": ["music", "travel"]
        },
        "compatibilityScore": 0.85,
        "matchReasons": ["共同兴趣", "年龄匹配", "地理位置接近"]
      }
    ]
  }
}
```

### 喜欢用户

**POST** `/api/matches/like`

对用户表示喜欢。

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
  "targetUserId": "target-user-id"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "isMatch": true,
    "match": {
      "id": "match-id",
      "users": ["user-id", "target-user-id"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "匹配成功！"
}
```

### 跳过用户

**POST** `/api/matches/pass`

跳过用户。

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
  "targetUserId": "target-user-id"
}
```

### 获取匹配列表

**GET** `/api/matches`

获取当前用户的所有匹配。

**请求头**: `Authorization: Bearer <token>`

**响应**:
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "match-id",
        "user": {
          "id": "user-id",
          "username": "username",
          "firstName": "Jane",
          "lastName": "Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "matchedAt": "2024-01-01T00:00:00.000Z",
        "lastMessage": {
          "content": "Hello!",
          "timestamp": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

---

## 💬 聊天 API

### 获取对话列表

**GET** `/api/chat/conversations`

获取用户的所有对话。

**请求头**: `Authorization: Bearer <token>`

**响应**:
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conversation-id",
        "matchId": "match-id",
        "user": {
          "id": "user-id",
          "username": "username",
          "firstName": "Jane",
          "lastName": "Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "lastMessage": {
          "content": "Hello!",
          "timestamp": "2024-01-01T00:00:00.000Z",
          "senderId": "user-id"
        },
        "unreadCount": 2
      }
    ]
  }
}
```

### 获取消息历史

**GET** `/api/chat/messages/:conversationId`

获取指定对话的消息历史。

**请求头**: `Authorization: Bearer <token>`

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 50)

**响应**:
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "message-id",
        "content": "Hello!",
        "senderId": "user-id",
        "receiverId": "target-user-id",
        "timestamp": "2024-01-01T00:00:00.000Z",
        "isRead": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "pages": 2
    }
  }
}
```

### 发送消息

**POST** `/api/chat/messages`

发送新消息。

**请求头**: `Authorization: Bearer <token>`

**请求体**:
```json
{
  "conversationId": "conversation-id",
  "content": "Hello!",
  "receiverId": "target-user-id"
}
```

### 标记消息为已读

**PUT** `/api/chat/messages/:conversationId/read`

标记对话中的所有消息为已读。

**请求头**: `Authorization: Bearer <token>`

---

## 📊 数据分析 API

### 获取用户统计

**GET** `/api/analytics/user-stats`

获取当前用户的统计数据。

**请求头**: `Authorization: Bearer <token>`

**响应**:
```json
{
  "success": true,
  "data": {
    "profileViews": 150,
    "likesReceived": 45,
    "matches": 12,
    "messagesSent": 89,
    "messagesReceived": 76,
    "responseRate": 0.85,
    "avgResponseTime": 2.5
  }
}
```

### 获取匹配统计

**GET** `/api/analytics/match-stats`

获取匹配相关的统计数据。

**请求头**: `Authorization: Bearer <token>`

**响应**:
```json
{
  "success": true,
  "data": {
    "totalLikes": 150,
    "totalPasses": 300,
    "totalMatches": 25,
    "matchRate": 0.17,
    "avgCompatibilityScore": 0.72
  }
}
```

---

## 🔌 WebSocket 事件

### 连接

连接到WebSocket服务器：

```javascript
const socket = io('ws://localhost:8002', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### 事件列表

#### 客户端发送事件

**加入用户房间**
```javascript
socket.emit('join', userId);
```

**发送消息**
```javascript
socket.emit('send_message', {
  conversationId: 'conversation-id',
  content: 'Hello!',
  receiverId: 'target-user-id'
});
```

**用户在线状态**
```javascript
socket.emit('user_online', userId);
```

#### 服务器发送事件

**接收消息**
```javascript
socket.on('receive_message', (message) => {
  console.log('收到新消息:', message);
});
```

**用户状态变化**
```javascript
socket.on('user_status_change', (data) => {
  console.log('用户状态变化:', data);
});
```

**匹配通知**
```javascript
socket.on('new_match', (match) => {
  console.log('新匹配:', match);
});
```

---

## 🚨 错误代码

| 代码 | 描述 |
|------|------|
| `AUTH_REQUIRED` | 需要认证 |
| `INVALID_TOKEN` | 无效的令牌 |
| `USER_NOT_FOUND` | 用户不存在 |
| `EMAIL_EXISTS` | 邮箱已存在 |
| `INVALID_CREDENTIALS` | 无效的凭据 |
| `RATE_LIMIT_EXCEEDED` | 请求频率超限 |
| `VALIDATION_ERROR` | 数据验证错误 |
| `INTERNAL_ERROR` | 内部服务器错误 |

---

## 📝 使用示例

### JavaScript/TypeScript

```javascript
// 用户登录
const login = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  return data;
};

// 获取用户资料
const getProfile = async (token) => {
  const response = await fetch('http://localhost:8000/api/users/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  return data;
};

// 喜欢用户
const likeUser = async (token, targetUserId) => {
  const response = await fetch('http://localhost:8000/api/matches/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ targetUserId }),
  });
  
  const data = await response.json();
  return data;
};
```

### cURL

```bash
# 用户登录
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 获取用户资料
curl -X GET http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer your-jwt-token"

# 喜欢用户
curl -X POST http://localhost:8000/api/matches/like \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"targetUserId":"target-user-id"}'
```

---

*最后更新时间: 2024年12月* 