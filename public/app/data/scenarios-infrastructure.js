export const infrastructureScenarios = [
    {
        id: 'grid-failure',
        title: 'Critical Grid Failure',
        icon: '⚡',
        category: 'infrastructure',
        severity: 'serious',
        summary: 'Power outage — from a short local outage to an extended, widespread grid failure.',
        dangerAssessment: 'A power outage is rarely an immediate threat by itself, but it can quickly endanger water, heating/cooling, medical equipment, and communication. Treat an outage of unknown duration as potentially extended.',
        phases: [
            {
                label: 'STAGE 1 — FIRST HOUR (DO THIS NOW)',
                now: true,
                items: [
                    'Check whether the outage is just you, your building, or the whole area.',
                    'Check for immediate hazards (sparks, burning smell, downed lines outside).',
                    'Turn off or unplug sensitive electronics to protect them from surges when power returns.',
                    'Stop using your phone for non-essentials — preserve its battery now.',
                    'Set up lighting (flashlight/lantern). Avoid candles if safer options exist.',
                    'Keep the refrigerator and freezer closed as much as possible.',
                    'Check whether elevators, water pumps, security systems and comms still work.',
                    'Check on children, elderly people, and anyone with medical needs.',
                ],
            },
            {
                label: 'STAGE 2 — FIRST 24 HOURS',
                items: [
                    'Secure drinking water in case pumping stops.',
                    'Manage indoor temperature (open/close windows, layer clothing).',
                    'A full freezer holds cold roughly 48h, a half freezer ~24h, if kept closed.',
                    'Set one time per hour to briefly check phone for official updates.',
                    'Ration lighting and battery use.',
                    'Plan sanitation if water pressure fails.',
                ],
            },
            {
                label: 'STAGE 3 — MULTI-DAY FAILURE',
                items: [
                    'Create a power budget: charge only critical devices (phone, medical, radio).',
                    'Battery hierarchy: use disposable/AA for lights, save power banks for comms.',
                    'Charge from solar or a vehicle where you can do so safely and outdoors.',
                    'Switch to low-power communication: text over calls, radio for news.',
                    'Move to safe food that spoils first; discard anything unsafe.',
                    'Find backup water and begin sanitation discipline.',
                    'Begin evacuation planning if the location can no longer support you.',
                ],
            },
            {
                label: 'IF THE SITUATION WORSENS',
                items: [
                    'If indoor temperature becomes dangerous, treat it as a temperature emergency.',
                    'If water stops and reserves run low, treat water as Priority #1.',
                    'If medical equipment loses power, seek a facility with power.',
                ],
            },
        ],
        doNot: [
            'Do not run a generator, grill, or combustion engine indoors or in an attached garage — carbon monoxide is deadly.',
            'Do not open the fridge/freezer repeatedly.',
            'Do not assume the outage is short — plan for longer.',
            'Do not use the gas stove for heating.',
        ],
        improvised: [
            'Diffuse a headlamp through a water bottle for soft room light.',
            'Charge phones from a vehicle USB port (engine outdoors only).',
        ],
        evacuationTriggers: [
            'Indoor temperature becoming dangerous with no way to control it',
            'Loss of power to essential medical equipment',
            'Water and reserves exhausted',
        ],
        communication: [
            'Prioritise: emergency contact, then official info, then family, then navigation. Entertainment last.',
            'Use a battery/hand-crank radio for official information.',
            'Send short texts instead of calls to save battery and network capacity.',
        ],
        medical: [
            'Plan for anyone dependent on powered medical devices (oxygen, refrigerated medication).',
            'Keep insulin and similar medication as cool as safely possible and follow storage guidance.',
        ],
        environmental: [
            'Traffic signals may be out — treat intersections as all-way stops.',
            'Report downed power lines to authorities; never approach them.',
        ],
        resourcePriorities: ['water', 'lighting', 'comms', 'food', 'sanitation'],
        decisionTree: [
            {
                id: 'root',
                question: 'Is the outage expected to last less than 6 hours?',
                options: [
                    { label: 'Yes, short outage', next: 'short' },
                    { label: 'No / Unknown', next: 'water' },
                ],
            },
            {
                id: 'short',
                question: 'Short outage protocol',
                options: [
                    {
                        label: 'Understood',
                        result: 'Run normal conservation: keep fridge closed, preserve phone battery, set up light. Recheck in 1 hour.',
                    },
                ],
            },
            {
                id: 'water',
                question: 'Is your running water still working?',
                options: [
                    { label: 'Yes', next: 'temp' },
                    { label: 'No', result: 'Activate WATER emergency: store water now from remaining pressure, plan treatment and backup sources.' },
                ],
            },
            {
                id: 'temp',
                question: 'Is the indoor temperature becoming dangerous?',
                options: [
                    { label: 'Yes', result: 'Activate TEMPERATURE emergency: prioritise cooling or heating and protect vulnerable people.' },
                    { label: 'No', next: 'struct' },
                ],
            },
            {
                id: 'struct',
                question: 'Is the building safe to stay in?',
                options: [
                    { label: 'Yes', result: 'Begin extended outage protocol: power budget, water reserve, sanitation, hourly info checks.' },
                    { label: 'No', result: 'Evaluate evacuation to a safe location with functioning infrastructure.' },
                ],
            },
        ],
        checklist: [
            'Confirm immediate safety',
            'Determine outage scope (local vs widespread)',
            'Unplug sensitive electronics',
            'Preserve phone battery',
            'Establish lighting',
            'Keep fridge/freezer closed',
            'Check vulnerable household members',
            'Secure drinking water',
            'Establish communications / radio',
            'Monitor official information',
            'Reassess after 6 hours',
        ],
        lastReviewed: '2026-01-01',
    },
    {
        id: 'water-failure',
        title: 'Water System Failure',
        icon: '💧',
        category: 'infrastructure',
        severity: 'serious',
        summary: 'Loss of running water, low pressure, or a boil-water / contamination notice.',
        dangerAssessment: 'Safe drinking water is a top survival priority. Without it, dehydration becomes dangerous within days — faster in heat or with exertion. Do not wait to act.',
        phases: [
            {
                label: 'DO THIS NOW',
                now: true,
                items: [
                    'If any pressure remains, fill clean containers with drinking water immediately.',
                    'Check for an official boil-water or "do not drink" notice.',
                    'Stop non-essential water use.',
                    'Identify what stored/reserve water you already have.',
                ],
            },
            {
                label: 'NEXT 30 MINUTES',
                items: [
                    'Separate water into POTABLE, TREATABLE, and UNKNOWN/CONTAMINATED.',
                    'Protect potable water from contamination — keep containers covered and clean.',
                    'Set a per-person drinking allowance for the day.',
                ],
            },
            {
                label: 'NEXT 6 HOURS',
                items: [
                    'Identify treatment options you actually have (boiling, appropriate filter, disinfectant).',
                    'Locate backup sources: stored water, water heater tank (if uncontaminated), rainfall.',
                    'Prioritise drinking and medical needs over hygiene and cleaning.',
                ],
            },
            {
                label: 'NEXT 24 HOURS',
                items: [
                    'Open the Water Command Center and set a water budget.',
                    'Establish a sanitation plan that keeps waste away from water.',
                    'Track consumption against days remaining.',
                ],
            },
            {
                label: 'IF THE SITUATION WORSENS',
                items: [
                    'If reserves drop below a few days for your group, water becomes the overriding priority.',
                    'Consider relocating to where safe water is available.',
                ],
            },
        ],
        doNot: [
            'Do not assume any filter, cloth, or bottle makes contaminated water safe.',
            'Do not rely on boiling to remove chemical contamination — boiling addresses many biological pathogens, not chemicals.',
            'Do not drink from unknown sources without appropriate treatment.',
            'Do not let dehydration set in to "save" water, especially in heat.',
        ],
        improvised: [
            'A coarse pre-filter (clean cloth) removes visible debris BEFORE proper treatment — it does NOT make water safe.',
            'Clean tarps or sheets funnel rainfall into clean containers.',
        ],
        evacuationTriggers: [
            'Safe water reserves nearly exhausted with no reliable source',
            'Widespread contamination with no treatment method available',
        ],
        communication: [
            'Follow public-health and utility notices for boil/do-not-drink advisories.',
            'Verify advisories from official sources rather than social media rumors.',
        ],
        medical: [
            'Watch for dehydration: dizziness, dark urine, confusion, rapid heartbeat.',
            'Infants, elderly, pregnant people and the ill dehydrate faster — prioritise them.',
        ],
        environmental: [
            'Flooded or storm-affected areas often have contaminated tap water even when flowing.',
        ],
        resourcePriorities: ['water', 'treatableWater', 'sanitation', 'medical'],
        checklist: [
            'Fill containers while pressure remains',
            'Check for official water advisory',
            'Separate potable / treatable / unknown water',
            'Protect potable water from contamination',
            'Confirm a treatment method you actually have',
            'Set a daily drinking allowance',
            'Set up a sanitation plan',
            'Track supply vs days remaining',
        ],
        lastReviewed: '2026-01-01',
    },
    {
        id: 'comms-failure',
        title: 'Communications Failure',
        icon: '📵',
        category: 'infrastructure',
        severity: 'elevated',
        summary: 'Internet, cellular, or phone networks are down or unreliable.',
        dangerAssessment: 'A communications outage is mainly dangerous because it delays emergency help and official information. Conserve device power and fall back to pre-arranged plans.',
        phases: [
            {
                label: 'DO THIS NOW',
                now: true,
                items: [
                    'Put phones on low-power mode and reduce screen brightness.',
                    'Try text/SMS — it often works when calls fail.',
                    'Turn on a battery/hand-crank radio for official information.',
                    'Recall your family communication and meeting plan.',
                ],
            },
            {
                label: 'NEXT 30 MINUTES',
                items: [
                    'Contact your out-of-area contact if any channel works — they can relay messages.',
                    'Note the last known status of each family member.',
                    'Conserve power banks for essential communication only.',
                ],
            },
            {
                label: 'NEXT 6 HOURS',
                items: [
                    'Check radio periodically rather than constantly refreshing the phone.',
                    'Write down critical info (addresses, contacts, medical needs) offline.',
                    'Establish who goes to the meeting point and when.',
                ],
            },
            {
                label: 'NEXT 24 HOURS',
                items: [
                    'Ration battery: emergency > official info > family > navigation > entertainment.',
                    'Use predetermined meeting points as your primary coordination method.',
                ],
            },
            {
                label: 'IF THE SITUATION WORSENS',
                items: [
                    'Physically go to meeting points if you cannot reach people.',
                    'Leave written notes at agreed locations.',
                ],
            },
        ],
        doNot: [
            'Do not drain your battery refreshing dead networks.',
            'Do not treat social-media rumors as verified information.',
            'Do not rely solely on one device or channel.',
        ],
        improvised: [
            'A whistle or bright fabric for close-range signalling.',
            'A written note at a meeting point as a fallback message.',
        ],
        evacuationTriggers: [
            'Combined with another emergency where you cannot summon help',
        ],
        communication: [
            'Priority order: emergency, official info, family, navigation, entertainment last.',
            'Text uses less power and network than calls.',
            'A predetermined meeting location is your most reliable backup.',
        ],
        medical: [
            'If you cannot call for a medical emergency, go directly to the nearest open facility.',
        ],
        environmental: [
            'Networks may be congested rather than down — brief retries can succeed.',
        ],
        resourcePriorities: ['comms', 'batteries'],
        checklist: [
            'Enable low-power mode',
            'Try SMS/text',
            'Turn on radio for official info',
            'Contact out-of-area relay',
            'Write down critical info offline',
            'Confirm meeting points',
            'Ration battery by priority',
        ],
        lastReviewed: '2026-01-01',
    },
];
