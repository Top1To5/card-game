# Database Configuration & Secret Information

**File**: Database Configuration and Connection Details  
**Created**: 2025-07-14  
**Updated**: 2025-07-14 (Team Schema Design Complete)  
**Purpose**: Secure storage of database credentials and comprehensive schema  
**Access Level**: Team Lead and Database Administrator Only

---

## 🔒 Production Database Credentials

### **Hostinger Database Details**
```
Database Name: u451727479_t1t5
Database User: u451727479_kc
Database Password: Top1To5!4295
Database Host: sql*****.hostinger.com (contact Vision for exact host)


### **Column Specifications (Team Approved)**

| Column | Data Type | Constraints | Purpose | Example |
|--------|-----------|-------------|---------|---------|
| **facebookid** | VARCHAR(50) | PRIMARY KEY, NOT NULL | Unique Facebook user identifier | "1234567890123456" |
| **displayname** | VARCHAR(255) | NOT NULL | User's display name from Facebook | "John Doe 🎮" |
| **firstname** | VARCHAR(100) | NOT NULL | User's first name | "John" |
| **lastname** | VARCHAR(100) | NOT NULL | User's last name | "Doe" |
| **email** | VARCHAR(320) | NOT NULL, UNIQUE | User's email (encrypted) | "john.doe@example.com" |
| **profileurl** | TEXT | NULL allowed | Facebook profile picture URL | "https://graph.facebook.com/123/picture?width=200" |
| **created_at** | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time | "2025-07-14 10:30:00" |
| **updated_at** | TIMESTAMP | AUTO UPDATE | Last modification time | "2025-07-14 15:45:00" |
| **last_login** | TIMESTAMP | NULL allowed | Last login timestamp | "2025-07-14 16:20:00" |
| **status** | ENUM | DEFAULT 'active' | Account status | "active", "inactive", "banned" |
| **email_verified** | BOOLEAN | DEFAULT FALSE | Email verification status | TRUE/FALSE |



**Document Classification**: TOP SECRET  
**Access Restriction**: Database Administrators Only  
**Next Review**: 2025-08-14  
**Version**: 2.0  
**Last Updated By**: Vision (Project Manager) after team schema design meeting

⚠️ **CRITICAL SECURITY WARNING**: This file contains live production database credentials. Never commit to version control. Restrict access to authorized team members only. All database access is logged and monitored.