// =========================================================================
// COMMANDER — offline survival assistant.
// A deterministic, rule-based reasoner (no network, no hallucination). It
// parses the user's message for quantities and keywords, blends in the
// current app state, and returns a calm, structured response:
//   CURRENT SITUATION / MOST IMPORTANT PROBLEM / DO THIS NOW / NEXT / AVOID /
//   IF CONDITIONS CHANGE
// If key information is missing, it asks only the single most important
// question rather than guessing.
// =========================================================================
import { computePriority } from './priority.js';
import { daysLabel } from './estimate.js';
const ITEM_WORDS = [
    'tarp', 'rope', 'bucket', 'bottle', 'bottles', 'flashlight', 'radio',
    'blanket', 'candle', 'tape', 'foil', 'power bank', 'battery', 'batteries',
    'lighter', 'matches', 'pot', 'knife', 'whistle', 'mirror', 'backpack',
];
function parse(msg) {
    const t = ' ' + msg.toLowerCase() + ' ';
    const p = { items: [] };
    const liters = t.match(/(\d+(?:\.\d+)?)\s*(?:l\b|liters?|litres?|gallons?)/);
    if (liters) {
        let v = parseFloat(liters[1]);
        if (/gallon/.test(liters[0]))
            v *= 3.785;
        p.liters = v;
    }
    const ppl = t.match(/(\d+)\s*(?:people|persons?|adults?|of us|family members?)/);
    if (ppl)
        p.people = parseInt(ppl[1], 10);
    const hrs = t.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/);
    if (hrs)
        p.hours = parseFloat(hrs[1]);
    const dys = t.match(/(\d+(?:\.\d+)?)\s*days?/);
    if (dys)
        p.days = parseFloat(dys[1]);
    p.heat = /(hot|heat|sweltering|boiling|too warm|overheat)/.test(t);
    p.cold = /(cold|freezing|frigid|hypotherm)/.test(t);
    p.fire = /(fire|wildfire|smoke|burning)/.test(t);
    p.flood = /(flood|water rising|rising water)/.test(t);
    p.quake = /(earthquake|quake|shaking|aftershock)/.test(t);
    p.water = /(water|thirst|dehydrat|drink)/.test(t);
    p.power = /(power|electric|grid|outage|blackout|no lights)/.test(t);
    p.food = /(food|eat|hungry|starv)/.test(t);
    p.injury = /(injur|bleed|broken|burn|unconscious|chest pain|breath|hurt|wound)/.test(t);
    for (const w of ITEM_WORDS) {
        if (t.includes(' ' + w + ' ') || t.includes(' ' + w + ','))
            p.items.push(w);
    }
    return p;
}
function n(v) {
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
}
export function commander(msg, state) {
    const p = parse(msg);
    const pr = computePriority(state);
    // ---- Immediate medical override -----------------------------------
    if (p.injury || state.conditions.medical === 'emergency') {
        return {
            situation: 'You mentioned a possible injury or medical emergency.',
            problem: 'A medical emergency outranks every other survival task.',
            doNow: [
                'If reachable, call your local emergency number now.',
                'Control severe bleeding with firm, direct pressure.',
                'For someone not breathing or unresponsive, begin resuscitation if trained and get help.',
                'Do not move anyone with a suspected spinal injury unless they face further danger.',
            ],
            next: [
                'Keep the person warm, still, and monitored.',
                'Gather their medical information and medications to hand to responders.',
            ],
            avoid: [
                'Do not delay calling for help to look up information.',
                'This app cannot diagnose — professional care comes first.',
            ],
            ifChange: [
                'If they lose consciousness or stop breathing, escalate resuscitation and keep calling for help.',
            ],
            question: p.injury
                ? 'What is the single most serious symptom right now (bleeding, breathing, or responsiveness)?'
                : undefined,
        };
    }
    // ---- Heat + water combination (the flagship example) ---------------
    if (p.heat && (p.water || p.liters !== undefined)) {
        const people = p.people ?? state.household.people;
        let waterLine = '';
        if (p.liters !== undefined) {
            const perDay = 3.6 * Math.max(1, people); // heat-adjusted planning figure
            const days = perDay > 0 ? p.liters / perDay : 0;
            waterLine = `About ${n(p.liters)} L for ${people} ${people === 1 ? 'person' : 'people'} in heat is roughly ${daysLabel(days)} of drinking water (approximate).`;
        }
        return {
            situation: `Extreme heat with water as a concern. ${waterLine}`.trim(),
            problem: 'Dehydration and heat exposure are your biggest immediate risks.',
            doNow: [
                'Move everyone to the coolest safe location.',
                'Reduce physical activity and rest.',
                'Protect your remaining drinking water.',
                'Set up your best available cooling (shade, airflow, damp cloth on skin).',
                'Check children, elderly, ill people, and pets.',
            ],
            next: [
                'Block sun on windows and open up when outside air is cooler.',
                'Sip water steadily rather than rationing to the point of dehydration.',
                'Identify a cooler location you could relocate to.',
            ],
            avoid: [
                'Do not do heavy work during peak heat.',
                'Do not leave anyone in a parked vehicle.',
                'Do not ration water so hard that you become dehydrated.',
            ],
            ifChange: [
                'Signs of heat stroke (confusion, hot dry skin, collapse) are a medical emergency — cool aggressively and get help.',
                'If the space cannot be kept safe, relocate somewhere cooler.',
            ],
        };
    }
    // ---- Water-focused --------------------------------------------------
    if ((p.water || p.liters !== undefined) && !p.power && !p.fire && !p.flood && !p.quake) {
        const people = p.people ?? state.household.people;
        if (p.liters === undefined && state.resources.water === 0) {
            return {
                situation: 'You are asking about water but I do not have a quantity yet.',
                problem: 'I need your available water to estimate how long it lasts.',
                doNow: ['Gather and measure all the safe drinking water you currently have.'],
                next: ['Enter it in the Water tracker so I can estimate days remaining.'],
                avoid: ['Do not drink from unknown sources without appropriate treatment.'],
                ifChange: [],
                question: `How many liters of safe drinking water do you have for ${people} ${people === 1 ? 'person' : 'people'}?`,
            };
        }
        const liters = p.liters ?? state.resources.water;
        const perDay = 3 * Math.max(1, people);
        const days = liters / perDay;
        return {
            situation: `About ${n(liters)} L for ${people} ${people === 1 ? 'person' : 'people'} is roughly ${daysLabel(days)} of drinking water (approximate, more in heat).`,
            problem: days < 2 ? 'Your water supply is critically low.' : days < 5 ? 'Your water supply is limited — conserve now.' : 'Water is adequate for now; keep it protected.',
            doNow: [
                'Protect your safe water from contamination (covered, clean containers).',
                'Set a daily drinking allowance per person.',
                days < 5 ? 'Identify a backup source and a treatment method you actually have.' : 'Confirm you have a treatment method for backup water.',
            ],
            next: [
                'Prioritise drinking and medical use over hygiene and cleaning.',
                'Open the Water Command Center to set a budget and track days remaining.',
            ],
            avoid: [
                'Do not assume any filter, cloth, or bottle makes contaminated water safe.',
                'Boiling addresses many biological pathogens but not chemical contamination.',
            ],
            ifChange: [
                'If reserves drop below a couple of days with no source, water becomes the overriding priority and you should consider relocating.',
            ],
        };
    }
    // ---- Power outage duration ----------------------------------------
    if (p.power) {
        const hours = p.hours ?? (p.days !== undefined ? p.days * 24 : undefined);
        const extended = hours === undefined || hours >= 6;
        return {
            situation: hours !== undefined ? `Power has been out about ${n(hours)} hours.` : 'You are dealing with a power outage.',
            problem: extended ? 'Treat this as an extended outage and protect water, temperature, and communication.' : 'This is likely a short outage — run basic conservation.',
            doNow: extended
                ? [
                    'Secure drinking water in case pumping stops.',
                    'Preserve phone battery; use a radio for official info.',
                    'Set up battery lighting and keep the fridge/freezer closed.',
                    'Check vulnerable household members.',
                ]
                : [
                    'Keep the fridge/freezer closed.',
                    'Preserve phone battery and set up a light.',
                    'Recheck the situation in about an hour.',
                ],
            next: extended
                ? [
                    'Create a power budget: charge only critical devices.',
                    'Plan sanitation if water pressure fails.',
                    'Move to safe food that spoils first.',
                ]
                : ['If it lasts beyond ~6 hours, switch to the extended-outage plan.'],
            avoid: [
                'Never run a generator or engine indoors or in an attached garage.',
                'Do not use a gas stove to heat the home.',
            ],
            ifChange: [
                'If indoor temperature becomes dangerous, treat it as a temperature emergency.',
                'If water stops and reserves run low, water becomes Priority #1.',
            ],
        };
    }
    // ---- "What can I make with X" -------------------------------------
    if (p.items.length > 0 && /(make|build|improvise|use|do with|with (a|an|my))/.test(msg.toLowerCase())) {
        const list = p.items.join(', ');
        const ideas = [];
        if (p.items.includes('tarp'))
            ideas.push('Tarp: rain shelter, sun shade, ground barrier, or a rain-collection surface.');
        if (p.items.includes('rope'))
            ideas.push('Rope: secure a tarp shelter, bundle supplies, or make a clothesline.');
        if (p.items.includes('bucket'))
            ideas.push('Bucket: store/carry water (if food-safe), collect rain, or line for sanitation.');
        if (p.items.includes('bottle') || p.items.includes('bottles'))
            ideas.push('Bottles: store safe water and diffuse a flashlight into soft room light.');
        if (p.items.includes('flashlight'))
            ideas.push('Flashlight: primary light and three-flash signalling.');
        if (p.items.includes('radio'))
            ideas.push('Radio: official information without the internet.');
        if (ideas.length === 0)
            ideas.push('Open the IMPROVISE and "Can I use this?" tools for safe, specific uses.');
        return {
            situation: `You have: ${list}.`,
            problem: 'Get the most survival value from what you already have.',
            doNow: ideas,
            next: ['Set up shelter/water first, then lighting and signalling.'],
            avoid: [
                'Do not improvise anything involving mains electricity, weapons, or dangerous chemistry.',
                'A collection surface or pre-filter does not make water safe — treat it before drinking.',
            ],
            ifChange: ['If a proper tool becomes available, switch to it.'],
        };
    }
    // ---- Fire / flood / quake quick routes ----------------------------
    if (p.fire) {
        return {
            situation: 'You mentioned fire or smoke.',
            problem: 'Fire moves fast; leaving early is far safer than leaving late.',
            doNow: [
                'If evacuation is ordered, leave now via your route.',
                'If sheltering from smoke, seal a clean-air room.',
                'Grab evacuation bag, medications, documents, and pets.',
            ],
            next: ['Follow official fire information and keep a backup route.'],
            avoid: ['Do not delay evacuation to protect property.'],
            ifChange: ['If trapped, call for help, move away from fuel, and signal your location.'],
        };
    }
    if (p.flood) {
        return {
            situation: 'You mentioned flooding or rising water.',
            problem: 'Moving water is powerful and often contaminated — get to higher ground.',
            doNow: [
                'Move to higher ground now.',
                'Do not walk or drive through moving floodwater.',
                'Protect drinking water and grab go-bag, meds, and documents.',
            ],
            next: ['Follow official flood warnings and confirm an evacuation route.'],
            avoid: ['Do not drive through flooded roads.', 'Do not drink tap water suspected of contamination.'],
            ifChange: ['If water reaches your safe level, move higher and signal for rescue.'],
        };
    }
    if (p.quake) {
        return {
            situation: 'You mentioned an earthquake or shaking.',
            problem: 'Falling objects and structural damage are the main risks; expect aftershocks.',
            doNow: [
                'During shaking: Drop, Cover, and Hold On.',
                'After shaking: check for injuries, fire, gas smell, and hazards.',
                'Put on sturdy shoes for broken glass.',
            ],
            next: ['Assess structure from outside; do not enter seriously damaged buildings.'],
            avoid: ['Do not use flames or switches if you smell gas.', 'Do not use elevators.'],
            ifChange: ['If the structure is unsafe, move to open ground or an official shelter.'],
        };
    }
    // ---- Fallback: use the priority engine ----------------------------
    if (pr.top) {
        return {
            situation: `Current threat level: ${pr.threat.toUpperCase()}.`,
            problem: `${pr.top.title}: ${pr.top.why}`,
            doNow: [pr.top.action],
            next: pr.ranked.slice(1, 3).map((i) => i.action),
            avoid: ['Do not try to do everything at once — follow the priority order.'],
            ifChange: ['Update your conditions and resources so I can recompute your top priority.'],
            question: state.resources.water === 0
                ? 'To sharpen my advice: how much safe drinking water do you have, and how many people are with you?'
                : undefined,
        };
    }
    // ---- No signal at all ----------------------------------------------
    return {
        situation: 'I need a little more to help precisely.',
        problem: 'Tell me your most pressing concern.',
        doNow: ['Describe your situation: what has happened, how many people, and what you have.'],
        next: [],
        avoid: [],
        ifChange: [],
        question: 'What is the single biggest problem you are facing right now?',
    };
}
