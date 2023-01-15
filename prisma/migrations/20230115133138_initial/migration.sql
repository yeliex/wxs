-- CreateTable
CREATE TABLE `app` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `outer_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `app_id` VARCHAR(24) NOT NULL,
    `app_secret` VARCHAR(48) NOT NULL,
    `offical_id` VARCHAR(24) NULL,
    `token` VARCHAR(512) NULL,
    `encoding_aes_key` VARCHAR(512) NULL,
    `is_service` BOOLEAN NOT NULL DEFAULT false,
    `is_organization` BOOLEAN NOT NULL DEFAULT false,
    `is_certified` BOOLEAN NOT NULL DEFAULT false,
    `verified_at` DATETIME(3) NULL,
    `iot_verified_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `app_outer_id_key`(`outer_id`),
    INDEX `app_outer_id_idx`(`outer_id`),
    INDEX `app_app_id_idx`(`app_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
