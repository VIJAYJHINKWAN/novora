-- Novora (Litverse) backend schema
-- Run this once against a fresh MySQL database, e.g.:
--   mysql -u root -p novora < schema.sql

CREATE DATABASE IF NOT EXISTS novora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE novora;

-- ============================================================
-- USERS  (auth + public reader profile combined)
-- ============================================================
CREATE TABLE users (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(120)    NOT NULL,
    email               VARCHAR(190)    NOT NULL UNIQUE,
    password_hash       VARCHAR(255)    NOT NULL,
    phone               VARCHAR(30)     NULL,

    -- profile / reader fields (matches UserProfile + Reader types)
    bio                 TEXT            NULL,
    location            VARCHAR(190)    NULL,
    reading_score       INT             NOT NULL DEFAULT 0,
    genres              VARCHAR(255)    NULL,
    goals               VARCHAR(255)    NULL,
    verification_status BOOLEAN         NOT NULL DEFAULT FALSE,
    streak              INT             NOT NULL DEFAULT 0,
    monthly_goal        INT             NOT NULL DEFAULT 0,
    monthly_progress    INT             NOT NULL DEFAULT 0,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- badges are a list per user -> own table
CREATE TABLE user_badges (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge   VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- BOOKS
-- ============================================================
CREATE TABLE books (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    owner_id        INT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    author          VARCHAR(255) NOT NULL,
    genre           VARCHAR(120) NULL,
    summary         TEXT NULL,
    rating          DECIMAL(2,1) NOT NULL DEFAULT 0,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    is_wishlist     BOOLEAN NOT NULL DEFAULT FALSE,
    is_exchangeable BOOLEAN NOT NULL DEFAULT TRUE,
    is_lendable     BOOLEAN NOT NULL DEFAULT TRUE,
    cover_url       VARCHAR(500) NULL,
    likes_count     INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- who liked which book (drives isLiked per-user + likes_count)
CREATE TABLE book_likes (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE events (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NULL,
    title       VARCHAR(255) NOT NULL,
    category    VARCHAR(100) NOT NULL,
    event_date  VARCHAR(100) NOT NULL,   -- kept as display string to match frontend ("Saturday, August 15")
    event_time  VARCHAR(100) NOT NULL,
    location    VARCHAR(255) NOT NULL,
    organizer_name VARCHAR(190) NOT NULL,
    description TEXT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE event_rsvps (
    user_id  INT NOT NULL,
    event_id INT NOT NULL,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
CREATE TABLE chat_messages (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    sender_id           INT NOT NULL,
    recipient_id        INT NOT NULL,
    message_text        TEXT NOT NULL,
    is_exchange_card     BOOLEAN NOT NULL DEFAULT FALSE,
    exchange_book_title VARCHAR(255) NULL,
    exchange_status     ENUM('Requested','Accepted','Declined','Completed') NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- READING STORIES
-- ============================================================
CREATE TABLE reading_stories (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    author_id         INT NOT NULL,
    book_title        VARCHAR(255) NOT NULL,
    note_text         TEXT NOT NULL,
    story_type        VARCHAR(100) NOT NULL,
    background_theme  VARCHAR(100) NOT NULL,
    likes_count       INT NOT NULL DEFAULT 0,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE story_likes (
    user_id  INT NOT NULL,
    story_id INT NOT NULL,
    PRIMARY KEY (user_id, story_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (story_id) REFERENCES reading_stories(id) ON DELETE CASCADE
);
