// Preparedness kit categories used by PREPARE and the preparedness score.
export const kitCategories = [
    {
        key: 'water',
        label: 'Water',
        icon: '💧',
        items: [
            { id: 'w-store', label: 'At least 3 days of stored drinking water (≈4 L/person/day)', weight: 8 },
            { id: 'w-treat', label: 'A water treatment method (filter/disinfectant/means to boil)', weight: 6 },
            { id: 'w-container', label: 'Extra food-grade containers for water', weight: 3 },
        ],
    },
    {
        key: 'food',
        label: 'Food',
        icon: '🥫',
        items: [
            { id: 'f-store', label: 'At least 3 days of shelf-stable food', weight: 8 },
            { id: 'f-ready', label: 'Some ready-to-eat food (no cooking needed)', weight: 4 },
            { id: 'f-opener', label: 'Manual can opener', weight: 2 },
        ],
    },
    {
        key: 'lighting',
        label: 'Lighting',
        icon: '🔦',
        items: [
            { id: 'l-flash', label: 'Flashlight or headlamp', weight: 4 },
            { id: 'l-lantern', label: 'Lantern or backup light', weight: 3 },
            { id: 'l-batt', label: 'Spare batteries for lights', weight: 3 },
        ],
    },
    {
        key: 'power',
        label: 'Power',
        icon: '🔋',
        items: [
            { id: 'p-bank', label: 'Charged power bank', weight: 4 },
            { id: 'p-solar', label: 'Solar or crank charger', weight: 3 },
            { id: 'p-car', label: 'Vehicle charging capability', weight: 2 },
        ],
    },
    {
        key: 'medical',
        label: 'Medical',
        icon: '⛑️',
        items: [
            { id: 'm-kit', label: 'Stocked first-aid kit', weight: 6 },
            { id: 'm-meds', label: 'Several days of essential medications', weight: 6 },
            { id: 'm-info', label: 'Written medical info for each person', weight: 2 },
        ],
    },
    {
        key: 'comms',
        label: 'Communication',
        icon: '📻',
        items: [
            { id: 'c-radio', label: 'Battery/hand-crank radio', weight: 4 },
            { id: 'c-plan', label: 'Written family communication plan', weight: 3 },
            { id: 'c-contacts', label: 'Offline emergency contact list', weight: 2 },
        ],
    },
    {
        key: 'sanitation',
        label: 'Sanitation',
        icon: '🧼',
        items: [
            { id: 's-waste', label: 'Waste bags / bucket sanitation supplies', weight: 3 },
            { id: 's-hygiene', label: 'Hand sanitizer / soap and hygiene items', weight: 3 },
        ],
    },
    {
        key: 'clothing',
        label: 'Clothing / Warmth',
        icon: '🧥',
        items: [
            { id: 'cl-warm', label: 'Warm layers and blankets for each person', weight: 3 },
            { id: 'cl-rain', label: 'Rain protection', weight: 2 },
            { id: 'cl-shoes', label: 'Sturdy footwear accessible', weight: 2 },
        ],
    },
    {
        key: 'tools',
        label: 'Tools',
        icon: '🧰',
        items: [
            { id: 't-multi', label: 'Multi-tool or basic tools', weight: 3 },
            { id: 't-tape', label: 'Duct tape and cordage', weight: 2 },
            { id: 't-whistle', label: 'Whistle for signalling', weight: 1 },
        ],
    },
    {
        key: 'documents',
        label: 'Documents',
        icon: '📄',
        items: [
            { id: 'd-copies', label: 'Copies of key documents (offline/waterproof)', weight: 3 },
            { id: 'd-cash', label: 'Some cash in small bills', weight: 2 },
        ],
    },
    {
        key: 'pets',
        label: 'Pets',
        icon: '🐾',
        items: [
            { id: 'pt-food', label: 'Several days of pet food and water', weight: 2 },
            { id: 'pt-carry', label: 'Pet carrier and leash', weight: 1 },
        ],
    },
];
export function maxKitScore() {
    return kitCategories.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.weight, 0), 0);
}
