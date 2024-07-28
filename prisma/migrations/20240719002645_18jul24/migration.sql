-- CreateTable
CREATE TABLE `MaterialGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `turma` VARCHAR(191) NOT NULL,
    `disabled` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `MaterialGroup_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Material` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `turma` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NULL,
    `disabled` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Material_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
