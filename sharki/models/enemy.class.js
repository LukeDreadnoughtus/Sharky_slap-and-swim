class Shark extends MovableObject{
    static JELLYFISH_VERTICAL_LIMITS = {
        minY: 30,
        maxY: 330,
        verticalRange: 150
    };

    static VARIANTS = {
        default: {
            swimImage: 'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/1.swim1.png',
            walkingImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition1.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition2.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition3.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition4.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/1.transition5.png'
            ],
            deadImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 1 (can animate by going up).png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 2 (can animate by going down to the floor after the Fin Slap attack).png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/1.Dead 3 (can animate by going down to the floor after the Fin Slap attack).png'
            ],
            energy: 10,
            damage: 5
        },
        transition2: {
            swimImage: 'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/2.swim1.png',
            walkingImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition1.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition2.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition3.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition4.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/2.transition5.png'
            ],
            deadImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/2.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/2.3.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/2.2.png'
            ],
            energy: 15,
            damage: 7
        },
        jelly_lila: {
            swimImage: 'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Lila 1.png',
            walkingImages: [
                'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Lila 1.png',
                'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Lila 2.png',
                'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Lila 3.png',
                'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Lila 4.png'
            ],
            deadImages: [
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Lila/L1.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Lila/L2.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Lila/L3.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Lila/L4.png'
            ],
            energy: 15,
            damage: 7
        },
        jelly_green: {
            swimImage: 'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Green 1.png',
            walkingImages: [
                'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Green 1.png',
                'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Green 2.png',
                'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Green 3.png',
                'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Green 4.png'
            ],
            deadImages: [
                'sharki/img/2.Enemy/2 Jelly fish/Dead/green/g1.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/green/g2.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/green/g3.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/green/g4.png'
            ],
            energy: 21,
            damage: 7
        },
        jelly_pink: {
            swimImage: 'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Pink 1.png',
            walkingImages: [
                'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Pink 1.png',
                'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Pink 2.png',
                'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Pink 3.png',
                'sharki/img/2.Enemy/2 Jelly fish/S%23U00faper dangerous/Pink 4.png'
            ],
            deadImages: [
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Pink/P1.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Pink/P2.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Pink/P3.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Pink/P4.png'
            ],
            energy: 19,
            damage: 8
        },
        transition3: {
            swimImage: 'sharki/img/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim1.png',
            walkingImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition1.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition2.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition3.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition4.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/2.transition/3.transition5.png'
            ],
            deadImages: [
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.3.png',
                'sharki/img/2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.2.png'
            ],
            energy: 21,
            damage: 7
        },
        jelly_yellow: {
            swimImage: 'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png',
            walkingImages: [
                'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png',
                'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Yellow 2.png',
                'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Yellow 3.png',
                'sharki/img/2.Enemy/2 Jelly fish/Regular damage/Yellow 4.png'
            ],
            deadImages: [
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Yellow/y1.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Yellow/y2.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Yellow/y3.png',
                'sharki/img/2.Enemy/2 Jelly fish/Dead/Yellow/y4.png'
            ],
            energy: 17,
            damage: 8
        }
    };

    height = 150;
    width = 100;
    hitboxOffsetX = 10;
    hitboxOffsetY = 10;
    hitboxWidth = 80;
    hitboxHeight = 80;
    y = 310;
    isRemoved = false;
    deathAnimationStarted = false;
    movementPattern = 'horizontal';
    baseY = 310;
    verticalDirection = 1;
    verticalRange = 80;
    verticalSpeed = 0.8;
    minY = null;
    maxY = null;

    /**
     * Creates an enemy from the selected variant and movement config.
     * It prepares the shared state that the split enemy behavior file consumes.
     */
    constructor(config = {}) {
        const variantName = config.variant ?? 'default';
        const variant = Shark.VARIANTS[variantName] ?? Shark.VARIANTS.default;

        super().loadImage(variant.swimImage);
        this.applyVariantConfig(config, variantName, variant);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
    }

    /**
     * Applies the selected variant values and caller overrides to this enemy.
     * It keeps the constructor short before the behavior methods run the logic.
     */
    applyVariantConfig(config, variantName, variant) {
        this.applyVariantIdentity(variantName, variant);
        this.applyVariantStats(config, variant);
        this.applyVariantGeometry(config);
        this.speed = config.speed ?? 0.15 + Math.random() * 0.5;
        this.movementPattern = config.movementPattern ?? this.movementPattern;
        this.baseY = this.y;
        this.applyVerticalConfig(config);
    }

    /**
     * Applies the selected variant name and image lists to this enemy instance.
     * It supports applyVariantConfig before stats and geometry are assigned.
     */
    applyVariantIdentity(variantName, variant) {
        this.variant = variantName;
        this.IMAGES_WALKING = variant.walkingImages;
        this.IMAGES_DEAD = variant.deadImages;
    }

    /**
     * Applies health, damage, and spawn position values for one enemy instance.
     * It supports applyVariantConfig before movement and vertical rules are set.
     */
    applyVariantStats(config, variant) {
        this.damage = config.damage ?? variant.damage;
        this.energy = config.energy ?? variant.energy;
        this.x = config.x ?? 450 + Math.random() * 500;
        this.y = config.y ?? this.y;
    }

    /**
     * Applies size and hitbox values that shape one enemy instance.
     * It supports applyVariantConfig so geometry setup is grouped in one helper.
     */
    applyVariantGeometry(config) {
        this.width = config.width ?? this.width;
        this.height = config.height ?? this.height;
        this.hitboxOffsetX = config.hitboxOffsetX ?? this.hitboxOffsetX;
        this.hitboxOffsetY = config.hitboxOffsetY ?? this.hitboxOffsetY;
        this.hitboxWidth = config.hitboxWidth ?? this.hitboxWidth;
        this.hitboxHeight = config.hitboxHeight ?? this.hitboxHeight;
    }

    /**
     * Applies vertical movement settings for jellyfish and other enemy variants.
     * It is extracted so applyVariantConfig stays within the size rule.
     */
    applyVerticalConfig(config) {
        const useJellyDefaults = this.variant.startsWith('jelly_');
        const limits = Shark.JELLYFISH_VERTICAL_LIMITS;

        this.minY = config.minY ?? (useJellyDefaults ? limits.minY : this.minY);
        this.maxY = config.maxY ?? (useJellyDefaults ? limits.maxY : this.maxY);
        this.verticalRange = config.verticalRange ?? (useJellyDefaults ? limits.verticalRange : this.verticalRange);
        this.verticalSpeed = config.verticalSpeed ?? this.verticalSpeed;
    }
}
