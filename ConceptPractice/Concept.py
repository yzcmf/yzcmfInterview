# Concept for an interview
'''

### ✅ Redis / MySQL / HTTPS 八股速查表

#### 🔴 Redis 八股
- 五种数据结构：String / List / Set / ZSet / Hash
- 分布式实现：主从复制（RDB+AOF）+ Sentinel 高可用 + Cluster 分片
- 常考命令：SETEX / INCR / HGETALL / ZRANGE / EXPIRE
- 缓存击穿：加锁 / 本地缓存
- 缓存穿透：Bloom Filter
- 缓存雪崩：过期时间加随机值 / 限流

#### 🔵 MySQL 八股
- 事务四特性：ACID（原子性、一致性、隔离性、持久性）
- 索引结构：B+ 树，聚簇索引 vs 非聚簇
- 常用引擎：InnoDB（支持事务），MyISAM
- 主从复制：异步复制 / 半同步 / GTID
- 慢查询优化：EXPLAIN / 覆盖索引 / 索引下推
- 锁机制：行锁 / 表锁 / MVCC

#### 🔐 HTTPS 八股
- 工作流程：TLS handshake + 加密通信
- 对称 + 非对称加密 + 数字证书（CA）
- 常用算法：RSA（握手），AES（数据传输），SHA（摘要）
- 前向保密：Diffie-Hellman + Ephemeral Key
- 如何防中间人攻击：证书链 + 验证 + SNI

| 面试问题                    | 可能期待回答的重点                                                                                      |
| ---------------------     | ---------------------------------------------------------------------------------------------- |
| HTTP 协议包含哪些？         | HTTP/1.1 vs HTTP/2、GET/POST/PUT/DELETE、Header、Body、状态码、Keep-Alive、Connection、Content-Type、缓存机制 |
| MQ vs 直接 API 调用       | 异步解耦、流量削峰、失败重试、幂等性保障 vs 延迟、复杂性；MQ 适用于高并发 / 服务解耦场景                                              |
| SQL index / logic key   | B+ 树、覆盖索引、主键唯一性、逻辑主键 vs 自增主键；复合索引顺序问题、最左前缀                                                     |
| Java 优势               | 跨平台 JVM、大量开源库、内存管理（GC）、多线程并发模型（synchronized, volatile）、大厂 Infra/分布式项目主力语言之一                    |


| 项目问题  | 技术解决方案                  |
| ----- | ----------------------- |
| 缓存穿透  | 使用布隆过滤器提前过滤不存在请求        |
| 缓存雪崩  | 增加过期时间随机值、热点预加载         |
| 数据不一致 | 引入 MQ + 消息幂等保障、事务消息     |
| 写入慢   | 用 Kafka 异步写入，后续落盘聚合处理   |
| 表爆炸   | 做分表分库 + Range + Hash 策略 |
| 接口延迟高 | 使用并发批量接口 + 限流保护         |
| 内存溢出  | 排查 GC Logs + 对象逃逸分析     |

'''