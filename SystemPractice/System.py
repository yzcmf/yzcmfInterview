'''
(webcrawler; twitter; onlineOrderSystem; ... )
(MessageQueue; RateLimiter; ...)

### ✅ 1. 消息队列（Message Queue）系统设计图：Producer → Queue → Consumer 架构

# 概念图（可视化思维导图，面试可快速画出）
# [Producer] --> [Broker: Queue/Topic] --> [Consumer]
#                ↑ Storage + Retry + DLQ + Ordering
#                ↓ Scale out: Partitioned + Distributed

# 架构核心组件：
- **Producer**：发送消息到 Broker，可带重试机制，ACK 控制
- **Broker**（MQ中间件）：存储、转发消息的核心组件（如 Kafka、RabbitMQ）
  - 支持 **Partition（分区）** 实现水平扩展（scale-out）
  - 支持 **Message ordering**（单分区保证顺序）
  - 支持 **Durability / Replication**
  - 支持 **Retry / Dead Letter Queue (DLQ)**
  - 支持 **At least once / Exactly once** delivery 语义
- **Consumer**：消费消息（Pull/Push 模式），支持并发处理
  - 支持 **Offset tracking / Commit**
  - 可使用 **consumer group** 提升并发度


---

### ✅ 2. 三题 System Design 解答

#### 🧱 Design a Message Queue
- 可参考上面图（Kafka 模型）
- 关键点：分布式、高可用、顺序、重试、幂等性、存储压缩（log compaction）
- 延伸点：如何做流控（rate limit）、如何做延迟消息（delay queue）

#### 🏢 Design URL Shortener（bit.ly）
- 输入长链接，返回短链
- Core:
  - Hashing（MD5/Base62）
  - DB mapping: shortKey -> longURL
  - Cache 层（Redis）加速热链接
  - API: Create, Expand, Metrics
  - 高可用存储（NoSQL + Cache）
  - 数据归档/清理机制（TTL）

#### 👥 Design Rate Limiter（限流器）
- 经典解法：
  - Token Bucket（漏桶）
  - Sliding Window Counter
- 技术实现：
  - Redis + Lua 原子操作实现计数器
  - nginx ingress 限流
  - Kafka 消费速率控制
- 延伸问题：
  - 如何 per-user/per-IP 限流？
  - 限流异常如何告警？


'''
