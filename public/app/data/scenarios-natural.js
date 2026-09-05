export const naturalScenarios = [
    {
        id: 'earthquake',
        title: 'Earthquake',
        icon: '🌐',
        category: 'natural',
        severity: 'critical',
        summary: 'Ground shaking, structural danger, and aftershocks.',
        dangerAssessment: 'During shaking, most injuries come from falling objects and collapsing structures. Protect yourself first, then assess damage and expect aftershocks.',
        phases: [
            {
                label: 'FIRST 5 MINUTES (DO THIS NOW)',
                now: true,
                items: [
                    'If indoors: DROP to your hands and knees, take COVER under sturdy furniture, and HOLD ON until shaking stops.',
                    'Stay away from windows, mirrors, and heavy objects that can fall.',
                    'If in bed, stay and protect your head with a pillow.',
                    'If outdoors, move to an open area away from buildings and power lines.',
                    'Do not run outside during shaking.',
                ],
            },
            {
                label: 'FIRST 30 MINUTES',
                items: [
                    'Check yourself and others for injuries; give first aid within your ability.',
                    'Check for fire, gas smell, and electrical hazards.',
                    'If you smell gas, leave and shut off the supply if you safely can.',
                    'Put on sturdy shoes — expect broken glass.',
                    'Expect aftershocks and be ready to drop/cover/hold again.',
                ],
            },
            {
                label: 'FIRST 6 HOURS',
                items: [
                    'Assess structural damage from outside; do not enter seriously damaged buildings.',
                    'Turn on a radio for official information and instructions.',
                    'Secure water in case supply is disrupted.',
                    'Account for household and check on vulnerable neighbours if safe.',
                ],
            },
            {
                label: 'FIRST 24 HOURS',
                items: [
                    'Prepare a go-bag in case evacuation becomes necessary.',
                    'Continue monitoring official channels.',
                    'Begin resource tracking if infrastructure is affected.',
                ],
            },
            {
                label: 'IF THE SITUATION WORSENS',
                items: [
                    'If the structure is unsafe, evacuate to open ground or an official shelter.',
                    'Follow tsunami warnings immediately if near the coast — move to high ground.',
                ],
            },
        ],
        doNot: [
            'Do not enter visibly damaged structures.',
            'Do not use flames or switches if you smell gas.',
            'Do not stand in doorways (a common myth) — get under sturdy cover instead.',
            'Do not use elevators.',
        ],
        improvised: [
            'Sturdy furniture as cover during shaking.',
            'Bright fabric or a whistle to signal if trapped — three blasts / knocks.',
        ],
        evacuationTriggers: [
            'Serious structural damage',
            'Fire or gas leak',
            'Tsunami warning near the coast',
        ],
        communication: [
            'Use text messages and a radio; keep lines free for emergencies.',
            'Follow official geological and emergency-management sources.',
        ],
        medical: [
            'Do not move someone with a suspected spinal injury unless they face further danger.',
            'Control severe bleeding immediately; seek professional help.',
        ],
        environmental: [
            'Aftershocks can be significant and continue for days.',
            'Ground may be unstable near slopes; watch for landslide risk.',
        ],
        resourcePriorities: ['shelter', 'medical', 'water', 'comms'],
        checklist: [
            'Drop / cover / hold performed',
            'Checked for injuries',
            'Checked for fire / gas / electrical hazards',
            'Put on sturdy footwear',
            'Assessed structure from outside',
            'Turned on radio for official info',
            'Secured water',
            'Prepared go-bag for possible evacuation',
        ],
        lastReviewed: '2026-01-01',
    },
    {
        id: 'flood',
        title: 'Flood',
        icon: '🌊',
        category: 'natural',
        severity: 'critical',
        summary: 'Rising water, flash flooding, and contaminated floodwater.',
        dangerAssessment: 'Moving water is deceptively powerful and often contaminated. A small depth can knock you down or float a vehicle. Move to higher ground early — do not wait.',
        phases: [
            {
                label: 'DO THIS NOW',
                now: true,
                items: [
                    'Move to higher ground immediately.',
                    'Do not walk or drive through moving floodwater.',
                    'If told to evacuate, do it now — do not wait for the water to rise.',
                    'Move essential supplies and people upstairs or up-slope.',
                ],
            },
            {
                label: 'NEXT 30 MINUTES',
                items: [
                    'Protect your drinking water; assume tap water may become contaminated.',
                    'Disconnect electrical devices if you can do so safely and dry.',
                    'Grab go-bag, medications, documents, and a phone/charger.',
                    'Plan and confirm an evacuation route to higher ground.',
                ],
            },
            {
                label: 'NEXT 6 HOURS',
                items: [
                    'Stay out of floodwater — it may carry sewage, chemicals, or hide hazards.',
                    'Monitor official flood warnings and road closures.',
                    'Keep vulnerable people and pets on the highest safe level.',
                ],
            },
            {
                label: 'NEXT 24 HOURS',
                items: [
                    'Do not return until authorities say it is safe.',
                    'Treat all tap water as unsafe until officially cleared.',
                    'Watch for structural damage before re-entering buildings.',
                ],
            },
            {
                label: 'IF THE SITUATION WORSENS',
                items: [
                    'If water enters your safe level, move higher and signal for rescue.',
                    'Never enter an attic without a way out if water is still rising.',
                ],
            },
        ],
        doNot: [
            'Do not drive through flooded roads — "Turn Around, Don\'t Drown".',
            'Do not walk through moving water; even ankle-deep flow can knock you down.',
            'Do not drink or cook with tap water suspected of contamination.',
            'Do not touch electrical equipment while wet or standing in water.',
        ],
        improvised: [
            'Bright fabric at a window or on the roof to signal rescuers.',
            'Sealed containers to keep documents and phones dry.',
        ],
        evacuationTriggers: [
            'Official evacuation order',
            'Water rising toward your safe level',
            'Structural undermining of the building',
        ],
        communication: [
            'Follow official flood and weather warnings.',
            'Tell someone your evacuation plan and destination.',
        ],
        medical: [
            'Floodwater causes infections — clean and cover any wounds.',
            'Seek help for anyone who has ingested or been submerged in floodwater.',
        ],
        environmental: [
            'Floodwater hides debris, open drains, and displaced animals.',
            'Contamination can persist after water recedes.',
        ],
        resourcePriorities: ['shelter', 'water', 'transport', 'comms'],
        checklist: [
            'Moved to higher ground',
            'Avoided moving floodwater',
            'Protected drinking water',
            'Gathered go-bag / meds / documents',
            'Confirmed evacuation route',
            'Monitoring official warnings',
            'Treating tap water as unsafe',
        ],
        lastReviewed: '2026-01-01',
    },
    {
        id: 'wildfire',
        title: 'Wildfire / Smoke',
        icon: '🔥',
        category: 'natural',
        severity: 'critical',
        summary: 'Approaching fire, evacuation orders, and hazardous smoke.',
        dangerAssessment: 'Wildfires move fast and unpredictably. If evacuation is ordered or advised, leaving early is far safer than leaving late. Smoke is also a serious health hazard.',
        phases: [
            {
                label: 'DO THIS NOW',
                now: true,
                items: [
                    'If an evacuation order is issued, leave immediately — do not delay.',
                    'Check air quality and current fire/smoke conditions from official sources.',
                    'Prepare your vehicle: fuel, facing outward, keys ready, windows closed.',
                    'Grab your evacuation bag, medications, documents, and pets.',
                ],
            },
            {
                label: 'NEXT 30 MINUTES',
                items: [
                    'If sheltering from smoke: close windows/doors and vents; create a clean-air room.',
                    'Wear a well-fitting respirator (e.g., N95) outdoors if available.',
                    'Move flammable items away from the building exterior if time and safety allow.',
                ],
            },
            {
                label: 'NEXT 6 HOURS',
                items: [
                    'Follow the designated evacuation route; have a backup route.',
                    'Keep monitoring official fire progression and road status.',
                    'Limit outdoor exertion in smoky air, especially for vulnerable people.',
                ],
            },
            {
                label: 'NEXT 24 HOURS',
                items: [
                    'Do not return until authorities confirm it is safe.',
                    'Continue protecting indoor air; use filtration if available.',
                ],
            },
            {
                label: 'IF THE SITUATION WORSENS',
                items: [
                    'If trapped, call emergency services and shelter in a cleared area away from fuel.',
                    'Signal your location to responders.',
                ],
            },
        ],
        doNot: [
            'Do not delay evacuation to protect property.',
            'Do not drive through active fire or heavy smoke with zero visibility.',
            'Do not assume light smoke is harmless — it affects the heart and lungs.',
        ],
        improvised: [
            'A clean-air room: one interior room, sealed, with a portable air filter if available.',
            'Damp cloth over gaps to reduce smoke entry (temporary; not a substitute for leaving).',
        ],
        evacuationTriggers: [
            'Any official evacuation order or warning',
            'Visible flame or ember spread toward you',
            'Rapidly worsening air quality for vulnerable people',
        ],
        communication: [
            'Follow fire authorities and emergency management for orders and routes.',
            'Tell your out-of-area contact your route and destination.',
        ],
        medical: [
            'Smoke worsens asthma, heart and lung conditions — keep relevant medication close.',
            'Seek help for severe breathing difficulty.',
        ],
        environmental: [
            'Wind shifts change fire direction quickly.',
            'Embers can ignite spot fires far ahead of the main fire.',
        ],
        resourcePriorities: ['transport', 'shelter', 'medical', 'comms'],
        checklist: [
            'Checked for evacuation orders',
            'Prepared vehicle and fuel',
            'Packed evacuation bag / meds / documents / pets',
            'Set up clean-air room (if sheltering)',
            'Identified primary and backup routes',
            'Monitoring official fire info',
        ],
        lastReviewed: '2026-01-01',
    },
    {
        id: 'extreme-heat',
        title: 'Extreme Heat',
        icon: '🌡️',
        category: 'natural',
        severity: 'serious',
        summary: 'Dangerous high temperatures, especially with power or water failure.',
        dangerAssessment: 'Extreme heat can cause heat exhaustion and life-threatening heat stroke, particularly in the elderly, young children, and those without cooling. Heat overrides food as a priority.',
        phases: [
            {
                label: 'DO THIS NOW',
                now: true,
                items: [
                    'Move everyone to the coolest safe location available.',
                    'Reduce physical activity and rest.',
                    'Drink water steadily — do not wait until you feel thirsty.',
                    'Remove excess clothing; wet skin and use airflow to cool down.',
                ],
            },
            {
                label: 'NEXT 30 MINUTES',
                items: [
                    'Block direct sun with shades, blinds, or fabric on sun-facing windows.',
                    'Open up for airflow when outside air is cooler (often overnight).',
                    'Check on children, elderly, ill people, and pets frequently.',
                    'Protect your drinking-water supply.',
                ],
            },
            {
                label: 'NEXT 6 HOURS',
                items: [
                    'Use damp cloths on neck/wrists and cool-water soaks to lower body temperature.',
                    'Identify a cooler location you could relocate to (public cooling center, shaded space).',
                    'Avoid using heat-producing appliances.',
                ],
            },
            {
                label: 'NEXT 24 HOURS',
                items: [
                    'Plan activity for the coolest parts of the day.',
                    'Maintain hydration and electrolyte balance where possible.',
                    'Reassess whether relocating to a cooler location is safer.',
                ],
            },
            {
                label: 'IF THE SITUATION WORSENS',
                items: [
                    'Heat stroke (confusion, no sweating, very high temperature, collapse) is a medical emergency — call for help and cool the person aggressively.',
                    'Relocate to a cooler environment if your location cannot be made safe.',
                ],
            },
        ],
        doNot: [
            'Do not leave anyone (or pets) in a parked vehicle.',
            'Do not ration water to the point of dehydration in heat.',
            'Do not rely only on a fan when air temperature is very high — it may not cool the body enough.',
            'Do not do heavy physical work during peak heat.',
        ],
        improvised: [
            'Damp cloth and airflow for evaporative cooling.',
            'Fabric or tarps to shade sun-facing windows.',
            'Sleep on the lowest, coolest floor level.',
        ],
        evacuationTriggers: [
            'Indoor temperature cannot be brought to a safe level',
            'A household member shows signs of heat stroke',
        ],
        communication: [
            'Check for official heat advisories and locations of cooling centers.',
        ],
        medical: [
            'Heat exhaustion: heavy sweating, weakness, nausea — rest, cool, hydrate.',
            'Heat stroke: high temperature, confusion, hot dry skin — medical emergency, cool immediately and get help.',
        ],
        environmental: [
            'Upper floors and sun-facing rooms get hottest.',
            'Humidity reduces the effectiveness of sweating.',
        ],
        resourcePriorities: ['water', 'shelter', 'medical'],
        checklist: [
            'Moved to coolest safe location',
            'Reduced physical activity',
            'Drinking water steadily',
            'Shaded sun-facing windows',
            'Checked vulnerable people and pets',
            'Identified a cooler fallback location',
        ],
        lastReviewed: '2026-01-01',
    },
    {
        id: 'extreme-cold',
        title: 'Extreme Cold',
        icon: '❄️',
        category: 'natural',
        severity: 'serious',
        summary: 'Dangerous cold, often with power loss and heating failure.',
        dangerAssessment: 'Cold causes hypothermia and frostbite, and improvised heating causes carbon-monoxide poisoning and fires. Stay dry, insulated, and heat safely.',
        phases: [
            {
                label: 'DO THIS NOW',
                now: true,
                items: [
                    'Stay dry — wet clothing rapidly steals body heat; change out of anything damp.',
                    'Layer clothing and add insulation (blankets, sleeping bags).',
                    'Gather everyone into one small, well-insulated room to share warmth.',
                    'Cover drafts and windows to retain heat.',
                ],
            },
            {
                label: 'NEXT 30 MINUTES',
                items: [
                    'Use only safe heating; never burn fuel indoors without proper ventilation.',
                    'Ensure a working carbon-monoxide alarm if using any combustion heat.',
                    'Insulate from the floor — cardboard, blankets, or a mattress.',
                    'Eat and drink warm fluids if available to maintain energy and warmth.',
                ],
            },
            {
                label: 'NEXT 6 HOURS',
                items: [
                    'Protect water pipes and stored water from freezing.',
                    'Check extremities for numbness (frostbite risk) and warm gradually.',
                    'Monitor the very young, elderly, and ill for hypothermia.',
                ],
            },
            {
                label: 'NEXT 24 HOURS',
                items: [
                    'Maintain the warm room; rotate people to stay comfortable.',
                    'Conserve fuel and plan for a longer outage.',
                    'Reassess whether relocating to a heated shelter is safer.',
                ],
            },
            {
                label: 'IF THE SITUATION WORSENS',
                items: [
                    'Hypothermia (shivering, confusion, drowsiness, slurred speech) needs warming and medical help.',
                    'If you cannot keep the space safe and warm, move to a heated shelter.',
                ],
            },
        ],
        doNot: [
            'Do not use a gas stove, oven, grill, or generator to heat indoors — carbon monoxide can kill.',
            'Do not stay in wet clothing.',
            'Do not rub frostbitten skin.',
            'Do not block all ventilation when using any combustion heat.',
        ],
        improvised: [
            'Cardboard, blankets and clothing as floor and body insulation.',
            'A single small room sealed against drafts to concentrate body heat.',
        ],
        evacuationTriggers: [
            'No safe way to keep temperature survivable',
            'Signs of hypothermia that you cannot reverse',
        ],
        communication: [
            'Check official cold-weather warnings and warming-shelter locations.',
        ],
        medical: [
            'Hypothermia: shivering, confusion, drowsiness — warm gradually, seek help.',
            'Frostbite: numb, pale, hard skin — warm gently, do not rub, get help.',
        ],
        environmental: [
            'Wind chill lowers effective temperature significantly.',
            'Pipes can freeze and burst, cutting water and causing damage.',
        ],
        resourcePriorities: ['shelter', 'clothing', 'fuel', 'water'],
        checklist: [
            'Everyone is dry',
            'Layered clothing and insulation',
            'Gathered into one insulated room',
            'Heating used safely with ventilation / CO alarm',
            'Insulated from the floor',
            'Protected water from freezing',
            'Checked vulnerable people for hypothermia',
        ],
        lastReviewed: '2026-01-01',
    },
    {
        id: 'storm-hurricane',
        title: 'Severe Storm / Hurricane',
        icon: '🌀',
        category: 'natural',
        severity: 'critical',
        summary: 'High winds, heavy rain, storm surge, and prolonged aftermath.',
        dangerAssessment: 'Severe storms combine wind, flooding, and power loss, and the aftermath can be as dangerous as the storm. Follow evacuation orders and prepare to be self-sufficient afterward.',
        phases: [
            {
                label: 'DO THIS NOW',
                now: true,
                items: [
                    'If evacuation is ordered, leave now via the designated route.',
                    'If sheltering, move to an interior room away from windows.',
                    'Fill containers with drinking water before supply is affected.',
                    'Charge devices and prepare lighting and a radio.',
                ],
            },
            {
                label: 'NEXT 30 MINUTES',
                items: [
                    'Secure or bring in loose outdoor items that could become projectiles.',
                    'Gather go-bag, medications, documents, food, and water in your shelter room.',
                    'Fill a bathtub/containers for washing and flushing water.',
                ],
            },
            {
                label: 'DURING THE STORM',
                items: [
                    'Stay in your safe room away from windows; keep the radio on.',
                    'Do not go outside during a lull — it may be the eye of the storm.',
                    'Avoid using landline phones and electrical equipment during lightning.',
                ],
            },
            {
                label: 'AFTER THE STORM',
                items: [
                    'Watch for downed power lines, gas leaks, flooding, and weakened structures.',
                    'Treat tap water as potentially unsafe until officially cleared.',
                    'Only return home when authorities say it is safe.',
                ],
            },
            {
                label: 'IF THE SITUATION WORSENS',
                items: [
                    'If flooding threatens, move to higher ground.',
                    'If the structure is failing, move to the safest interior space and signal for help.',
                ],
            },
        ],
        doNot: [
            'Do not ignore evacuation orders, especially for storm surge zones.',
            'Do not go outside during the eye of the storm.',
            'Do not drive through flooded roads.',
            'Do not run a generator indoors or in an attached garage.',
        ],
        improvised: [
            'A bathtub or large containers as a non-drinking water reserve for washing/flushing.',
            'An interior room or hallway as a wind-safe shelter.',
        ],
        evacuationTriggers: [
            'Official evacuation order or storm-surge warning',
            'Structural failure or serious flooding',
        ],
        communication: [
            'Follow weather agencies and emergency management for warnings and orders.',
            'Keep a battery/hand-crank radio for post-storm information.',
        ],
        medical: [
            'Post-storm cleanup causes many injuries — wear protective footwear and gloves.',
            'Seek help for serious injuries; services may be delayed, so prioritise safety.',
        ],
        environmental: [
            'Storm surge and inland flooding cause most storm deaths.',
            'Aftermath hazards (lines, gas, debris) persist for days.',
        ],
        resourcePriorities: ['shelter', 'water', 'comms', 'food', 'lighting'],
        checklist: [
            'Checked for evacuation orders',
            'Chose interior safe room',
            'Filled drinking-water containers',
            'Filled washing/flushing water reserve',
            'Charged devices, prepared radio and lighting',
            'Secured loose outdoor items',
            'Reviewed post-storm hazards',
        ],
        lastReviewed: '2026-01-01',
    },
];
