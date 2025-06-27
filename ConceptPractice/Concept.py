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



'''