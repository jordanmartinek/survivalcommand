import { Scenario } from '../model/types.js';

// Immediate life-threatening danger scenarios.
// Every one opens by directing the user to emergency services when reachable.

export const immediateScenarios: Scenario[] = [
  {
    id: 'immediate-general',
    title: 'Immediate Danger',
    icon: '🚨',
    category: 'immediate',
    severity: 'critical',
    summary: 'Building collapse, fire, flash flood, gas leak, severe injury, or dangerous structural damage.',
    dangerAssessment:
      'You may be in a life-threatening situation right now. Protecting life comes before every other consideration. Contact emergency services as soon as it is safe to do so.',
    phases: [
      {
        label: 'DO THIS NOW',
        now: true,
        items: [
          'If anyone can safely reach a phone, call your local emergency number now.',
          'Move away from the immediate hazard if you can do so safely.',
          'Do not go back for belongings.',
          'Account for everyone in your group.',
          'If there is fire or smoke, stay low and get out.',
          'If you smell gas, do not use switches, flames, or phones inside — leave first, then call from outside.',
        ],
      },
      {
        label: 'NEXT 30 MINUTES',
        items: [
          'Get to a safe distance or a safer structure.',
          'Provide basic first aid only within your ability; prioritise severe bleeding and breathing.',
          'Signal for help if you cannot reach services.',
          'Keep the group together and calm.',
        ],
      },
      {
        label: 'NEXT 6 HOURS',
        items: [
          'Stay reachable for emergency responders.',
          'Avoid re-entering damaged structures.',
          'Secure water, warmth, and any needed medication.',
          'Note injuries and needs so you can report them clearly.',
        ],
      },
      {
        label: 'NEXT 24 HOURS',
        items: [
          'Follow instructions from official responders.',
          'Reassess shelter safety before returning anywhere.',
          'Begin tracking resources if infrastructure is affected.',
        ],
      },
      {
        label: 'IF THE SITUATION WORSENS',
        items: [
          'Evacuate further from the hazard.',
          'Keep signalling and stay visible to rescuers.',
          'Prioritise the most vulnerable members of your group.',
        ],
      },
    ],
    doNot: [
      'Do not re-enter a collapsed or burning structure.',
      'Do not use open flames or electrical switches if you suspect a gas leak.',
      'Do not move a seriously injured person unless they are in immediate further danger.',
      'Do not drive or walk into moving floodwater.',
    ],
    improvised: [
      'Bright fabric or a light to signal your location to rescuers.',
      'A whistle (three blasts) as a recognised distress signal.',
    ],
    evacuationTriggers: [
      'Active fire or smoke',
      'Structural collapse or severe damage',
      'Rising floodwater',
      'Suspected gas leak',
    ],
    communication: [
      'Call emergency services first when reachable.',
      'Tell them your exact location, number of people, and injuries.',
      'If networks are down, use a battery radio for official instructions.',
    ],
    medical: [
      'Severe bleeding, difficulty breathing, chest pain, unconsciousness, or suspected spinal injury are medical emergencies — get professional help.',
      'This app cannot diagnose. It provides general guidance only.',
    ],
    environmental: [
      'Watch for secondary hazards: aftershocks, further collapse, downed power lines, spreading fire.',
    ],
    resourcePriorities: ['shelter', 'medical', 'water'],
    checklist: [
      'Everyone is accounted for',
      'Moved away from immediate hazard',
      'Called emergency services (if reachable)',
      'Provided first aid within ability',
      'Found a safer location',
      'Reassessed for secondary hazards',
    ],
    lastReviewed: '2026-01-01',
  },
];
